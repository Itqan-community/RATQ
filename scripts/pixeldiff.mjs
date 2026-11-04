// Pixel diff: live site vs local clone.
// usage: node scripts/pixeldiff.mjs [--routes /,/faq] [--vp 1440x900,390x844] [--theme light,dark] [--locale ar,en]
//        [--hero split] [--max 2] [--local http://localhost:3100] [--full]
// Exits 1 if any case differs by more than --max percent (or page height differs by > 2%).
import { chromium } from "playwright-core";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import fs from "node:fs";
import path from "node:path";

const arg = (k, d) => {
  const i = process.argv.indexOf("--" + k);
  return i > -1 ? process.argv[i + 1] : d;
};
const LIVE = arg("live", "https://ratq-itqan.netlify.app");
const LOCAL = arg("local", "http://localhost:3100");
const routes = arg("routes", "/").split(",");
const vps = arg("vp", "1440x900").split(",");
const themes = arg("theme", "light").split(",");
const locales = arg("locale", "ar").split(",");
const hero = arg("hero", "third");
const max = Number(arg("max", "2"));
const full = process.argv.includes("--full");
// --act "click:<css>;press:<key>;type:<text>;select:<css>=<value>;wait:<ms>" runs on both pages before the screenshot.
const act = arg("act", "");
const noFonts = process.argv.includes("--no-gfonts"); // when Google Fonts is unreachable the page load stalls; block it on both sides
const hideText = arg("hide-text", ""); // hide the live block whose label matches (clone intentionally omits it), e.g. the hero-layout row of the appearance panel
const first = process.argv.includes("--first"); // fresh visitor: do not pre-set the appearance-panel flag
const actTag = (first ? "-first" : "") + (act ? "-act-" + act.replace(/[^A-Za-z0-9]+/g, "_").slice(0, 24) + "-" + [...act].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7).toString(36) : "");
const out = "baseline/diff";
fs.mkdirSync(out, { recursive: true });
fs.mkdirSync("baseline/live", { recursive: true });

// Freeze motion so ambient animations and the carousel autoplay do not count as diffs.
const FREEZE = `*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}`;

async function shot(browser, base, route, [w, h], theme, locale) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await ctx.addInitScript((f) => { window.__first = f; }, first);
  await ctx.addInitScript(
    ([t, l, hr]) => {
      try {
        localStorage.setItem("ratq_theme", t);
        localStorage.setItem("ratq_locale", l);
        localStorage.setItem("ratq_hero_layout", hr);
        if (!window.__first) localStorage.setItem("ratq_theme_customizer_first_visit_v1", "true");
      } catch {}
    },
    [theme, locale, hero],
  );
  if (noFonts) await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  const page = await ctx.newPage();
  await page.goto(base + route, { waitUntil: "load" });
  await page.addStyleTag({ content: FREEZE });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500);
  for (const step of act.split(";").filter(Boolean)) {
    const i = step.indexOf(":"), op = step.slice(0, i), v = step.slice(i + 1);
    if (op === "click") await page.locator(v).first().click();
    else if (op === "press") await page.keyboard.press(v);
    else if (op === "type") await page.keyboard.type(v);
    else if (op === "select") { const [sel, val] = v.split("="); await page.locator(sel).first().selectOption(val); }
    await page.waitForTimeout(op === "wait" ? Number(v) : 500);
  }
  if (hideText && base === LIVE) {
    await page.evaluate((txt) => {
      const re = new RegExp(txt);
      const span = [...document.querySelectorAll("[role=dialog] span")].find((e) => re.test(e.textContent || ""));
      let n = span; while (n && !(n.parentElement && n.parentElement.className.includes("space-y-3.5"))) n = n.parentElement;
      if (n) n.style.display = "none";
    }, hideText);
  }
  // Carousel autoplays on the live site: pin both pages to slide 1 so the cards match.
  const dot = page.locator(".depth-carousel__dot").first();
  // script click: works even under the first-visit overlay
  if (await dot.count()) { await dot.evaluate((e) => e.click()); await page.waitForTimeout(900); }
  const buf = await page.screenshot({ fullPage: full });
  await ctx.close();
  return PNG.sync.read(buf);
}

const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
let fail = 0;
for (const route of routes) for (const vp of vps) for (const theme of themes) for (const locale of locales) {
  const size = vp.split("x").map(Number);
  const slug = `${noFonts ? "nf-" : ""}${route === "/" ? "home" : route.replace(/^\//, "").replace(/[/?=&]/g, "_")}-${vp}-${theme}-${locale}-${hero}${full ? "-full" : ""}${actTag}`;
  const livePath = `baseline/live/${slug}.png`;
  const a = fs.existsSync(livePath) && !process.argv.includes("--refresh")
    ? PNG.sync.read(fs.readFileSync(livePath))
    : await shot(browser, LIVE, route, size, theme, locale);
  fs.writeFileSync(livePath, PNG.sync.write(a));
  const b = await shot(browser, LOCAL, route, size, theme, locale);
  const w = Math.min(a.width, b.width), h = Math.min(a.height, b.height);
  const crop = (p) => {
    const c = new PNG({ width: w, height: h });
    PNG.bitblt(p, c, 0, 0, w, h, 0, 0);
    return c;
  };
  const d = new PNG({ width: w, height: h });
  const bad = pixelmatch(crop(a).data, crop(b).data, d.data, w, h, { threshold: 0.12, includeAA: false });
  const pct = (bad / (w * h)) * 100;
  const dh = (Math.abs(a.height - b.height) / a.height) * 100;
  fs.writeFileSync(`${out}/${slug}.png`, PNG.sync.write(d));
  const ok = pct <= max && dh <= 2;
  if (!ok) fail++;
  console.log(`${ok ? "PASS" : "FAIL"} ${slug}  diff=${pct.toFixed(2)}%  height live=${a.height} clone=${b.height} (${dh.toFixed(1)}%)`);
  if (!ok && full) {
    // Where it differs: % of changed pixels per 400px band, worst first.
    const BAND = 400, bands = [];
    for (let y = 0; y < h; y += BAND) {
      let n = 0;
      const end = Math.min(y + BAND, h);
      for (let i = y * w; i < end * w; i++) if (d.data[i * 4] === 255 && d.data[i * 4 + 1] === 0) n++;
      bands.push([y, (n / ((end - y) * w)) * 100]);
    }
    console.log("  worst bands (y: %):", bands.sort((p, q) => q[1] - p[1]).slice(0, 5).map(([y, p]) => `${y}: ${p.toFixed(1)}`).join(" | "));
  }
}
await browser.close();
process.exit(fail ? 1 : 0);
