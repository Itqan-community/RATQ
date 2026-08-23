import type { Access, CollectionConfig } from 'payload'

const canReadComment: Access = ({ req }) => {
  if (req.user?.role === 'admin') return true
  if (req.user) {
    return {
      or: [
        { 'resource.status': { equals: 'published' } },
        { 'resource.owner': { equals: req.user.id } },
      ],
    }
  }
  return { 'resource.status': { equals: 'published' } }
}

const canModifyComment: Access = ({ req }) => {
  if (!req.user) return false
  if (req.user.role === 'admin') return true
  return { author: { equals: req.user.id } }
}

export const Comments: CollectionConfig = {
  slug: 'comments',
  access: {
    read: canReadComment,
    create: ({ req }) => Boolean(req.user),
    update: canModifyComment,
    delete: canModifyComment,
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
    afterChange: [
      async ({ req, doc, operation }) => {
        if (operation !== 'create') return doc

        const resourceId = typeof doc.resource === 'object' ? doc.resource.id : doc.resource
        const authorId = typeof doc.author === 'object' ? doc.author.id : doc.author

        const { docs: existingComments } = await req.payload.find({
          collection: 'comments',
          where: {
            and: [
              { resource: { equals: resourceId } },
              { author: { not_equals: authorId } },
              { id: { not_equals: doc.id } },
            ],
          },
          depth: 0,
          pagination: false,
        })

        const recipientIds = new Set<number>()
        for (const comment of existingComments) {
          const recipientId = typeof comment.author === 'object' ? comment.author.id : comment.author
          recipientIds.add(recipientId)
        }

        if (recipientIds.size === 0) return doc

        const resource = await req.payload.findByID({
          collection: 'resources',
          id: resourceId,
          depth: 0,
        })

        for (const recipientId of recipientIds) {
          await req.payload.create({
            collection: 'notifications',
            data: {
              recipient: recipientId,
              type: 'comment_reply',
              message: `رد على تعليقك في "${resource.name}"`,
              resource: resource.id,
              resource_name: resource.name,
              related_comment: doc.id,
            },
          })
        }

        return doc
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
