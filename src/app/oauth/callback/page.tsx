'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

function OAuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithToken } = useAuth();
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const token = searchParams.get('token');
    if (!token) {
      router.replace('/login?error=oauth_missing_token');
      return;
    }

    loginWithToken(token).then((result) => {
      router.replace(result.success ? '/dashboard' : '/login?error=oauth_login_failed');
    });
  }, [searchParams, loginWithToken, router]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-white text-black">
      <p className="text-sm font-black text-[#59636d]">Signing you in...</p>
    </main>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense>
      <OAuthCallbackInner />
    </Suspense>
  );
}
