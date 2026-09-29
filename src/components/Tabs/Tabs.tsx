import type { ComponentProps, ReactNode } from "react";
import { useId } from "react";
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
  Omit<ComponentProps<"div">, "value" | "defaultValue"> & {
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

  const getTabId = (v: string) => `${base}-tab-${sanitizeId(v)}`;
  const getPanelId = (v: string) => `${base}-panel-${sanitizeId(v)}`;

  return (
    <TabsContext.Provider value={{ variant, selectedValue, select, getTabId, getPanelId }}>
      <div className={className} {...rest}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}
