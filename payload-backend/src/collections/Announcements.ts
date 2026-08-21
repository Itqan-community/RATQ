import type { Access, CollectionConfig, Where } from 'payload'

const isAdmin: Access = ({ req }) => req.user?.role === 'admin'

// The homepage carousel fetches announcements unauthenticated, so public
// readers see only announcements that are both active and not yet expired
// (or never expiring). Admin sees everything, including drafts of upcoming
// announcements.
const canReadAnnouncement: Access = ({ req }) => {
  if (req.user?.role === 'admin') return true

  const now = new Date().toISOString()

  const where: Where = {
    and: [
      {
        is_active: {
          equals: true,
        },
      },
      {
        or: [
          {
            expires_at: {
              exists: false,
            },
          },
          {
            expires_at: {
              greater_than: now,
            },
          },
        ],
      },
    ],
  }

  return where
}

// Mirrors src/types/announcement.ts AnnouncementType.
const ANNOUNCEMENT_TYPES = [
  'release',
  'new_resource',
  'maintenance',
  'breaking_change',
] as const

export const Announcements: CollectionConfig = {
  slug: 'announcements',

  access: {
    read: canReadAnnouncement,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },

  admin: {
    useAsTitle: 'title',
  },

  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: ANNOUNCEMENT_TYPES.map((value) => ({ label: value, value })),
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'resource_id',
      type: 'relationship',
      relationTo: 'resources',
      index: true,
    },
    {
      name: 'cta_url',
      type: 'text',
    },
    {
      name: 'cta_label',
      type: 'text',
    },
    {
      name: 'expires_at',
      type: 'date',
    },
    {
      name: 'is_active',
      type: 'checkbox',
      required: true,
      defaultValue: true,
    },
  ],
}