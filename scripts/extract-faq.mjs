// Capture every FAQ item (question, answer, category chip) in both locales by driving the live /faq page.
import { chromium } from "playwright-core";
import fs from "node:fs";
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const out = {};
for (const l of ["ar", "en"]) {
  const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await c.addInitScript((l) => { localStorage.setItem("ratq_theme_customizer_first_visit_v1", "true"); localStorage.setItem("ratq_locale", l); }, l);
  const p = await c.newPage(); await p.goto("https://ratq-itqan.netlify.app/faq"); await p.waitForTimeout(1800);
  const chips = await p.evaluate(() => [...document.querySelectorAll("main .flex.flex-wrap.gap-2 button")].map((b) => b.innerText.trim()));
  const qs = async () => p.evaluate(() => [...document.querySelectorAll("main .space-y-3 > div")].map((d) => d.querySelector("button")?.innerText.trim()));
  const all = await qs();
  const items = [];
  for (let i = 0; i < all.length; i++) {
    const btn = p.locator("main .space-y-3 > div").nth(i).locator("button").first();
    const open = await p.evaluate((i) => document.querySelectorAll("main .space-y-3 > div")[i].children.length > 1, i);
    if (!open) { await btn.click(); await p.waitForTimeout(150); }
    const answer = await p.evaluate((i) => { const d = document.querySelectorAll("main .space-y-3 > div")[i]; return d.children[1]?.textContent.trim() ?? ""; }, i);
    items.push({ q: all[i], a: answer, cat: [] });
  }
  for (let ci = 1; ci < chips.length; ci++) {
    await p.locator("main .flex.flex-wrap.gap-2 button").nth(ci).click(); await p.waitForTimeout(250);
    const shown = await qs();
    for (const it of items) if (shown.includes(it.q)) it.cat.push(chips[ci]);
  }
  out[l] = { chips, items };
  console.log(l, chips, items.length, items.map((i) => i.cat.join("|")));
  await c.close();
}
fs.writeFileSync("data/mock/faq.json", JSON.stringify(out));
await b.close();
