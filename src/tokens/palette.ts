export const palette = {
  white: "#FFFFFF",
  navy900: "#1B2134",
  navy700: "#343A4E",
  navy500: "#585D71",
  gray50: "#F6F6FA",
  gray100: "#F1F1F7",
  gray300: "#D3D3DC",
  gray400: "#C4C5CF",
  green200: "#B1FFC7",
  red200: "#FFBFB1",
} as const;

export type PaletteKey = keyof typeof palette;
