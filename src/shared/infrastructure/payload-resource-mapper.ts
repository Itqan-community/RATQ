import type { Resource, ResourceType } from '@/types/resource';

// Shared between the resources module's Payload repository (repositories/payload.ts)
// and the developer module's Payload resource CRUD (developer/infrastructure/resources-api.ts) -
// both map the same Payload `resources` collection doc shape, so this lives
// here rather than one module reaching into the other's repository internals.
export interface PayloadResourceDoc {
  id: number | string;
  name: string;
  slug: string;
  type: ResourceType;
  description: string;
  short_description: string;
  // Payload REST API populates relationships by default (depth=1), so this
  // comes back as the full media doc - but guard for the bare-id/null shapes
  // too (e.g. if depth is ever overridden to 0, or no image was set).
  image?: { url: string } | number | string | null;
  documentation_url: string | null;
  github_url: string | null;
  license: string;
  itqan_badge: boolean;
  status: 'draft' | 'published' | 'archived';
  version: string | null;
  createdAt: string;
  updatedAt: string;
}

// No public per-resource page on the Payload side yet - source_url is null
// until one exists (unlike cms.ts, which links to the CMS gallery).
// Slug is namespaced (payload-${slug}) the same way cms.ts namespaces its
// ids (cms-${id}) - the aggregator resolves detail pages by matching slug
// across the flat merged cross-source list (see repositories/aggregate.ts
// getResource), so an unprefixed slug could silently collide with a
// ratq-native/cms one.
export function toResource(doc: PayloadResourceDoc): Resource {
  return {
    id: 200_000 + Number(doc.id), // offset to avoid colliding with ratq-native/cms ids
    name: doc.name,
    slug: `payload-${doc.slug}`,
    source: 'payload',
    source_url: null,
    type: doc.type,
    description: doc.description,
    short_description: doc.short_description,
    image_url: typeof doc.image === 'object' && doc.image !== null ? doc.image.url : null,
    documentation_url: doc.documentation_url,
    github_url: doc.github_url,
    license: doc.license,
    itqan_badge: doc.itqan_badge,
    status: doc.status,
    created_at: doc.createdAt,
    updated_at: doc.updatedAt,
    version: doc.version,
    github_stats: null,
    total_downloads: 0,
    downloads: 0,
  };
}
