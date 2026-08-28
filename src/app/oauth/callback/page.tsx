'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const { loginWithCode } = useAuth();
  const ranRef = useRef(false);

  useEffect(() => {
    // The code is single-use, so a second run would redeem an already-spent
    // code and fail a login that actually succeeded.
    if (ranRef.current) return;
    ranRef.current = true;

    // Fragment, not a query string - the backend puts the code after # so it
    // never reaches a server log or a Referer header (issue #229). That also
    // means useSearchParams() can't see it: fragments are client-side only.
    const code = new URLSearchParams(window.location.hash.slice(1)).get('code');

    // Drop it from the address bar immediately so it doesn't sit in the URL
    // (or get copy-pasted) any longer than the redeem call needs it.
    window.history.replaceState(null, '', window.location.pathname);

    if (!code) {
      router.replace('/login?error=oauth_missing_code');
      return;
    }

    loginWithCode(code).then((result) => {
      router.replace(result.success ? '/dashboard' : '/login?error=oauth_login_failed');
    });
  }, [loginWithCode, router]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-white text-black">
      <p className="text-sm font-black text-[#59636d]">Signing you in...</p>
    </main>
  );
}
