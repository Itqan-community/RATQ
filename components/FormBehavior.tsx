"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { setRole } from "@/lib/role";
import states from "@/lib/form-states.json";
import { FAKE_LATENCY_MS, showLoading } from "@/lib/form-loading";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** innerHTML of the <main> inside a captured state (a constant from our own capture, not user input). */
const inner = (html: string) => {
  const t = document.createElement("template");
  t.innerHTML = html;
  return (t.content.firstElementChild as HTMLElement).innerHTML;
};

/**
 * Demo behaviour for the public forms, mirroring the live site: nothing is sent anywhere.
 * /auth/forgot and /contact swap in their success card; /auth/sign-up logs in as the demo developer.
 */
export function FormBehavior() {
  const path = usePathname();
  const router = useRouter();
  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    const original = main.innerHTML;
    const teardown: (() => void)[] = [];

    const links = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a[href^='/']");
      if (a) { e.preventDefault(); router.push(a.getAttribute("href")!); }
    };
    main.addEventListener("click", links);
    teardown.push(() => main.removeEventListener("click", links));

    const wire = () => {
      const form = main.querySelector("form");
      if (!form) return;
      const onSubmit = (e: Event) => {
        e.preventDefault();
        const btn = form.querySelector<HTMLButtonElement>("button[type=submit]") ?? ([...form.querySelectorAll("button")].pop() as HTMLButtonElement | undefined);
        showLoading(btn, path.startsWith("/auth/sign"));
        const email = form.querySelector<HTMLInputElement>("input[type=email]")?.value ?? "";
        window.setTimeout(() => {
          if (path === "/auth/sign-up") { setRole("developer"); router.push("/app"); return; }
          const state = path === "/contact" ? states.contact : states.forgot.replace("demo@example.com", esc(email));
          main.innerHTML = inner(state);
          // "Send another message" restores the form; other links are handled by the click delegate above.
          if (path === "/contact") {
            const again = [...main.querySelectorAll("button")].pop();
            again?.addEventListener("click", () => { main.innerHTML = original; wire(); });
          }
        }, FAKE_LATENCY_MS);
      };
      form.addEventListener("submit", onSubmit);
    };
    wire();
    return () => teardown.forEach((f) => f());
  }, [path, router]);
  return null;
}
