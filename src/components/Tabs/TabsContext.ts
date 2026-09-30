import { createContext, useContext } from "react";
import type { TabsContextValue } from "./Tabs.types.ts";

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
