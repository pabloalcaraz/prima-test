import { useId } from "react";
import type { TabsProps } from "./Tabs.types.ts";
import { TabsContext } from "./TabsContext.ts";
import { useControllableState } from "./useControllableState.ts";

function sanitizeId(value: string): string {
  return value.replace(/\s+/g, "-");
}

export function Tabs({
  variant = "pill",
  value,
  defaultValue,
  onValueChange,
  children,
  ...rest
}: TabsProps) {
  const base = useId();
  const [selectedValue, select] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  const getTabId = (v: string) => `${base}-tab-${sanitizeId(v)}`;
  const getPanelId = (v: string) => `${base}-panel-${sanitizeId(v)}`;

  return (
    <TabsContext.Provider value={{ variant, selectedValue, select, getTabId, getPanelId }}>
      <div {...rest}>{children}</div>
    </TabsContext.Provider>
  );
}
