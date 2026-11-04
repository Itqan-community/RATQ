// Capture post-submit states of the demo forms (both locales) so the clone can swap them in.
import { chromium } from "playwright-core";
import fs from "node:fs";
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const base = "https://ratq-itqan.netlify.app";
const FORMS = {
  forgot: { path: "/auth/forgot", run: async (p) => { await p.locator("main input").fill("demo@example.com"); await p.locator("main form button[type=submit], main form button").first().click(); } },
  contact: { path: "/contact", run: async (p) => { await p.locator("main input").nth(0).fill("Demo User"); await p.locator("main input").nth(1).fill("demo@example.com"); await p.locator("main textarea").fill("Hello team, this is a demo message."); await p.locator("main button").last().click(); } },
  signup: { path: "/auth/sign-up", run: async (p) => { const i = p.locator("main input"); await i.nth(0).fill("Demo User"); await i.nth(1).fill("demo_user"); await i.nth(2).fill("demo@example.com"); await i.nth(3).fill("Passw0rd!x"); await i.nth(4).check({ force: true }); await p.locator("main button").last().click(); } },
};
const out = {};
for (const [name, f] of Object.entries(FORMS)) {
  out[name] = {};
  for (const l of ["ar", "en"]) {
    const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
    await c.addInitScript((l) => { localStorage.setItem("ratq_theme_customizer_first_visit_v1", "true"); localStorage.setItem("ratq_locale", l); }, l);
    const p = await c.newPage(); await p.goto(base + f.path); await p.waitForTimeout(1500);
    await f.run(p); await p.waitForTimeout(2500);
    out[name][l] = { url: p.url().replace(base, ""), main: await p.evaluate(() => document.querySelector("main").outerHTML) };
    await p.screenshot({ path: `data/chrome/state-${name}-${l}.png` });
    console.log(name, l, out[name][l].url, out[name][l].main.length);
    await c.close();
  }
}
fs.writeFileSync("data/chrome/form-states.json", JSON.stringify(out));
await b.close();
