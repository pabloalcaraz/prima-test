export const radius = {
  "2xs": 8,
  xs: 12,
  full: 100,
} as const;

export type RadiusKey = keyof typeof radius;
