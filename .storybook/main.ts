import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: (viteConfig) => ({
    ...viteConfig,
    server: {
      ...viteConfig.server,
      // The static build output lives in the project root; watching it while a
      // build runs locks its files on Windows and crashes the dev server.
      watch: { ...viteConfig.server?.watch, ignored: ["**/storybook-static/**"] },
    },
  }),
};
export default config;
