import type { Access, CollectionConfig, FieldAccess } from 'payload'
import { passwordValidation } from './hooks/validate-password'

// Users carry email addresses, so a signed-in account may only read its own
// record (admins read all). Other people's names reach the UI through
// denormalised fields (Comments.author_name, AccessRequests.applicant_name,
// Reports.reporter_name), not by populating the user relationship.
const canReadUser: Access = ({ req }) => {
  if (!req.user) return false
  if (req.user.role === 'admin') return true
  return { id: { equals: req.user.id } }
}

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
  auth: {
    // 1. Session lifespan (in seconds) - e.g., 7 days
    tokenExpiration: 7 * 24 * 60 * 60,

    // 2. Brute-force protection
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000, // Lock for 10 minutes after 5 failures

    // 3. Cookie specifications
    cookies: {
      // Ensures the cookie is only transmitted over HTTPS in production
      secure: process.env.NODE_ENV === 'production',
      // 'Lax' protects against CSRF while allowing top-level link navigations
      sameSite: 'Lax',

      // // Shares the cookie across all *.itqan.dev subdomains in production
      // // Omitted in development so localhost cookies are not scoped improperly
      domain: process.env.NODE_ENV === 'production' ? '.ratq.itqan.dev'  : undefined,
    },
  },
  hooks: {
    beforeValidate: [passwordValidation],
  },

  access: {
    // Public self-registration (no default access config would otherwise
    // require an authenticated user even to create an account).
    create: () => true,
    read: canReadUser,
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
