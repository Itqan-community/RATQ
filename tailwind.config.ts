import type { Config } from "tailwindcss";

const v = (name: string) => `var(${name})`;
const ratq: Record<string, string> = {};
for (const s of [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]) ratq[s] = v(`--ratq-primary-${s}`);
const deep: Record<string, string> = {};
for (const s of [50, 100, 300, 500, 700, 900]) deep[s] = v(`--ratq-deep-${s}`);
const gold: Record<string, string> = {};
for (const s of [50, 100, 300, 500, 700, 900]) gold[s] = v(`--ratq-gold-${s}`);

// Mirrors the live site's Tailwind 3 config: semantic tokens resolve to CSS variables set per palette/theme.
export default {
  // lib/**/*.json holds recorded UI states (graphs, form results) whose class names appear nowhere else.
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx,json}", "./public/graph/*.json"], // recorded states are fetched at runtime but their classes must be generated at build
  darkMode: ["variant", "&:is([data-theme=dark] *)"],
  theme: {
    extend: {
      colors: {
        canvas: v("--bg-canvas"),
        subtle: v("--bg-subtle"),
        muted: v("--bg-muted"),
        inverse: v("--bg-inverse"),
        fg: { DEFAULT: v("--fg-default"), muted: v("--fg-muted"), subtle: v("--fg-subtle"), inverse: v("--fg-inverse") },
        border: { DEFAULT: v("--border-default"), subtle: v("--border-subtle"), strong: v("--border-strong") },
        ratq,
        deep,
        gold,
      },
      borderRadius: {
        xs: v("--radius-xs"), sm: v("--radius-sm"), md: v("--radius-md"), lg: v("--radius-lg"), xl: v("--radius-xl"), "2xl": v("--radius-2xl"),
      },
      boxShadow: { xs: v("--shadow-xs-v"), sm: v("--shadow-sm-v"), md: v("--shadow-md-v"), lg: v("--shadow-lg-v") },
      fontSize: { "2xs": ["0.6875rem", "1rem"] },
      maxWidth: { container: v("--container-max"), narrow: v("--container-narrow") },
      fontFamily: { sans: v("--font-ui"), ui: v("--font-ui"), quran: v("--font-quran"), mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"] },
    },
  },
} satisfies Config;
