import type { Meta, StoryObj } from "@storybook/react-vite";
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

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--ds-space-2xs)" }}>
      {variants.map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant.charAt(0).toUpperCase() + variant.slice(1)}
        </Badge>
      ))}
    </div>
  ),
};
