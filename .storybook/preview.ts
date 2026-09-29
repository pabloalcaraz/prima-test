import "@fontsource-variable/inter";
import "../src/styles/tokens.css";
import "../src/styles/global.scss";

import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ["Introduction", "Foundations", ["Colors", "Typography", "Spacing"], "Components"],
      },
    },
  },
};

export default preview;
