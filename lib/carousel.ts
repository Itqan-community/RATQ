import type { CSSProperties } from "react";

const N = 7;

// --dir is -1 in RTL and +1 in LTR (globals.css): the stack recedes toward the inline-end side.
// Positions measured from the live site's steady states: active card centred, next three recede
// (x -70, z -180 per step, dimmer and blurrier), the other three wait hidden on the opposite side.
export function cardStyle(index: number, active: number): CSSProperties {
  const k = (((index - active) % N) + N) % N;
  const base = { width: "265px", height: "320px", borderRadius: "20px" };
  if (k <= 3) {
    return {
      ...base,
      transform: `translate(-50%, -50%) scale(1) translateX(calc(var(--dir) * ${70 * k}px)) translateZ(${-180 * k}px) rotateY(calc(var(--dir) * ${k ? 16 : 0}deg))`,
      opacity: 1,
      filter: `brightness(${+(1 - 0.16 * k).toFixed(2)}) blur(${+(1.25 * k).toFixed(2)}px)`,
      zIndex: 2000 - 20 * k,
      pointerEvents: "auto",
    };
  }
  const f = N - k;
  return {
    ...base,
    transform: `translate(-50%, -50%) scale(1) translateX(calc(var(--dir) * ${-70 * f}px)) translateZ(${180 * f}px) rotateY(0deg)`,
    opacity: 0,
    filter: "brightness(1) blur(0px)",
    zIndex: 2000 + 20 * f,
    pointerEvents: "none",
  };
}

export const wrap = (n: number) => ((n % N) + N) % N;
