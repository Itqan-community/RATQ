// Pull the live app's in-memory dataset out of React's fiber tree (the site keeps its mock DB in module state).
// usage: node scripts/extract-data.mjs  -> data/mock/resources.json (+ publishers/categories if reachable)
import { chromium } from "playwright-core";
import fs from "node:fs";
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
await c.addInitScript(() => localStorage.setItem("ratq_theme_customizer_first_visit_v1", "true"));
const p = await c.newPage(); await p.goto("https://ratq-itqan.netlify.app/resources"); await p.waitForTimeout(2000);
const data = await p.evaluate(() => {
  const el = document.querySelector("main article");
  const key = Object.keys(el).find((k) => k.startsWith("__reactFiber$"));
  let f = el[key];
  const found = {};
  const scan = (v, label) => { if (Array.isArray(v) && v.length > 3 && v[0] && typeof v[0] === "object") { const k = Object.keys(v[0]).slice(0, 4).join(","); if (!found[k] || found[k].length < v.length) found[k] = v; } };
  while (f) {
    let s = f.memoizedState;
    while (s) { scan(s.memoizedState, "state"); if (Array.isArray(s.memoizedState) && Array.isArray(s.memoizedState[0])) scan(s.memoizedState[0], "memo"); s = s.next; }
    for (const pr of Object.values(f.memoizedProps || {})) scan(pr, "prop");
    f = f.return;
  }
  return Object.fromEntries(Object.entries(found).map(([k, v]) => [k, v.map((o) => JSON.parse(JSON.stringify(o)))]));
});
for (const [k, v] of Object.entries(data)) console.log(k, v.length);
fs.mkdirSync("data/mock", { recursive: true });
fs.writeFileSync("data/mock/_found.json", JSON.stringify(data));
await b.close();
