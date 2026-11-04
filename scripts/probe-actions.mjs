// For each gated route, click every non-navigation button on the live site (fresh page each time) and record what happens.
// usage: node scripts/probe-actions.mjs /app/keys,/app/settings  -> data/raw/actions.json
import { chromium } from "playwright-core";
import fs from "node:fs";
const routes = (process.argv[2] || "/app/keys").split(",");
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const base = "https://ratq-itqan.netlify.app";
const out = fs.existsSync("data/raw/actions.json") ? JSON.parse(fs.readFileSync("data/raw/actions.json", "utf8")) : {};
for (const route of routes) {
  const c0 = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await c0.addInitScript(() => localStorage.setItem("ratq_theme_customizer_first_visit_v1", "true"));
  const p0 = await c0.newPage(); await p0.goto(base + route); await p0.waitForTimeout(1500);
  const labels = await p0.evaluate(() => [...document.querySelectorAll("main button, main [role=switch], main select, main input[type=checkbox]")].map((e, i) => ({ i, tag: e.tagName.toLowerCase(), text: (e.innerText || e.getAttribute("aria-label") || e.getAttribute("title") || "").trim().replace(/\s+/g, " ").slice(0, 40), cls: e.className.toString().slice(0, 40) })));
  await c0.close();
  const res = [];
  for (const l of labels.slice(0, 40)) {
    const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
    await c.addInitScript(() => localStorage.setItem("ratq_theme_customizer_first_visit_v1", "true"));
    const p = await c.newPage(); await p.goto(base + route); await p.waitForTimeout(1200);
    const before = await p.evaluate(() => ({ t: document.querySelector("main").innerText, n: document.querySelector("main").querySelectorAll("*").length, fixed: [...document.querySelectorAll("body *")].filter((e) => getComputedStyle(e).position === "fixed" && e.getClientRects().length && !e.closest("aside,header")).length }));
    try {
      const el = p.locator("main button, main [role=switch], main select, main input[type=checkbox]").nth(l.i);
      if (l.tag === "select") { const opts = await el.evaluate((s) => [...s.options].map((o) => o.value)); await el.selectOption(opts[opts.length - 1]); }
      else await el.click({ timeout: 2000 });
      await p.waitForTimeout(500);
    } catch (e) { res.push({ ...l, err: String(e.message).split("\n")[0].slice(0, 60) }); await c.close(); continue; }
    const after = await p.evaluate(() => ({ url: location.pathname, t: document.querySelector("main")?.innerText ?? "", n: document.querySelector("main")?.querySelectorAll("*").length ?? 0, fixed: [...document.querySelectorAll("body *")].filter((e) => getComputedStyle(e).position === "fixed" && e.getClientRects().length && !e.closest("aside,header")).length, dialog: document.querySelector("[role=dialog]")?.innerText.slice(0, 120) ?? null }));
    const added = after.t.split("\n").filter((x) => x.trim() && !before.t.includes(x)).slice(0, 4);
    res.push({ ...l, url: after.url === route ? undefined : after.url, dn: after.n - before.n, fixed: after.fixed - before.fixed, dialog: after.dialog, added });
    await c.close();
  }
  out[route] = res;
  console.log(route, labels.length, "buttons;", res.filter((r) => r.url || r.dn || r.fixed || r.dialog || (r.added && r.added.length)).length, "with effects");
}
fs.writeFileSync("data/raw/actions.json", JSON.stringify(out, null, 1));
await b.close();
