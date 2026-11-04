"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import faq from "@/lib/home-faq.json";

// Buttons that navigate on the live home page (matched by their Arabic label; the English label sits in a sibling span).
const GO: Record<string, string> = {
  "استكشف الموارد": "/resources",
  "وثّق موردك كناشر": "/publisher",
  "استكشف معايير إتقان": "/standards",
  "قائمة التحقق التفصيلية": "/standards/checklist",
  "تصفح الكتالوج الآن": "/resources",
  "إنشاء حساب مطور": "/auth/sign-up",
  "المُوجِّه التفاعلي Wizard": "/resources/wizard",
};

// Tab -> resource types shown (from the live site; fonts only appear under "all").
const GROUPS: string[][] = [
  [],
  ["mushaf", "tafsir", "translation", "tajweed"],
  ["api", "sdk", "library", "tool"],
  ["dataset"],
  ["recitation"],
];

const hide = (el: HTMLElement, on: boolean) => { el.hidden = on; el.style.display = on ? "none" : ""; };

/** Wires the home page's index tabs and FAQ accordion onto the statically generated markup. */
export function HomeBehavior() {
  const router = useRouter();
  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    const cleanups: (() => void)[] = [];

    // --- index tabs ---------------------------------------------------------------
    const bar = [...main.querySelectorAll<HTMLElement>("div")].find((d) => d.className.includes("bg-subtle/50") && d.className.includes("rounded-xl") && d.querySelectorAll(":scope > button").length === 5);
    if (bar) {
      const tabs = [...bar.querySelectorAll<HTMLButtonElement>(":scope > button")];
      const activeCls = tabs[0].className;
      const idleCls = tabs[1].className;
      const cards = [...main.querySelectorAll<HTMLAnchorElement>("a[href^='/resources?type=']")];
      tabs.forEach((t, i) => {
        const on = () => {
          tabs.forEach((x, j) => (x.className = j === i ? activeCls : idleCls));
          cards.forEach((a) => hide(a, i !== 0 && !GROUPS[i].includes(a.getAttribute("href")!.split("=")[1])));
        };
        t.addEventListener("click", on);
        cleanups.push(() => t.removeEventListener("click", on));
      });
    }

    // --- FAQ accordion (single open) ----------------------------------------------
    const list = main.querySelector<HTMLElement>("section .max-w-3xl .flex.flex-col.gap-3");
    if (list) {
      const rows = [...list.children] as HTMLElement[];
      const close = (row: HTMLElement) => {
        row.querySelector(":scope > div")?.remove();
        row.querySelector("svg")?.classList.remove("rotate-180");
      };
      rows.forEach((row, i) => {
        const btn = row.querySelector("button")!;
        const click = () => {
          const wasOpen = row.children.length > 1;
          rows.forEach(close);
          if (wasOpen || !faq[i]) return;
          const a = document.createElement("div");
          a.className = "px-4 pb-4 pt-1 text-xs text-fg-muted leading-relaxed border-t border-border-subtle bg-subtle/30";
          for (const [cls, text] of [["t-ar", faq[i].a.ar], ["t-en", faq[i].a.en]] as const) {
            const s = document.createElement("span");
            s.className = cls;
            s.textContent = text;
            a.appendChild(s);
          }
          row.appendChild(a);
          row.querySelector("svg")?.classList.add("rotate-180");
        };
        btn.addEventListener("click", click);
        cleanups.push(() => btn.removeEventListener("click", click));
      });
    }
    // --- plain buttons that navigate -------------------------------------------------------
    const go = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest("button");
      if (!btn || btn.closest("a, form")) return;
      const label = (btn.querySelector(".t-ar") ?? btn).textContent?.trim() ?? "";
      const to = GO[label];
      if (to) router.push(to);
    };
    main.addEventListener("click", go);
    cleanups.push(() => main.removeEventListener("click", go));

    // --- hero search: Enter / "search now" goes to the catalog with ?q= ---------------------
    const form = main.querySelector<HTMLFormElement>("form");
    if (form) {
      const onSubmit = (e: Event) => {
        e.preventDefault();
        const v = form.querySelector<HTMLInputElement>("input")?.value.trim() ?? "";
        router.push(v ? `/resources?q=${encodeURIComponent(v)}` : "/resources");
      };
      form.addEventListener("submit", onSubmit);
      cleanups.push(() => form.removeEventListener("submit", onSubmit));
    }
    return () => cleanups.forEach((f) => f());
  }, [router]);
  return null;
}
