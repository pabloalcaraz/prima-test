import type { PaletteKey } from "./palette.ts";

// Semantic names match Figma exactly. `onNeutral` and `inverse` share a hex
// today but are kept as distinct roles: one is a background, the other text.
export const color = {
  inverse: "navy900",
  inverseHover: "navy700",
  inverseActive: "navy500",
  onInverse: "white",
  onNeutral: "navy900",
  surface: "white",
  surfaceHover: "gray50",
  surfaceActive: "gray100",
  surfaceHigh: "gray100",
  surfacePositive: "green200",
  surfaceNegative: "red200",
  outline: "gray300",
  outlineHover: "gray400",
} as const satisfies Record<string, PaletteKey>;
