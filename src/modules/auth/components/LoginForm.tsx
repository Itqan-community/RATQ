'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { githubOAuthUrl } from '@/modules/auth/application/use-cases/get-github-oauth-url';
import { SESSION_EXPIRED_REASON } from '@/shared/infrastructure/session-expiry';
import { useLanguage } from '@/shared/ui/i18n';
import Link from 'next/link';

export function LoginForm() {
  const { t, direction, locale } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  const displayedError = error === SESSION_EXPIRED_REASON ? t.auth.sessionExpired : error;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      router.push('/dashboard');
      router.refresh();
    }
  };

  const copy = t.header.auth;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {displayedError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700">
          {displayedError}
        </div>
      )}

      <div>
        <label htmlFor="login-email" className="mb-2 block text-sm font-black text-[#3f4851]">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field h-12 rounded-lg"
          required
          placeholder="you@example.com"
          dir="ltr"
        />
      </div>

      <div>
        <label htmlFor="login-password" className="mb-2 block text-sm font-black text-[#3f4851]">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field h-12 rounded-lg"
          required
          placeholder="••••••••"
          dir="ltr"
        />
        <div className='w-fit'>
          <Link href="/forgot-password" dir={direction} className={`${locale === 'ar' ? 'text-right' : 'text-left'} mt-2 font-medium text-sm text-[#171717] block transition hover:underline`}>
            {copy.forgotPassword}
          </Link>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex h-12 w-full items-center justify-center rounded-full bg-black px-5 text-sm font-black text-white transition hover:bg-[#171717] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Logging in...' : 'Log in'}
      </button>

      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#ededed]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-xs font-bold text-[#9aa4ad]">or</span>
        </div>
      </div>

      <div className="grid gap-3">
        <button
          type="button"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#ededed] bg-white px-5 text-sm font-black text-black transition hover:bg-[#f7f7f7]"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>
        <a
          href={githubOAuthUrl}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#ededed] bg-white px-5 text-sm font-black text-black transition hover:bg-[#f7f7f7]"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          Continue with GitHub
        </a>
      </div>
    </form>
  );
}
