// Map every resource slug to its resource_type by loading the live catalog with ?type=<key> for each type.
import { chromium } from "playwright-core";
import fs from "node:fs";
// drawer labels (Arabic) -> type keys used in ?type= links on the home index
const TYPES = { "مكتبة برمجية": "library", "تلاوة وقراءات": "recitation", "مصحف رقمي": "mushaf", "تفسير وبيان": "tafsir", "خط طباعي": "font", "مجموعة بيانات": "dataset", "واجهة API": "api", "ترجمة معاني": "translation", "أحكام تجويد": "tajweed", "حزمة تطوير SDK": "sdk", "أداة مساعدة": "tool" };
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const out = {};
for (const [label, t] of Object.entries(TYPES)) {
  const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await c.addInitScript(() => localStorage.setItem("ratq_theme_customizer_first_visit_v1", "true"));
  const p = await c.newPage(); await p.goto("https://ratq-itqan.netlify.app/resources"); await p.waitForTimeout(1500);
  await p.getByText("الفلاتر المتقدمة").first().click(); await p.waitForTimeout(500);
  await p.locator("label", { hasText: label }).first().click(); await p.getByText(/تطبيق الفلاتر/).first().click(); await p.waitForTimeout(900);
  const slugs = await p.evaluate(() => [...new Set([...document.querySelectorAll("main article a[href^='/resources/']")].map((a) => a.getAttribute("href").split("/")[2]))]);
  for (const s of slugs) out[s] = t;
  console.log(t, slugs.length);
  await c.close();
}
fs.writeFileSync("data/resource-types.json", JSON.stringify(out));
await b.close();
