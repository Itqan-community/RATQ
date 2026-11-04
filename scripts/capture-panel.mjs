// Capture the live Appearance & Theme panel (first-visit state) in both locales.
import { chromium } from "playwright-core";
import fs from "node:fs";
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const out = {};
for (const locale of ["ar", "en"]) {
  const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await c.addInitScript((l) => localStorage.setItem("ratq_locale", l), locale);
  const p = await c.newPage(); await p.goto("https://ratq-itqan.netlify.app/about"); await p.waitForTimeout(1500);
  out[locale] = await p.evaluate(() => {
    const root = document.getElementById("root");
    const top = [...root.children].slice(1).map((e) => e.outerHTML); // aside, overlay, panel
    return top;
  });
  await p.screenshot({ path: `data/chrome/panel-first-${locale}.png` });
  await c.close();
}
fs.writeFileSync("data/chrome/panel.json", JSON.stringify(out));
console.log(out.ar.map((h) => h.length));
await b.close();
