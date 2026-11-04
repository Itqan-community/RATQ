// src/pages/ProjectWizard.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { mockRepo } from '@/lib/supabase';
import { Resource } from '@/types';
import { Button } from '@/components/ui/Button';
import { ItqanBadge } from '@/components/ui/ItqanBadge';
import { LicenseBadge } from '@/components/ui/LicenseBadge';
import { AccessBadge } from '@/components/ui/AccessBadge';
import { RatingStars } from '@/components/ui/RatingStars';
import {
  Wand2,
  Smartphone,
  Globe,
  Headphones,
  Cpu,
  CheckCircle2,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  Package,
  FileText,
  Download,
  Eye,
  ShieldCheck,
  Code2,
  X,
} from 'lucide-react';

interface WizardState {
  projectType: string;
  framework: string;
  features: string[];
  licenseType: string;
}

interface RecommendedSlot {
  slotId: string;
  slotTitle: string;
  slotDesc: string;
  resource: Resource;
}

export const ProjectWizardPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const allResources = useMemo(() => mockRepo.getResources(), []);
  const [currentStep, setCurrentStep] = useState(1);

  const [state, setState] = useState<WizardState>(() => {
    const urlType = searchParams.get('type');
    const urlFw = searchParams.get('framework');
    return {
      projectType: urlType || 'mobile',
      framework: urlFw || 'flutter',
      features: ['mushaf_text', 'tafsir', 'audio', 'fonts'],
      licenseType: 'commercial_allowed',
    };
  });

  useEffect(() => {
    const urlType = searchParams.get('type');
    const urlFw = searchParams.get('framework');
    if (urlType || urlFw) {
      setState((prev) => ({
        ...prev,
        projectType: urlType || prev.projectType,
        framework: urlFw || prev.framework,
      }));
    }
  }, [searchParams]);

  const toggleFeature = (feat: string) => {
    setState((prev) => ({
      ...prev,
      features: prev.features.includes(feat)
        ? prev.features.filter((f) => f !== feat)
        : [...prev.features, feat],
    }));
  };

  // -------------------------------------------------------------
  // Dynamic Recommendation Engine operating on all 124 resources
  // -------------------------------------------------------------
  const { recommendedSlots } = useMemo(() => {
    const slots: RecommendedSlot[] = [];

    const sortByQuality = (a: Resource, b: Resource) => {
      const itqanWeight: Record<string, number> = { gold: 4, certified: 3, verified: 2, basic: 1, none: 0 };
      const weightA = itqanWeight[a.itqan_level] || 0;
      const weightB = itqanWeight[b.itqan_level] || 0;
      if (weightB !== weightA) return weightB - weightA;
      return b.rating_avg - a.rating_avg;
    };

    // 1. Mushaf text & authentic source
    if (state.features.includes('mushaf_text') || state.projectType === 'mobile' || state.projectType === 'web') {
      const candidates = allResources.filter(
        (r) => r.categories.includes('cat_quran_sources') || r.resource_type === 'mushaf'
      ).sort(sortByQuality);
      if (candidates.length > 0) {
        slots.push({
          slotId: 'mushaf_text',
          slotTitle: 'متن المصحف الشريف المعتمد',
          slotDesc: 'المتن الأساسي بالرسم العثماني وعلامات الضبط',
          resource: candidates[0],
        });
      }
    }

    // 2. Dev Framework / SDK package matching framework
    const devCandidates = allResources.filter(
      (r) => r.categories.includes('cat_dev') || ['library', 'sdk', 'tool', 'api'].includes(r.resource_type)
    );

    let matchedDev: Resource | undefined;
    if (state.framework === 'flutter') {
      matchedDev = devCandidates.find((r) =>
        r.tech_stack.some((t) => /flutter|dart|mobile/i.test(t)) ||
        /flutter|dart/i.test(r.summary_ar + r.title_ar + (r.title_en || ''))
      );
    } else if (state.framework === 'react') {
      matchedDev = devCandidates.find((r) =>
        r.tech_stack.some((t) => /react|javascript|typescript|node/i.test(t)) ||
        /react|javascript|typescript/i.test(r.summary_ar + r.title_ar + (r.title_en || ''))
      );
    } else if (state.framework === 'python') {
      matchedDev = devCandidates.find((r) =>
        r.tech_stack.some((t) => /python|fastapi/i.test(t)) ||
        /python|بايثون/i.test(r.summary_ar + r.title_ar + (r.title_en || ''))
      );
    }

    if (!matchedDev && devCandidates.length > 0) {
      matchedDev = devCandidates.sort(sortByQuality)[0];
    }

    if (matchedDev) {
      slots.push({
        slotId: 'framework_package',
        slotTitle: `حزمة ${state.framework === 'flutter' ? 'Flutter' : state.framework === 'react' ? 'React / Web' : 'Python'} البرمجية`,
        slotDesc: 'المكتبة الهندسية الأساسية لبناء وظائف التطبيق',
        resource: matchedDev,
      });
    }

    // 3. Fonts & Typography
    if (state.features.includes('fonts')) {
      const fontCandidates = allResources.filter(
        (r) => r.categories.includes('cat_fonts') || r.resource_type === 'font'
      ).sort(sortByQuality);
      if (fontCandidates.length > 0) {
        slots.push({
          slotId: 'fonts',
          slotTitle: 'خطوط الرسم العثماني الرقمية',
          slotDesc: 'خطوط حاسوبية معتمدة لعرض الآيات وعلامات الوقف',
          resource: fontCandidates[0],
        });
      }
    }

    // 4. Tafsir Sciences
    if (state.features.includes('tafsir')) {
      const tafsirCandidates = allResources.filter(
        (r) => r.categories.includes('cat_tafsir') || r.resource_type === 'tafsir'
      ).sort(sortByQuality);
      if (tafsirCandidates.length > 0) {
        slots.push({
          slotId: 'tafsir',
          slotTitle: 'المحتوى التفسيري المعتمد',
          slotDesc: 'أمهات كتب التفسير المحققة وأسباب النزول',
          resource: tafsirCandidates[0],
        });
      }
    }

    // 5. Audio & Recitations
    if (state.features.includes('audio') || state.projectType === 'audio_player') {
      const audioCandidates = allResources.filter(
        (r) => r.categories.includes('cat_recitations') || ['recitation', 'audio', 'tajweed'].includes(r.resource_type)
      ).sort(sortByQuality);
      if (audioCandidates.length > 0) {
        slots.push({
          slotId: 'audio',
          slotTitle: 'المكتبة الصوتية ومصاحف التلاوات',
          slotDesc: 'تسجيلات المصاحف المرتلة ومزامنة الآيات',
          resource: audioCandidates[0],
        });
      }
    }

    // 6. Translations
    if (state.features.includes('translations')) {
      const transCandidates = allResources.filter(
        (r) => r.categories.includes('cat_translations') || r.resource_type === 'translation'
      ).sort(sortByQuality);
      if (transCandidates.length > 0) {
        slots.push({
          slotId: 'translations',
          slotTitle: 'ترجمات معاني القرآن العالمية',
          slotDesc: 'ترجمات معاني الآيات باللغات العالمية الموثقة',
          resource: transCandidates[0],
        });
      }
    }

    // 7. AI & Datasets
    if (state.projectType === 'nlp_ai' || state.features.includes('search_engine')) {
      const aiCandidates = allResources.filter(
        (r) => r.categories.includes('cat_datasets') || r.resource_type === 'dataset'
      ).sort(sortByQuality);
      if (aiCandidates.length > 0) {
        slots.push({
          slotId: 'ai_datasets',
          slotTitle: 'مجموعات البيانات والذكاء الاصطناعي',
          slotDesc: 'بيانات منظمة للأبحاث والتحليل اللغوي القرآني',
          resource: aiCandidates[0],
        });
      }
    }

    return {
      recommendedSlots: slots,
    };
  }, [allResources, state]);

  // Selected resource and slide-over drawer modal
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [drawerResource, setDrawerResource] = useState<Resource | null>(null);

  // Close drawer on Escape key and lock body scroll while modal is active
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerResource(null);
    };
    if (drawerResource) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [drawerResource]);

  const handleSelectResource = (res: Resource) => {
    setSelectedResourceId(res.id);
    setDrawerResource(res);
  };

  // -------------------------------------------------------------
  // Cinematic Verification Experience between Step 3 and Step 4
  // -------------------------------------------------------------
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);

  const verificationCheckpoints = useMemo(() => [
    {
      id: 'mushaf_text',
      title: 'فحص سلامة نصوص المصحف الشريف المعتمدة',
      detail: 'التحقق من خلو النصوص من أي تحريف ومطابقة الرسم العثماني وعلامات الضبط للمصاحف المعتمدة.',
      badge: 'سلامة النص',
    },
    {
      id: 'tech_stack',
      title: `التحقق من توافق الحزم مع بيئة ${state.framework === 'flutter' ? 'Flutter / Dart' : state.framework === 'react' ? 'React / Web' : 'Python'}`,
      detail: 'مطابقة إصدارات الحزم وتوافق التبعيات الهندسية وخلوها من التعارضات المعمارية.',
      badge: 'توافق الحزم',
    },
    {
      id: 'licensing',
      title: 'تدقيق التراخيص البرمجية وحرية الاستخدام',
      detail: 'ضمان التوافق القانوني لجميع المكونات وفق تراخيص المصادر المفتوحة والحرة.',
      badge: 'توافق التراخيص',
    },
    {
      id: 'itqan_quality',
      title: 'اعتماد مصفوفة التوافق وفق معيار إتقان',
      detail: 'تأكيد مستوى الثقة وتجهيز ملفات الوصفة البرمجية الموحدة لمشروعك.',
      badge: 'معيار إتقان',
    },
  ], [state.framework]);

  const currentCheckpointIndex = useMemo(() => {
    if (verificationProgress < 25) return 0;
    if (verificationProgress < 55) return 1;
    if (verificationProgress < 85) return 2;
    return 3;
  }, [verificationProgress]);

  useEffect(() => {
    if (!isVerifying) return;

    setVerificationProgress(0);
    const duration = 6200; // 6-7 seconds total cinematic experience
    const intervalMs = 40;
    const step = 100 / (duration / intervalMs);

    const timer = setInterval(() => {
      setVerificationProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsVerifying(false);
            setCurrentStep(4);
          }, 600);
          return 100;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isVerifying]);

  const handleStartVerification = () => {
    setIsVerifying(true);
  };

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-10 w-full text-start">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-border">
        <div className="flex items-center gap-2 text-xs text-fg-subtle mb-3">
          <Link to="/" className="hover:text-ratq-700 transition-colors">
            الرئيسية
          </Link>
          <span>/</span>
          <span className="text-ratq-700 font-bold">المُوجِّه التفاعلي</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-ratq-200 bg-ratq-50 dark:border-ratq-800 dark:bg-ratq-950 text-ratq-800 dark:text-ratq-300 text-xs font-semibold mb-3">
              <Wand2 className="w-3.5 h-3.5 text-ratq-600" />
              <span>مُنشئ ومُركّب الحزم القرآنية الفعلي (يربط 124 مورداً معتمداً)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-fg tracking-tight">
              المُوجِّه التفاعلي لبناء برمجيات القرآن الكريم
            </h1>
            <p className="text-xs sm:text-sm text-fg-muted mt-2 max-w-2xl leading-relaxed">
              اختر نوع مشروعك وتقنيتك المفضلة، وسيقوم المعالج بفحص وتجميع الحزم المتوافقة فعلياً من قاعدة موارد رتق الـ {allResources.length} الموثقة.
            </p>
          </div>

          {/* Stepper Progress Indicator */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((step) => {
              const isDone = isVerifying ? step <= 3 : currentStep > step;
              const isCurrent = isVerifying ? step === 4 : currentStep === step;

              return (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCurrent
                      ? 'bg-ratq-700 text-white shadow-xs ring-2 ring-ratq-500/30'
                      : isDone
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-subtle text-fg-subtle border border-border'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : step}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Wizard Steps */}
      <div className="max-w-5xl mx-auto">
        {/* Verification Loading Screen (Cinematic Inspector) */}
        {isVerifying ? (
          <div className="p-5 sm:p-8 rounded-3xl bg-gradient-to-b from-canvas via-subtle/50 to-subtle border border-border shadow-xl relative overflow-hidden text-center animate-in fade-in zoom-in-95 duration-300">
            {/* Ambient Background Glows */}
            <div className="absolute -top-24 -start-24 w-72 h-72 bg-ratq-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -end-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Central Animated Radar / Scanner Icon */}
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                {/* Outer Pulsing Rings */}
                <div
                  className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${
                    verificationProgress === 100
                      ? 'border-emerald-500/50 scale-105'
                      : 'border-ratq-500/30 animate-ping'
                  }`}
                />
                <div className="absolute inset-2 rounded-full border border-dashed border-ratq-400/40 animate-spin [animation-duration:8s]" />

                {/* Inner Core */}
                <div
                  className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-300 ${
                    verificationProgress === 100
                      ? 'bg-emerald-600 shadow-emerald-500/40 scale-110'
                      : 'bg-gradient-to-br from-ratq-600 to-emerald-700 shadow-ratq-600/30'
                  }`}
                >
                  {verificationProgress === 100 ? (
                    <CheckCircle2 className="w-9 h-9 animate-in zoom-in duration-200" />
                  ) : (
                    <ShieldCheck className="w-8 h-8 animate-pulse" />
                  )}
                </div>
              </div>

              {/* Status Header */}
              <div className="mt-5 space-y-1.5 max-w-lg mx-auto">
                <h3 className="text-lg sm:text-xl font-extrabold text-fg tracking-tight">
                  {verificationProgress === 100
                    ? 'اكتمل التدقيق المعماري بنجاح!'
                    : 'جاري فحص ومراجعة مصفوفة الحزم القرآنية...'}
                </h3>
                <p className="text-xs sm:text-sm text-fg-muted leading-relaxed min-h-[40px] flex items-center justify-center">
                  {verificationProgress === 100
                    ? 'تم استيفاء معايير الجودة والتراخيص وتطابق بيئة المشروع، جاري عرض وصفتك...'
                    : verificationCheckpoints[currentCheckpointIndex].detail}
                </p>
              </div>
            </div>

            {/* Progress Bar & Numerical Counter */}
            <div className="max-w-md mx-auto mb-8 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-fg-subtle px-1">
                <span className="font-bold text-ratq-700 dark:text-ratq-400">
                  {Math.round(verificationProgress)}%
                </span>
                <span>
                  المرحلة {Math.min(currentCheckpointIndex + 1, verificationCheckpoints.length)} من {verificationCheckpoints.length}
                </span>
              </div>

              <div className="h-3 w-full rounded-full bg-subtle border border-border-subtle overflow-hidden p-0.5 shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-ratq-600 via-emerald-500 to-teal-400 transition-all duration-100 ease-out shadow-xs"
                  style={{ width: `${verificationProgress}%` }}
                />
              </div>
            </div>

            {/* Checkpoint Indicators Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto text-start">
              {verificationCheckpoints.map((cp, idx) => {
                const isPassed = verificationProgress >= ((idx + 1) * 25);
                const isActive = !isPassed && currentCheckpointIndex === idx;

                return (
                  <div
                    key={cp.id}
                    className={`p-3.5 rounded-xl border transition-all text-xs flex items-center gap-3 ${
                      isPassed
                        ? 'border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20 text-fg'
                        : isActive
                        ? 'border-ratq-500 bg-ratq-50/40 dark:bg-ratq-950/30 text-fg ring-1 ring-ratq-500/30'
                        : 'border-border/60 bg-canvas/60 text-fg-subtle opacity-60'
                    }`}
                  >
                    <div className="shrink-0">
                      {isPassed ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : isActive ? (
                        <div className="w-5 h-5 rounded-full border-2 border-ratq-600 border-t-transparent animate-spin" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-border-strong flex items-center justify-center text-[10px] font-mono">
                          {idx + 1}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-bold truncate text-[11px] sm:text-xs text-fg">
                        {cp.title}
                      </div>
                      <div className="text-[10px] text-fg-muted font-mono mt-0.5">
                        {isPassed ? 'تم التدقيق والاعتماد' : isActive ? 'جاري الفحص الآن...' : 'في الانتظار'}
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded shrink-0 border ${
                      isPassed
                        ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-100/70 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : isActive
                        ? 'border-ratq-300 dark:border-ratq-800 bg-ratq-100/70 dark:bg-ratq-950 text-ratq-800 dark:text-ratq-300'
                        : 'border-border-subtle bg-muted text-fg-subtle'
                    }`}>
                      {cp.badge}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            {/* Step 1: Project Type */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-ratq-700 uppercase tracking-wider block mb-1">الخطوة الأولى</span>
              <h2 className="text-lg sm:text-xl font-bold text-fg">ما هو نوع المشروع الذي تريد بناءه؟</h2>
              <p className="text-xs text-fg-muted mt-1">حدد الغرض الأساسي لنظامك لفرز الحزم الملائمة من قاعدة الموارد الـ {allResources.length}.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'mobile', title: 'تطبيق هاتف جوال (iOS & Android)', desc: 'تطبيق مصحف كامل يدعم العمل دون اتصال وتغيير الروايات والخطوط.', icon: Smartphone },
                { id: 'web', title: 'موقع ويب وتطبيق سحابي (Web Platform)', desc: 'بوابة إلكترونية لتصفح السور والبحث المتقدم في التفاسير.', icon: Globe },
                { id: 'audio_player', title: 'منصة استماع وتدبر صوتي', desc: 'مشغل تلاوات دقيق مع مزامنة الآيات وعرض أحكام التجويد والقراءات.', icon: Headphones },
                { id: 'nlp_ai', title: 'أبحاث ومعالجة لغة طبيعية وذكاء اصطناعي', desc: 'تضمين دلالي، تصنيف موضوعي، ومطابقة النصوص والترجمات.', icon: Cpu },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = state.projectType === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setState({ ...state, projectType: item.id })}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer select-none bg-canvas ${
                      isSelected
                        ? 'border-ratq-600 ring-2 ring-ratq-500/20 shadow-md'
                        : 'border-border hover:border-ratq-400'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl shrink-0 ${isSelected ? 'bg-ratq-100 text-ratq-800 dark:bg-ratq-950 dark:text-ratq-200' : 'bg-subtle text-fg-muted'}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-fg mb-1">{item.title}</h3>
                        <p className="text-xs text-fg-muted leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <Button size="md" variant="primary" onClick={() => setCurrentStep(2)}>
                <span>المتابعة إلى بيئة التطوير</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180 ms-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Framework */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-ratq-700 uppercase tracking-wider block mb-1">الخطوة الثانية</span>
              <h2 className="text-lg sm:text-xl font-bold text-fg">ما هي لغة البرمجة أو إطار العمل المفضل؟</h2>
              <p className="text-xs text-fg-muted mt-1">سنحدد حزم SDK والمكتبات الفعلية المتوافقة مع بيئتك التقنية.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'flutter', title: 'Flutter / Dart', tag: 'Mobile & Multiplatform', desc: 'الأكثر شعبية لتطبيقات المصاحف بنظام رسم نصوص فائق الدقة.' },
                { id: 'react', title: 'React / Next.js / TypeScript', tag: 'Web & Universal', desc: 'لتطبيقات الويب الحديثة مع دعم كامل لـ SSR ومكتبات الـ JS.' },
                { id: 'python', title: 'Python / FastAPI', tag: 'AI & Data Science', desc: 'لأبحاث استخراج البيانات، المتجهات الدلالية، والذكاء الاصطناعي.' },
              ].map((item) => {
                const isSelected = state.framework === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setState({ ...state, framework: item.id })}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer select-none bg-canvas flex flex-col justify-between ${
                      isSelected
                        ? 'border-ratq-600 ring-2 ring-ratq-500/20 shadow-md'
                        : 'border-border hover:border-ratq-400'
                    }`}
                  >
                    <div>
                      <span className="text-2xs font-bold font-mono text-ratq-700 block mb-1">{item.tag}</span>
                      <h3 className="text-base font-bold text-fg mb-2">{item.title}</h3>
                      <p className="text-xs text-fg-muted leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between pt-4">
              <Button size="md" variant="outline" onClick={() => setCurrentStep(1)}>
                <ArrowLeft className="w-4 h-4 rtl:rotate-180 me-2" />
                <span>الرجوع</span>
              </Button>
              <Button size="md" variant="primary" onClick={() => setCurrentStep(3)}>
                <span>المتابعة إلى المكونات المطلوبة</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180 ms-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Features & Components */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-ratq-700 uppercase tracking-wider block mb-1">الخطوة الثالثة</span>
              <h2 className="text-lg sm:text-xl font-bold text-fg">ما هي المكونات التي يحتاجها تطبيقك؟</h2>
              <p className="text-xs text-fg-muted mt-1">اختر المكونات المطلوبة ليتم استخراج أفضل الموارد المطابقة لها من قاعدة البيانات.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'mushaf_text', title: 'متن المصحف بالرسم العثماني (إلزامي)', desc: 'نصوص الآيات كاملة برواية حفص عن عاصم مع علامات الضبط.' },
                { id: 'tafsir', title: 'كتب التفسير المعتمدة (ابن كثير، السعدي، الميسر)', desc: 'تفاسير موثقة خاضعة للتدقيق الشرعي المعتمد.' },
                { id: 'audio', title: 'تلاوات صوتية ومصاحف القراءات العشر', desc: 'ملفات صوتية عالية الجودة مع بيانات التزامن والتظليل الحركي.' },
                { id: 'fonts', title: 'خطوط النشر المصحفي الحاسوبي (OTF/WOFF2)', desc: 'خطوط مجمع الملك فهد وعلامات السجدات والوقف المزخرفة.' },
                { id: 'translations', title: 'ترجمات معاني القرآن (إنجليزية، فرنسية، أوردو)', desc: 'تراجم صادرة عن مراكز ترجمة موثوقة عالمياً.' },
                { id: 'search_engine', title: 'محرك بحث متقدم ومجموعات بيانات', desc: 'خوارزميات تطبيع وتبسيط الهمزات والبحث الفوري والذكاء الاصطناعي.' },
              ].map((feat) => {
                const isSelected = state.features.includes(feat.id);
                return (
                  <div
                    key={feat.id}
                    onClick={() => toggleFeature(feat.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer select-none bg-canvas flex items-start gap-3 ${
                      isSelected
                        ? 'border-ratq-600 bg-ratq-50/20 dark:bg-ratq-950/20 ring-1 ring-ratq-500'
                        : 'border-border hover:border-ratq-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="mt-1 rounded text-ratq-600 focus:ring-ratq-500 shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-fg mb-1">{feat.title}</h4>
                      <p className="text-xs text-fg-muted leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between pt-4">
              <Button size="md" variant="outline" onClick={() => setCurrentStep(2)}>
                <ArrowLeft className="w-4 h-4 rtl:rotate-180 me-2" />
                <span>الرجوع</span>
              </Button>
              <Button size="md" variant="primary" onClick={handleStartVerification}>
                <span>توليد الحزمة والوصفة النهائية</span>
                <Sparkles className="w-4 h-4 ms-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Final Output & Recipe */}
        {currentStep === 4 && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Success Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-ratq-50 to-emerald-50 dark:from-ratq-950/50 dark:to-emerald-950/30 border border-ratq-200 dark:border-ratq-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-ratq-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-fg">
                      تم تجهيز وصفتك البرمجية المتوافقة بنجاح!
                    </h2>
                    <p className="text-xs text-fg-muted mt-0.5">
                      تم فرز المكونات بناءً على معايير الجودة والتراخيص وتطابق بيئة {state.framework.toUpperCase()}.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <div className="px-3 py-1.5 rounded-xl bg-canvas border border-border text-2xs">
                    <span className="text-fg-subtle block font-sans">المكونات المختارة لمشروعك:</span>
                    <span className="font-bold text-xs text-ratq-700 dark:text-ratq-400 font-mono">
                      {recommendedSlots.length} حزم أساسية موثقة
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Curated Slots Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-ratq-600" />
                  <h3 className="text-sm sm:text-base font-bold text-fg">
                    المكونات المعتمدة الموصى بها لمشروعك
                  </h3>
                </div>
                <span className="text-2xs font-mono text-fg-subtle px-2.5 py-1 rounded-full bg-subtle border border-border-subtle">
                  {recommendedSlots.length} مكونات أساسية متكاملة
                </span>
              </div>

              <p className="text-xs text-fg-muted">
                تم اختيار هذه الحزم بعناية لتكون متوافقة هندسياً وخالية من التعارض، ومعتمدة وفق معيار إتقان. انقر على أي مكون لعرض تفاصيله وطريقة ربطه:
              </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {recommendedSlots.map((slot) => {
                    const res = slot.resource;
                    const isSelected = selectedResourceId === res.id || drawerResource?.id === res.id;

                    return (
                      <div
                        key={slot.slotId}
                        onClick={() => handleSelectResource(res)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer select-none bg-canvas flex flex-col justify-between text-start relative group ${
                          isSelected
                            ? 'border-ratq-600 bg-ratq-50/50 dark:bg-ratq-950/40 ring-2 ring-ratq-500/30 shadow-md'
                            : 'border-border hover:border-ratq-400 hover:shadow-xs'
                        }`}
                      >
                        <div>
                          {/* Slot Role Pill */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-muted text-ratq-800 dark:text-ratq-300 border border-border-subtle">
                              {slot.slotTitle}
                            </span>
                            <ItqanBadge level={res.itqan_level} size="sm" />
                          </div>

                          {/* Resource Title */}
                          <h4 className="text-sm font-bold text-fg leading-snug group-hover:text-ratq-700 transition-colors flex items-center gap-1.5">
                            <Package className="w-4 h-4 text-ratq-600 shrink-0" />
                            <span className="line-clamp-1">{res.title_ar}</span>
                          </h4>

                          <p className="text-xs text-fg-muted line-clamp-2 mt-1.5 leading-relaxed">
                            {res.summary_ar}
                          </p>
                        </div>

                        {/* Footer: License */}
                        <div className="mt-3 pt-2.5 border-t border-border-subtle">
                          <div className="text-[11px] font-mono text-fg-subtle truncate">
                            {res.license?.name_ar || res.license_id}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Subtle bottom exploration note linking to catalog */}
                <div className="p-3.5 sm:p-4 rounded-xl border border-border-subtle bg-subtle/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-fg-muted mt-6">
                  <div className="flex items-center gap-2">
                    <span className="text-ratq-600 text-sm">💡</span>
                    <span>
                      تم اختيار هذه الحزم لتمنحك أسرع وأوثق بداية معمارية متناسقة. هل تبحث عن متطلبات إضافية؟
                    </span>
                  </div>
                  <Link
                    to="/resources"
                    className="font-semibold text-ratq-700 dark:text-ratq-300 hover:underline shrink-0 flex items-center gap-1"
                  >
                    <span>استكشف مكتبة الموارد كاملة</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </Link>
                </div>
              </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button
                size="md"
                variant="outline"
                onClick={() => {
                  setIsVerifying(false);
                  setVerificationProgress(0);
                  setCurrentStep(1);
                }}
              >
                <span>إعادة ضبط المعالج</span>
              </Button>
              <Button size="md" variant="primary" onClick={() => setCurrentStep(3)}>
                <ArrowLeft className="w-4 h-4 rtl:rotate-180 me-2" />
                <span>تعديل المكونات والخصائص</span>
              </Button>
            </div>
          </div>
        )}
      </>
    )}
  </div>

      {/* Slide-over Drawer Modal from the Right for Resource Details */}
      {drawerResource && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-resource-title"
        >
          {/* Dimmed Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-modal-fade-in"
            onClick={() => setDrawerResource(null)}
            aria-hidden="true"
          />

          {/* Drawer Panel Sliding in from the Left */}
          <div className="fixed inset-y-0 left-0 z-10 w-full max-w-xl md:max-w-2xl h-full bg-canvas border-r border-border shadow-2xl flex flex-col animate-slide-in-left overflow-hidden text-start">
            {/* Drawer Header */}
            <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between gap-4 bg-canvas/95 backdrop-blur-xs sticky top-0 z-20">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-ratq-50 dark:bg-ratq-950 text-ratq-700 dark:text-ratq-300 flex items-center justify-center shrink-0 border border-ratq-200 dark:border-ratq-800 shadow-2xs">
                  <Package className="w-5 h-5 text-ratq-600" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-bold font-mono text-ratq-700 uppercase tracking-wider bg-ratq-50 dark:bg-ratq-950 px-2 py-0.5 rounded border border-ratq-200 dark:border-ratq-800">
                      تفاصيل المورد المعتمد
                    </span>
                    <ItqanBadge level={drawerResource.itqan_level} size="sm" />
                  </div>
                  <h3 id="drawer-resource-title" className="text-base sm:text-lg font-bold text-fg leading-tight truncate">
                    {drawerResource.title_ar}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDrawerResource(null)}
                className="p-2 rounded-lg text-fg-subtle hover:text-fg hover:bg-subtle transition-colors cursor-pointer shrink-0"
                aria-label="إغلاق النافذة"
                title="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-start">
              {/* English Title & Metadata Badges */}
              <div className="space-y-2.5 pb-4 border-b border-border-subtle">
                {drawerResource.title_en && (
                  <p className="text-xs font-mono text-fg-subtle">
                    {drawerResource.title_en}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <AccessBadge level={drawerResource.access_level} />
                  <LicenseBadge licenseId={drawerResource.license_id} spdx={drawerResource.license_spdx} />
                  {drawerResource.latest_version && (
                    <span className="text-2xs font-mono text-fg-subtle bg-muted px-2 py-0.5 rounded border border-border-subtle">
                      v{drawerResource.latest_version}
                    </span>
                  )}
                </div>

                {/* Publisher Info */}
                {drawerResource.publisher && (
                  <div className="flex items-center gap-2 text-xs text-fg-muted pt-1">
                    <span className="text-fg-subtle">الناشر المعتمد:</span>
                    <span className="font-semibold text-fg">
                      {drawerResource.publisher.name_ar}
                    </span>
                    {drawerResource.publisher.verification_status === 'verified' && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        <ShieldCheck className="w-3 h-3" />
                        <span>ناشر موثق</span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Summary */}
              <div>
                <h4 className="text-xs font-bold text-fg uppercase tracking-wider mb-1.5">
                  نبذة عن المورد وغرض الاستخدام:
                </h4>
                <p className="text-xs text-fg leading-relaxed">
                  {drawerResource.summary_ar}
                </p>
              </div>

              {/* Description */}
              {drawerResource.description_ar && (
                <div>
                  <h4 className="text-xs font-bold text-fg uppercase tracking-wider mb-1.5">
                    الوصف التفصيلي:
                  </h4>
                  <div className="p-3.5 rounded-xl bg-subtle/50 border border-border-subtle text-xs text-fg-muted leading-relaxed whitespace-pre-line max-h-52 overflow-y-auto font-sans">
                    {drawerResource.description_ar}
                  </div>
                </div>
              )}

              {/* Tech Stack & Stats */}
              <div className="pt-4 border-t border-border-subtle space-y-3">
                <div>
                  <span className="text-[11px] font-medium text-fg-subtle block mb-1.5">
                    التقنيات والصيغ البرمجية المدعومة:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {drawerResource.tech_stack && drawerResource.tech_stack.length > 0 ? (
                      drawerResource.tech_stack.map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-mono text-fg-muted bg-subtle px-2 py-0.5 rounded border border-border-subtle"
                        >
                          {tech}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-fg-subtle">ملفات ومصادر قياسية</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-fg-subtle pt-2">
                  <div className="flex items-center gap-1.5">
                    <RatingStars rating={drawerResource.rating_avg} size={13} />
                    <span className="font-bold text-fg">
                      {drawerResource.rating_avg}
                    </span>
                    <span className="text-fg-subtle">({drawerResource.rating_count})</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Download className="w-3.5 h-3.5 text-fg-subtle" />
                    <span>{drawerResource.downloads_count.toLocaleString()} تنزيل</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-fg-subtle" />
                    <span>{drawerResource.views_count.toLocaleString()} مشاهدة</span>
                  </div>
                </div>
              </div>

              {/* Documentation & Repo Links */}
              {(drawerResource.docs_url || drawerResource.repo_url) && (
                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border-subtle text-xs">
                  {drawerResource.docs_url && (
                    <a
                      href={drawerResource.docs_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-ratq-700 hover:underline font-semibold"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>الوثائق والتوثيق البرمجي ↗</span>
                    </a>
                  )}
                  {drawerResource.repo_url && (
                    <a
                      href={drawerResource.repo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-ratq-700 hover:underline font-semibold"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>المستودع المصدري ↗</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-border bg-canvas/95 backdrop-blur-xs flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDrawerResource(null)}
              >
                <span>إغلاق النافذة</span>
              </Button>

              <Link to={`/resources/${drawerResource.slug}`}>
                <Button size="sm" variant="primary">
                  <span>عرض صفحة المورد الكاملة</span>
                  <ExternalLink className="w-3.5 h-3.5 ms-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectWizardPage;
