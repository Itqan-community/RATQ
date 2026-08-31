import { describe, it, expect } from "vitest";
import { render, act } from "@testing-library/react";
import { ToastContainer } from "@/shared/ui/Toast";
import { LanguageProvider } from "@/shared/ui/i18n/LanguageContext";

function renderContainer(locale: "ar" | "en") {
  localStorage.setItem("ratq_locale", locale);
  const result = render(
    <LanguageProvider>
      <ToastContainer
        toasts={[{ id: 1, message: "hello", type: "info" }]}
        removeToast={() => {}}
      />
    </LanguageProvider>,
  );
  act(() => {});
  return result.container.querySelector("div[dir]") as HTMLElement;
}

describe("ToastContainer", () => {
  it("renders right-aligned with dir=rtl in Arabic", () => {
    const el = renderContainer("ar");
    expect(el.getAttribute("dir")).toBe("rtl");
    expect(el.className).toContain("right-4");
    expect(el.className).not.toContain("left-4");
  });

  it("renders left-aligned with dir=ltr in English", () => {
    const el = renderContainer("en");
    expect(el.getAttribute("dir")).toBe("ltr");
    expect(el.className).toContain("left-4");
    expect(el.className).not.toContain("right-4");
  });
});
