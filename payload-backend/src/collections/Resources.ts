import type { Access, CollectionConfig, FieldAccess } from 'payload'

const isOwner: Access = ({ req }) => {
  if (!req.user) return false
  return { owner: { equals: req.user.id } }
}

// The "Itqan Standard" badge is a platform-curated trust signal, not
// self-declared metadata - only an admin can set or change it. Plain boolean
// check (not owner-scoped) since this is about who awards the badge, not who
// owns the resource.
const isAdmin: FieldAccess = ({ req }) => req.user?.role === 'admin'

// Unicode-aware so Arabic (and any other script) names produce a real slug
// instead of collapsing to '' under an ASCII-only \w filter.
function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
}

// Mirrors src/types/resource.ts ResourceType, minus CMS-only entries that
// don't apply to natively-authored Payload resources.
const RESOURCE_TYPES = [
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

export const Resources: CollectionConfig = {
  slug: 'resources',
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: isOwner,
    delete: isOwner,
  },
  admin: {
    useAsTitle: 'name',
  },
  hooks: {
    beforeValidate: [
      async ({ req, data, operation }) => {
        if (!data || operation !== 'create') return data
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
      ({ req, data }) => {
        if (req.user) {
          data.owner = req.user.id
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
      name: 'documentation_url',
      type: 'text',
    },
    {
      name: 'github_url',
      type: 'text',
    },
    {
      name: 'license',
      type: 'text',
      required: true,
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
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'github_stats',
      type: 'group',
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
      admin: { description: 'Auto-populated by the periodic GitHub stats job.' },
    },
    {
      name: 'github_topics',
      type: 'json',
      admin: { description: 'Auto-populated by the periodic GitHub stats job.' },
    },
    {
      name: 'github_stats_fetched_at',
      type: 'date',
      admin: { description: 'Timestamp of the last successful GitHub API refresh.' },
    },
  ],
}
