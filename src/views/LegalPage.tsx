// src/views/LegalPage.tsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Shield, FileText, Lock, Eye } from 'lucide-react';

interface LegalDoc {
  slug: string;
  title_ar: string;
  title_en: string;
  icon: any;
  content_ar: React.ReactNode;
  content_en: React.ReactNode;
}

export const LegalPage: React.FC = () => {
  const { slug = 'terms' } = useParams<{ slug: string }>();
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const docs: Record<string, LegalDoc> = {
    terms: {
      slug: 'terms',
      title_ar: 'شروط الاستخدام وميثاق النزاهة',
      title_en: 'Terms of Service & Integrity Charter',
      icon: FileText,
      content_ar: (
        <div className="space-y-6 leading-relaxed">
          <section>
            <h3 className="text-lg font-bold text-fg mb-2">1. المقدمة ونطاق التطبيق</h3>
            <p className="text-fg-muted">
              تنظم هذه الشروط استخدام دليل التقنيات القرآنية. باستخدامك للمنصة أو التسجيل فيها، فإنك توافق التزاماً تاماً على جميع الأحكام المذكورة هنا وميثاق التعامل مع النص القرآني الشريف.
            </p>
          </section>
          <section>
            <h3 className="text-lg font-bold text-fg mb-2">2. قدسية النص القرآني وعدم التوليد الآلي</h3>
            <p className="text-fg-muted">
              يُحظر حظراً مطلقاً على أي ناشر أو مطور استخدام نماذج الذكاء الاصطناعي التوليدي لكتابة أو تعديل أو تصحيح أو تخمين آيات القرآن الكريم أو التفاسير أو التراجم المعتمدة. كل نص منشور يجب أن يُستند فيه إلى مصدر موثق ومعتمد رسميًا (مثل مجمع الملك فهد أو مشروع Tanzil المعتمد).
            </p>
          </section>
          <section>
            <h3 className="text-lg font-bold text-fg mb-2">3. حسابات المطورين ومفاتيح API</h3>
            <p className="text-fg-muted">
              المطور مسؤول بالكامل عن الحفاظ على سرية مفاتيح الوصول الصادرة له. في حال تسرب أي مفتاح، يجب إبطاله فوراً من لوحة التحكم وإعادة إصداره. تحتفظ إدارة المنصة بالحق في تعليق أي مفتاح يتجاوز حدود الاستخدام العادل أو يسيء استخدام الموارد.
            </p>
          </section>
        </div>
      ),
      content_en: (
        <div className="space-y-6 leading-relaxed">
          <section>
            <h3 className="text-lg font-bold text-fg mb-2">1. Scope and Acceptance</h3>
            <p className="text-fg-muted">
              These terms govern access and usage of Quran Tech Directory. By accessing or using the platform, you agree to be bound by these terms and the Sacred Text Integrity Covenant.
            </p>
          </section>
          <section>
            <h3 className="text-lg font-bold text-fg mb-2">2. Sacred Text Zero-Hallucination Policy</h3>
            <p className="text-fg-muted">
              It is strictly prohibited to use generative AI models to write, alter, or interpolate verses of the Holy Quran, authoritative tafsir, or translations. All published data must originate from accredited sources (e.g., King Fahd Complex or Tanzil verification standard).
            </p>
          </section>
          <section>
            <h3 className="text-lg font-bold text-fg mb-2">3. Developer Credentials & API Usage</h3>
            <p className="text-fg-muted">
              Developers are fully responsible for safeguarding issued API credentials. Keys are rate-limited according to tier policies, and compromised keys must be revoked immediately via the developer dashboard.
            </p>
          </section>
        </div>
      ),
    },
    privacy: {
      slug: 'privacy',
      title_ar: 'سياسة الخصوصية',
      title_en: 'Privacy Policy',
      icon: Lock,
      // Copied from live ratq.itqan.dev (messages en/ar "privacy"); en item3 follows the ar wording since beta uses a cookie session.
      content_ar: (
        <div className="space-y-6 leading-relaxed">
          <p className="text-fg-muted">هذه الصفحة تشرح البيانات التي يجمعها دليل التقنيات القرآنية ولماذا.</p>
          <section>
            <h3 className="text-lg font-bold text-fg mb-2">ما الذي نجمعه</h3>
            <ul className="list-disc ps-6 space-y-2 text-fg-muted">
              <li>عند تسجيل الدخول كمطوّر عبر GitHub، نحصل على بريدك الإلكتروني الموثّق واسم العرض من GitHub لإنشاء حسابك وربط جلستك.</li>
              <li>عند نشر مورد أو طلب وصول إليه، نخزّن البيانات التي تُدخلها لهذا الغرض تحديدا (وصف المورد، رابط GitHub، معلومات الترخيص، وما شابه).</li>
              <li>ملف تعريف ارتباط (كوكي) واحد للجلسة يُستخدم فقط لإبقائك مسجّل الدخول، وليس للتتبع.</li>
            </ul>
          </section>
          <section>
            <h3 className="text-lg font-bold text-fg mb-2">ما لا نفعله</h3>
            <ul className="list-disc ps-6 space-y-2 text-fg-muted">
              <li>لا نستخدم أدوات تحليلات أو إعلانات من طرف ثالث لتتبع زوار الموقع.</li>
              <li>لا نبيع بياناتك أو نشاركها مع أي جهة خارجية لأغراض تسويقية.</li>
            </ul>
          </section>
          <section>
            <h3 className="text-lg font-bold text-fg mb-2">طلب حذف الحساب أو البيانات</h3>
            <p className="text-fg-muted">
              تواصل معنا عبر GitHub Issues (انظر صفحة "تواصل معنا") وسنعالج الطلب.
            </p>
          </section>
          <p className="text-sm text-fg-subtle">هذه سياسة أولية لمنصة لا تزال في مرحلة Beta، وقد تُحدَّث مع تطور المنصة.</p>
        </div>
      ),
      content_en: (
        <div className="space-y-6 leading-relaxed">
          <p className="text-fg-muted">This page explains what data Quran Tech Directory collects and why.</p>
          <section>
            <h3 className="text-lg font-bold text-fg mb-2">What we collect</h3>
            <ul className="list-disc ps-6 space-y-2 text-fg-muted">
              <li>When you sign in as a developer via GitHub, we receive your verified email and display name from GitHub to create your account and link your session.</li>
              <li>When you publish a resource or request access to one, we store the data you enter specifically for that purpose (resource description, GitHub URL, license info, and similar).</li>
              <li>One session cookie is used only to keep you signed in, not for tracking.</li>
            </ul>
          </section>
          <section>
            <h3 className="text-lg font-bold text-fg mb-2">What we don&apos;t do</h3>
            <ul className="list-disc ps-6 space-y-2 text-fg-muted">
              <li>We don&apos;t use third-party analytics or advertising trackers on the site.</li>
              <li>We don&apos;t sell your data or share it with outside parties for marketing purposes.</li>
            </ul>
          </section>
          <section>
            <h3 className="text-lg font-bold text-fg mb-2">Requesting account or data deletion</h3>
            <p className="text-fg-muted">
              Reach out via GitHub Issues (see the Contact page) and we&apos;ll handle the request.
            </p>
          </section>
          <p className="text-sm text-fg-subtle">This is an initial policy for a platform still in Beta, and may be updated as the platform evolves.</p>
        </div>
      ),
    },
    dmca: {
      slug: 'dmca',
      title_ar: 'حقوق الملكية الفكرية والإبلاغ (DMCA)',
      title_en: 'Intellectual Property & DMCA Notice',
      icon: Shield,
      content_ar: (
        <div className="space-y-6 leading-relaxed">
          <section>
            <h3 className="text-lg font-bold text-fg mb-2">1. احترام حقوق المصنفات البرمجية والعلمية</h3>
            <p className="text-fg-muted">
              يحترم دليل التقنيات القرآنية حقوق المؤلفين والمطورين والمؤسسات العلمية. يجب أن يلتزم كل ناشر بشروط تراخيص المشاع الإبداعي المعتمدة (Creative Commons: CC0, CC BY, CC BY-SA, CC BY-ND, CC BY-NC إلخ).
            </p>
          </section>
          <section>
            <h3 className="text-lg font-bold text-fg mb-2">2. إجراءات الإبلاغ وطلب الإزالة</h3>
            <p className="text-fg-muted">
              إذا كنت تعتقد أن أحد الموارد المنشورة ينتهك حقوق ملكيتك الفكرية أو يحتوي على نص غير مرخص، يمكنك تقديم إشعار رسمي فوري من صفحة المورد عبر زر "إبلاغ"، أو مراسلة الفريق القانوني. يتم إيقاف المورد مؤقتاً أثناء الفحص القانوني.
            </p>
          </section>
        </div>
      ),
      content_en: (
        <div className="space-y-6 leading-relaxed">
          <section>
            <h3 className="text-lg font-bold text-fg mb-2">1. Respect for Intellectual Property</h3>
            <p className="text-fg-muted">
              Quran Tech Directory respects the intellectual property rights of authors, open-source maintainers, and academic bodies. Packages must respect defined Creative Commons licenses (CC0, CC BY, CC BY-SA, CC BY-ND, CC BY-NC, etc.).
            </p>
          </section>
          <section>
            <h3 className="text-lg font-bold text-fg mb-2">2. Notice and Takedown Procedure</h3>
            <p className="text-fg-muted">
              If you believe content violates your copyright or licensing terms, submit a report directly from the resource page or contact our legal team. Disputed packages are held in escrow during investigation.
            </p>
          </section>
        </div>
      ),
    },
    accessibility: {
      slug: 'accessibility',
      title_ar: 'بيان إمكانية الوصول وسهولة الاستخدام',
      title_en: 'Accessibility Statement (WCAG 2.1 AA)',
      icon: Eye,
      content_ar: (
        <div className="space-y-6 leading-relaxed">
          <section>
            <h3 className="text-lg font-bold text-fg mb-2">1. معايير WCAG 2.1 AA</h3>
            <p className="text-fg-muted">
              صُمم دليل التقنيات القرآنية ليكون متاحاً لجميع المستخدمين وفق معايير إتاحة محتوى الويب (WCAG 2.1 AA)، مع تباين لوني مدروس، وتنقل كامل عبر لوحة المفاتيح، وتوافق تام مع برامج قراءة الشاشة باللغة العربية.
            </p>
          </section>
          <section>
            <h3 className="text-lg font-bold text-fg mb-2">2. الاتجاه المنطقي (RTL First)</h3>
            <p className="text-fg-muted">
              تعتمد المنصة خصائص CSS المنطقية لضمان تدفق بصري طبيعي للكتابة العربية، مع تحسين مظهر الخطوط دون استخدام الميلان الاصطناعي (Zero Synthetic Italic) احتراماً لقواعد الخط العربي.
            </p>
          </section>
        </div>
      ),
      content_en: (
        <div className="space-y-6 leading-relaxed">
          <section>
            <h3 className="text-lg font-bold text-fg mb-2">1. WCAG 2.1 AA Compliance</h3>
            <p className="text-fg-muted">
              Quran Tech Directory is engineered to comply with WCAG 2.1 Level AA standards, featuring high-contrast themes, full keyboard navigability, semantic ARIA landmarks, and robust screen-reader support.
            </p>
          </section>
          <section>
            <h3 className="text-lg font-bold text-fg mb-2">2. Native Logical RTL Layout</h3>
            <p className="text-fg-muted">
              Built with native logical CSS properties to preserve Arabic typographic integrity, enforcing zero synthetic italicization on the primary font.
            </p>
          </section>
        </div>
      ),
    },
  };

  const currentDoc = docs[slug] || docs.terms;

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-20 space-y-1">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-fg-subtle px-3 mb-2">
              {isAr ? 'الوثائق القانونية' : 'Legal Documents'}
            </h2>
            {Object.values(docs).map((d) => {
              const Icon = d.icon;
              const active = d.slug === currentDoc.slug;
              return (
                <Link
                  key={d.slug}
                  to={`/legal/${d.slug}`}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-ratq-500/10 text-ratq-600 dark:text-ratq-400 font-bold'
                      : 'text-fg-muted hover:text-fg hover:bg-canvas-subtle'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{isAr ? d.title_ar : d.title_en}</span>
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          <Card className="p-8 md:p-10 border-border">
            <div className="border-b border-border pb-6 mb-8">
              <span className="text-xs font-mono text-ratq-600 dark:text-ratq-400 uppercase tracking-widest block mb-2">
                {isAr ? 'دليل التقنيات القرآنية • الشفافية والامتثال' : 'Quran Tech Directory • Governance & Compliance'}
              </span>
              <h1 className="text-2xl md:text-4xl font-extrabold text-fg tracking-tight">
                {isAr ? currentDoc.title_ar : currentDoc.title_en}
              </h1>
              {currentDoc.slug !== 'privacy' && (
                <p className="text-xs text-fg-subtle mt-2 font-mono">
                  {isAr ? 'آخر تحديث: 2026-03-20 • إصدار 1.0' : 'Last updated: 2026-03-20 • Version 1.0'}
                </p>
              )}
            </div>

            {isAr ? currentDoc.content_ar : currentDoc.content_en}
          </Card>
        </main>
      </div>
    </div>
  );
};

export default LegalPage;
