"use client";

import { usePathname } from "next/navigation";

// The live site renders these routes without the global header/footer (they bring their own shell).
const BARE = new Set(["/ux-study"]);

export function Chrome({ children }: { children: React.ReactNode }) {
  return BARE.has(usePathname()) ? null : <>{children}</>;
}
