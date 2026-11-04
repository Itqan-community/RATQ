import { useSyncExternalStore } from "react";
import type { RoleId } from "@/lib/chrome-data";

// The live site keeps the demo role in memory only (it resets on a full page load), so a module-level store matches it.
let role: RoleId = "developer";
const subs = new Set<() => void>();

export const getRole = () => role;
export const setRole = (r: RoleId) => { role = r; subs.forEach((f) => f()); };
export const useRole = () => useSyncExternalStore((f) => { subs.add(f); return () => { subs.delete(f); }; }, () => role, () => "developer" as RoleId);
