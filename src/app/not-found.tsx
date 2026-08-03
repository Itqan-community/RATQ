import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] section-padding text-center">
      <div className="mb-6">
        <span className="text-8xl font-heading font-bold text-[var(--accent-primary)] opacity-20">404</span>
      </div>
      <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)] mb-3">
        الصفحة غير موجودة
      </h1>
      <p className="text-[var(--text-secondary)] mb-8 max-w-md leading-relaxed">
        عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها. قد تكون تم حذفها أو تغيير رابطها.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/" className="btn-primary text-sm py-2.5 px-6 inline-block text-center">
          العودة للرئيسية
        </Link>
        <Link href="/resources" className="btn-outline text-sm py-2.5 px-6 inline-block text-center">
          تصفح الموارد
        </Link>
      </div>
    </div>
  );
}
