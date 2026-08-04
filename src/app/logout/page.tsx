'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function LogoutPage() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    logout();
    router.push('/login');
  }, [logout, router]);

  return (
    <div className="flex items-center justify-center min-h-[70vh] section-padding py-12">
      <div className="text-center">
        <div className="skeleton w-32 h-6 rounded mb-4 mx-auto" />
        <p className="text-[var(--text-muted)] text-sm">جاري تسجيل الخروج...</p>
      </div>
    </div>
  );
}
