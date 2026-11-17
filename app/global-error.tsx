'use client';

// Last resort when the root layout itself fails; must render its own <html>/<body>.
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: 32 }}>
        <h1>حدث خطأ غير متوقع / Something went wrong</h1>
        <button onClick={reset}>إعادة المحاولة / Try again</button>
      </body>
    </html>
  );
}
