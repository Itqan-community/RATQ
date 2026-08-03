'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/i18n';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'developer' | 'publisher'>('developer');
  const { register, loading, error } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const copy = t.auth;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await register(email, password, displayName, role);
    if (result.success) {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700">{error}</div>}

      <div>
        <label htmlFor="reg-name" className="mb-2 block text-sm font-black text-[#3f4851]">{copy.displayName}</label>
        <input id="reg-name" type="text" value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="input-field h-12 rounded-lg" required placeholder={copy.displayNamePlaceholder} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="reg-email" className="mb-2 block text-sm font-black text-[#3f4851]">{copy.email}</label>
          <input id="reg-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="input-field h-12 rounded-lg" required placeholder="you@example.com" dir="ltr" />
        </div>
        <div>
          <label htmlFor="reg-password" className="mb-2 block text-sm font-black text-[#3f4851]">{copy.password}</label>
          <input id="reg-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="input-field h-12 rounded-lg" required placeholder="********" dir="ltr" />
        </div>
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-black text-[#3f4851]">{copy.accountRole}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className={`cursor-pointer rounded-lg border p-4 transition ${role === 'developer' ? 'border-[#171717] bg-[#f0f7f3]' : 'border-[#ededed] bg-white hover:border-[#cbd5cf]'}`}>
            <input type="radio" name="role" value="developer" checked={role === 'developer'} onChange={() => setRole('developer')} className="sr-only" />
            <span className="flex items-start gap-3">
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${role === 'developer' ? 'border-[#171717]' : 'border-[#b7bec4]'}`}><span className={`h-2.5 w-2.5 rounded-full ${role === 'developer' ? 'bg-[#171717]' : 'bg-transparent'}`} /></span>
              <span><span className="block text-sm font-black text-black">{copy.developer}</span><span className="mt-1 block text-xs font-bold leading-5 text-[#7d8790]">{copy.developerDescription}</span></span>
            </span>
          </label>
          <label className={`cursor-pointer rounded-lg border p-4 transition ${role === 'publisher' ? 'border-[#171717] bg-[#f0f7f3]' : 'border-[#ededed] bg-white hover:border-[#cbd5cf]'}`}>
            <input type="radio" name="role" value="publisher" checked={role === 'publisher'} onChange={() => setRole('publisher')} className="sr-only" />
            <span className="flex items-start gap-3">
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${role === 'publisher' ? 'border-[#171717]' : 'border-[#b7bec4]'}`}><span className={`h-2.5 w-2.5 rounded-full ${role === 'publisher' ? 'bg-[#171717]' : 'bg-transparent'}`} /></span>
              <span><span className="block text-sm font-black text-black">{copy.publisher}</span><span className="mt-1 block text-xs font-bold leading-5 text-[#7d8790]">{copy.publisherDescription}</span></span>
            </span>
          </label>
        </div>
      </fieldset>

      <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center rounded-full bg-black px-5 text-sm font-black text-white transition hover:bg-[#171717] disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? copy.creatingAccount : copy.createAccount}
      </button>
    </form>
  );
}