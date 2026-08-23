'use client';

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/shared/ui/i18n";
import Image from "next/image";

export function ForgotPasswordForm() {
  const { t, direction } = useLanguage();
  const [emailSent, setEmailSent] = useState<'idle' | 'sent'>('idle');
  const [resendCooldown, setResendCooldown] = useState<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const RESEND_COOLDOWN_MS = 30_000; // 30 seconds

  const [email, setEmail] = useState('');
  const { forgotPassword, error } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await sentEmail();
  };

  const sentEmail = async () => {
    setSubmitting(true);
    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setEmailSent("sent");
      }
      return result;
      // No need to handle error here, it will be handled by the useAuth hook
    } finally {
      setSubmitting(false);
    }
  };

  const resetEmail = async () => {
    // We don't need to handle error here, it will be handled by the useAuth hook
    const result = await sentEmail();
    if (!result.success) return;

    setResendCooldown(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setResendCooldown(false);
    }, RESEND_COOLDOWN_MS); // 30 seconds
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copy = t.auth;

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
            {emailSent === "idle"
              ? copy.forgotPasswordTitle
              : copy.resetLinkSentHeading}
          </h1>
        </div>
      </div>
      <div className="mb-8 text-base leading-8 text-[#59636d]">
        <p>
          {emailSent === "idle"
            ? copy.forgotPasswordSubtitle
            : copy.resetLinkSentSubtitle}
        </p>
        {emailSent === "sent" && (
          <div className={`font-bold ${direction === "rtl" ? "text-right" : "text-left"}`} dir="ltr">
            {email}
          </div>
        )}
      </div>
      <div className="rounded-lg bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.045)] sm:p-6">
        {emailSent === "idle" ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700">
                {error}
              </div>
            )}
            <div>
              <label
                htmlFor="forgot-password-email"
                className="mb-2 block text-sm font-black text-[#3f4851]"
              >
                {copy.email}
              </label>
              <input
                id="forgot-password-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field h-12 rounded-lg"
                required
                placeholder="you@example.com"
                dir="ltr"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="flex h-12 w-full items-center justify-center rounded-full bg-black px-5 text-sm font-black text-white transition hover:bg-[#171717] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {copy.forgotPasswordButton}
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-2 justify-center">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700">
                {error}
              </div>
            )}
            {!resendCooldown ? (
              <>
                <p>{copy.didntReceiveEmail}</p>
                <button
                  type="button"
                  disabled={submitting}
                  className="font-bold hover:underline"
                  onClick={resetEmail}
                >
                  {submitting ? copy.sendingEmail : copy.resetLinkSentButton}
                </button>
              </>
            ) : (
              <p className="block text-center">
                {copy.resentAvailableIn}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
