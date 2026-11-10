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
              تنظم هذه الشروط استخدام منصة "رتق" (RATQ). باستخدامك للمنصة أو التسجيل فيها، فإنك توافق التزاماً تاماً على جميع الأحكام المذكورة هنا وميثاق التعامل مع النص القرآني الشريف.
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
              These terms govern access and usage of the RATQ Community Platform. By accessing or using the platform, you agree to be bound by these terms and the Sacred Text Integrity Covenant.
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
      title_ar: 'سياسة الخصوصية وحماية البيانات',
      title_en: 'Privacy Policy & Data Protection',
      icon: Lock,
      content_ar: (
        <div className="space-y-6 leading-relaxed">
          <section>
            <h3 className="text-lg font-bold text-fg mb-2">1. جمع البيانات والحد الأدنى</h3>
            <p className="text-fg-muted">
              تتبنى رتق مبدأ "الحد الأدنى الضروري من البيانات" (Data Minimization). لا نجمع سوى البريد الإلكتروني الضروري للمصادقة واسم المستخدم وبيانات الموارد البرمجية التي تختار نشرها علناً.
            </p>
          </section>
          <section>
            <h3 className="text-lg font-bold text-fg mb-2">2. تخزين المفاتيح والتجزئة الأمنية</h3>
            <p className="text-fg-muted">
              لا نقوم بتخزين مفاتيح API الخاصة بك في شكلها الخام أبدًا. يتم حفظ تجزئة SHA-256 للمفتاح فقط، ويُعرض المفتاح الكامل مرة واحدة عند إنشائه.
            </p>
          </section>
          <section>
            <h3 className="text-lg font-bold text-fg mb-2">3. حقوق المستخدمين (GDPR)</h3>
            <p className="text-fg-muted">
              يحق لكل مستخدم طلب تصدير بياناته أو حذف حسابه عبر التواصل معنا من صفحة «اتصل بنا».
            </p>
          </section>
        </div>
      ),
      content_en: (
        <div className="space-y-6 leading-relaxed">
          <section>
            <h3 className="text-lg font-bold text-fg mb-2">1. Data Minimization</h3>
            <p className="text-fg-muted">
              RATQ collects only the minimal information required to provide authentication and manage repository publication: email address, username, and public package metadata.
            </p>
          </section>
          <section>
            <h3 className="text-lg font-bold text-fg mb-2">2. Key Security & Cryptographic Hashing</h3>
            <p className="text-fg-muted">
              Raw API keys are never stored in databases. Only a SHA-256 hash of each key is kept; the full key is shown once, when it is created.
            </p>
          </section>
          <section>
            <h3 className="text-lg font-bold text-fg mb-2">3. User Rights & Data Portability</h3>
            <p className="text-fg-muted">
              Users may request an export or deletion of their personal data by contacting us through the Contact page.
            </p>
          </section>
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
              تحترم منصة رتق حقوق المؤلفين والمطورين والمؤسسات العلمية. يجب أن يلتزم كل ناشر بشروط تراخيص المشاع الإبداعي المعتمدة (Creative Commons: CC0, CC BY, CC BY-SA, CC BY-ND, CC BY-NC إلخ).
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
              RATQ respects the intellectual property rights of authors, open-source maintainers, and academic bodies. Packages must respect defined Creative Commons licenses (CC0, CC BY, CC BY-SA, CC BY-ND, CC BY-NC, etc.).
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
              صُممت منصة رتق لتكون متاحة لجميع المستخدمين وفق معايير إتاحة محتوى الويب (WCAG 2.1 AA)، مع تباين لوني مدروس، وتنقل كامل عبر لوحة المفاتيح، وتوافق تام مع برامج قراءة الشاشة باللغة العربية.
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
              RATQ is engineered to comply with WCAG 2.1 Level AA standards, featuring high-contrast themes, full keyboard navigability, semantic ARIA landmarks, and robust screen-reader support.
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
                {isAr ? 'رتق • الشفافية والامتثال' : 'RATQ • Governance & Compliance'}
              </span>
              <h1 className="text-2xl md:text-4xl font-extrabold text-fg tracking-tight">
                {isAr ? currentDoc.title_ar : currentDoc.title_en}
              </h1>
              <p className="text-xs text-fg-subtle mt-2 font-mono">
                {isAr ? 'آخر تحديث: 2026-03-20 • إصدار 1.0' : 'Last updated: 2026-03-20 • Version 1.0'}
              </p>
            </div>

            {isAr ? currentDoc.content_ar : currentDoc.content_en}
          </Card>
        </main>
      </div>
    </div>
  );
};

export default LegalPage;
