import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// All pages are prerendered at build time; serve that cache from the Worker's static assets (no KV/R2 needed).
export default defineCloudflareConfig({ incrementalCache: staticAssetsIncrementalCache });
