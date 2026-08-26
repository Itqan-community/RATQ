'use client';

import { useLanguage } from "@/shared/ui/i18n";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ForgotPasswordForm } from "@/modules/auth/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  const { t, direction } = useLanguage();
  const { user, loading, clearError } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  if (loading || user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#171717] border-t-transparent" />
      </div>
    );
  }
  const copy = t.auth;

  return (
    <main
      className="page-enter bg-white pb-20 pt-32 text-black"
      dir={direction}
    >
      <section className="mx-auto w-fit max-w-full px-4 sm:px-6">
        <div className="flex items-start justify-center min-h-[29.6rem] overflow-hidden rounded-2xl border border-[#ededed] bg-[#fafafa] shadow-[0_16px_44px_rgba(15,23,42,0.05)]">
          <div className="px-6 py-10 sm:px-6 lg:px-6">
          <div className="w-full max-w-[500px]">
              <ForgotPasswordForm/>
              <p className="mt-6 text-center text-sm text-[#6f7780]">
                {copy.rememberPassword}{" "}
                <Link
                  href="/login"
                  className="font-black text-[#171717] transition hover:text-black"
                >
                  {copy.loginNow}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
