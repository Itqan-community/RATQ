"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/shared/ui/i18n";

export function VerifyEmailStatus({ token }: { token: string }) {
  const { t } = useLanguage();
  const copy = t.auth;
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState<"pending" | "failed" | "done">(
    "pending",
  );
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    void verifyEmail(token)
      .then((result) => {
        if (result.success) {
          setStatus("done");
          return;
        }
        setStatus("failed");
      })
      .catch(() => {
        setStatus("failed");
      });
  }, [token, verifyEmail]);

  const title =
    status === "pending"
      ? copy.verifyingEmailTitle
      : status === "failed"
        ? copy.invalidVerifyLink
        : copy.verifyEmailTitle;
  const subtitle =
    status === "pending"
      ? copy.verifyingEmailSubtitle
      : status === "failed"
        ? copy.invalidVerifyLinkSubtitle
        : copy.verifyEmailSuccess;

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
            {title}
          </h1>
        </div>
      </div>
      <p className="mb-8 text-base leading-8 text-[#59636d]">{subtitle}</p>
      {status === "pending" ? (
        <div className="flex justify-center py-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#171717] border-t-transparent" />
        </div>
      ) : (
        <Link
          href="/login"
          className="flex h-12 w-full items-center justify-center rounded-full bg-black px-5 text-sm font-black text-white transition hover:bg-[#171717]"
        >
          {copy.loginNow}
        </Link>
      )}
    </>
  );
}
