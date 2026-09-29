import { create } from "storybook/theming";
import { palette } from "../src/tokens/palette.ts";
import { fontFamily } from "../src/tokens/typography.ts";

export const theme = create({
  base: "light",
  brandTitle: "Tabs Design System",

  fontBase: fontFamily.base,

  colorPrimary: palette.navy900,
  colorSecondary: palette.navy900,

  appBg: palette.white,
  appContentBg: palette.white,
  appPreviewBg: palette.white,
  appBorderColor: palette.gray300,
  appBorderRadius: 4,

  textColor: palette.navy900,
  textInverseColor: palette.white,

  barBg: palette.white,
  barTextColor: palette.navy500,
  barSelectedColor: palette.navy900,
  barHoverColor: palette.navy700,

  inputBg: palette.white,
  inputBorder: palette.gray300,
  inputTextColor: palette.navy900,
  inputBorderRadius: 4,
});
