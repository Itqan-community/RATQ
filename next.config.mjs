import path from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
export default {
  // Pin the trace root so a stray lockfile above the project doesn't pull in the home dir.
  outputFileTracingRoot: path.dirname(fileURLToPath(import.meta.url)),
  // No next/image usage; also keeps native sharp out of the Worker bundle.
  images: { unoptimized: true },
  // The design source was never linted (no ESLint config upstream); don't fail builds on its style.
  eslint: { ignoreDuringBuilds: true },
};
