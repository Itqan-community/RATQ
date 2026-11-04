"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronDown, CircleHelp, Key, Layers, Search, ShieldCheck } from "lucide-react";
import { usePrefs } from "@/lib/prefs";
import faq from "@/lib/faq-data.json";

const ICONS = [Layers, BookOpen, ShieldCheck, Key, CircleHelp];
const Bi = ({ ar, en }: { ar: string; en: string }) => (
  <>
    <span className="t-ar">{ar}</span>
    <span className="t-en">{en}</span>
  </>
);

// Markup and behaviour mirror the live /faq: single-open accordion, category chips, search over question + answer.
export default function FaqPage() {
  const { prefs } = usePrefs();
  const [cat, setCat] = useState(0);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<number | null>(0);
  const L = prefs.locale;
  const needle = q.trim().toLowerCase();
  const shown = faq.items.map((it, i) => ({ it, i })).filter(({ it }) => (cat === 0 || it.cat === cat) && (!needle || it.q[L].toLowerCase().includes(needle) || it.a[L].toLowerCase().includes(needle)));

  return (
    <main id="main-content" className="flex-1 w-full flex flex-col">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <span className="inline-flex items-center font-medium rounded-full border select-none bg-ratq-50 text-ratq-800 border-ratq-200 dark:bg-ratq-950 dark:text-ratq-300 dark:border-ratq-800 text-xs px-2.5 py-0.5 gap-1.5 mb-3">
            <CircleHelp className="w-3.5 h-3.5 me-1.5" />
            <Bi ar="مركز الأسئلة الشائعة" en="FAQ Center" />
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-fg tracking-tight mb-4"><Bi ar="كيف يمكننا مساعدتك؟" en="How can we help you?" /></h1>
          <p className="text-fg-muted text-lg max-w-2xl mx-auto">
            <Bi ar="إجابات شاملة حول ميثاق النزاهة، شارات الإتقان، تراخيص البرمجيات، وإدارة الموارد التقنية." en="Clear answers on sacred text integrity, Itqan badge tiers, licensing, and API access." />
          </p>
        </div>
        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search className="w-5 h-5 absolute start-3 top-1/2 -translate-y-1/2 text-fg-muted pointer-events-none" />
            <div className="w-full flex flex-col gap-1.5 text-start">
              <div className="relative flex items-center">
                <input
                  aria-invalid="false"
                  className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-fg placeholder:text-fg-subtle transition-colors focus:outline-none focus:ring-2 focus:ring-ratq-500 focus:border-ratq-500 disabled:cursor-not-allowed disabled:opacity-50 ps-10 h-12 text-base"
                  placeholder={L === "ar" ? "ابحث في الأسئلة الشائعة..." : "Search questions..."}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {faq.chips.ar.map((label, i) => {
              const Icon = ICONS[i];
              return (
                <button key={i} onClick={() => setCat(i)} className={"inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all " + (cat === i ? "bg-ratq-600 text-white shadow-sm" : "bg-canvas-card border border-border text-fg-muted hover:text-fg")}>
                  <Icon className="w-4 h-4" />
                  <span><Bi ar={label} en={faq.chips.en[i]} /></span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="space-y-3">
          {shown.length === 0 ? (
            <div className="rounded-xl border border-border bg-canvas transition-all duration-200 p-8 text-center text-fg-muted"><Bi ar="لا توجد نتائج مطابقة لبحثك." en="No matching questions found." /></div>
          ) : (
            shown.map(({ it, i }) => (
              <div key={i} className={"rounded-xl border bg-canvas text-fg overflow-hidden transition-all duration-200 border-border"}>
                <button type="button" onClick={() => setOpen(open === i ? null : i)} className="w-full p-5 text-start flex items-center justify-between gap-4 hover:bg-canvas-subtle/50 transition-colors">
                  <span className="font-bold text-fg text-base md:text-lg"><Bi ar={it.q.ar} en={it.q.en} /></span>
                  <ChevronDown className={"w-5 h-5 text-fg-muted shrink-0 transition-transform duration-200" + (open === i ? " rotate-180 text-ratq-600" : "")} />
                </button>
                {open === i && <div className="px-5 pb-5 pt-1 text-fg-muted leading-relaxed text-sm md:text-base border-t border-border/50"><Bi ar={it.a.ar} en={it.a.en} /></div>}
              </div>
            ))
          )}
        </div>
        <div className="mt-12 p-8 rounded-2xl bg-canvas-card border border-border text-center">
          <h3 className="text-xl font-bold text-fg mb-2"><Bi ar="لم تجد الإجابة التي تبحث عنها؟" en="Still have questions?" /></h3>
          <p className="text-fg-muted text-sm mb-6 max-w-md mx-auto"><Bi ar="فريق مجتمع رتق ومحكموه متاحون للإجابة عن استفساراتك الفنية والعلمية." en="Our community coordinators and technical reviewers are here to assist." /></p>
          <Link href="/contact">
            <button className="inline-flex flex-row flex-nowrap items-center justify-center whitespace-nowrap font-medium rounded-md transition-all duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ratq-500 disabled:opacity-50 disabled:pointer-events-none select-none shrink-0 bg-ratq-700 text-white hover:bg-ratq-800 shadow-sm active:bg-ratq-900 text-sm px-4 py-2 gap-2">
              <Bi ar="تواصل معنا" en="Contact Support" />
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
