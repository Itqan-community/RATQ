// For each recorded route, replay every depth-1 click on live and on the clone and pixel-diff the two screens.
// usage: node scripts/verify-graph.mjs /app/keys,/admin [--locale ar] [--local http://localhost:3100] [--max 2]
import { chromium } from "playwright-core";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import fs from "node:fs";
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > -1 ? process.argv[i + 1] : d; };
const LIVE = "https://ratq-itqan.netlify.app", LOCAL = arg("local", "http://localhost:3100"), max = Number(arg("max", "2"));
const locale = arg("locale", "ar"), WAIT = Number(arg("wait", "700")); // --wait 3000 lets smooth scrolls finish
const routes = (process.argv[2] || "/app/keys").split(",");
const DEFAULT_SEL = "main button, main select, main input[type=checkbox], main [role=switch], [role=dialog] button, [role=dialog] select, [role=dialog] input[type=checkbox]";
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const FREEZE = "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}";
async function shot(base, route, keys, SEL = DEFAULT_SEL) {
  const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await c.addInitScript((l) => { localStorage.setItem("ratq_theme_customizer_first_visit_v1", "true"); localStorage.setItem("ratq_locale", l); }, locale);
  const p = await c.newPage(); await p.goto(base + route); await p.addStyleTag({ content: FREEZE }); await p.waitForTimeout(1600);
  for (const k of keys) { const [i, v] = k.split("="); const el = p.locator(SEL).filter({ visible: true }).nth(Number(i)); if (v !== undefined) await el.selectOption(v); else await el.click({ timeout: 3000 }); await p.waitForTimeout(WAIT); }
  const nav = new URL(p.url()).pathname;
  const buf = await p.screenshot(); await c.close();
  return { png: PNG.sync.read(buf), nav };
}
let fail = 0, total = 0;
for (const route of routes) {
  const slug = route === "/" ? "_home" : route.replace(/^\//, "").replace(/\//g, "__");
  const g = JSON.parse(fs.readFileSync(`data/graph/${slug}.json`, "utf8"));
  const keys = Object.keys(g.edges["0"] || {}).filter((k) => !k.includes("=")); const sel = g.sel || DEFAULT_SEL;
  for (const k of keys) {
    total++;
    try {
      const [a, c] = [await shot(LIVE, route, [k], sel), await shot(LOCAL, route, [k], sel)];
      const d = new PNG({ width: a.png.width, height: a.png.height });
      const bad = a.png.width === c.png.width && a.png.height === c.png.height ? pixelmatch(a.png.data, c.png.data, d.data, a.png.width, a.png.height, { threshold: 0.12, includeAA: false }) : -1;
      const pct = bad < 0 ? 100 : (bad / (a.png.width * a.png.height)) * 100;
      const ok = pct <= max && a.nav === c.nav;
      if (!ok) { fail++; fs.mkdirSync("baseline/diff", { recursive: true }); fs.writeFileSync(`baseline/diff/graph-${slug}-${k}.png`, PNG.sync.write(d)); }
      console.log(`${ok ? "PASS" : "FAIL"} ${route} click#${k} ${locale} diff=${pct.toFixed(2)}% nav live=${a.nav} clone=${c.nav}`);
    } catch (e) { fail++; console.log(`ERR  ${route} click#${k} ${String(e.message).split("\n")[0].slice(0, 80)}`); }
  }
}
console.log(`done: ${total - fail}/${total} pass`);
await b.close();
