import { createContext, useContext } from "react";

export type TabsVariant = "pill" | "underline";

export interface TabsContextValue {
  variant: TabsVariant;
  selectedValue: string;
  select: (value: string) => void;
  getTabId: (value: string) => string;
  getPanelId: (value: string) => string;
}

export const TabsContext = createContext<TabsContextValue | null>(null);

export function useTabsContext(): TabsContextValue {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error(
      "Tabs components (TabList, Tab, TabPanel) must be rendered inside a <Tabs> root.",
    );
  }
  return context;
}
