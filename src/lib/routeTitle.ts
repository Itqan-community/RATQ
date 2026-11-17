// Per-route document.title (WCAG 2.4.2). ponytail: static per-route names; resource-specific titles need the SSR metadata work.
const TITLES: [string, string, string][] = [
  ['/resources/roadmap', 'مسار المطور', 'Dev Roadmap'],
  ['/resources/stacks', 'حزم التطبيقات', 'App Stacks'],
  ['/resources/wizard', 'معالج المشروع', 'Project Wizard'],
  ['/resources', 'مكتبة الموارد', 'Resources'],
  ['/categories', 'التصنيفات', 'Categories'],
  ['/publishers', 'الناشرون', 'Publishers'],
  ['/standards', 'معيار إتقان', 'Itqan Standard'],
  ['/licenses', 'التراخيص', 'Licenses'],
  ['/about', 'عن رتق', 'About'],
  ['/contributors', 'المساهمون', 'Contributors'],
  ['/docs', 'الوثائق', 'Docs'],
  ['/faq', 'الأسئلة الشائعة', 'FAQ'],
  ['/changelog', 'سجل التغييرات', 'Changelog'],
  ['/status', 'حالة الخدمة', 'Status'],
  ['/legal', 'قانوني', 'Legal'],
  ['/contact', 'اتصل بنا', 'Contact'],
  ['/auth', 'تسجيل الدخول', 'Sign in'],
  ['/app', 'لوحة المطور', 'Developer Dashboard'],
  ['/publisher', 'بوابة الناشر', 'Publisher Portal'],
  ['/review', 'لوحة المراجع', 'Reviewer Dashboard'],
  ['/moderation', 'لوحة الإشراف', 'Moderation'],
  ['/admin', 'لوحة الإدارة', 'Admin'],
];
const SITE = { ar: 'منصة مجتمع RATQ', en: 'RATQ Community Platform' } as const;
const RESOURCE = { ar: 'مورد', en: 'Resource' } as const;

export function routeTitle(pathname: string, lang: 'ar' | 'en'): string {
  const hit = TITLES.find(([p]) => pathname === p || (p !== '/resources' && pathname.startsWith(p + '/')));
  const page = hit ? (lang === 'ar' ? hit[1] : hit[2]) : pathname.startsWith('/resources/') ? RESOURCE[lang] : '';
  return page ? `${page} | ${SITE[lang]}` : SITE[lang];
}
