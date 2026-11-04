const SPINNER =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-circle w-4 h-4 animate-spin text-current shrink-0"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>';

/** The live demo forms fake a ~600ms round trip: button disabled with a spinner, then the result appears. */
export const FAKE_LATENCY_MS = 600;

export function showLoading(btn: HTMLButtonElement | null | undefined, replaceIcon: boolean) {
  if (!btn) return;
  btn.disabled = true;
  if (replaceIcon) btn.querySelector("svg")?.remove();
  btn.insertAdjacentHTML("afterbegin", SPINNER);
}
