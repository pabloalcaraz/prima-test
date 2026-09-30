import type { FocusEvent, MouseEvent } from "react";
import { cx } from "../../utils/cx.ts";
import { Badge } from "../Badge/Badge.tsx";
import styles from "./Tabs.module.scss";
import type { TabProps } from "./Tabs.types.ts";
import { useTabsContext } from "./TabsContext.ts";

export function Tab({ value, children, badge, className, onClick, onFocus, ...rest }: TabProps) {
  const { variant, selectedValue, select, getTabId, getPanelId } = useTabsContext();
  const selected = selectedValue === value;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    select(value);
  };

  const handleFocus = (event: FocusEvent<HTMLButtonElement>) => {
    onFocus?.(event);
    if (event.defaultPrevented) return;
    select(value);
  };

  return (
    <button
      {...rest}
      type="button"
      role="tab"
      id={getTabId(value)}
      aria-selected={selected}
      aria-controls={getPanelId(value)}
      tabIndex={selected ? 0 : -1}
      data-variant={variant}
      className={cx(styles.tab, className)}
      onClick={handleClick}
      onFocus={handleFocus}
    >
      <span>{children}</span>
      {badge ? (
        <>
          {" "}
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </>
      ) : null}
    </button>
  );
}
