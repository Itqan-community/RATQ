'use client';

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/shared/ui/i18n";
import Image from "next/image";
import { validatePassword } from "@/shared/utils/utils";

export function ResetPasswordForm({ token }: { token: string }) {
  const { t } = useLanguage();
  const copy = t.auth;
  const { resetPassword, error } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const message = formError ?? error;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate password
    if (!validatePassword(password)) {
      setFormError(copy.passwordLength);
      return;
    }
    if (password !== confirmPassword) {
      setFormError(copy.passwordMismatch);
      return;
    }
    setFormError(null);
    setSubmitting(true);
    try {
      const result = await resetPassword(token, password);
      if (result.success) setDone(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-[0_8px_22px_rgba(15,23,42,0.06)]">
          <Image
            src="/images/logo.png"
            alt="RATQ"
            width={34}
            height={34}
            className="h-8 w-8 object-contain"
          />
        </div>
        <div>
          <p className="text-sm font-black text-[#7d8790]">RATQ</p>
          <h1 className="text-3xl font-black leading-tight text-black sm:text-4xl">
            {done ? copy.passwordUpdated : copy.resetPasswordTitle}
          </h1>
        </div>
      </div>
      <p className="mb-8 text-base leading-8 text-[#59636d]">
        {done ? copy.resetPasswordSuccess : copy.resetPasswordSubtitle}
      </p>
      <div className="rounded-lg bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.045)] sm:p-6">
        {done ? (
          <Link
            href="/login"
            className="flex h-12 w-full items-center justify-center rounded-full bg-black px-5 text-sm font-black text-white transition hover:bg-[#171717]"
          >
            {copy.loginNow}
          </Link>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-5">
              {message && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700">
                  {message}
                </div>
              )}
              <div>
                <label
                  htmlFor="reset-password"
                  className="mb-2 block text-sm font-black text-[#3f4851]"
                >
                  {copy.newPassword}
                </label>
                <input
                  id="reset-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field h-12 rounded-lg"
                  required
                  maxLength={64}
                  placeholder="••••••••"
                  dir="ltr"
                />
              </div>
              <div>
                <label
                  htmlFor="reset-password-confirm"
                  className="mb-2 block text-sm font-black text-[#3f4851]"
                >
                  {copy.confirmPassword}
                </label>
                <input
                  id="reset-password-confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field h-12 rounded-lg"
                  required
                  maxLength={64}
                  placeholder="••••••••"
                  dir="ltr"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="flex h-12 w-full items-center justify-center rounded-full bg-black px-5 text-sm font-black text-white transition hover:bg-[#171717] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {copy.resetPasswordButton}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-[#6f7780]">
              {copy.rememberPassword}{" "}
              <Link
                href="/login"
                className="font-black text-[#171717] transition hover:underline"
              >
                {copy.loginNow}
              </Link>
            </p>
          </>
        )}
      </div>
    </>
  );
}
