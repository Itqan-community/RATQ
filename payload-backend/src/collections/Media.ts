import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    // Raster image types only - SVG is deliberately excluded since it can
    // embed <script> content and would be served back with read: () => true.
    mimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
    // 5MB cap to prevent arbitrarily large uploads.
    limits: {
      fileSize: 5_000_000,
    },
  },
}
