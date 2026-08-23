import crypto from 'crypto'
import { APIError } from 'payload'
import type { Access, CollectionConfig } from 'payload'

const isOwner: Access = ({ req }) => {
  if (!req.user) return false
  return { owner: { equals: req.user.id } }
}

// Matches the scope strings used by createDeveloperApiKey in src/lib/api-client.ts.
const SCOPES = ['read', 'read,write'] as const

const KEY_PREFIX = 'ratq_live_'

function generateKey() {
  const secret = crypto.randomBytes(24).toString('hex')
  const fullKey = `${KEY_PREFIX}${secret}`
  // Keep the ratq_live_ prefix in key_prefix so the masked value shown in
  // the UI (ApiKeyCard) still reads as a RATQ key, not a bare hex fragment.
  const keyPrefix = fullKey.slice(0, KEY_PREFIX.length + 8)
  const keyHash = crypto.createHash('sha256').update(fullKey).digest('hex')
  return { fullKey, keyPrefix, keyHash }
}

export const APIKeys: CollectionConfig = {
  slug: 'api-keys',
  access: {
    create: ({ req }) => Boolean(req.user),
    read: isOwner,
    // No update: these are immutable, private developer credentials - only
    // create (generate) and delete (revoke) make sense.
    update: () => false,
    delete: isOwner,
  },
  admin: {
    useAsTitle: 'name',
  },
  hooks: {
    beforeValidate: [
      async ({ req, data, operation }) => {
        if (operation !== 'create' || !data || !req.user) return data
        if (req.user.role === 'admin') return data

        const resourceId =
          typeof data.resource === 'object' ? data.resource.id : data.resource
        if (!resourceId) return data

        const resource = await req.payload.findByID({
          collection: 'resources',
          id: resourceId,
          depth: 0,
        })

        if (!resource) {
          throw new APIError('Resource not found.', 404)
        }

        const resourceOwnerId =
          typeof resource.owner === 'object' ? resource.owner.id : resource.owner

        if (resourceOwnerId === req.user.id) {
          return data
        }

        const { totalDocs } = await req.payload.count({
          collection: 'access-requests',
          where: {
            and: [
              { resource: { equals: resourceId } },
              { applicant: { equals: req.user.id } },
              { status: { equals: 'approved' } },
            ],
          },
        })

        if (totalDocs > 0) {
          return data
        }

        throw new APIError(
          'You do not have permission to generate an API key for this resource.',
          403,
        )
      },
    ],
    beforeChange: [
      ({ req, data, operation }) => {
        if (req.user) {
          data.owner = req.user.id
        }
        if (operation === 'create') {
          const { fullKey, keyPrefix, keyHash } = generateKey()
          data.key_prefix = keyPrefix
          data.key_hash = keyHash
          // Full plaintext key is never persisted - stash it on req.context so
          // afterChange can surface it in the create response exactly once.
          req.context.generatedKey = fullKey
        }
        return data
      },
    ],
    afterChange: [
      ({ req, doc, operation }) => {
        if (operation === 'create' && req.context.generatedKey) {
          return { ...doc, key: req.context.generatedKey }
        }
        return doc
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
      name: 'resource',
      type: 'relationship',
      relationTo: 'resources',
      required: true,
      index: true,
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'key_prefix',
      type: 'text',
      // Server-generated on create only, from the random key - never
      // client-settable.
      access: {
        create: () => false,
        update: () => false,
      },
    },
    {
      name: 'key_hash',
      type: 'text',
      // Never exposed to any client (including the owner) - only key_prefix
      // is shown in listings, and the full key is returned once via
      // afterChange, never persisted or re-readable.
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
    },
    {
      name: 'scope',
      type: 'select',
      required: true,
      defaultValue: 'read',
      options: SCOPES.map((value) => ({ label: value, value })),
    },
    {
      name: 'last_used_at',
      type: 'date',
    },
  ],
}
