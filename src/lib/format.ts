// src/lib/format.ts
// Date and Number formatting utilities

export function formatNumber(
  num: number,
  system: 'western' | 'arabic-indic' = 'western'
): string {
  if (system === 'arabic-indic') {
    return new Intl.NumberFormat('ar-SA-u-nu-arab').format(num);
  }
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatDate(
  dateString?: string,
  options?: { showHijri?: boolean; locale?: string }
): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const locale = options?.locale || 'ar-SA';

  const gregorian = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);

  if (options?.showHijri) {
    try {
      const hijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
      return `${hijri}هـ (${gregorian}م)`;
    } catch {
      return gregorian;
    }
  }

  return gregorian;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
