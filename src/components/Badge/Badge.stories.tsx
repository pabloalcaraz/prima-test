import type { Meta, StoryObj } from "@storybook/react-vite";
import styles from "./Badge.stories.module.scss";
import { Badge, type BadgeVariant } from "./Badge.tsx";

const variants: BadgeVariant[] = ["neutral", "positive", "negative"];

const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A small label for status or metadata. The label is plain text content, so screen readers announce it exactly as written, with no extra role or state.",
      },
    },
  },
  argTypes: {
    variant: {
      options: variants,
      control: { type: "select" },
    },
  },
  args: {
    variant: "neutral",
    children: "Label",
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

// Docs-only overview; the Playground covers each variant in the sidebar.
export const Variants: Story = {
  tags: ["!dev"],
  parameters: { controls: { disable: true } },
  render: () => (
    <div className={styles.row}>
      {variants.map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant.charAt(0).toUpperCase() + variant.slice(1)}
        </Badge>
      ))}
    </div>
  ),
};
