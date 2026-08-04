import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { AccessRequests } from './collections/AccessRequests'
import { APIKeys } from './collections/APIKeys'
import { Comments } from './collections/Comments'
import { Media } from './collections/Media'
import { Reports } from './collections/Reports'
import { Resources } from './collections/Resources'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  cors: [
    'https://beta.ratq.itqan.dev',
    'https://ratq.itqan.dev',
    'https://admin.ratq.itqan.dev',
    'http://localhost:3000',
  ],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '- RATQ Admin',
      icons: [{ url: '/ratq-logo.png' }],
    },
    components: {
      graphics: {
        Logo: '/admin/Logo#Logo',
        Icon: '/admin/Icon#Icon',
      },
      beforeLogin: ['/admin/BeforeLogin#BeforeLogin'],
    },
  },
  collections: [Users, Media, Resources, Comments, Reports, AccessRequests, APIKeys],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  // sharp's published types don't structurally match payload's SharpDependency
  // signature across versions; cast rather than chase types.
  sharp: sharp as unknown as Parameters<typeof buildConfig>[0]['sharp'],
})
