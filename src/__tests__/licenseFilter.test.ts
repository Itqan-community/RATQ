import { describe, it, expect } from "vitest";
import {
    matchesLicenseFilter,
    TRACKED_LICENSE_VALUES,
} from "@/shared/utils/license-filter";
import { CC_LICENSE_ROWS } from "@/modules/resources/components/FilterPanel";

// ─────────────────────────────────────────────────────────────────────────────
// matchesLicenseFilter
//
// set (MIT, Apache-2.0, GPL-3.0, BSD-3-Clause, custom, CC-BY-NC-4.0, …) must
// NEVER be hidden by the license filter — they are unfilterable and always
// pass through, regardless of which checkboxes are active.
// ─────────────────────────────────────────────────────────────────────────────

describe("matchesLicenseFilter", () => {
    // ── No filter active ─────────────────────────────────────────────────────

    it("returns true when selected is undefined", () => {
        expect(matchesLicenseFilter("MIT", undefined)).toBe(true);
        expect(matchesLicenseFilter("CC-BY-4.0", undefined)).toBe(true);
    });

    it("returns true when selected is an empty array", () => {
        expect(matchesLicenseFilter("MIT", [])).toBe(true);
        expect(matchesLicenseFilter("CC0", [])).toBe(true);
    });

    // ── Tracked CC license — filter active ──────────────────────────────────

    it("returns true when the resource license is in the selected set", () => {
        expect(
            matchesLicenseFilter("CC-BY-4.0", ["CC-BY-4.0", "CC-BY-SA-4.0"]),
        ).toBe(true);
        expect(matchesLicenseFilter("CC0", ["CC0"])).toBe(true);
        expect(
            matchesLicenseFilter("CC-BY-NC-SA-4.0", ["CC-BY-NC-SA-4.0"]),
        ).toBe(true);
        expect(
            matchesLicenseFilter(
                "CC-BY-ND",
                CC_LICENSE_ROWS.find((row) => row.labelKey === "cc_by_nd")!
                    .values,
            ),
        ).toBe(true);
        expect(
            matchesLicenseFilter(
                "CC0 1.0",
                CC_LICENSE_ROWS.find((row) => row.labelKey === "cc0")!.values,
            ),
        ).toBe(true);
    });

    it("returns false when the resource license IS tracked but NOT in the selected set", () => {
        expect(matchesLicenseFilter("CC-BY-SA-4.0", ["CC-BY-4.0"])).toBe(false);
        expect(matchesLicenseFilter("CC-BY-ND-4.0", ["CC0", "CC-BY-4.0"])).toBe(
            false,
        );
        expect(
            matchesLicenseFilter("CC-BY-NC-ND-4.0", ["CC-BY-NC-SA-4.0"]),
        ).toBe(false);
        expect(matchesLicenseFilter("CC-BY-NC-ND", ["CC-BY-ND"])).toBe(false);
    });

    // ── Untracked license — must always pass through ─────────────────────────

    it("returns true for MIT even when a CC license is selected", () => {
        expect(matchesLicenseFilter("MIT", ["CC-BY-4.0"])).toBe(true);
    });

    it("returns true for Apache-2.0 even when a CC license is selected", () => {
        expect(matchesLicenseFilter("Apache-2.0", ["CC0", "CC-BY-4.0"])).toBe(
            true,
        );
    });

    it("returns true for GPL-3.0 even when a CC license is selected", () => {
        expect(matchesLicenseFilter("GPL-3.0", ["CC-BY-SA-4.0"])).toBe(true);
    });

    it("returns true for BSD-3-Clause even when a CC license is selected", () => {
        expect(matchesLicenseFilter("BSD-3-Clause", ["CC-BY-NC-ND-4.0"])).toBe(
            true,
        );
    });

    it("returns true for custom license even when a CC license is selected", () => {
        expect(matchesLicenseFilter("custom", ["CC-BY-4.0", "CC0"])).toBe(true);
    });

    it("returns true for CC-BY-NC-4.0 (no design row) even when other CC licenses are selected", () => {
        // CC-BY-NC-4.0 is intentionally absent from the tracked set per issue #298.
        // It should never be hidden regardless of which checkboxes are active.
        expect(matchesLicenseFilter("CC-BY-NC-4.0", ["CC-BY-4.0"])).toBe(true);
        expect(matchesLicenseFilter("CC-BY-NC-4.0", ["CC-BY-NC-SA-4.0"])).toBe(
            true,
        );
        expect(
            matchesLicenseFilter("CC-BY-NC-4.0", [...TRACKED_LICENSE_VALUES]),
        ).toBe(true);
    });

    it("returns true for an unknown/future license string", () => {
        expect(
            matchesLicenseFilter("LicenseRef-custom-1.0", ["CC-BY-4.0"]),
        ).toBe(true);
    });

    // ── TRACKED_LICENSE_VALUES integrity ─────────────────────────────────────

    it("contains every value that the filter-panel rows can select", () => {
        CC_LICENSE_ROWS.flatMap((row) => row.values).forEach((license) => {
            expect(TRACKED_LICENSE_VALUES.has(license)).toBe(true);
        });
    });

    it("does not contain CC-BY-NC-4.0", () => {
        expect(TRACKED_LICENSE_VALUES.has("CC-BY-NC-4.0")).toBe(false);
    });

    it("does not contain any of the common non-CC open-source licenses", () => {
        const nonCc = [
            "MIT",
            "Apache-2.0",
            "GPL-3.0",
            "GPL-2.0",
            "BSD-3-Clause",
            "BSD-2-Clause",
            "custom",
        ];
        nonCc.forEach((l) => expect(TRACKED_LICENSE_VALUES.has(l)).toBe(false));
    });

    it("has one tracked value for every SPDX alias across all filter-panel rows", () => {
        const expected = new Set(CC_LICENSE_ROWS.flatMap((row) => row.values));
        expect(TRACKED_LICENSE_VALUES).toEqual(expected);
    });

    // ── Unrecognised values ──────────────────────────────────────────────────
    // A hand-edited, bookmarked, or shared URL can contain `?license=` (empty
    // string) or `?license=not-a-real-license` (typo / stale value).  Neither
    // should hide any resources — they must be treated as "no filter active".

    it("returns true for a tracked license when selected contains only an empty string", () => {
        expect(matchesLicenseFilter("CC-BY-4.0", [""])).toBe(true);
    });

    it("returns true for a tracked license when selected contains only an unrecognised value", () => {
        expect(matchesLicenseFilter("CC-BY-4.0", ["not-a-real-license"])).toBe(
            true,
        );
    });

    it("returns true for an untracked license when selected contains only invalid values", () => {
        expect(matchesLicenseFilter("MIT", ["", "not-a-real-license"])).toBe(
            true,
        );
    });

    it("filters on the valid value and drops an empty-string entry", () => {
        // resource matching the valid value → included
        expect(matchesLicenseFilter("CC-BY-4.0", ["CC-BY-4.0", ""])).toBe(
            true,
        );
        // resource NOT matching the valid value → excluded
        expect(matchesLicenseFilter("CC-BY-SA-4.0", ["CC-BY-4.0", ""])).toBe(
            false,
        );
    });

    it("filters on the valid value and drops an unrecognised-string entry", () => {
        expect(
            matchesLicenseFilter("CC-BY-4.0", [
                "CC-BY-4.0",
                "not-a-real-license",
            ]),
        ).toBe(true);
        expect(
            matchesLicenseFilter("CC-BY-SA-4.0", [
                "CC-BY-4.0",
                "not-a-real-license",
            ]),
        ).toBe(false);
    });

    it("untracked license still passes through when selected mixes valid and invalid values", () => {
        expect(
            matchesLicenseFilter("MIT", ["CC-BY-4.0", "not-a-real-license"]),
        ).toBe(true);
    });
});
