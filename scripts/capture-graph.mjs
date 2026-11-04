// Record a small interaction graph per route: from the loaded page, click each interactive element (depth <= 2) and snapshot
// the resulting <main> + fixed overlays, in both locales. The clone replays these snapshots (see components/Replay.tsx).
// usage: node scripts/capture-graph.mjs /app/keys,/app/settings [--depth 2] [--max 14]
import { chromium } from "playwright-core";
import fs from "node:fs";
const routes = (process.argv[2] || "/app/keys").split(",");
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > -1 ? Number(process.argv[i + 1]) : d; }; // absent flag -> default (indexOf -1 would read argv[0])
const depth = arg("depth", 2), maxStates = arg("max", 14);
const SETTLE = arg("settle", 450); // ms to wait after each click; raise for slow transitions/smooth scroll
const base = "https://ratq-itqan.netlify.app";
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });

const DEFAULT_SEL = "main button, main select, main input[type=checkbox], main [role=switch], [role=dialog] button, [role=dialog] select, [role=dialog] input[type=checkbox]";
const SEL = process.argv.includes("--sel") ? process.argv[process.argv.indexOf("--sel") + 1] : DEFAULT_SEL; // restrict which elements are explored (stored with the graph)

async function open(route, locale) {
  const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await c.addInitScript((l) => { localStorage.setItem("ratq_theme_customizer_first_visit_v1", "true"); localStorage.setItem("ratq_locale", l); }, locale);
  const p = await c.newPage();
  for (let n = 1; ; n++) { try { await p.goto(base + route, { timeout: 60000 }); break; } catch (e) { if (n >= 8) throw e; await p.waitForTimeout(15000 * n); } } // live site / DNS occasionally stalls: back off up to ~9 min total
  await p.waitForTimeout(1500);
  return [c, p];
}
const snap = (p) => p.evaluate(() => ({
  url: location.pathname,
  sy: Math.round(scrollY), // live may scroll on click (e.g. a map into view); Replay restores it for graphs that carry it
  main: document.querySelector("main")?.outerHTML ?? "",
  // Fixed layers rendered outside <main> (portals); anything inside <main> is already part of its snapshot.
  overlays: [...document.querySelectorAll("body *")].filter((e) => getComputedStyle(e).position === "fixed" && !e.closest("aside,header,main") && e.parentElement?.closest("[class~=fixed]") === null).map((e) => e.outerHTML),
}));
// Numbered exactly as act() does (Playwright's visible filter), so keys and clicks agree. That filter can include controls with no layout
// box (e.g. a display:none button) and disabled ones; `ph` = indices of the box-less ones, which Replay must count too. Neither is clickable.
const keysOf = (p) => p.locator(SEL).filter({ visible: true }).evaluateAll((els) => els.map((e, i) => ({ i, dis: e.disabled || !e.getClientRects().length, ph: !e.getClientRects().length, tag: e.tagName.toLowerCase(), opts: e.tagName === "SELECT" ? [...e.options].map((o) => o.value) : null, text: (e.innerText || e.getAttribute("aria-label") || "").trim().slice(0, 30) })));
async function act(p, key) {
  const [i, v] = String(key).split("=");
  const el = p.locator(SEL).filter({ visible: true }).nth(Number(i));
  if (v !== undefined) await el.selectOption(v); else await el.click({ timeout: 2500 });
  await p.waitForTimeout(SETTLE);
}
const out = fs.existsSync("data/graph/index.json") ? JSON.parse(fs.readFileSync("data/graph/index.json", "utf8")) : {};
for (const route of routes) {
  const slug = route === "/" ? "_home" : route.replace(/^\//, "").replace(/\//g, "__");
  let ph = []; const states = []; const edges = {}; const byHtml = new Map(); const queue = [];
  // sy is part of the key: the same markup at another scroll position is a different state
  const add = (s, path) => { const h = s.main + "|" + s.overlays.join("") + "|" + s.url + "|" + s.sy; if (byHtml.has(h)) return byHtml.get(h); const id = states.length; states.push({ ...s, path }); byHtml.set(h, id); queue.push(id); return id; };
  let [c, p] = await open(route, "ar");
  add(await snap(p), []); await c.close();
  while (queue.length && states.length < maxStates) {
    const id = queue.shift(); const path = states[id].path;
    if (path.length >= depth) continue;
    [c, p] = await open(route, "ar");
    try { for (const k of path) await act(p, k); } catch { await c.close(); continue; }
    const keys = await keysOf(p); await c.close();
    if (id === 0) ph = keys.filter((k) => k.ph).map((k) => k.i);
    for (const k of keys) {
      if (k.dis) continue; // numbered (Playwright nth() counts disabled controls) but not clickable
      const variants = k.opts ? k.opts.slice(1).map((o) => `${k.i}=${o}`) : [String(k.i)];
      for (const key of variants) {
        if (states.length >= maxStates) break;
        [c, p] = await open(route, "ar");
        try { for (const kk of path) await act(p, kk); await act(p, key); } catch { await c.close(); continue; }
        const s = await snap(p); await c.close();
        const same = s.url === route ? add(s, [...path, key]) : null;
        (edges[id] ??= {})[key] = same !== null ? same : { nav: s.url };
      }
    }
  }
  if (!Object.keys(edges).length && fs.existsSync(`data/graph/${slug}.json`)) { console.log(route, "no interactive elements found (page not loaded?), keeping existing graph"); continue; }
  // EN snapshots by replaying each state's path
  const en = [];
  for (const st of states) { [c, p] = await open(route, "en"); try { for (const k of st.path) await act(p, k); en.push(await snap(p)); } catch { en.push(null); } await c.close(); }
  fs.writeFileSync(`data/graph/${slug}.json`, JSON.stringify({ route, ...(SEL !== DEFAULT_SEL ? { sel: SEL } : {}), ...(ph.length ? { ph } : {}), states: states.map(({ path, ...s }) => ({ ...s, path })), en, edges }));
  out[route] = { states: states.length, edges: Object.values(edges).reduce((a, e) => a + Object.keys(e).length, 0) };
  console.log(route, out[route]);
  fs.writeFileSync("data/graph/index.json", JSON.stringify(out)); // keep progress if a later route crashes
}
fs.writeFileSync("data/graph/index.json", JSON.stringify(out));
await b.close();
