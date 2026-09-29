import type { ComponentProps, ReactNode } from "react";
import { useEffect, useId, useRef } from "react";
import { TabsContext, type TabsVariant } from "./TabsContext.ts";
import { useControllableState } from "./useControllableState.ts";

export type { TabsVariant };

type TabsValueProps =
  | {
      /** Selected tab value. Pass it together with `onValueChange` to control the component. */
      value: string;
      defaultValue?: never;
    }
  | {
      value?: never;
      /** Initially selected tab value when the component manages its own state. */
      defaultValue: string;
    };

export type TabsProps = TabsValueProps &
  Omit<ComponentProps<"div">, "value" | "defaultValue" | "ref"> & {
    /** Visual style shared by every tab in the group. */
    variant?: TabsVariant;
    /** Called with the new value whenever the user selects a different tab. */
    onValueChange?: (value: string) => void;
    children: ReactNode;
  };

function sanitizeId(value: string): string {
  return value.replace(/\s+/g, "-");
}

export function Tabs({
  variant = "pill",
  value,
  defaultValue,
  onValueChange,
  className,
  children,
  ...rest
}: TabsProps) {
  const base = useId();
  const [selectedValue, select] = useControllableState({
    value,
    defaultValue: defaultValue ?? value,
    onChange: onValueChange,
  });

  const rootRef = useRef<HTMLDivElement>(null);
  const warnedValue = useRef<string | null>(null);

  const getTabId = (v: string) => `${base}-tab-${sanitizeId(v)}`;
  const getPanelId = (v: string) => `${base}-panel-${sanitizeId(v)}`;

  // A selected value with no matching Tab leaves every tab out of the Tab
  // order and every panel hidden. Surface it during development instead of
  // failing silently.
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const root = rootRef.current;
    const hasTabs = root?.querySelector('[role="tab"]');
    const hasSelection = root?.querySelector('[role="tab"][aria-selected="true"]');
    if (hasTabs && !hasSelection && warnedValue.current !== selectedValue) {
      warnedValue.current = selectedValue;
      console.warn(`Tabs: the selected value "${selectedValue}" does not match any Tab.`);
    }
  });

  return (
    <TabsContext.Provider value={{ variant, selectedValue, select, getTabId, getPanelId }}>
      <div {...rest} ref={rootRef} className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}
