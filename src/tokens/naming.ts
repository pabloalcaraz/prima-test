// Shared naming helpers for the token -> CSS variable pipeline. Used by both
// the generator (scripts/generate-tokens.ts) and the Storybook foundations
// pages, so docs and generated CSS can never drift from each other.

export function camelToKebab(value: string): string {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

export function cssVar(group: string, key: string): string {
  return `--ds-${group}-${camelToKebab(key)}`;
}

// px -> rem (base 16px), trimmed of trailing zeros. Zero stays unitless.
export function pxToRem(px: number): string {
  if (px === 0) return "0";
  const rem = Number((px / 16).toFixed(4));
  return `${rem}rem`;
}
