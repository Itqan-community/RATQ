// Fails if any page requests an origin other than the target host (or data:/blob:).
import { chromium } from "playwright-core";
const base = process.argv[2] || "https://ratq-v2.an-alshayea.workers.dev";
const routes = ["/", "/resources", "/resources/cms-9", "/resources/cms-150", "/standards", "/faq", "/app", "/admin", "/publishers", "/stacks", "/ux-study", "/about", "/en"];
const host = new URL(base).host;
const b = await chromium.launch({ channel: "chrome" }).catch(() => chromium.launch());
const bad = new Map();
for (const r of routes) {
  const p = await (await b.newContext()).newPage();
  p.on("request", (q) => {
    const u = q.url();
    if (/^(data|blob):/.test(u) || new URL(u).host === host) return;
    bad.set(new URL(u).host, (bad.get(new URL(u).host) || []).concat(r));
  });
  await p.goto(base + r, { waitUntil: "networkidle" }).catch((e) => console.log("ERR", r, e.message));
  await p.close();
}
await b.close();
console.log(bad.size ? Object.fromEntries(bad) : "OK: only same-origin requests");
process.exit(bad.size ? 1 : 0);
