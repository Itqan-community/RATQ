// Compares rendered <title>, description, og/twitter meta, manifest, canonical per route: live vs clone.
import { chromium } from "playwright-core";
import fs from "node:fs";
const LIVE = "https://ratq-itqan.netlify.app", LOCAL = process.argv[2] || "http://localhost:3100";
const routes = Object.keys(JSON.parse(fs.readFileSync("baseline/routes-ar.json", "utf8"))).filter((r) => r.startsWith("/"));
const grab = () => ({
  title: document.title,
  meta: Object.fromEntries([...document.querySelectorAll("meta[name],meta[property]")].map((m) => [m.getAttribute("name") || m.getAttribute("property"), m.content])),
  links: [...document.querySelectorAll("link[rel=manifest],link[rel=canonical],link[rel~=icon]")].map((l) => l.rel + "=" + l.getAttribute("href")),
});
const b = await chromium.launch({ channel: "chrome" }).catch(() => chromium.launch());
const ctx = await b.newContext();
let bad = 0;
for (const r of routes) {
  const out = [];
  for (const base of [LIVE, LOCAL]) {
    const p = await ctx.newPage();
    await p.goto(base + r, { waitUntil: "networkidle" }).catch(() => {});
    await p.waitForTimeout(300);
    out.push(await p.evaluate(grab)); await p.close();
  }
  const [a, c] = out, diffs = [];
  for (const x of out) { x.links.sort(); if (x.meta.viewport) x.meta.viewport = x.meta.viewport.replace("1.0", "1"); }
  if (a.title !== c.title) diffs.push(`title live="${a.title}" clone="${c.title}"`);
  for (const k of new Set([...Object.keys(a.meta), ...Object.keys(c.meta)])) if (a.meta[k] !== c.meta[k]) diffs.push(`${k} live="${a.meta[k]}" clone="${c.meta[k]}"`);
  if (JSON.stringify(a.links) !== JSON.stringify(c.links)) diffs.push(`links live=${a.links} clone=${c.links}`);
  if (diffs.length) { bad++; console.log(r, "\n  " + diffs.join("\n  ")); }
}
await b.close();
console.log(`${routes.length - bad}/${routes.length} routes match`);
