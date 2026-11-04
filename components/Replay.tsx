"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { GRAPHS } from "@/lib/graph";

// Same selector the capture script used to number interactive elements.
const SEL = "main button, main select, main input[type=checkbox], main [role=switch], [role=dialog] button, [role=dialog] select, [role=dialog] input[type=checkbox]";

// Must match how the capture script numbers elements (Playwright's visible filter): disabled controls count, and the
// graph's `ph` lists indices of box-less controls Playwright also counted (e.g. a display:none button).
const visible = (e: Element) => e.getClientRects().length > 0;
const inner = (html: string) => {
  const t = document.createElement("template");
  t.innerHTML = html;
  return (t.content.firstElementChild as HTMLElement | null)?.innerHTML ?? "";
};

/**
 * Replays recorded interaction states for pages whose behaviour we captured from the live site
 * (dialogs, toggles, filters on the dashboards). Each click on a recorded element swaps in the snapshot taken after that
 * click on the live site. Typed values are not reflected - these are demo states, not a working backend.
 */
export function Replay() {
  const path = usePathname();
  const router = useRouter();
  useEffect(() => {
    const load = GRAPHS[path];
    if (!load) return;
    let off = () => {};
    let alive = true;
    load().then(({ default: g }) => {
      if (!alive) return;
      let cur = 0;
      const host = document.createElement("div");
      host.id = "replay-overlays";
      document.body.appendChild(host);

      const first = g.states[0];
      const base = "main" in first ? first.main : "";
      const SELECTOR = g.sel ?? SEL;
      const apply = (id: number) => {
        const main = document.querySelector("main");
        const st = g.states[id];
        if (!main || !st) return;
        const html = "main" in st ? st.main : base.slice(0, st.p) + st.m + base.slice(base.length - st.s);
        // Live keeps its DOM nodes across state changes, so inner scroll containers (e.g. the /stacks list) stay where they were.
        const path = (el: Element) => { const p: number[] = []; for (let n = el; n !== main; n = n.parentElement!) p.unshift([...n.parentElement!.children].indexOf(n)); return p; };
        const scrolled = [...main.querySelectorAll("*")].filter((e) => e.scrollTop > 0).map((e) => [path(e), e.scrollTop] as const);
        main.innerHTML = inner(html);
        for (const [p, top] of scrolled) {
          let n: Element | undefined = main;
          for (const i of p) n = n?.children[i];
          if (n) n.scrollTop = top;
        }
        host.innerHTML = st.overlays.join("");
        if (typeof st.sy === "number") window.scrollTo({ top: st.sy, behavior: "instant" }); // only graphs recorded with scroll positions
        cur = id;
        window.dispatchEvent(new Event("replay-swap")); // behaviours bound to nodes inside <main> re-attach
      };
      const onClick = (e: MouseEvent) => {
        const t = e.target as HTMLElement;
        const hit = t.closest(SELECTOR);
        if (!hit || hit.closest("[data-no-replay]")) return;
        const all: (Element | null)[] = [...document.querySelectorAll(SELECTOR)].filter(visible);
        for (const p of g.ph ?? []) all.splice(p, 0, null);
        const i = all.indexOf(hit);
        const edge = g.edges[String(cur)]?.[String(i)];
        if (edge === undefined) return;
        e.preventDefault();
        e.stopPropagation();
        if (typeof edge === "number") apply(edge);
        else router.push(edge.nav);
      };
      document.addEventListener("click", onClick, true);
      off = () => { document.removeEventListener("click", onClick, true); host.remove(); };
    });
    return () => { alive = false; off(); };
  }, [path, router]);
  return null;
}
