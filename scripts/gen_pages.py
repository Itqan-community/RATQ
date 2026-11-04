"""Generate bilingual page components from data/pages/*.json (see scripts/capture.mjs).

Each page's AR and EN <main> DOM are walked in parallel. Identical nodes are emitted once; text that differs
becomes <span class="t-ar">..</span><span class="t-en">..</span> (CSS shows one by <html lang>), so SSR needs no
locale and there is no flash. Pages whose AR/EN structure differs are listed in data/pages-report.json.

usage: python3 scripts/gen_pages.py
"""
import glob
import html as htmllib
import json
import os
import re
import shutil
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_COMP = os.path.join(ROOT, "components", "pages")
OUT_APP = os.path.join(ROOT, "app")

VOID = {"img", "br", "hr", "input", "meta", "link", "source", "wbr", "col"}
ATTR = {
    "class": "className", "for": "htmlFor", "tabindex": "tabIndex", "srcset": "srcSet", "crossorigin": "crossOrigin",
    "colspan": "colSpan", "rowspan": "rowSpan", "readonly": "readOnly", "maxlength": "maxLength", "autocomplete": "autoComplete",
    "viewbox": "viewBox", "patternunits": "patternUnits", "patterncontentunits": "patternContentUnits", "gradientunits": "gradientUnits",
    "gradienttransform": "gradientTransform", "preserveaspectratio": "preserveAspectRatio", "stopcolor": "stopColor",
    "clippathunits": "clipPathUnits", "maskunits": "maskUnits", "filterunits": "filterUnits", "spreadmethod": "spreadMethod",
    "frameborder": "frameBorder", "allowfullscreen": "allowFullScreen", "datetime": "dateTime", "autofocus": "autoFocus",
}
BOOL = {"disabled", "checked", "readOnly", "required", "hidden", "open", "selected", "multiple", "autoFocus"}
NUMERIC_ATTR = {"tabIndex", "colSpan", "rowSpan", "maxLength", "rows", "cols", "size"}
UNITLESS = {"zIndex", "opacity", "flex", "fontWeight", "order", "flexGrow", "flexShrink", "lineHeight", "scale"}
VISIBLE_ATTRS = {"placeholder", "aria-label", "title", "alt"}


def camel(s):
    return re.sub(r"-([a-z])", lambda m: m.group(1).upper(), s)


def attr_name(n):
    n = n.lower()
    if n in ATTR:
        return ATTR[n]
    if n.startswith(("aria-", "data-")):
        return n
    if n == "xmlns:xlink":
        return None
    if n.startswith("xlink:"):
        return camel(n.replace(":", "-"))
    return camel(n)


def style_obj(s):
    parts = []
    for decl in s.split(";"):
        if ":" not in decl:
            continue
        k, v = decl.split(":", 1)
        k, v = k.strip(), v.strip()
        key = '"%s"' % k if k.startswith("--") else camel(k)
        val = v if key in UNITLESS and re.fullmatch(r"-?\d+(\.\d+)?", v) else json.dumps(v)
        parts.append("%s: %s" % (key, val))
    return "{{ %s } as React.CSSProperties}" % ", ".join(parts)


def esc_text(t):
    if "\n" in t or "  " in t:
        # JSX collapses newlines/runs of spaces in literal text; keep them (white-space: pre-line/pre-wrap content).
        return "{%s}" % json.dumps(t, ensure_ascii=False)
    return t.replace("{", "&#123;").replace("}", "&#125;").replace("<", "&lt;").replace(">", "&gt;")


class Node:
    __slots__ = ("tag", "attrs", "kids", "text")

    def __init__(self, tag=None, attrs=None, text=None):
        self.tag, self.attrs, self.kids, self.text = tag, attrs or [], [], text


class Tree(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("#root")
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs)
        self.stack[-1].kids.append(n)
        if tag not in VOID:
            self.stack.append(n)

    def handle_startendtag(self, tag, attrs):
        self.stack[-1].kids.append(Node(tag, attrs))

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                break

    def handle_data(self, data):
        self.stack[-1].kids.append(Node(text=data))


def parse(src):
    t = Tree()
    t.feed(src)
    t.close()
    return t.root


class Mismatch(Exception):
    pass


stats = {"attr_diff": 0}


def fmt_attrs(tag, a_attrs, b_attrs):
    parts = []
    bd = dict(b_attrs)
    for k, v in a_attrs:
        an = attr_name(k)
        if an is None:
            continue
        if k in VISIBLE_ATTRS or k.startswith("aria-"):
            if bd.get(k, v) != v:
                stats["attr_diff"] += 1  # EN value dropped: attributes stay Arabic (see report)
        elif bd.get(k, v) != v and k not in ("class", "style", "href", "src", "d", "points"):
            pass
        if tag in ("input", "textarea", "select") and an == "value":
            an = "defaultValue"
        if v is None:
            parts.append(an)
        elif an == "style":
            parts.append("style=%s" % style_obj(v))
        elif an in NUMERIC_ATTR and re.fullmatch(r"-?\d+", v):
            parts.append("%s={%s}" % (an, v))
        elif an in BOOL and v in ("", an.lower()):
            parts.append(an)
        else:
            v = htmllib.unescape(v)
            if "\n" in v or '"' in v:
                parts.append("%s={%s}" % (an, json.dumps(v)))
            else:
                parts.append('%s="%s"' % (an, v.replace("{", "&#123;").replace("}", "&#125;")))
    return parts


def emit(a, b, out):
    if a.text is not None:
        if b.text is None:
            raise Mismatch("text vs element")
        if a.text == b.text or not a.text.strip():
            out.append(esc_text(a.text))
        else:
            out.append('<span className="t-ar">%s</span><span className="t-en">%s</span>' % (esc_text(a.text), esc_text(b.text)))
        return
    if a.tag == b.tag and len(a.kids) != len(b.kids) and 0 in (len(a.kids), len(b.kids)):
        # one locale renders this element empty: show the populated side's children in its language only
        src, cls = (a, "t-ar") if a.kids else (b, "t-en")
        parts = fmt_attrs(a.tag, a.attrs, b.attrs)
        out.append("<%s%s>" % (a.tag, (" " + " ".join(parts)) if parts else ""))
        for k in src.kids:
            out.append('<span className="%s">' % cls)
            emit(k, k, out)
            out.append("</span>")
        out.append("</%s>" % a.tag)
        return
    if a.tag != b.tag or len(a.kids) != len(b.kids):
        raise Mismatch("%s/%s kids %d/%d" % (a.tag, b.tag, len(a.kids), len(b.kids)))
    href = dict(a.attrs).get("href")
    internal = a.tag == "a" and href and href.startswith("/") and not href.startswith("//")
    name = "Link" if internal else a.tag
    parts = fmt_attrs(a.tag, a.attrs, b.attrs)
    if a.tag == "option" and len(a.kids) == 1 and a.kids[0].text is not None and b.kids and b.kids[0].text is not None and a.kids[0].text != b.kids[0].text:
        # <option> can only hold text: keep the Arabic and let lib/prefs.tsx swap it by data-en when the locale is English
        parts += ["data-ar=%s" % json.dumps("{%s}" % json.dumps(a.kids[0].text, ensure_ascii=False)) if False else "data-ar={%s}" % json.dumps(a.kids[0].text, ensure_ascii=False), "data-en={%s}" % json.dumps(b.kids[0].text, ensure_ascii=False)]
        out.append("<option%s>%s</option>" % ((" " + " ".join(parts)) if parts else "", esc_text(a.kids[0].text)))
        return
    s = "<%s%s" % (name, (" " + " ".join(parts)) if parts else "")
    if a.tag in VOID:
        out.append(s + " />")
        return
    out.append(s + ">")
    for x, y in zip(a.kids, b.kids):
        emit(x, y, out)
    out.append("</%s>" % name)


def emit_html(a, b, out):
    """Same walk as emit(), but writes plain HTML (for states swapped in at runtime via innerHTML)."""
    if a.text is not None:
        if a.text == b.text or not a.text.strip():
            out.append(htmllib.escape(a.text, quote=False))
        else:
            out.append('<span class="t-ar">%s</span><span class="t-en">%s</span>' % (htmllib.escape(a.text, quote=False), htmllib.escape(b.text, quote=False)))
        return
    if a.tag == b.tag and len(a.kids) != len(b.kids) and 0 in (len(a.kids), len(b.kids)):
        # one locale renders this element empty: show the populated side's children in its language only
        src, cls = (a, "t-ar") if a.kids else (b, "t-en")
        out.append("<%s%s>" % (a.tag, "".join((' %s="%s"' % (k, htmllib.escape(v or "", quote=True))) if v is not None else " " + k for k, v in a.attrs)))
        for k in src.kids:
            out.append('<span class="%s">' % cls)
            emit_html(k, k, out)
            out.append("</span>")
        out.append("</%s>" % a.tag)
        return
    if a.tag != b.tag or len(a.kids) != len(b.kids):
        raise Mismatch("%s/%s" % (a.tag, b.tag))
    attrs = "".join((' %s="%s"' % (k, htmllib.escape(v or "", quote=True))) if v is not None else " " + k for k, v in a.attrs)
    if a.tag == "option" and len(a.kids) == 1 and a.kids[0].text is not None and b.kids and b.kids[0].text is not None and a.kids[0].text != b.kids[0].text:
        out.append('<option%s data-ar="%s" data-en="%s">%s</option>' % (attrs, htmllib.escape(a.kids[0].text), htmllib.escape(b.kids[0].text), htmllib.escape(a.kids[0].text, quote=False)))
        return
    if a.tag in VOID:
        out.append("<%s%s>" % (a.tag, attrs))
        return
    out.append("<%s%s>" % (a.tag, attrs))
    for x, y in zip(a.kids, b.kids):
        emit_html(x, y, out)
    out.append("</%s>" % a.tag)


def write_form_states():
    """data/chrome/form-states.json (captured by scripts/capture-states.mjs) -> lib/form-states.json of merged AR/EN HTML."""
    src = os.path.join(ROOT, "data", "chrome", "form-states.json")
    if not os.path.exists(src):
        return
    d = json.load(open(src))
    res = {}
    for name, v in d.items():
        if v["ar"]["url"] != v["en"]["url"] or not v["ar"]["url"].startswith(("/contact", "/auth/forgot")):
            continue  # e.g. sign-up redirects; only in-place states are swapped
        out = []
        emit_html(parse(v["ar"]["main"]).kids[0], parse(v["en"]["main"]).kids[0], out)
        res[name] = "".join(out)
    write(os.path.join(ROOT, "lib", "form-states.json"), json.dumps(res, ensure_ascii=False))


def write_graphs():
    """data/graph/*.json (scripts/capture-graph.mjs) -> lib/graph/<slug>.json with AR/EN merged into bilingual HTML,
    plus lib/graph/index.ts mapping a route to its lazy loader."""
    src = os.path.join(ROOT, "data", "graph")
    dst = os.path.join(ROOT, "lib", "graph")
    pub = os.path.join(ROOT, "public", "graph")  # snapshots are static assets fetched on demand (too big to bundle into the Worker)
    for d in (dst, pub):
        shutil.rmtree(d, ignore_errors=True)
    os.makedirs(dst)
    os.makedirs(pub)
    routes = {}
    for f in sorted(glob.glob(os.path.join(src, "*.json"))):
        if f.endswith("index.json"):
            continue
        g = json.load(open(f))
        states = []
        for st, en in zip(g["states"], g["en"]):
            def merge(a_html, b_html):
                try:
                    out = []
                    emit_html(parse(a_html).kids[0], parse(b_html).kids[0], out)
                    return "".join(out)
                except (Mismatch, IndexError):
                    return a_html
            main = merge(st["main"], en["main"]) if en else st["main"]
            ovs = [merge(a, b) for a, b in zip(st["overlays"], en["overlays"])] if en and len(en["overlays"]) == len(st["overlays"]) else st["overlays"]
            states.append({"main": main, "overlays": ovs, **({"sy": st["sy"]} if "sy" in st else {})})
        # Store every state after the first as a splice against state 0 (common prefix/suffix kept, only the middle saved):
        # tab/dialog states differ in one region, so this keeps big pages small.
        base = states[0]["main"]
        packed = [{**states[0]}]
        for st in states[1:]:
            t = st["main"]
            p = 0
            lim = min(len(base), len(t))
            while p < lim and base[p] == t[p]:
                p += 1
            q = 0
            lim2 = min(len(base), len(t)) - p
            while q < lim2 and base[len(base) - 1 - q] == t[len(t) - 1 - q]:
                q += 1
            packed.append({"p": p, "s": q, "m": t[p:len(t) - q], "overlays": st["overlays"], **({"sy": st["sy"]} if "sy" in st else {})})
        slug = os.path.basename(f)[:-5]
        write(os.path.join(pub, slug + ".json"), json.dumps({"states": packed, "edges": g["edges"], **({"sel": g["sel"]} if g.get("sel") else {}), **({"ph": g["ph"]} if g.get("ph") else {})}, ensure_ascii=False))
        routes[g["route"]] = slug
    # the live site serves some pages at two URLs; they share one recording
    for alias, target in {"/resources/stacks": "/stacks"}.items():
        if target in routes:
            routes[alias] = routes[target]
    lines = ["// generated by scripts/gen_pages.py", "export type Graph = { sel?: string; ph?: number[]; states: ({ main: string; overlays: string[]; sy?: number } | { p: number; s: number; m: string; overlays: string[]; sy?: number })[]; edges: Record<string, Record<string, number | { nav: string }>> };", "export const GRAPHS: Record<string, () => Promise<{ default: Graph }>> = {"]
    for r, sl in routes.items():
        lines.append('  %s: () => fetch("/graph/%s.json").then((r) => r.json()).then((default_) => ({ default: default_ as Graph })),' % (json.dumps(r), sl))
    lines.append("};")
    write(os.path.join(dst, "index.ts"), "\n".join(lines) + "\n")


def pascal(slug):
    return "P_" + re.sub(r"[^A-Za-z0-9]", "_", slug)


STATIC_RES = {"/resources/roadmap", "/resources/stacks", "/resources/wizard", "/resources/preview-sections", "/resources/preview-tree-explorer"}
FAMILIES = ("resources", "review", "publishers")


def family(route):
    parts = route.strip("/").split("/")
    if len(parts) == 2 and parts[0] in FAMILIES and route not in STATIC_RES:
        return parts[0], parts[1]
    return None


def slug_of(route):
    return "_home" if route == "/" else route.strip("/").replace("/", "__")


def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, "w").write(text)


# Routes served by hand-written, data-driven components instead of the captured markup (they need data the capture lacks).
HAND = {"/faq": "@/components/FaqPage"}


def write_routes(pages, ok):
    """app/<route>/page.tsx per static route; one [slug] page per dynamic family backed by a registry."""
    for f in glob.glob(os.path.join(OUT_APP, "**", "page.tsx"), recursive=True):
        if os.path.relpath(f, OUT_APP) != "page.tsx":
            os.remove(f)
    for fam in FAMILIES:
        shutil.rmtree(os.path.join(OUT_APP, fam, "[slug]"), ignore_errors=True)
    fams = {f: {} for f in FAMILIES}
    for route in ok:
        d = pages[route]
        meta = "export const metadata = { title: %s, description: %s };\n" % (json.dumps(d["ar"]["title"], ensure_ascii=False), json.dumps(d["ar"]["desc"], ensure_ascii=False))
        fam = family(route)
        if fam:
            fams[fam[0]][fam[1]] = d["ar"]["title"]
            continue
        if route == "/does-not-exist-404":
            write(os.path.join(OUT_APP, "not-found.tsx"), 'import C from "@/components/pages/%s";\n\nexport default C;\n' % slug_of(route))
            continue
        if route == "/":
            continue  # home is wired by hand (interactive hero)
        # /500 collides with Next's reserved 500 page; served at /error-500 and rewritten (next.config.mjs).
        dest = "error-500" if route == "/500" else route.strip("/")
        src = HAND.get(route, "@/components/pages/" + slug_of(route))
        write(os.path.join(OUT_APP, dest, "page.tsx"), 'import C from "%s";\n\n%sexport default C;\n' % (src, meta))
    for fam, items in fams.items():
        if not items:
            continue
        reg = "".join('  %s: () => import("./%s__%s"),\n' % (json.dumps(k), fam, k) for k in items)
        write(os.path.join(OUT_COMP, "_registry_%s.ts" % fam), "export const REG: Record<string, () => Promise<{ default: React.ComponentType }>> = {\n%s};\n\nexport const TITLES: Record<string, string> = %s;\n" % (reg, json.dumps(items, ensure_ascii=False)))
        write(os.path.join(OUT_APP, fam, "[slug]", "page.tsx"), (
            'import { notFound } from "next/navigation";\nimport { REG, TITLES } from "@/components/pages/_registry_%s";\n\n'
            "export const dynamicParams = false;\n"
            "export function generateStaticParams() {\n  return Object.keys(REG).map((slug) => ({ slug }));\n}\n\n"
            "export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {\n  const { slug } = await params;\n  return { title: TITLES[slug] };\n}\n\n"
            "export default async function Page({ params }: { params: Promise<{ slug: string }> }) {\n"
            "  const { slug } = await params;\n  const load = REG[slug];\n  if (!load) notFound();\n  const C = (await load()).default;\n  return <C />;\n}\n") % fam)


def patch_home():
    """Make the generated home interactive: depth-carousel cards, dots and arrows are driven by one state value."""
    p = os.path.join(OUT_COMP, "_home.tsx")
    c = open(p).read()
    n = [0]

    def card(m):
        i = n[0]
        n[0] += 1
        attrs = re.sub(r'aria-hidden="[^"]*"', "aria-hidden={a !== %d}" % i, m.group(1))
        return '<div className="depth-carousel__card"%s style={cardStyle(%d, a)} onClick={() => setA(%d)}>' % (attrs, i, i)

    c = re.sub(r'<div className="depth-carousel__card"((?: [a-z-]+="[^"]*")*) style=\{\{.*?\} as React\.CSSProperties\}>', card, c, flags=re.S)
    d = [0]

    def dot(m):
        i = d[0]
        d[0] += 1
        return '<button type="button" role="tab" aria-selected={a === %d} aria-label="Go to slide %d" className={"depth-carousel__dot" + (a === %d ? " is-active" : "")} onClick={() => setA(%d)}></button>' % (i, i + 1, i, i)

    c = re.sub(r'<button type="button" role="tab" aria-selected="(?:true|false)" aria-label="Go to slide \d+" className="depth-carousel__dot(?: is-active)?"></button>', dot, c)
    c = c.replace('className="depth-carousel__arrow depth-carousel__arrow--prev"', 'onClick={() => setA((x) => wrap(x + 1))} className="depth-carousel__arrow depth-carousel__arrow--prev"')
    c = c.replace('className="depth-carousel__arrow depth-carousel__arrow--next"', 'onClick={() => setA((x) => wrap(x - 1))} className="depth-carousel__arrow depth-carousel__arrow--next"')
    c = c.replace('import Link from "next/link";', '"use client";\n\nimport { useState } from "react";\nimport Link from "next/link";\nimport { cardStyle, wrap } from "@/lib/carousel";', 1)
    c = c.replace("export default function P__home() {\n", "export default function P__home() {\n  const [a, setA] = useState(0);\n", 1)
    assert n[0] == 7 and d[0] == 7, (n[0], d[0])
    open(p, "w").write(c)
    write(os.path.join(OUT_APP, "page.tsx"), 'import C from "@/components/pages/_home";\n\nexport default C;\n')


# Client behaviours attached to generated static markup: route slug -> (component, import path)
BEHAVIORS = {"resources": ("CatalogBehavior", "@/components/CatalogBehavior"), "_home": ("HomeBehavior", "@/components/HomeBehavior"), "auth__sign-in": ("AuthBehavior", "@/components/AuthBehavior"), "auth__forgot": ("FormBehavior", "@/components/FormBehavior"), "auth__sign-up": ("FormBehavior", "@/components/FormBehavior"), "contact": ("FormBehavior", "@/components/FormBehavior")}


def patch_behaviors():
    """Mount behaviour components inside a generated page's root element (they render nothing, they wire up the DOM)."""
    for slug, (comp, path) in BEHAVIORS.items():
        p = os.path.join(OUT_COMP, slug + ".tsx")
        if not os.path.exists(p):
            continue
        c = open(p).read()
        i = c.rfind("</main>")
        assert i > 0, slug
        c = c[:i] + "<%s />" % comp + c[i:]
        c = c.replace('import Link from "next/link";', 'import Link from "next/link";\nimport { %s } from "%s";' % (comp, path), 1)
        open(p, "w").write(c)


def main():
    shutil.rmtree(OUT_COMP, ignore_errors=True)
    os.makedirs(OUT_COMP)
    pages = {}
    for f in sorted(glob.glob(os.path.join(ROOT, "data", "pages", "*.json"))):
        d = json.load(open(f))
        pages[d["route"]] = d
    report = {"ok": [], "mismatch": {}, "attr_diff_total": 0}
    needs_client = re.compile(r"\bon[A-Z]\w+=|useState")
    for route, d in pages.items():
        slug = "_home" if route == "/" else route.strip("/").replace("/", "__")
        try:
            a, b = parse(d["ar"]["main"]).kids[0], parse(d["en"]["main"]).kids[0]
            out = []
            emit(a, b, out)
        except Mismatch as e:
            report["mismatch"][route] = str(e)
            continue
        body = "".join(out)
        code = 'import Link from "next/link";\n\nexport default function %s() {\n  return (\n    %s\n  );\n}\n' % (pascal(slug), body)
        open(os.path.join(OUT_COMP, slug + ".tsx"), "w").write(code)
        report["ok"].append(route)
    write_form_states()
    write_graphs()
    patch_home()
    patch_behaviors()
    write_routes(pages, report["ok"])
    report["attr_diff_total"] = stats["attr_diff"]
    json.dump(report, open(os.path.join(ROOT, "data", "pages-report.json"), "w"), ensure_ascii=False, indent=1)
    print("ok", len(report["ok"]), "mismatch", len(report["mismatch"]), "attr diffs", stats["attr_diff"])
    for r, m in list(report["mismatch"].items())[:20]:
        print("  MISMATCH", r, m)


if __name__ == "__main__":
    main()
