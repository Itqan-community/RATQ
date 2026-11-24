import type { Access,AccessResult, CollectionConfig, Field, FieldAccess, Where } from 'payload'

const canReadResource: Access = ({ req }) => {
  if (req.user?.role === 'admin') return true

  if (!req.user) {
    const where: Where = {
      status: { equals: 'published' },
    }
    return where
  }

  const where: Where = {
    or: [
      { status: { equals: 'published' } },
      { owner: { equals: req.user.id } },
    ],
  }
  return where
}

const isOwner: Access = ({ req }) => {
  if (!req.user) return false
  return { owner: { equals: req.user.id } }
}

// Admins moderate the whole catalog (e.g. pulling leftover test data), so they
// bypass the owner scope for update/delete. Everyone else stays owner-only.
const isOwnerOrAdmin: Access = (args) => (args.req.user?.role === 'admin' ? true : isOwner(args))

// The "Itqan Standard" badge is a platform-curated trust signal, not
// self-declared metadata - only an admin can set or change it. Plain boolean
// check (not owner-scoped) since this is about who awards the badge, not who
// owns the resource.
const isAdmin: FieldAccess = ({ req }) => req.user?.role === 'admin'

// Unicode-aware so Arabic (and any other script) names produce a real slug
// instead of collapsing to '' under an ASCII-only \w filter.
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
}

// Mirrors src/types/resource.ts ResourceType, minus CMS-only entries that
// don't apply to natively-authored Payload resources.
export const RESOURCE_TYPES = [
  'library',
  'sdk',
  'dataset',
  'api',
  'tafsir',
  'audio',
  'pdf',
  'json',
  'recitation',
  'mushaf',
  'program',
  'linguistic',
  'translation',
  'font',
  'search',
  'tajweed',
] as const

// Must be a real http(s) URL when set: other schemes (ftp:, javascript:, mailto:, ...) are
// rejected so a frontend link can never render broken or unsafe.
const httpUrl = (value: unknown) => {
  if (!value) return true
  try {
    const url = new URL(String(value))
    if (url.protocol === 'http:' || url.protocol === 'https:') return true
  } catch {
    // fall through to the error below
  }
  return 'Please enter a valid http:// or https:// URL.'
}

// json fields are rendered by the frontend: bound them to a short list of short strings.
const shortStringList = (value: unknown) =>
  value == null ||
  (Array.isArray(value) && value.length <= 100 && value.every((v) => typeof v === 'string' && v.length <= 200)) ||
  'Must be a list of at most 100 strings, each at most 200 characters.'

// Optional columns imported from the quran.tech sources sheet. All optional so existing
// resources keep validating; `_en` twins hold the English column beside the Arabic one.
export const bilingual = [
  'content_domain',
  'riwayah',
  'smallest_unit',
  'query_units',
  'numbering_reference',
  'authentication',
  'rate_limits',
  'attribution',
  'scholarly_review',
]
// Provenance the importer owns (it writes with overrideAccess): an owner must not forge it.
const importerOnly = { create: isAdmin, update: isAdmin }
const importerOwned = new Set(['verified_on', 'source_status', 'source_type', 'source_last_updated', 'scholarly_review', 'scholarly_review_en', 'attribution', 'attribution_en'])
const sheetFields: Field[] = [
  { name: 'sheet_id', type: 'text', unique: true, index: true, access: importerOnly },
  { name: 'name_en', type: 'text' },
  { name: 'description_en', type: 'textarea' },
  ...[
    ...bilingual,
    ...bilingual.map((n) => `${n}_en`),
    'short_description_en',
    'license_en',
    'sample_request',
    'source_status',
    'source_type',
    'source_last_updated',
    'verified_on',
  ].map((name): Field => ({ name, type: 'text', ...(importerOwned.has(name) && { access: importerOnly }) })),
  ...['base_url', 'api_key_url', 'playground_url', 'download_url', 'repository'].map(
    (name): Field => ({ name, type: 'text', validate: httpUrl }),
  ),
  ...['languages', 'tags', 'data_formats'].map((name): Field => ({ name, type: 'json', validate: shortStringList })),
  { name: 'has_api', type: 'select', options: ['yes', 'no', 'planned', 'iframe'] },
]

export const Resources: CollectionConfig = {
  slug: 'resources',
  access: {
    read: canReadResource,
    create: ({ req }) => Boolean(req.user),
    update: isOwnerOrAdmin,
    delete: isOwnerOrAdmin,
  },
  admin: {
    useAsTitle: 'name',
  },
  hooks: {
    beforeValidate: [
      async ({ req, data, operation, context }) => {
        if (!data || operation !== 'create') return data
        // The sheet importer picks collision-free slugs itself (inside its transaction, where this count cannot see them).
        if (context?.keepSlug && data.slug) return data
        const base = slugify(data.name || '') || 'resource'
        let candidate = base
        let suffix = 0
        while (
          await req.payload.count({
            collection: 'resources',
            where: { slug: { equals: candidate } },
          }).then((r) => r.totalDocs > 0)
        ) {
          suffix += 1
          candidate = `${base}-${suffix}`
        }
        data.slug = candidate
        return data
      },
    ],
    beforeChange: [
      ({ req, data, operation, originalDoc }) => {
        // Only stamp ownership on create. On update the owner must stay put, otherwise
        // an admin moderating someone's resource would silently take it over.
        if (operation === 'create') {
          if (req.user) data.owner = req.user.id
        } else {
          // Restore the stored owner rather than deleting it: field validation runs after this hook and
          // `owner` is required, so a deleted owner made EVERY update fail with "Owner is required".
          const stored = originalDoc?.owner
          const storedId = typeof stored === 'object' && stored !== null ? stored.id : stored
          if (storedId !== undefined && storedId !== null) data.owner = storedId
          else delete data.owner
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: RESOURCE_TYPES.map((value) => ({ label: value, value })),
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'short_description',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'documentation_url',
      type: 'text',
    },
    {
      name: 'github_url',
      type: 'text',
    },
    {
      // The resource's own website (publisher's product page), shown in the
      // visit-site CTA on the frontend - see issue #299. Optional/nullable,
      // like the sibling URL fields. Must be a real http(s) URL when set -
      // arbitrary text or other schemes (ftp:, javascript:, mailto:, ...) are
      // rejected so the frontend CTA can never render a broken/unsafe link.
      name: 'website_url',
      type: 'text',
      validate: httpUrl,
    },
    {
      // Language of the description, set in the admin (name has title_language).
      // Optional: the frontend guesses from the text when unset (issue #303).
      name: 'content_language',
      type: 'select',
      options: ['ar', 'en'],
    },
    {
      name: 'title_language',
      type: 'select',
      options: ['ar', 'en'],
    },
    {
      name: 'license',
      type: 'text',
    },
    {
      name: 'itqan_badge',
      type: 'checkbox',
      defaultValue: false,
      access: {
        create: isAdmin,
        update: isAdmin,
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: ['draft', 'published', 'archived'],
    },
    {
      name: 'version',
      type: 'text',
    },
    {
      name: 'audio_url',
      type: 'text',
    },
    {
      name: 'audio_thumbnail',
      type: 'text',
    },
    {
      name: 'reciter_name',
      type: 'text',
    },
    {
      name: 'audio_quality',
      type: 'text',
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      // Public-safe view of the owner: users read is self-or-admin (it holds
      // emails), so everyone but the owner and admins only ever gets a bare
      // owner id. This exposes just id + display_name, for the catalog
      // publisher filter.
      name: 'publisher',
      type: 'json',
      virtual: true,
      access: { create: () => false, update: () => false },
      hooks: {
        afterRead: [
          async ({ siblingData, req }) => {
            const owner = siblingData?.owner
            const id = typeof owner === 'object' && owner !== null ? owner.id : owner
            if (id == null) return null

            const cache = (req.context.publishers ??= {}) as Record<string, Promise<unknown>>
            cache[id] ??= req.payload
              .findByID({ collection: 'users', id, depth: 0, overrideAccess: true })
              .then((user) => {
                const name = user.display_name?.trim()
                return name ? { id, name } : null
              })
              .catch(() => null)
            return cache[id]
          },
        ],
      },
    },
    {
      name: 'github_stats',
      type: 'group',
      access: { create: () => false, update: () => false },
      admin: { description: 'Auto-populated by the periodic GitHub stats job. Do not edit manually.' },
      fields: [
        { name: 'stars', type: 'number' },
        { name: 'forks', type: 'number' },
        { name: 'open_issues', type: 'number' },
        { name: 'last_commit', type: 'date' },
      ],
    },
    {
      name: 'github_commits',
      type: 'json',
      access: { create: () => false, update: () => false },
      admin: { description: 'Auto-populated by the periodic GitHub stats job.' },
    },
    {
      name: 'github_topics',
      type: 'json',
      access: { create: () => false, update: () => false },
      admin: { description: 'Auto-populated by the periodic GitHub stats job.' },
    },
    {
      name: 'github_stats_fetched_at',
      type: 'date',
      access: { create: () => false, update: () => false },
      admin: { description: 'Timestamp of the last successful GitHub API refresh.' },
    },
    ...sheetFields,
  ],
}
