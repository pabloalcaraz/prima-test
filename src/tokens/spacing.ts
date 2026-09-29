export const spacing = {
  "0": 0,
  "4xs": 2,
  "3xs": 4,
  "2xs": 8,
  xs: 12,
  s: 16,
  m: 20,
  l: 24,
  xl: 32,
  "2xl": 48,
} as const;

export type SpacingKey = keyof typeof spacing;
