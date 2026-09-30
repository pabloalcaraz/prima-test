import "@fontsource-variable/inter";
import "../src/styles/tokens.css";
import "./preview.scss";

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
        order: ["Introduction", "Components"],
      },
    },
  },
};

export default preview;
