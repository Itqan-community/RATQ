import type { CollectionConfig, FieldAccess } from 'payload'

// Mirrors the itqan_badge pattern in Resources.ts - role is a privilege
// escalation vector, not self-declared metadata, so only an existing admin
// may set or change it. Public self-registration still works; the field
// just silently falls back to its default for anyone else.
const isAdmin: FieldAccess = ({ req }) => req.user?.role === 'admin'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    // Public self-registration (no default access config would otherwise
    // require an authenticated user even to create an account).
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req, id }) => Boolean(req.user) && req.user?.id === id,
    delete: ({ req, id }) => Boolean(req.user) && req.user?.id === id,
  },
  fields: [
    {
      name: 'display_name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      options: ['developer', 'publisher', 'admin'],
      defaultValue: 'developer',
      access: {
        create: isAdmin,
        update: isAdmin,
      },
    },
  ],
}
