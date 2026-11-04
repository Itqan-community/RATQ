// Every internal link found on the captured live pages must resolve on the clone exactly as it does on the live site.
// usage: node scripts/audit-links.mjs [https://ratq-v2.an-alshayea.workers.dev]
import fs from "node:fs";
import glob from "node:fs";
const CLONE = process.argv[2] || "http://localhost:3100";
const LIVE = "https://ratq-itqan.netlify.app";
const hrefs = new Map(); // path -> sample source page
for (const f of fs.readdirSync("data/pages")) {
  const d = JSON.parse(fs.readFileSync("data/pages/" + f, "utf8"));
  for (const loc of ["ar", "en"]) for (const part of [d[loc].main, d[loc].footer]) {
    for (const m of part.matchAll(/href="([^"]+)"/g)) { const h = m[1].replace(/&amp;/g, "&"); if (h.startsWith("/") && !h.startsWith("//") && !/\.(png|jpg|svg|webmanifest|css|js|otf)$/.test(h)) { const p = h.split("#")[0].split("?")[0] || "/"; if (!hrefs.has(p)) hrefs.set(p, d.route); } }
  }
}
for (const h of ["/", "/resources", "/resources/roadmap", "/resources/stacks", "/categories", "/standards", "/about", "/legal/terms", "/legal/privacy", "/legal/dmca", "/legal/accessibility", "/status", "/ux-study", "/faq", "/contact", "/licenses", "/changelog", "/publishers", "/standards/checklist", "/standards/revocations", "/auth/sign-in", "/auth/sign-up", "/auth/forgot", "/app", "/publisher", "/admin", "/review", "/moderation"]) if (!hrefs.has(h)) hrefs.set(h, "(static list)");
const status = async (base, p) => { try { const r = await fetch(base + p, { redirect: "manual" }); return r.status + (r.status >= 300 && r.status < 400 ? ">" + (r.headers.get("location") || "") : ""); } catch (e) { return "ERR"; } };
const paths = [...hrefs.keys()].sort();
const bad = [];
let i = 0;
async function worker() {
  while (i < paths.length) {
    const p = paths[i++];
    const [a, b] = await Promise.all([status(LIVE, p), status(CLONE, p)]);
    const okLive = a.startsWith("200");
    if (a !== b && !(okLive && b.startsWith("200"))) bad.push({ path: p, live: a, clone: b, from: hrefs.get(p) });
  }
}
await Promise.all(Array.from({ length: 8 }, worker));
console.log(paths.length, "distinct internal paths checked;", bad.length, "mismatches");
for (const x of bad) console.log(JSON.stringify(x));
