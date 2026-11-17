'use client';

// Route-level boundary for exceptions outside the SPA's own PageErrorBoundary (e.g. during boot).
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div role="alert" className="container mx-auto px-4 py-20 text-center space-y-3">
      <h1 className="text-xl font-bold">حدث خطأ غير متوقع / Something went wrong</h1>
      <button className="underline font-semibold" onClick={reset}>إعادة المحاولة / Try again</button>
    </div>
  );
}
