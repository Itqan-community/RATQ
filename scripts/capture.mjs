// Crawl the live site and store each route's rendered <main>/<footer> HTML in both locales.
// usage: node scripts/capture.mjs [--only /about,/faq] [--conc 4]
// out:   data/pages/<slug>.json  { route, ar:{title,desc,main,footer}, en:{...} }
import { chromium } from "playwright-core";
import fs from "node:fs";

const LIVE = "https://ratq-itqan.netlify.app";
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > -1 ? process.argv[i + 1] : d; };
const conc = Number(arg("conc", "4"));
const only = arg("only", "");
const slugOf = (r) => (r === "/" ? "_home" : r.replace(/^\//, "").replace(/\//g, "__"));
fs.mkdirSync("data/pages", { recursive: true });

const seeds = only ? only.split(",") : [
  "/", "/about", "/categories", "/changelog", "/contact", "/faq", "/legal", "/legal/privacy", "/legal/terms", "/legal/dmca", "/legal/accessibility",
  "/licenses", "/publishers", "/standards", "/standards/checklist", "/standards/revocations", "/status", "/ux-study", "/roadmap", "/stacks",
  "/stacks/tech-spec-table", "/resources", "/resources/roadmap", "/resources/stacks", "/resources/stacks/tech-spec-table", "/resources/wizard",
  "/resources/preview-sections", "/resources/preview-tree-explorer", "/403", "/500", "/auth/sign-in", "/auth/sign-up", "/auth/forgot",
  "/app", "/app/keys", "/app/notifications", "/app/requests", "/app/saved", "/app/settings", "/publisher", "/publisher/analytics",
  "/publisher/claim", "/publisher/requests", "/publisher/resources", "/publisher/resources/new", "/publisher/webhooks", "/admin", "/admin/audit",
  "/admin/flags", "/admin/resources", "/admin/users", "/review", "/moderation", "/does-not-exist-404",
];

const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const seen = new Set(seeds);
const queue = [...seeds];
const found = [];

async function grab(route, locale) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(([l]) => { try { localStorage.setItem("ratq_locale", l); localStorage.setItem("ratq_hero_layout", "third"); localStorage.setItem("ratq_theme_customizer_first_visit_v1", "true"); } catch {} }, [locale]);
  const page = await ctx.newPage();
  await page.goto(LIVE + route, { waitUntil: "load" });
  await page.waitForTimeout(1800);
  const r = await page.evaluate(() => {
    const main = document.querySelector("main");
    const links = [...document.querySelectorAll("a[href^='/']")].map((a) => a.getAttribute("href").split("#")[0].split("?")[0]).filter(Boolean);
    return {
      title: document.title,
      desc: document.querySelector("meta[name=description]")?.content || "",
      main: main ? main.outerHTML : "",
      footer: document.querySelector("footer")?.outerHTML || "",
      links,
      path: location.pathname,
    };
  });
  await ctx.close();
  return r;
}

async function worker() {
  while (queue.length) {
    const route = queue.shift();
    try {
      const ar = await grab(route, "ar");
      const en = await grab(route, "en");
      for (const l of ar.links) if (!seen.has(l) && !/\.(png|jpg|svg|webmanifest|js|css)$/.test(l)) { seen.add(l); if (!only) queue.push(l); }
      const { links: _a, ...A } = ar; const { links: _b, ...E } = en;
      fs.writeFileSync(`data/pages/${slugOf(route)}.json`, JSON.stringify({ route, ar: A, en: E }));
      found.push(route);
      console.log(`ok ${route} ar=${A.main.length} en=${E.main.length} (redirect:${A.path !== route ? A.path : "-"}) queue=${queue.length}`);
    } catch (e) {
      console.log(`ERR ${route} ${String(e.message).slice(0, 120)}`);
    }
  }
}
await Promise.all(Array.from({ length: conc }, worker));
await browser.close();
console.log("done", found.length, "routes");
