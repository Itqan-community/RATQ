import type { Access, CollectionConfig } from 'payload'

const isOwner: Access = ({ req }) => {
  if (!req.user) return false
  return { author: { equals: req.user.id } }
}

export const Comments: CollectionConfig = {
  slug: 'comments',
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: isOwner,
    delete: isOwner,
  },
  admin: {
    useAsTitle: 'content',
  },
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        if (req.user) {
          data.author = req.user.id
          // Denormalized so anonymous/logged-out viewers (whose requests can't
          // populate the author relationship, since Users.read requires an
          // authenticated req.user) still see a name instead of "Unknown" -
          // same display_name-then-email-local-part fallback as toUser in
          // src/lib/api-client.ts, never the full email (public page).
          data.author_name = req.user.display_name || req.user.email.split('@')[0]
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'content',
      type: 'textarea',
      required: true,
      maxLength: 2000,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'author_name',
      type: 'text',
      required: true,
      access: {
        create: () => false,
        update: () => false,
      },
    },
    {
      name: 'resource',
      type: 'relationship',
      relationTo: 'resources',
      required: true,
      index: true,
    },
  ],
}
