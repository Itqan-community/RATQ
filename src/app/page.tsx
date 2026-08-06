"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLanguage } from "@/shared/ui/i18n";
import { useResources } from "@/hooks/useResources";
import { ResourceCard } from "@/modules/resources/components/ResourceCard";

gsap.registerPlugin(useGSAP);

type Stat = { value: string; label: string };

function AnimatedCounter({ value, active, delay = 0 }: { value: string; active: boolean; delay?: number }) {
  const match = value.match(/^([\d.]+)(.*)$/);
  const hasNumericValue = Boolean(match);
  const endValue = match ? Number(match[1]) : 0;
  const suffix = match?.[2] ?? "";
  const decimals = match?.[1].includes(".") ? 1 : 0;
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (!active || !hasNumericValue) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setCurrentValue(endValue); return; }
    let animationFrame = 0;
    const timeout = window.setTimeout(() => {
      const startedAt = performance.now();
      const duration = 1200;
      const animate = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        setCurrentValue(endValue * (1 - Math.pow(1 - progress, 3)));
        if (progress < 1) animationFrame = requestAnimationFrame(animate);
      };
      animationFrame = requestAnimationFrame(animate);
    }, delay);
    return () => { window.clearTimeout(timeout); cancelAnimationFrame(animationFrame); };
  }, [active, delay, endValue, hasNumericValue]);

  if (!hasNumericValue) return value;
  return <span className="tabular-nums" aria-label={value}>{currentValue.toFixed(decimals)}{suffix}</span>;
}

function HeroArtwork({ floatOne, floatTwo, starLine1, starLine2 }: { floatOne: string; floatTwo: string; starLine1: string; starLine2: string }) {
  return (
    <div className="relative mx-auto w-full max-w-[560px] pb-8" aria-hidden="true">
      <img src="/images/hero.png" alt="" className="mx-auto h-auto w-full object-contain" />
      {[floatOne, floatTwo].map((text, index) => (
        <div key={text} className={`absolute right-0 flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-black shadow-[0_10px_28px_rgba(15,23,42,0.08)] sm:right-4 ${index === 0 ? "top-[18%]" : "top-[32%]"}`}>
          <span>{text}</span>
          <svg className="h-5 w-5 text-[#c99a33]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m12 3 2.1 4.26 4.7.68-3.4 3.32.8 4.68L12 13.72l-4.2 2.22.8-4.68-3.4-3.32 4.7-.68L12 3Z" /></svg>
        </div>
      ))}
      <div className="absolute bottom-0 left-[3%] flex h-32 w-32 items-center justify-center sm:h-40 sm:w-40">
        <img src="/images/stars.png" alt="" className="absolute inset-0 h-full w-full object-contain" />
        <div className="relative z-10 flex max-w-[86%] flex-col items-center text-center text-white"><div className="text-3xl font-black leading-none sm:text-4xl">+20</div><div className="mt-2 text-[10px] font-black leading-4 sm:text-xs sm:leading-5"><span className="block whitespace-nowrap">{starLine1}</span><span className="block whitespace-nowrap">{starLine2}</span></div></div>
      </div>
    </div>
  );
}

function SectionHeading({ children, direction }: { children: ReactNode; direction: "rtl" | "ltr" }) {
  return <div className="mb-6 flex items-center justify-between" dir={direction}><h2 className="text-3xl font-black text-black sm:text-4xl">{children}</h2><div className="hidden rounded-full bg-[#fafafa] px-4 py-2 text-[#c8c8c8] sm:flex"><span className="px-2">‹</span><span className="px-2">›</span></div></div>;
}

export default function HomePage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const statsSectionRef = useRef<HTMLElement>(null);
  const rocketSectionRef = useRef<HTMLElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const { t, direction } = useLanguage();
  const home = t.home;

  const { data: trendingData, isLoading: trendingLoading } = useResources({ sort: "downloads", page_size: 4 });
  const { data: featuredData, isLoading: featuredLoading } = useResources({ sort: "newest", page_size: 4 });
  const trendingResources = trendingData?.results ?? [];
  const featuredResources = featuredData?.results ?? [];
  const stats: Stat[] = [
    { value: direction === "rtl" ? "12.4 ألف" : "12.4k", label: home.stats.downloads },
    { value: "350+", label: home.stats.developers },
    { value: "12+", label: home.stats.publishers },
    { value: "20+", label: home.stats.resources },
  ];

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(".gsap-hero-panel, .gsap-hero-artwork, .gsap-hero-copy", { clearProps: "all" });
      return;
    }

    gsap.timeline({ defaults: { ease: "power2.out" } })
      .from(".gsap-hero-panel", { autoAlpha: 0, y: 16, duration: 0.5 })
      .from(".gsap-hero-artwork", { autoAlpha: 0, y: 18, duration: 0.55 }, "-=0.25")
      .from(".gsap-hero-copy", { autoAlpha: 0, y: 14, duration: 0.45, stagger: 0.06 }, "-=0.35");
  }, { scope: pageRef });

  useEffect(() => {
    const section = statsSectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStatsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.2 });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = rocketSectionRef.current;
    if (!section) return;

    const rocket = section.querySelector<HTMLElement>(".home-rocket");
    if (!rocket) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(rocket, { clearProps: "all" });
      return;
    }

    gsap.set(rocket, { autoAlpha: 0, y: 70, scale: 0.92 });
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;

      

      gsap.to(rocket, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        clearProps: "transform,opacity,visibility",
      });
      observer.disconnect();
    }, { threshold: 0.25 });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={pageRef} className="bg-white text-black" dir={direction}>
      <section className="mx-auto mt-3 max-w-[1480px] px-3 sm:mt-4 sm:px-4">
        <div className="gsap-hero-panel overflow-hidden rounded-2xl bg-[linear-gradient(122.15deg,#EBEFF0_30.7%,#D8E8F5_86.27%)]">
          <div className="grid min-h-[760px] grid-cols-[minmax(0,1fr)] items-center gap-6 px-4 pb-10 pt-32 sm:px-6 sm:pt-36 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:px-16 lg:pb-16 lg:pt-40" dir="ltr">
            <div className="gsap-hero-artwork min-w-0 w-full"><HeroArtwork floatOne={home.hero.floatOne} floatTwo={home.hero.floatTwo} starLine1={home.hero.starLine1} starLine2={home.hero.starLine2} /></div>
            <div className="mx-auto w-full min-w-0 max-w-xl text-start" dir={direction}>
              <span className="gsap-hero-copy inline-flex rounded-full bg-[#e8ef3d] px-5 py-2 text-sm font-black">{home.hero.badge}</span>
              <h1 className="gsap-hero-copy mt-7 max-w-full break-words pb-1 text-3xl font-black leading-[1.45] tracking-normal text-black min-[360px]:text-4xl sm:mt-8 sm:text-5xl sm:leading-[1.35] lg:text-6xl">{home.hero.title}</h1>
              <p className="gsap-hero-copy mt-8 text-lg leading-9 text-[#7d8790]">{home.hero.subtitle}</p>
              <form className="gsap-hero-copy mt-9 flex items-center gap-3" action="/resources" dir={direction}>
                <input name="q" className="h-16 min-w-0 flex-1 rounded-full border-0 bg-white px-8 text-base text-black shadow-none outline-none placeholder:text-[#9b9b9b] focus:ring-2 focus:ring-black/10" placeholder={home.hero.searchPlaceholder} dir={direction} />
                <button type="submit" className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-black text-white transition hover:bg-[#171717]" aria-label={home.hero.searchLabel}><svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg></button>
              </form>
              <div className="gsap-hero-copy mt-5 flex flex-wrap gap-2">{home.hero.categories.map((category) => <span key={category} className="rounded-full bg-white/65 px-3 py-1 text-xs font-semibold text-[#9aa4ad]">{category}</span>)}</div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto mt-16 w-full max-w-[1205px] px-5"><div className="grid min-h-[101px] overflow-hidden rounded-[21.8785px] bg-black text-white shadow-sm md:h-[101px] md:grid-cols-[240px_1fr_240px]" dir="ltr" style={{ background: "radial-gradient(circle at 4% 50%, rgba(67, 198, 118, 0.5) 10%, rgba(67, 198, 118, 0) 34%), radial-gradient(circle at 110% 50%, rgba(56, 185, 179, 0.95) 5%, rgba(67, 198, 118, 0) 34%), #000000" }}><div className="flex items-center justify-start gap-5 px-6 py-5" dir="ltr"><span className="text-3xl font-black leading-none text-white/40">...</span><Link href="/resources" className="rounded-full bg-white px-4 py-4 text-base font-black text-black">{home.announcements.action}</Link></div><p className="flex items-center justify-center px-6 py-5 text-center text-[18px] leading-[1.45]" dir={direction}>{home.announcements.text}</p><div className="flex items-center justify-end px-7 py-5 text-[38px] font-black leading-none" dir={direction}>{home.announcements.title}</div></div></section>
      {(trendingLoading || trendingResources.length > 0) && (
        <section className="mx-auto mt-16 max-w-7xl px-5">
          <SectionHeading direction={direction}>{home.sections.trending}</SectionHeading>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {trendingLoading
              ? Array.from({ length: 4 }).map((_, index) => <div key={index} className="skeleton min-h-[305px] rounded-[13px]" />)
              : trendingResources.map((resource) => <ResourceCard key={resource.id} resource={resource} />)}
          </div>
        </section>
      )}
      {(featuredLoading || featuredResources.length > 0) && (
        <section className="mx-auto mt-16 max-w-7xl px-5">
          <SectionHeading direction={direction}>{home.sections.featured}</SectionHeading>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {featuredLoading
              ? Array.from({ length: 4 }).map((_, index) => <div key={index} className="skeleton min-h-[305px] rounded-[13px]" />)
              : featuredResources.map((resource) => <ResourceCard key={resource.id} resource={resource} />)}
          </div>
        </section>
      )}
      <section ref={statsSectionRef} className="mx-auto mt-20 max-w-7xl px-5"><h2 className="mb-8 text-4xl font-black text-black">{home.sections.stats}</h2><div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">{stats.map((stat, index) => <div key={stat.label} className={`${statsVisible ? "stats-card-enter" : "stats-card-wait"} rounded-lg bg-[#fafafa] p-8 text-center`} style={{ animationDelay: (180 + index * 110) + "ms" }}><div className="text-4xl font-black text-black"><AnimatedCounter value={stat.value} active={statsVisible} delay={180 + index * 110} /></div><div className="mt-5 text-xl font-black text-black">{stat.label}</div></div>)}</div></section>
      <section ref={rocketSectionRef} className="mx-auto mt-16 max-w-7xl px-5 pb-20"><div className="grid items-stretch md:min-h-[340px] overflow-hidden rounded-2xl bg-[linear-gradient(122.15deg,#EBEFF0_30.7%,#D8E8F5_86.27%)] px-6 md:grid-cols-[330px_1fr] md:px-12" dir="ltr"><div className="flex h-[220px] items-end justify-center self-stretch overflow-hidden sm:h-[270px] md:h-full"><img src="/images/rocket.png" alt="" className="home-rocket h-full w-auto max-w-full object-contain object-bottom md:max-w-none" /></div><div className="flex flex-col items-start justify-center py-8 text-start md:py-10" dir={direction}><h2 className="text-4xl font-black leading-tight text-black">{home.publish.title}</h2><p className="mt-6 max-w-xl text-lg leading-9 text-[#7d8790]">{home.publish.subtitle}</p><Link href="/register" className="mt-8 rounded-full bg-black px-10 py-4 text-lg font-black text-white transition hover:bg-[#171717]">{home.publish.action}</Link></div></div></section>
    </div>
  );
}
