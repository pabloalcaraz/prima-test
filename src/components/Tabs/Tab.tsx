import type { ComponentProps, FocusEvent, MouseEvent, ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import { Badge, type BadgeVariant } from "../Badge/index.ts";
import styles from "./Tabs.module.scss";
import { useTabsContext } from "./TabsContext.ts";

export interface TabBadge {
  /** Badge text. It becomes part of the tab's accessible name. */
  label: ReactNode;
  /** Badge colour, `neutral` by default. */
  variant?: BadgeVariant;
}

export type TabProps = Omit<
  ComponentProps<"button">,
  "role" | "type" | "value" | "disabled" | "aria-selected" | "aria-controls" | "tabIndex"
> & {
  /** Unique value linking the tab to the `TabPanel` with the same value. */
  value: string;
  /** Tab label. */
  children: ReactNode;
  /** Optional badge shown after the label, e.g. `{ label: "Warning", variant: "negative" }`. */
  badge?: TabBadge;
};

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
      {...rest}
    >
      <span className={styles.label}>{children}</span>
      {badge ? (
        <>
          {" "}
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </>
      ) : null}
    </button>
  );
}
