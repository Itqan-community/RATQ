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
    // File-size cap lives on payload.config.ts's top-level upload option
    // (collection-level upload config has no `limits` key).
    mimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
  },
}
