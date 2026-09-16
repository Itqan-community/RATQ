/**
 * License filter logic shared across all three resource data sources
 * (ratq-native, cms, payload).
 *
 * Only the 6 CC licenses that appear in the filter panel's checkbox list are
 * "tracked".  Resources with any other license (MIT, Apache-2.0, GPL-3.0,
 * BSD-3-Clause, custom, CC-BY-NC-4.0, …) are NEVER hidden by the license
 * filter — they are simply unfilterable and always pass through.
 *
 * Keep TRACKED_LICENSE_VALUES in sync with FilterPanel's CC_LICENSE_ROWS:
 * the data sources import this helper while the UI owns checkbox display.
 */

export interface CcLicenseRow {
    labelKey:
        | "cc0"
        | "cc_by"
        | "cc_by_sa"
        | "cc_by_nd"
        | "cc_by_nc_sa"
        | "cc_by_nc_nd";
    badge: string;
    badgeColor: string;
    /** Every raw license string stored by the supported sources for this row. */
    values: string[];
}

export const CC_LICENSE_ROWS: CcLicenseRow[] = [
    {
        labelKey: "cc0",
        badge: "CC0",
        badgeColor: "bg-[#4ade80]",
        values: ["CC0", "CC0-1.0", "CC0 1.0"],
    },
    {
        labelKey: "cc_by",
        badge: "CC BY",
        badgeColor: "bg-[#4ade80]",
        values: ["CC-BY-4.0", "CC-BY-3.0", "CC-BY-2.0"],
    },
    {
        labelKey: "cc_by_sa",
        badge: "CC BY-SA",
        badgeColor: "bg-[#facc15]",
        values: ["CC-BY-SA-4.0", "CC-BY-SA-3.0", "CC-BY-SA 4.0"],
    },
    {
        labelKey: "cc_by_nd",
        badge: "CC BY-ND",
        badgeColor: "bg-[#facc15]",
        values: ["CC-BY-ND-4.0", "CC-BY-ND-3.0", "CC-BY-ND"],
    },
    {
        labelKey: "cc_by_nc_sa",
        badge: "CC BY-NC-SA",
        badgeColor: "bg-[#f87171]",
        values: ["CC-BY-NC-SA-4.0", "CC-BY-NC-SA-3.0"],
    },
    {
        labelKey: "cc_by_nc_nd",
        badge: "CC BY-NC-ND",
        badgeColor: "bg-[#f87171]",
        values: ["CC-BY-NC-ND-4.0", "CC-BY-NC-ND-3.0", "CC-BY-NC-ND"],
    },
];

/**
 * The complete set of SPDX license strings that have a corresponding
 * checkbox in the filter panel.  Derived directly from CC_LICENSE_ROWS
 * (FilterPanel.tsx) — must be kept in sync if rows are added or removed.
 *
 */
export const TRACKED_LICENSE_VALUES = new Set(
    CC_LICENSE_ROWS.flatMap((row) => row.values),
);

/**
 * Returns `true` when a resource should be included in the results given the
 * current license filter selection.
 *
 * Rules:
 *  - No selection active  → always include (return true).
 *  - Resource license is NOT tracked (e.g. MIT, Apache, custom, CC-BY-NC-4.0)
 *    → always include (unfilterable, never hidden).
 *  - Resource license IS tracked → include only if it appears in `selected`.
 */
export function matchesLicenseFilter(
    resourceLicense: string,
    selected: string[] | undefined,
): boolean {
    if (!selected || selected.length === 0) return true;
    if (!TRACKED_LICENSE_VALUES.has(resourceLicense)) return true;
    return selected.includes(resourceLicense);
}
