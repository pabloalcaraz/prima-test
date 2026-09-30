import { Badge } from "../Badge/Badge.tsx";
import styles from "./Tabs.module.scss";
import type { TabProps } from "./Tabs.types.ts";
import { useTabsContext } from "./TabsContext.ts";

export function Tab({ value, label, badge }: TabProps) {
  const { variant, selectedValue, select, getTabId, getPanelId } = useTabsContext();
  const selected = selectedValue === value;

  return (
    <button
      type="button"
      role="tab"
      id={getTabId(value)}
      aria-selected={selected}
      aria-controls={getPanelId(value)}
      tabIndex={selected ? 0 : -1}
      data-variant={variant}
      className={styles.tab}
      onClick={() => select(value)}
      onFocus={() => select(value)}
    >
      <span>{label}</span>
      {badge ? (
        <>
          {" "}
          <Badge variant={badge.variant} label={badge.label} />
        </>
      ) : null}
    </button>
  );
}
