import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import type { BadgeVariant } from "../Badge/Badge.types.ts";
import { Tab } from "./Tab.tsx";
import { TabList } from "./TabList.tsx";
import { TabPanel } from "./TabPanel.tsx";
import styles from "./Tabs.stories.module.scss";
import { Tabs } from "./Tabs.tsx";
import type { TabsVariant } from "./Tabs.types.ts";

const labels = ["Emails", "Files", "Edits", "Dashboard", "Messages", "Downloads", "Documents"];
const badgeVariants: BadgeVariant[] = ["neutral", "positive", "negative"];

const keyboardTable = `
| Key | Action |
| --- | --- |
| Tab | Moves focus into the tab list (selected tab) or out to the active panel |
| ArrowRight | Moves focus to the next tab, wraps to the first |
| ArrowLeft | Moves focus to the previous tab, wraps to the last |
| Home | Moves focus to the first tab |
| End | Moves focus to the last tab |
`;

type PlaygroundArgs = {
  variant: TabsVariant;
  tabCount: number;
  badge: boolean;
  badgeLabel: string;
  badgeVariant: BadgeVariant;
};

const meta = {
  title: "Components/Tabs",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `Tabs follow the WAI-ARIA APG tabs pattern with automatic activation: moving focus with the keyboard also selects the tab, matching how a mouse click behaves. Panels stay mounted (hidden via the \`hidden\` attribute) so every \`aria-controls\` reference always resolves.\n\nUse the controls below to switch variants and add a badge to a tab. Below 768px the component switches to its mobile size; resize the browser or use the viewport toolbar to see it.\n\n${keyboardTable}`,
      },
    },
  },
  argTypes: {
    variant: {
      description: "`Tabs` prop. Visual style shared by every tab in the group.",
      options: ["pill", "underline"] satisfies TabsVariant[],
      control: { type: "inline-radio" },
      table: { defaultValue: { summary: "pill" } },
    },
    tabCount: {
      description: "Number of tabs in the example. Add enough to see the list scroll.",
      control: { type: "range", min: 2, max: labels.length, step: 1 },
    },
    badge: {
      description: "Shows a badge on the second tab through the `Tab` `badge` prop.",
      control: { type: "boolean" },
    },
    badgeLabel: {
      description: "`badge.label` on the `Tab`.",
      control: { type: "text" },
      if: { arg: "badge" },
    },
    badgeVariant: {
      description: "`badge.variant` on the `Tab`.",
      options: badgeVariants,
      control: { type: "inline-radio" },
      table: { defaultValue: { summary: "neutral" } },
      if: { arg: "badge" },
    },
  },
  args: {
    variant: "pill",
    tabCount: 5,
    badge: true,
    badgeLabel: "Warning",
    badgeVariant: "negative",
  },
} satisfies Meta<PlaygroundArgs>;

export default meta;

type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {
  render: ({ variant, tabCount, badge, badgeLabel, badgeVariant }) => {
    const visible = labels.slice(0, tabCount);
    return (
      <Tabs key={tabCount} variant={variant} defaultValue={visible[0]}>
        <TabList aria-label="Inbox">
          {visible.map((label, index) => (
            <Tab
              key={label}
              value={label}
              label={label}
              badge={
                badge && index === 1 ? { label: badgeLabel, variant: badgeVariant } : undefined
              }
            />
          ))}
        </TabList>
        {visible.map((label) => (
          <TabPanel key={label} value={label} className={styles.panel}>
            {`${label} content`}
          </TabPanel>
        ))}
      </Tabs>
    );
  },
};

export const BadgeVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Tabs variant="pill" defaultValue="neutral">
      <TabList aria-label="Badge variants">
        {badgeVariants.map((variant) => (
          <Tab
            key={variant}
            value={variant}
            label={variant.charAt(0).toUpperCase() + variant.slice(1)}
            badge={{ label: "Badge", variant }}
          />
        ))}
      </TabList>
      {badgeVariants.map((variant) => (
        <TabPanel key={variant} value={variant} className={styles.panel}>
          {`Tab with a ${variant} badge`}
        </TabPanel>
      ))}
    </Tabs>
  ),
};

function ControlledExample({ onValueChange }: { onValueChange: (value: string) => void }) {
  const [value, setValue] = useState("Emails");
  const options = labels.slice(0, 3);

  const select = (next: string) => {
    setValue(next);
    onValueChange(next);
  };

  return (
    <>
      <div className={styles.controls}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={styles.button}
            onClick={() => select(option)}
          >
            {`Select ${option}`}
          </button>
        ))}
      </div>
      <Tabs variant="pill" value={value} onValueChange={select}>
        <TabList aria-label="Controlled tabs">
          {options.map((option) => (
            <Tab key={option} value={option} label={option} />
          ))}
        </TabList>
        {options.map((option) => (
          <TabPanel key={option} value={option} className={styles.panel}>
            {`${option} content`}
          </TabPanel>
        ))}
      </Tabs>
    </>
  );
}

export const Controlled: StoryObj<{ onValueChange: (value: string) => void }> = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "The parent owns the selected value through `value` and `onValueChange`, so it can also change the tab from outside.",
      },
    },
  },
  args: { onValueChange: fn() },
  argTypes: { onValueChange: { table: { disable: true } } },
  render: ({ onValueChange }) => <ControlledExample onValueChange={onValueChange} />,
};
