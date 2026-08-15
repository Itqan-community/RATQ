import type { Access, CollectionConfig, Where } from 'payload'

const isAdmin: Access = ({ req }) => req.user?.role === 'admin'

// Reporter sees only their own reports; publishers see reports on their own resources;
// admin sees all; unauthenticated sees nothing.
const canReadReport: Access = ({ req }) => {
  if (!req.user) return false
  if (req.user.role === 'admin') return true
  const where: Where = {
    or: [{ reporter: { equals: req.user.id } }, { 'resource.owner': { equals: req.user.id } }],
  }
  return where
}

const REPORT_REASONS = [
  'inaccurate',
  'inappropriate',
  'infringing',
  'spam',
  'outdated',
  'broken-link',
] as const

export const Reports: CollectionConfig = {
  slug: 'reports',
  access: {
    read: canReadReport,
    create: ({ req }) => Boolean(req.user),
    update: isAdmin,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'reason',
  },
  hooks: {
    beforeChange: [
      ({ req, data, operation }) => {
        if (operation === 'create' && req.user) {
          data.reporter = req.user.id
        }
        // status is a moderation action - only admin (via update) may set it.
        if (operation === 'create' && req.user?.role !== 'admin') {
          data.status = 'open'
        }
        return data
      },
    ],
    afterChange: [
      async ({ req, doc, previousDoc, operation }) => {
        if (operation !== 'update') return doc
        if (!previousDoc || previousDoc.status === doc.status) return doc

        const resourceId = typeof doc.resource === 'object' ? doc.resource.id : doc.resource
        const resource = await req.payload.findByID({
          collection: 'resources',
          id: resourceId,
          depth: 0,
        })
        const recipientId = typeof doc.reporter === 'object' ? doc.reporter.id : doc.reporter

        await req.payload.create({
          collection: 'notifications',
          data: {
            recipient: recipientId,
            type: doc.status === 'resolved' ? 'report_resolved' : 'report_status_change',
            message:
              doc.status === 'resolved'
                ? `تم حل التقرير على "${resource.name}"`
                : `تغيرت حالة التقرير على "${resource.name}" إلى ${doc.status}`,
            resource: resource.id,
            resource_name: resource.name,
            related_report: doc.id,
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
      name: 'reporter',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'reason',
      type: 'select',
      required: true,
      options: REPORT_REASONS.map((value) => ({ label: value, value })),
    },
    {
      name: 'details',
      type: 'textarea',
      maxLength: 500,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: ['open', 'resolved', 'closed'],
      defaultValue: 'open',
    },
  ],
}
