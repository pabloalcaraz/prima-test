import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Tab } from "./Tab.tsx";
import { TabList } from "./TabList.tsx";
import { TabPanel } from "./TabPanel.tsx";
import { Tabs } from "./Tabs.tsx";

interface RenderTabsOptions {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  withBadge?: boolean;
}

function renderTabs(options: RenderTabsOptions = {}) {
  const { onValueChange, withBadge } = options;
  const children = (
    <>
      <TabList aria-label="Inbox">
        <Tab value="emails">Emails</Tab>
        <Tab
          value="files"
          badge={withBadge ? { label: "Warning", variant: "negative" } : undefined}
        >
          Files
        </Tab>
        <Tab value="edits">Edits</Tab>
      </TabList>
      <TabPanel value="emails">Emails panel</TabPanel>
      <TabPanel value="files">Files panel</TabPanel>
      <TabPanel value="edits">Edits panel</TabPanel>
    </>
  );

  if (options.value !== undefined) {
    return render(
      <Tabs value={options.value} onValueChange={onValueChange}>
        {children}
      </Tabs>,
    );
  }
  return render(
    <Tabs defaultValue={options.defaultValue ?? "emails"} onValueChange={onValueChange}>
      {children}
    </Tabs>,
  );
}

// Hidden panels are excluded from accessible-name computation, so they can't
// be looked up with getByRole(..., { name }). Follow the tab's aria-controls
// to the panel element instead, regardless of its current visibility.
function getPanelForTab(tabName: string): HTMLElement {
  const tab = screen.getByRole("tab", { name: tabName });
  const panelId = tab.getAttribute("aria-controls");
  const panel = panelId ? document.getElementById(panelId) : null;
  if (!panel) throw new Error(`No panel found for tab "${tabName}"`);
  return panel;
}

describe("Tabs", () => {
  it("wires roles, accessible name and aria-controls/aria-labelledby", () => {
    renderTabs();
    expect(screen.getByRole("tablist", { name: "Inbox" })).toBeInTheDocument();

    for (const name of ["Emails", "Files", "Edits"]) {
      const tab = screen.getByRole("tab", { name });
      const panel = getPanelForTab(name);
      expect(tab).toHaveAttribute("aria-controls", panel.id);
      expect(panel).toHaveAttribute("aria-labelledby", tab.id);
    }
  });

  it("selects the defaultValue tab and shows only its panel", () => {
    renderTabs({ defaultValue: "files" });
    expect(screen.getByRole("tab", { name: "Files" })).toHaveAttribute("aria-selected", "true");
    expect(getPanelForTab("Files")).toBeVisible();
    expect(getPanelForTab("Emails")).not.toBeVisible();
    expect(getPanelForTab("Edits")).not.toBeVisible();
  });

  it("switches selection and panel on click", async () => {
    const user = userEvent.setup();
    renderTabs();

    await user.click(screen.getByRole("tab", { name: "Edits" }));

    expect(screen.getByRole("tab", { name: "Edits" })).toHaveAttribute("aria-selected", "true");
    expect(getPanelForTab("Edits")).toBeVisible();
    expect(getPanelForTab("Emails")).not.toBeVisible();
  });

  it("moves selection with ArrowRight/ArrowLeft and wraps at the edges", async () => {
    const user = userEvent.setup();
    renderTabs();
    screen.getByRole("tab", { name: "Emails" }).focus();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Files" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Files" })).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "Emails" })).toHaveFocus();

    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "Edits" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Edits" })).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Emails" })).toHaveFocus();
  });

  it("moves selection to the first/last tab with Home/End", async () => {
    const user = userEvent.setup();
    renderTabs();
    screen.getByRole("tab", { name: "Files" }).focus();

    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Edits" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Edits" })).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "Emails" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Emails" })).toHaveAttribute("aria-selected", "true");
  });

  it("keeps a roving tabindex and moves focus to the panel on Tab", async () => {
    const user = userEvent.setup();
    renderTabs();

    expect(screen.getByRole("tab", { name: "Emails" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("tab", { name: "Files" })).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("tab", { name: "Edits" })).toHaveAttribute("tabindex", "-1");

    screen.getByRole("tab", { name: "Emails" }).focus();
    await user.tab();

    expect(getPanelForTab("Emails")).toHaveFocus();
  });

  it("in controlled mode calls onValueChange but keeps the fixed value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderTabs({ value: "emails", onValueChange });

    await user.click(screen.getByRole("tab", { name: "Files" }));

    expect(onValueChange).toHaveBeenCalledWith("files");
    expect(screen.getByRole("tab", { name: "Emails" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Files" })).toHaveAttribute("aria-selected", "false");
  });

  it("renders a badge inside the tab, part of the accessible name, with its variant", () => {
    renderTabs({ withBadge: true });

    const filesTab = screen.getByRole("tab", { name: "Files Warning" });
    expect(within(filesTab).getByText("Warning")).toHaveAttribute("data-variant", "negative");
  });

  it("throws a helpful error when a Tab is used outside Tabs", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Tab value="lonely">Lonely</Tab>)).toThrow(
      /must be rendered inside a <Tabs> root/,
    );

    consoleError.mockRestore();
  });

  it("fires onValueChange exactly once per user selection, and not for the already-selected tab", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderTabs({ onValueChange });

    await user.click(screen.getByRole("tab", { name: "Files" }));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith("files");

    await user.click(screen.getByRole("tab", { name: "Files" }));
    expect(onValueChange).toHaveBeenCalledTimes(1);

    onValueChange.mockClear();
    screen.getByRole("tab", { name: "Files" }).blur();
    screen.getByRole("tab", { name: "Files" }).focus();
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
