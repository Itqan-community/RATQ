"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/i18n";

export function Footer() {
  const pathname = usePathname();
  const { t, direction } = useLanguage();
  const year = new Date().getFullYear();
  return (
    <footer className={pathname === "/about" ? "bg-[linear-gradient(145deg,#EBEFF0_0%,#F7F9FA_48%,#D8E8F5_100%)] bg-fixed" : "bg-white"} dir={direction}>
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-8">
        <div className="grid gap-10 text-start md:grid-cols-[0.9fr_0.75fr_0.75fr_1.35fr_auto]">
          <div className="flex justify-start md:order-5"><Link href="/" className="inline-flex" aria-label="RATQ"><img src="/images/logo.png" alt="RATQ" className="h-10 w-auto object-contain" /></Link></div>
          <div className="md:order-4"><p className="mt-5 max-w-md text-lg font-medium leading-8 text-black">{t.footer.description}</p></div>
          <div className="md:order-3"><h3 className="mb-4 text-lg font-black text-black">{t.footer.platform.title}</h3><ul className="space-y-3 text-base font-semibold text-black"><li><Link href="/resources">{t.footer.platform.browse}</Link></li><li><a href="#">{t.footer.platform.standards}</a></li><li><a href="#">{t.footer.platform.docs}</a></li></ul></div>
          <div className="md:order-2"><h3 className="mb-4 text-lg font-black text-black">{t.footer.community.title}</h3><ul className="space-y-3 text-base font-semibold text-black"><li><Link href="/about">{t.footer.community.about}</Link></li><li><a href="#">{t.footer.community.contact}</a></li><li><a href="#">{t.footer.community.privacy}</a></li></ul></div>
          <div className="md:order-1"><h3 className="mb-4 text-lg font-black text-black">{t.footer.community.contact}</h3><a href="mailto:Example@gmail.com" className="text-lg font-medium text-black">Example@gmail.com</a></div>
        </div>
        <div className="mt-14 border-t-2 border-black pt-8 text-start"><p className="text-base font-bold text-black">{t.footer.copyright.replace('{{year}}', String(year))}</p></div>
      </div>
    </footer>
  );
}