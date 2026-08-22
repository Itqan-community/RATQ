'use client';

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/shared/ui/i18n";
import { useAuth } from "@/hooks/useAuth";
import { ResetPasswordForm } from "@/modules/auth/components/ResetPasswordForm";
import Image from "next/image";

function ResetPasswordInner() {
  const { t, direction } = useLanguage();
  const { user, loading } = useAuth();
  const router = useRouter();
  const token = useSearchParams().get("token");
  const copy = t.auth;

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#171717] border-t-transparent" />
      </div>
    );
  }

  return (
    <main
      className="page-enter bg-white pb-20 pt-32 text-black"
      dir={direction}
    >
      <section className="mx-auto w-fit max-w-full px-4 sm:px-6">
        <div className="flex min-h-[29.6rem] items-start justify-center overflow-hidden rounded-2xl border border-[#ededed] bg-[#fafafa] shadow-[0_16px_44px_rgba(15,23,42,0.05)]">
          <div className="px-8 py-10">
            <div className="w-full max-w-[440px]">
              {token ? <ResetPasswordForm token={token} /> : (
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
                        {copy.invalidResetLink}
                      </h1>
                    </div>
                  </div>
                  <p className="mb-8 text-base leading-8 text-[#59636d]">
                    {copy.invalidResetLinkSubtitle}
                  </p>
                  <Link
                    href={"/forgot-password"}
                    className="flex h-12 w-full items-center justify-center rounded-full bg-black px-5 text-sm font-black text-white transition hover:bg-[#171717] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                      {copy.requestNewResetLink}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#171717] border-t-transparent" />
        </div>
      }
    >
      <ResetPasswordInner />
    </Suspense>
  );
}
