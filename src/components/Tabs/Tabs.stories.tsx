import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import type { BadgeVariant } from "../Badge/index.ts";
import { Tab } from "./Tab.tsx";
import { TabList } from "./TabList.tsx";
import { TabPanel } from "./TabPanel.tsx";
import styles from "./Tabs.stories.module.scss";
import { Tabs, type TabsVariant } from "./Tabs.tsx";

const variants: TabsVariant[] = ["pill", "underline"];
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

// Typed with an annotation rather than `satisfies`: TabsProps is a union with
// required children, which would force every story to provide dummy args.
const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `Tabs follow the WAI-ARIA APG tabs pattern with automatic activation: moving focus with the keyboard also selects the tab, matching how a mouse click behaves. Panels stay mounted (hidden via the \`hidden\` attribute) so every \`aria-controls\` reference always resolves.\n\n${keyboardTable}`,
      },
    },
  },
  subcomponents: { TabList, Tab, TabPanel },
};

export default meta;

type Story = StoryObj<typeof Tabs>;

interface PlaygroundArgs {
  variant: TabsVariant;
  tabCount: number;
  withBadge: boolean;
  badgeVariant: BadgeVariant;
  badgeLabel: string;
}

export const Playground: StoryObj<PlaygroundArgs> = {
  argTypes: {
    variant: { options: variants, control: { type: "select" } },
    tabCount: { control: { type: "range", min: 1, max: 8, step: 1 } },
    withBadge: { control: { type: "boolean" } },
    badgeVariant: { options: badgeVariants, control: { type: "select" } },
    badgeLabel: { control: { type: "text" } },
  },
  args: {
    variant: "pill",
    tabCount: 4,
    withBadge: false,
    badgeVariant: "neutral",
    badgeLabel: "New",
  },
  render: ({ variant, tabCount, withBadge, badgeVariant, badgeLabel }) => {
    const tabs = Array.from({ length: tabCount }, (_, index) => `tab-${index + 1}`);
    return (
      <Tabs variant={variant} defaultValue={tabs[0]}>
        <TabList aria-label="Playground tabs">
          {tabs.map((value, index) => (
            <Tab
              key={value}
              value={value}
              badge={withBadge ? { label: badgeLabel, variant: badgeVariant } : undefined}
            >
              {`Label ${index + 1}`}
            </Tab>
          ))}
        </TabList>
        {tabs.map((value, index) => (
          <TabPanel key={value} value={value} className={styles.panelContent}>
            <p className={styles.placeholder}>{`Content for label ${index + 1}`}</p>
          </TabPanel>
        ))}
      </Tabs>
    );
  },
};

export const Pill: Story = {
  render: () => (
    <Tabs variant="pill" defaultValue="one">
      <TabList aria-label="Pill tabs">
        <Tab value="one">Label</Tab>
        <Tab value="two">Label</Tab>
        <Tab value="three">Label</Tab>
        <Tab value="four">Label</Tab>
        <Tab value="five">Label</Tab>
      </TabList>
      <TabPanel value="one" className={styles.panelContent}>
        Panel one
      </TabPanel>
      <TabPanel value="two" className={styles.panelContent}>
        Panel two
      </TabPanel>
      <TabPanel value="three" className={styles.panelContent}>
        Panel three
      </TabPanel>
      <TabPanel value="four" className={styles.panelContent}>
        Panel four
      </TabPanel>
      <TabPanel value="five" className={styles.panelContent}>
        Panel five
      </TabPanel>
    </Tabs>
  ),
};

export const Underline: Story = {
  render: () => (
    <Tabs variant="underline" defaultValue="one">
      <TabList aria-label="Underline tabs">
        <Tab value="one">Label</Tab>
        <Tab value="two">Label</Tab>
        <Tab value="three">Label</Tab>
        <Tab value="four">Label</Tab>
        <Tab value="five">Label</Tab>
      </TabList>
      <TabPanel value="one" className={styles.panelContent}>
        Panel one
      </TabPanel>
      <TabPanel value="two" className={styles.panelContent}>
        Panel two
      </TabPanel>
      <TabPanel value="three" className={styles.panelContent}>
        Panel three
      </TabPanel>
      <TabPanel value="four" className={styles.panelContent}>
        Panel four
      </TabPanel>
      <TabPanel value="five" className={styles.panelContent}>
        Panel five
      </TabPanel>
    </Tabs>
  ),
};

export const WithBadge: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--ds-space-l)" }}>
      {variants.map((variant) => (
        <Tabs key={variant} variant={variant} defaultValue="emails">
          <TabList aria-label={`${variant} tabs with badges`}>
            <Tab value="emails">Emails</Tab>
            <Tab value="files" badge={{ label: "Warning", variant: "negative" }}>
              Files
            </Tab>
            <Tab value="edits">Edits</Tab>
            <Tab value="dashboard">Dashboard</Tab>
            <Tab value="messages">Messages</Tab>
          </TabList>
          <TabPanel value="emails" className={styles.panelContent}>
            Emails panel
          </TabPanel>
          <TabPanel value="files" className={styles.panelContent}>
            Files panel
          </TabPanel>
          <TabPanel value="edits" className={styles.panelContent}>
            Edits panel
          </TabPanel>
          <TabPanel value="dashboard" className={styles.panelContent}>
            Dashboard panel
          </TabPanel>
          <TabPanel value="messages" className={styles.panelContent}>
            Messages panel
          </TabPanel>
        </Tabs>
      ))}
    </div>
  ),
};

export const BadgeVariants: Story = {
  render: () => (
    <Tabs variant="pill" defaultValue="neutral">
      <TabList aria-label="Tabs with every badge variant">
        <Tab value="neutral" badge={{ label: "Neutral", variant: "neutral" }}>
          Neutral
        </Tab>
        <Tab value="positive" badge={{ label: "Positive", variant: "positive" }}>
          Positive
        </Tab>
        <Tab value="negative" badge={{ label: "Negative", variant: "negative" }}>
          Negative
        </Tab>
      </TabList>
      <TabPanel value="neutral" className={styles.panelContent}>
        Neutral panel
      </TabPanel>
      <TabPanel value="positive" className={styles.panelContent}>
        Positive panel
      </TabPanel>
      <TabPanel value="negative" className={styles.panelContent}>
        Negative panel
      </TabPanel>
    </Tabs>
  ),
};

function ControlledDemo({ onValueChange }: { onValueChange: (value: string) => void }) {
  const [value, setValue] = useState("emails");
  const tabs = ["emails", "files", "edits"];

  const handleChange = (next: string) => {
    setValue(next);
    onValueChange(next);
  };

  return (
    <div>
      <div className={styles.controlledBar}>
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={styles.controlledButton}
            onClick={() => handleChange(tab)}
          >
            {`Select ${tab}`}
          </button>
        ))}
      </div>
      <Tabs variant="pill" value={value} onValueChange={handleChange}>
        <TabList aria-label="Controlled tabs">
          <Tab value="emails">Emails</Tab>
          <Tab value="files">Files</Tab>
          <Tab value="edits">Edits</Tab>
        </TabList>
        <TabPanel value="emails" className={styles.panelContent}>
          Emails panel
        </TabPanel>
        <TabPanel value="files" className={styles.panelContent}>
          Files panel
        </TabPanel>
        <TabPanel value="edits" className={styles.panelContent}>
          Edits panel
        </TabPanel>
      </Tabs>
    </div>
  );
}

export const Controlled: StoryObj<{ onValueChange: (value: string) => void }> = {
  args: {
    onValueChange: fn(),
  },
  render: ({ onValueChange }) => <ControlledDemo onValueChange={onValueChange} />,
};

const skeletonIds = ["a", "b", "c", "d", "e", "f"];

function SwitchingContentDemo({ variant }: { variant: TabsVariant }) {
  return (
    <Tabs variant={variant} defaultValue="emails">
      <TabList aria-label="Inbox">
        <Tab value="emails">Emails</Tab>
        <Tab value="files" badge={{ label: "Warning", variant: "negative" }}>
          Files
        </Tab>
        <Tab value="edits">Edits</Tab>
        <Tab value="downloads">Downloads</Tab>
        <Tab value="documents">Documents</Tab>
      </TabList>
      <TabPanel value="emails" className={styles.panelContent}>
        <div className={styles.rowList}>
          {skeletonIds.map((id) => (
            <div key={`row-${id}`} className={styles.skeletonRow} />
          ))}
        </div>
      </TabPanel>
      <TabPanel value="files" className={styles.panelContent}>
        <div className={styles.cardGrid}>
          {skeletonIds.map((id) => (
            <div key={`card-${id}`} className={styles.skeletonCard} />
          ))}
        </div>
      </TabPanel>
      <TabPanel value="edits" className={styles.panelContent}>
        <p className={styles.placeholder}>Edits panel</p>
      </TabPanel>
      <TabPanel value="downloads" className={styles.panelContent}>
        <p className={styles.placeholder}>Downloads panel</p>
      </TabPanel>
      <TabPanel value="documents" className={styles.panelContent}>
        <p className={styles.placeholder}>Documents panel</p>
      </TabPanel>
    </Tabs>
  );
}

export const SwitchingContent: Story = {
  render: () => <SwitchingContentDemo variant="pill" />,
};

// Viewport globals only apply on the story page, not inline in the docs page.
export const Mobile: Story = {
  tags: ["!autodocs"],
  globals: {
    viewport: { value: "mobile1", isRotated: false },
  },
  render: () => <SwitchingContentDemo variant="pill" />,
};

// Kept out of the docs page so its play function doesn't steal focus there.
export const Keyboard: Story = {
  tags: ["!autodocs"],
  render: () => (
    <Tabs variant="pill" defaultValue="one">
      <TabList aria-label="Keyboard demo tabs">
        <Tab value="one">One</Tab>
        <Tab value="two">Two</Tab>
        <Tab value="three">Three</Tab>
      </TabList>
      <TabPanel value="one" className={styles.panelContent}>
        Panel one
      </TabPanel>
      <TabPanel value="two" className={styles.panelContent}>
        Panel two
      </TabPanel>
      <TabPanel value="three" className={styles.panelContent}>
        Panel three
      </TabPanel>
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole("tab", { name: "One" });
    const second = canvas.getByRole("tab", { name: "Two" });

    first.focus();
    await expect(first).toHaveFocus();
    await expect(first).toHaveAttribute("aria-selected", "true");

    await userEvent.keyboard("{ArrowRight}");
    await expect(second).toHaveFocus();
    await expect(second).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByText("Panel two")).toBeVisible();

    await userEvent.keyboard("{ArrowLeft}");
    await expect(first).toHaveFocus();
    await expect(first).toHaveAttribute("aria-selected", "true");
  },
};
