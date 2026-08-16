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
        // Once a request has been decided, its status is final - no re-opening
        // and no switching between approved/denied.
        if (
          operation === 'update' &&
          originalDoc &&
          originalDoc.status !== 'pending' &&
          data.status &&
          data.status !== originalDoc.status
        ) {
          throw new APIError('Access request status cannot be changed once decided.', 400)
        }
        return data
      },
    ],
    afterChange: [
      async ({ req, doc, previousDoc, operation }) => {
        if (operation !== 'update') return doc
        if (!previousDoc || previousDoc.status === doc.status) return doc
        if (doc.status !== 'approved' && doc.status !== 'denied') return doc

        const resourceId = typeof doc.resource === 'object' ? doc.resource.id : doc.resource
        const resource = await req.payload.findByID({
          collection: 'resources',
          id: resourceId,
          depth: 0,
        })
        const recipientId = typeof doc.applicant === 'object' ? doc.applicant.id : doc.applicant

        await req.payload.create({
          collection: 'notifications',
          data: {
            recipient: recipientId,
            type: doc.status === 'approved' ? 'access_approved' : 'access_denied',
            message:
              doc.status === 'approved'
                ? `تمت الموافقة على طلب الوصول إلى "${resource.name}"`
                : `تم رفض طلب الوصول إلى "${resource.name}"`,
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
      options: ['pending', 'approved', 'denied'],
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