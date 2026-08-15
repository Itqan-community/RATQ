import type { Access, CollectionConfig, Where } from 'payload'

const isAdmin: Access = ({ req }) => req.user?.role === 'admin'

// Recipient sees only their own notifications; admin sees all; unauthenticated sees nothing.
const canReadNotification: Access = ({ req }) => {
  if (!req.user) return false
  if (req.user.role === 'admin') return true
  const where: Where = { recipient: { equals: req.user.id } }
  return where
}

// Recipient may only toggle read/unread on their own notifications - never
// touch message/type/resource, which are always server-set (see field-level
// access below).
const canUpdateNotification: Access = ({ req }) => {
  if (!req.user) return false
  if (req.user.role === 'admin') return true
  const where: Where = { recipient: { equals: req.user.id } }
  return where
}

const NOTIFICATION_TYPES = [
  'access_approved',
  'access_denied',
  'comment_reply',
  'report_resolved',
  'report_status_change',
  'resource_activity',
  'access_revoked',
] as const

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  access: {
    read: canReadNotification,
    // Notifications are only ever produced by afterChange hooks on
    // AccessRequests/Comments/Reports, via the local API (which bypasses
    // access control by default) - never created directly by a client.
    create: () => false,
    update: canUpdateNotification,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'message',
  },
  fields: [
    {
      name: 'recipient',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      access: { update: () => false },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: NOTIFICATION_TYPES.map((value) => ({ label: value, value })),
      access: { update: () => false },
    },
    {
      name: 'message',
      type: 'text',
      required: true,
      access: { update: () => false },
    },
    {
      name: 'resource',
      type: 'relationship',
      relationTo: 'resources',
      index: true,
      access: { update: () => false },
    },
    // Denormalized so the frontend can render the list without depth
    // population - same pattern as Comments.author_name.
    {
      name: 'resource_name',
      type: 'text',
      access: { update: () => false },
    },
    {
      name: 'related_access_request',
      type: 'relationship',
      relationTo: 'access-requests',
      access: { update: () => false },
    },
    {
      name: 'related_report',
      type: 'relationship',
      relationTo: 'reports',
      access: { update: () => false },
    },
    {
      name: 'related_comment',
      type: 'relationship',
      relationTo: 'comments',
      access: { update: () => false },
    },
    {
      name: 'read',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
