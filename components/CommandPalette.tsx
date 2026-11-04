"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, CodeXml, Layers, Search, Shield, X } from "lucide-react";
import index from "@/lib/search-index.json";

type Item = { s: string; t: string; e: string; d: string; g: string[]; y: string };
const ITEMS = index as Item[];

// Shown before typing; matched by slug so the list survives index reordering.
const FEATURED = ["quran-morphology-js", "uthmanic-hafs-font", "tafsir-cross-reference-dataset"];
const FEATURED_TITLES = ["محرك الفهرسة والبحث القرآني الدقيق", "حزمة مشغل الصوتيات القرآنية لـ Flutter"];

const QUICK = [
  { href: "/resources", label: "الكتالوج الشامل", Icon: BookOpen },
  { href: "/publishers", label: "دليل الناشرين", Icon: Layers },
  { href: "/standards", label: "معيار إتقان للجودة", Icon: Shield },
  { href: "/app", label: "بوابة المطور", Icon: CodeXml },
] as const;

const short = (s: string) => `${s.slice(0, 50)}...`; // raw slice like the live site (counts \r\n as two chars)

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(-1); // -1: nothing highlighted until arrow keys are used
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    const featured = ITEMS.filter((r) => FEATURED.includes(r.s) || FEATURED_TITLES.includes(r.t));
    const order = [...featured, ...ITEMS.filter((r) => !featured.includes(r))];
    const needle = q.trim().toLowerCase();
    const hit = needle
      ? order.filter((r) => r.t.toLowerCase().includes(needle) || r.e.toLowerCase().includes(needle) || r.d.toLowerCase().includes(needle) || r.g.some((x) => x.toLowerCase().includes(needle)) || r.y.includes(needle))
      : featured;
    return hit.slice(0, 5);
  }, [q]);

  const quick = QUICK; // quick paths stay visible while searching, as on the live site
  const total = results.length + quick.length;

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(-1);
    }
  }, [open]);

  useEffect(() => setActive(-1), [q]);

  if (!open) return null;

  const go = (href: string) => {
    onClose();
    router.push(href);
  };
  const choose = (i: number) => (i < results.length ? go(`/resources/${results[i].s}`) : go(quick[i - results.length].href));

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (total ? (a + 1) % total : -1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (total ? (a <= 0 ? total - 1 : a - 1) : -1)); }
    else if (e.key === "Enter" && total) choose(Math.max(active, 0));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4" onKeyDown={onKey}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-xl border border-border bg-canvas shadow-2xl overflow-hidden z-10 text-start animate-in fade-in-0 zoom-in-95 duration-100">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-subtle">
          <Search className="w-5 h-5 text-fg-subtle shrink-0" />
          <input
            ref={input}
            autoFocus
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث عن مورد، مكتبة، حزمة، أو تصنيف..."
            className="w-full bg-transparent text-sm text-fg placeholder:text-fg-subtle focus:outline-none"
          />
          {q && (
            <button className="text-fg-subtle hover:text-fg" onClick={() => setQ("")}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto p-2">
          {results.length > 0 && (
            <div className="mb-3">
              <span className="text-[11px] font-bold text-fg-subtle px-3 py-1 block uppercase">الموارد والبرمجيات</span>
              {results.map((r, i) => (
                <button key={r.s} onClick={() => choose(i)} className={"w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg hover:bg-subtle transition-colors text-start cursor-pointer" + (active === i ? " bg-subtle" : "")}>
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-ratq-600 shrink-0" />
                    <div>
                      <p className="font-bold text-fg">{r.t}</p>
                      <p className="text-2xs text-fg-subtle">{short(r.d)}</p>
                    </div>
                  </div>
                  <ArrowLeft className="w-3.5 h-3.5 text-fg-subtle rtl:rotate-0 rotate-180" />
                </button>
              ))}
            </div>
          )}
          {quick.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-fg-subtle px-3 py-1 block uppercase">مسارات سريعة</span>
              {quick.map(({ href, label, Icon }, j) => (
                <button key={href} onClick={() => go(href)} className={"w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-fg rounded-lg hover:bg-subtle transition-colors text-start cursor-pointer" + (active === results.length + j ? " bg-subtle" : "")}>
                  <Icon className="w-4 h-4 text-fg-subtle shrink-0" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="px-4 py-2 border-t border-border-subtle bg-muted/40 flex items-center justify-between text-[11px] text-fg-subtle">
          <span>التنقل بالأسهم والمفاتيح</span>
          <span>ESC للإغلاق</span>
        </div>
      </div>
    </div>
  );
}
