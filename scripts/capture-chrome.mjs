// Capture the open state of the header widgets (avatar menu, mobile menu, Cmd+K palette) in both locales.
import { chromium } from "playwright-core";
import fs from "node:fs";
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const out = {};
for (const locale of ["ar", "en"]) {
  const mk = async (w) => {
    const c = await b.newContext({ viewport: { width: w, height: 900 } });
    await c.addInitScript((l) => { localStorage.setItem("ratq_locale", l); localStorage.setItem("ratq_hero_layout", "third"); localStorage.setItem("ratq_theme_customizer_first_visit_v1", "true"); }, locale);
    const p = await c.newPage(); await p.goto("https://ratq-itqan.netlify.app/about"); await p.waitForTimeout(1500); return [c, p];
  };
  const diff = (before, after) => after.filter((x) => !before.includes(x));
  // avatar menu
  let [c, p] = await mk(1440);
  const header = () => p.evaluate(() => document.querySelector("header").outerHTML);
  const body = () => p.evaluate(() => document.body.innerHTML.length);
  await p.locator("header button.rounded-full").click(); await p.waitForTimeout(500);
  out[`avatar_${locale}`] = await p.evaluate(() => { const h = document.querySelector("header .relative"); return h.outerHTML; });
  await p.screenshot({ path: `data/chrome/avatar-${locale}.png` });
  await c.close();
  // palette
  [c, p] = await mk(1440);
  await p.locator("header button:has(kbd)").click(); await p.waitForTimeout(700);
  out[`palette_${locale}`] = await p.evaluate(() => { const d = [...document.querySelectorAll("div")].filter((e) => getComputedStyle(e).position === "fixed" && e.querySelector("input")).pop(); return d ? d.outerHTML : null; });
  await p.screenshot({ path: `data/chrome/palette-${locale}.png` });
  await p.keyboard.type("tafsir"); await p.waitForTimeout(500);
  out[`palette_q_${locale}`] = await p.evaluate(() => { const d = [...document.querySelectorAll("div")].filter((e) => getComputedStyle(e).position === "fixed" && e.querySelector("input")).pop(); return d ? d.outerHTML : null; });
  await p.screenshot({ path: `data/chrome/palette-q-${locale}.png` });
  await c.close();
  // mobile menu
  [c, p] = await mk(390);
  await p.locator("header button[aria-label]").last().click(); await p.waitForTimeout(600);
  out[`mobile_${locale}`] = await p.evaluate(() => document.querySelector("header").outerHTML);
  await p.screenshot({ path: `data/chrome/mobile-${locale}.png` });
  await c.close();
}
fs.writeFileSync("data/chrome/states.json", JSON.stringify(out));
for (const [k, v] of Object.entries(out)) console.log(k, v ? v.length : null);
await b.close();
