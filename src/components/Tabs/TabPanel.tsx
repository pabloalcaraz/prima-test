import type { ComponentProps } from "react";
import { cx } from "../../utils/cx.ts";
import styles from "./Tabs.module.scss";
import { useTabsContext } from "./TabsContext.ts";

type ManagedTabPanelProps = "id" | "role" | "aria-labelledby" | "tabIndex" | "hidden";

export type TabPanelProps = Omit<ComponentProps<"div">, ManagedTabPanelProps> & {
  /** Value of the `Tab` that shows this panel. */
  value: string;
};

export function TabPanel({ value, className, ...rest }: TabPanelProps) {
  const { selectedValue, getTabId, getPanelId } = useTabsContext();
  const selected = selectedValue === value;

  return (
    <div
      {...rest}
      role="tabpanel"
      id={getPanelId(value)}
      aria-labelledby={getTabId(value)}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: WAI-ARIA APG tabpanel must be reachable by Tab when it has no focusable content
      tabIndex={0}
      hidden={!selected}
      className={cx(styles.panel, className)}
    />
  );
}
