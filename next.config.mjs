import path from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
export default {
  // A stray lockfile above the project made Next trace from the home directory (pulling in its node_modules/sharp).
  outputFileTracingRoot: path.dirname(fileURLToPath(import.meta.url)),
  // No next/image usage; also keeps the native sharp binary out of the Worker bundle.
  images: { unoptimized: true },
  // The live site serves its error preview at /500, a path Next reserves for its own 500 page.
  async rewrites() {
    return [{ source: "/500", destination: "/error-500" }];
  },
};
