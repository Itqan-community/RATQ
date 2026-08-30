import { APIError } from 'payload'
import type { Access, CollectionConfig, FieldAccess, Where } from 'payload'

const isAdmin: Access = ({ req }) => req.user?.role === 'admin'

// Applicant sees only their own requests; publishers see requests on their own
// resources; admin sees all; unauthenticated sees nothing.
const canReadAccessRequest: Access = ({ req }) => {
  if (!req.user) return false
  if (req.user.role === 'admin') return true
  const where: Where = {
    or: [{ applicant: { equals: req.user.id } }, { 'resource.owner': { equals: req.user.id } }],
  }
  return where
}

// Approve/deny is the resource publisher's call (or admin's) - not the applicant's.
const canUpdateAccessRequest: Access = ({ req }) => {
  if (!req.user) return false
  if (req.user.role === 'admin') return true
  const where: Where = { 'resource.owner': { equals: req.user.id } }
  return where
}

// publisher_notes is internal to the publisher/admin side of the workflow -
// never client-settable on create, never visible to the applicant. Read is
// admin-only (not "any publisher") because an applicant can themselves hold
// the publisher role on a different resource - a role check alone would leak
// the notes to that applicant on their own request.
const isAdminField: FieldAccess = ({ req }) => req.user?.role === 'admin'

const canWritePublisherNotes: FieldAccess = ({ req }) => {
  if (!req.user) return false
  return req.user.role === 'admin' || req.user.role === 'publisher'
}

// Applicant-facing copy for each decided state. Revoking notifies the
// applicant exactly the way approving and denying already do -
// 'access_revoked' has been a valid notification type (with an icon in
// developer/notifications/page.tsx) since before this hook existed, but
// nothing ever emitted it.
const NOTIFICATION_BY_STATUS: Record<
  string,
  {
    type: 'access_approved' | 'access_denied' | 'access_revoked'
    message: (resourceName: string) => string
  }
> = {
  approved: {
    type: 'access_approved',
    message: (name) => `تمت الموافقة على طلب الوصول إلى "${name}"`,
  },
  denied: {
    type: 'access_denied',
    message: (name) => `تم رفض طلب الوصول إلى "${name}"`,
  },
  revoked: {
    type: 'access_revoked',
    message: (name) => `تم إلغاء وصولك إلى "${name}"`,
  },
}

// Note: AccessRequests only applies to Payload-sourced resources.
// CMS- and mock-sourced resources have no real owner relationship to notify or approve requests.
export const AccessRequests: CollectionConfig = {
  slug: 'access-requests',
  access: {
    read: canReadAccessRequest,
    create: ({ req }) => Boolean(req.user),
    update: canUpdateAccessRequest,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'status',
  },
  hooks: {
    beforeValidate: [
      async ({ req, data, operation }) => {
        if (operation !== 'create' || !data || !req.user) return data
        const { totalDocs } = await req.payload.count({
          collection: 'access-requests',
          where: {
            and: [
              { resource: { equals: data.resource } },
              { applicant: { equals: req.user.id } },
              { status: { equals: 'pending' } },
            ],
          },
        })
        if (totalDocs > 0) {
          throw new APIError(
            'You already have a pending access request for this resource.',
            400,
          )
        }
        return data
      },
    ],
    beforeChange: [
      ({ req, data, operation, originalDoc }) => {
        if (operation === 'create' && req.user) {
          data.applicant = req.user.id
        }
        // status is a moderation action - only admin/publisher (via update) may set it.
        if (operation === 'create') {
          data.status = 'pending'
        }
        if (operation === 'update' && originalDoc && data.status && data.status !== originalDoc.status) {
          const isRevokingApprovedAccess =
            originalDoc.status === 'approved' && data.status === 'revoked'

          // Revoking is for access that was actually granted. A request
          // still awaiting a decision is denied, not revoked - otherwise
          // pending -> revoked would be a second, unreviewed way to refuse
          // one, and it would report the wrong thing to the applicant.
          if (data.status === 'revoked' && !isRevokingApprovedAccess) {
            throw new APIError('Only an approved access request can be revoked.', 400)
          }

          // Once a request has been decided, its status is final - no
          // re-opening and no switching between approved/denied. Revoking an
          // approved request is the single exception, and is itself terminal:
          // revoked never goes back to approved. An applicant who wants
          // access again submits a fresh request, which the pending-only
          // duplicate guard in beforeValidate already allows.
          if (originalDoc.status !== 'pending' && !isRevokingApprovedAccess) {
            throw new APIError('Access request status cannot be changed once decided.', 400)
          }
        }
        return data
      },
    ],
    afterChange: [
      async ({ req, doc, previousDoc, operation }) => {
        if (operation !== 'update') return doc
        if (!previousDoc || previousDoc.status === doc.status) return doc
        const notification = NOTIFICATION_BY_STATUS[doc.status]
        if (!notification) return doc

        const resourceId = typeof doc.resource === 'object' ? doc.resource.id : doc.resource
        const resource = await req.payload.findByID({
          collection: 'resources',
          id: resourceId,
          depth: 0,
        })
        const recipientId = typeof doc.applicant === 'object' ? doc.applicant.id : doc.applicant

        // Revoking has to reach the access itself, not just this record.
        // APIKeys' beforeValidate only requires an approved request when a
        // key is *created*, and nothing re-checks afterwards, so a key
        // issued while the request was approved would otherwise keep
        // working indefinitely. APIKeys.delete is scoped to the key's own
        // holder (delete: isOwner, with no admin or resource-owner branch),
        // so the publisher cannot clear these themselves - this goes
        // through the local API rather than loosening that rule.
        if (doc.status === 'revoked') {
          // A bulk delete reports per-document failures in `errors` rather
          // than throwing, so ignoring them would leave a working key behind
          // while we tell the applicant their access is gone. Throwing here
          // rolls the whole update back, so the request stays `approved` and
          // the publisher can retry, rather than the record and the real
          // access disagreeing.
          //
          // `req` is what makes that true. The Local API only joins the
          // caller's transaction when it is handed the request; without it
          // this delete would commit on its own, and a throw would roll back
          // only the access-request row, leaving already-deleted keys gone
          // while the record reverted to `approved`. Same split brain, from
          // the other direction.
          const { errors } = await req.payload.delete({
            collection: 'api-keys',
            req,
            where: {
              and: [{ owner: { equals: recipientId } }, { resource: { equals: resource.id } }],
            },
          })
          if (errors?.length) {
            throw new APIError(
              `Could not revoke access: ${errors.length} API key(s) for this resource could not be deleted.`,
              500,
            )
          }
        }

        // Also on the parent transaction: a notification announcing a revoke
        // that later rolled back would outlive the thing it announced.
        await req.payload.create({
          collection: 'notifications',
          req,
          data: {
            recipient: recipientId,
            type: notification.type,
            message: notification.message(resource.name),
            resource: resource.id,
            resource_name: resource.name,
            related_access_request: doc.id,
          },
        })

        return doc
      },
    ],
  },
  fields: [
    {
      name: 'resource',
      type: 'relationship',
      relationTo: 'resources',
      required: true,
      index: true,
    },
    {
      name: 'applicant',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: ['pending', 'approved', 'denied', 'revoked'],
      defaultValue: 'pending',
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      maxLength: 2000,
    },
    {
      name: 'publisher_notes',
      type: 'textarea',
      maxLength: 2000,
      access: {
        create: () => false,
        read: isAdminField,
        update: canWritePublisherNotes,
      },
    },
  ],
}