"use client";

import { useEffect, useState } from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import data from "@/lib/catalog-data.json";
import { EMPTY } from "@/lib/catalog-empty";

type R = (typeof data)[number];
const BY_SLUG = new Map<string, R>(data.map((r) => [r.slug, r]));

// Same rule as the live catalog: Arabic/English title, Arabic summary or any tag contains the query.
const matches = (r: R, q: string) =>
  !q ||
  r.title_ar.toLowerCase().includes(q) ||
  (r.title_en ?? "").toLowerCase().includes(q) ||
  r.summary_ar.toLowerCase().includes(q) ||
  r.tags.some((t) => t.toLowerCase().includes(q));

const hide = (el: Element, on: boolean) => {
  (el as HTMLElement).hidden = on;
  (el as HTMLElement).style.display = on ? "none" : "";
};

/**
 * Adds the live catalog's search to the statically generated /resources markup:
 * hides non-matching cards, empties sections, and keeps the counters, the section index and the empty state in sync.
 */
function Inner() {
  const router = useRouter();
  const urlQ = useSearchParams().get("q"); // ?q= comes from the home hero search
  const [swap, setSwap] = useState(0); // Replay replaces <main>'s nodes; bump to re-bind
  useEffect(() => {
    const bump = () => setSwap((n) => n + 1);
    window.addEventListener("replay-swap", bump);
    return () => window.removeEventListener("replay-swap", bump);
  }, []);
  useEffect(() => {
    const main = document.querySelector("main");
    const input = main?.querySelector<HTMLInputElement>("input[type=text]");
    if (!main || !input) return;

    const sections = [...main.querySelectorAll<HTMLElement>("section[id^=section-cat_]")];
    const cards = sections.map((s) => [...s.querySelectorAll<HTMLElement>("article")].map((a) => ({ el: a, slug: a.querySelector("a[href^='/resources/']")?.getAttribute("href")?.split("/")[2] ?? "" })));
    const total = [...main.querySelectorAll<HTMLElement>("span")].find((s) => /^\d+ مورد معتمد$/.test(s.textContent ?? ""));
    const sideCount = [...main.querySelectorAll<HTMLElement>("aside span")].find((s) => /^\d+ أقسام$/.test(s.textContent ?? ""));
    const nav = main.querySelector<HTMLElement>("aside nav");
    const navItems = nav ? [...nav.children] as HTMLElement[] : [];
    const column = main.querySelector<HTMLElement>(".lg\\:col-span-9");
    const sectionBadge = sections.map((s) => [...s.querySelectorAll<HTMLElement>("span")].find((x) => /^\d+ مورد$/.test(x.textContent ?? "")));
    const empty = document.createElement("div");
    empty.innerHTML = EMPTY.ar;
    const emptyEl = empty.firstElementChild as HTMLElement;
    emptyEl.hidden = true;
    emptyEl.style.display = "none";
    column?.appendChild(emptyEl);

    // Counters as the markup shipped them: with no query the page must show exactly this, even when a recorded state
    // (e.g. a collapsed section) has fewer cards in the DOM than the counters say.
    const texts: [Element, string | null][] = [];
    const keep = (e?: Element | null) => e && texts.push([e, e.textContent]);
    keep(total);
    keep(sideCount);
    sectionBadge.forEach(keep);
    navItems.forEach((item) => keep(item.lastElementChild));

    const apply = () => {
      const q = input.value.trim().toLowerCase();
      if (!q) {
        sections.forEach((s, i) => {
          cards[i].forEach(({ el }) => hide(el.parentElement ?? el, false));
          hide(s, false);
          if (navItems[i]) hide(navItems[i], false);
        });
        texts.forEach(([e, t]) => { e.textContent = t; });
        hide(emptyEl, true);
        return;
      }
      let all = 0;
      const distinct = new Set<string>(); // a resource can sit in two sections but counts once
      let shownSections = 0;
      sections.forEach((s, i) => {
        let n = 0;
        cards[i].forEach(({ el, slug }) => {
          const r = BY_SLUG.get(slug);
          const ok = !r || matches(r, q);
          hide(el.parentElement ?? el, !ok); // the grid cell wrapper, so the grid re-flows
          if (ok) { n++; distinct.add(slug); }
        });
        hide(s, n === 0);
        if (sectionBadge[i]) sectionBadge[i]!.textContent = `${n} مورد`;
        const item = navItems[i];
        if (item) {
          hide(item, n === 0);
          const c = item.lastElementChild;
          if (c) c.textContent = String(n);
        }
        all += n;
        if (n) shownSections++;
      });
      if (total) total.textContent = `${distinct.size} مورد معتمد`;
      if (sideCount) sideCount.textContent = `${shownSections} أقسام`;
      hide(emptyEl, all !== 0);
    };

    // The "interactive wizard" banner button leads to /resources/wizard.
    const wiz = [...main.querySelectorAll("button")].find((b) => (b.querySelector(".t-ar") ?? b).textContent?.trim() === "المُوجِّه التفاعلي Wizard");
    const onWiz = () => router.push("/resources/wizard");
    wiz?.addEventListener("click", onWiz);

    // Section index: each entry scrolls its section into view (Replay must not treat these clicks as state changes).
    const goTo = navItems.map((item, i) => {
      // 148px = what the live page leaves above the section (sticky header + gap), measured against it
      const h = () => sections[i] && window.scrollTo({ top: sections[i].getBoundingClientRect().top + scrollY - 148, behavior: "smooth" });
      item.setAttribute("data-no-replay", "");
      item.addEventListener("click", h);
      return () => item.removeEventListener("click", h);
    });

    const reset = emptyEl.querySelector("button");
    const onReset = () => { input.value = ""; apply(); };
    if (urlQ && input.value !== urlQ) input.value = urlQ;
    apply();
    input.addEventListener("input", apply);
    reset?.addEventListener("click", onReset);
    apply();
    return () => {
      input.removeEventListener("input", apply);
      reset?.removeEventListener("click", onReset);
      wiz?.removeEventListener("click", onWiz);
      goTo.forEach((off) => off());
      emptyEl.remove();
    };
  }, [router, urlQ, swap]);
  return null;
}

export function CatalogBehavior() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
