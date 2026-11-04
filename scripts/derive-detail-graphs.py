"""Derive the interaction graph of every detail page from one recorded representative per structural group.

Pages in a group (data/graph-groups.json, tag-skeleton hash) have the same DOM shape, so the text nodes of their rest state
line up 1:1. We map representative text -> member text from the two rest states, add the values that only appear in tab
states (ids in URLs, URL-encoded titles, formatted dates), and apply that to every recorded state (AR and EN).
Writes data/graph/resources__<member>.json in capture-graph.mjs format, so scripts/gen_pages.py needs no change.
usage: python3 scripts/derive-detail-graphs.py [member-slug ...]   (default: every member whose representative is recorded)
"""
import json, os, re, sys, html
from datetime import datetime
from urllib.parse import quote

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
J = lambda *p: os.path.join(ROOT, *p)
groups = json.load(open(J("data", "graph-groups.json")))
records = {r["slug"]: r for r in json.load(open(J("data", "mock", "resources.json")))}
AR_M = "يناير فبراير مارس أبريل مايو يونيو يوليو أغسطس سبتمبر أكتوبر نوفمبر ديسمبر".split()
EN_M = "January February March April May June July August September October November December".split()
INDIC = str.maketrans("0123456789", "٠١٢٣٤٥٦٧٨٩")


def text_nodes(h):
    return [html.unescape(t) for t in re.findall(r">([^<>]+)<", h)]


def dates(rec):
    """Formatted forms a date field takes on the page, per locale (only latest_released_at/updated_at/created_at are shown)."""
    out = {"ar": {}, "en": {}}
    for f in ("latest_released_at", "updated_at", "created_at"):
        v = rec.get(f)
        if not v:
            continue
        d = datetime.fromisoformat(v.replace("Z", "+00:00"))
        out["ar"][f] = f"{d.day} {AR_M[d.month - 1]} {d.year}".translate(INDIC)
        out["en"][f] = f"{EN_M[d.month - 1]} {d.day}, {d.year}"
    return out


def mapping(rep_main, mem_main, rep_rec, mem_rec, loc, rep_id, mem_id):
    pairs = {}
    a, b = text_nodes(rep_main), text_nodes(mem_main)
    assert len(a) == len(b), "rest-state text nodes do not line up"
    for x, y in zip(a, b):
        if x != y and x.strip():
            pairs[x] = y
    for f in ("title_ar", "title_en", "summary_ar", "description_ar"):  # text that first appears in a dialog/tab, not in the rest state
        x, y = rep_rec.get(f), mem_rec.get(f)
        if x and y and x != y:
            pairs.setdefault(x, y)
    rd, md = dates(rep_rec), dates(mem_rec)
    for f, x in rd[loc].items():
        if f in md[loc] and x != md[loc][f]:
            pairs.setdefault(x, md[loc][f])
    # URL-encoded titles (README badge markdown) and ids in links
    for x, y in list(pairs.items()):
        if len(x) >= 4:
            pairs.setdefault(quote(x, safe="!~*'()"), quote(y, safe="!~*'()"))  # encodeURIComponent keeps ! ~ * ' ( ) literal
    pairs[f"/resources/{rep_id}"] = f"/resources/{mem_id}"
    return pairs


def apply(h, pairs):
    """Whole-text-node match for short strings (so '1' never rewrites '14'); substring match for anything >= 4 chars."""
    longs = sorted((k for k in pairs if len(k) >= 4), key=len, reverse=True)
    rx = re.compile("|".join(re.escape(html.escape(k, quote=False)) for k in longs)) if longs else None
    by_esc = {html.escape(k, quote=False): html.escape(v, quote=False) for k, v in pairs.items()}

    def node(m):
        t = m.group(1)
        if t in by_esc and len(html.unescape(t)) < 4:
            return ">" + by_esc[t] + "<"
        return ">" + (rx.sub(lambda mm: by_esc[mm.group(0)], t) if rx else t) + "<"

    out = re.sub(r">([^<>]+)<", node, h)
    # attribute values and raw URLs (href, markdown in text already covered above)
    return rx.sub(lambda mm: by_esc[mm.group(0)], out) if rx else out


def derive(rep_id, mem_id):
    rep = json.load(open(J("data", "graph", f"resources__{rep_id}.json")))
    pg = json.load(open(J("data", "pages", f"resources__{mem_id}.json")))
    rr, mr = records_by_page(rep_id), records_by_page(mem_id)
    maps = {
        "ar": mapping(rep["states"][0]["main"], pg["ar"]["main"], rr, mr, "ar", rep_id, mem_id),
        "en": mapping(rep["en"][0]["main"], pg["en"]["main"], rr, mr, "en", rep_id, mem_id),
    }
    sw = lambda s, loc: None if s is None else {**s, "main": apply(s["main"], maps[loc]), "overlays": [apply(o, maps[loc]) for o in s["overlays"]], "url": s["url"].replace(rep_id, mem_id)}
    g = {
        "route": f"/resources/{mem_id}",
        "states": [{**sw(s, "ar"), "path": s["path"]} for s in rep["states"]],
        "en": [sw(s, "en") for s in rep["en"]],
        "edges": json.loads(retarget(json.dumps(rep["edges"], ensure_ascii=False), rep["states"][0]["main"], pg["ar"]["main"]).replace(rep_id, mem_id)),
    }
    if rep.get("sel"):
        g["sel"] = rep["sel"]
    json.dump(g, open(J("data", "graph", f"resources__{mem_id}.json"), "w"), ensure_ascii=False)


def retarget(edges_json, rep_main, mem_main):
    """Navigation edges (publisher profile link) must lead to the member's own publisher, not the representative's."""
    rx = re.compile(r'href="(/publishers/[^"]+)"')
    for a, b in zip(rx.findall(rep_main), rx.findall(mem_main)):
        edges_json = edges_json.replace('"nav": "%s"' % a, '"nav": "%s"' % b)
    return edges_json


def records_by_page(pid):
    """Page id (cms-9 / payload-...) -> data record: the page is keyed by its slug in raw data; fall back to matching the title."""
    if pid in records:
        return records[pid]
    pg = json.load(open(J("data", "pages", f"resources__{pid}.json")))
    h1 = text_nodes(pg["ar"]["main"])
    for r in records.values():
        if r["title_ar"] in h1:
            return r
    raise KeyError(pid)


if __name__ == "__main__":
    only = set(sys.argv[1:])
    DERIVED = J("data", "graph-derived.json")  # members written by this script; never reused as a representative
    derived = set(json.load(open(DERIVED))) if os.path.exists(DERIVED) else set()
    n = skipped = 0
    for members in groups.values():
        recorded = [m for m in members if os.path.exists(J("data", "graph", f"resources__{m}.json")) and m not in derived]
        if not recorded:
            skipped += len(members)
            continue
        rep = recorded[0]
        for m in members:
            if m == rep or (only and m not in only):
                continue
            try:
                derive(rep, m)
                derived.add(m)
                n += 1
            except (AssertionError, KeyError) as e:
                print("SKIP", m, "(rep %s)" % rep, e)
    json.dump(sorted(derived), open(DERIVED, "w"))
    print("derived", n, "no recorded rep for", skipped)
