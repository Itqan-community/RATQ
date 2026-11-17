import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// A production build without the live API URL would silently serve demo/snapshot data to real users.
// .env.production (committed) normally supplies it; ALLOW_MOCK_BUILD=1 is the explicit opt-out for mock-mode builds.
if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_PAYLOAD_API_URL && !process.env.ALLOW_MOCK_BUILD) {
  throw new Error('NEXT_PUBLIC_PAYLOAD_API_URL is empty: refusing a production build that would ship mock data (see .env.production).');
}

// Old live-RATQ URLs: real permanent redirects (bookmarks, search results) from the same table the SPA falls back to.
const legacy = JSON.parse(readFileSync(new URL("./src/lib/legacyRedirects.json", import.meta.url), "utf8"));

// quran.tech serves the same frontend for read-only browsing. Pages that need the session cookie (SameSite=Lax on
// .ratq.itqan.dev) are sent to the canonical host, otherwise sign-in would silently fail from another site.
const AUTH_PREFIXES = JSON.parse(readFileSync(new URL("./src/lib/authPrefixes.json", import.meta.url), "utf8"));

/** @type {import('next').NextConfig} */
export default {
  redirects: async () => [
    ...Object.entries(legacy).map(([source, destination]) => ({ source, destination, permanent: true })),
    ...AUTH_PREFIXES.map((p) => ({
      source: `/${p}/:path*`,
      has: [{ type: 'host', value: 'quran.tech' }],
      destination: `https://ratq.itqan.dev/${p}/:path*`,
      permanent: false,
    })),
  ],
  // Pin the trace root so a stray lockfile above the project doesn't pull in the home dir.
  outputFileTracingRoot: path.dirname(fileURLToPath(import.meta.url)),
  // No next/image usage; also keeps native sharp out of the Worker bundle.
  images: { unoptimized: true },
  // The design source was never linted (no ESLint config upstream); don't fail builds on its style.
  eslint: { ignoreDuringBuilds: true },
};
