// Capture header avatar/guest markup per demo role (role is in-memory on the live site, set via the mobile-menu select).
import { chromium } from "playwright-core";
import fs from "node:fs";
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const out = {};
for (const locale of ["ar", "en"]) {
  const c = await b.newContext({ viewport: { width: 390, height: 900 } });
  await c.addInitScript((l) => { localStorage.setItem("ratq_locale", l); localStorage.setItem("ratq_theme_customizer_first_visit_v1", "true"); }, locale);
  const p = await c.newPage(); await p.goto("https://ratq-itqan.netlify.app/about"); await p.waitForTimeout(1500);
  await p.locator("header button[aria-label]").last().click(); await p.waitForTimeout(300);
  for (const role of ["developer", "publisher_owner", "reviewer", "moderator", "admin", "guest"]) {
    await p.locator("header select").selectOption(role); await p.waitForTimeout(400);
    const hasAvatar = await p.locator("header button.rounded-full").count();
    let menu = null;
    if (hasAvatar) { await p.locator("header button.rounded-full").click(); await p.waitForTimeout(300); menu = await p.evaluate(() => document.querySelector("header .relative").outerHTML); await p.locator("header button.rounded-full").click(); }
    const right = await p.evaluate(() => document.querySelector("header > div > div:last-child").outerHTML);
    out[`${role}_${locale}`] = { menu, right };
  }
  await c.close();
}
fs.writeFileSync("data/chrome/roles.json", JSON.stringify(out));
console.log(Object.keys(out).join(" "));
await b.close();
