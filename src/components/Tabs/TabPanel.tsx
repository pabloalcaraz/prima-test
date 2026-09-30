import { cx } from "../../utils/cx.ts";
import styles from "./Tabs.module.scss";
import type { TabPanelProps } from "./Tabs.types.ts";
import { useTabsContext } from "./TabsContext.ts";

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
