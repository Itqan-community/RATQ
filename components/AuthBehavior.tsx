"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setRole } from "@/lib/role";
import { FAKE_LATENCY_MS, showLoading } from "@/lib/form-loading";

// The four quick-login buttons on /auth/sign-in: label order in the markup -> persona and landing page.
const QUICK: { role: "developer" | "publisher_owner" | "reviewer" | "admin"; to: string }[] = [
  { role: "developer", to: "/app" },
  { role: "publisher_owner", to: "/publisher" },
  { role: "reviewer", to: "/review" },
  { role: "admin", to: "/admin" },
];

/** Demo sign-in: any valid submit logs in as the developer; the quick buttons pick a role. No credentials are checked or stored. */
export function AuthBehavior() {
  const router = useRouter();
  useEffect(() => {
    const main = document.querySelector("main");
    const form = main?.querySelector("form");
    if (!main || !form) return;
    const submit = (e: Event) => {
      e.preventDefault();
      showLoading(form.querySelector<HTMLButtonElement>("button[type=submit]"), true);
      window.setTimeout(() => { setRole("developer"); router.push("/app"); }, FAKE_LATENCY_MS);
    };
    form.addEventListener("submit", submit);
    const quick = [...main.querySelectorAll<HTMLButtonElement>("button[type=button]")].slice(-4);
    const offs = quick.map((b, i) => {
      const f = () => { setRole(QUICK[i].role); router.push(QUICK[i].to); };
      b.addEventListener("click", f);
      return () => b.removeEventListener("click", f);
    });
    return () => { form.removeEventListener("submit", submit); offs.forEach((f) => f()); };
  }, [router]);
  return null;
}
