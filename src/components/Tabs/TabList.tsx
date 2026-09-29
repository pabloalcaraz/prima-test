import type { ComponentProps, KeyboardEvent } from "react";
import { cx } from "../../utils/cx.ts";
import styles from "./Tabs.module.scss";
import { useTabsContext } from "./TabsContext.ts";

type AccessibleName =
  | { "aria-label": string; "aria-labelledby"?: never }
  | { "aria-labelledby": string; "aria-label"?: never };

export type TabListProps = Omit<ComponentProps<"div">, "role"> & AccessibleName;

function focusTab(tabs: HTMLButtonElement[], index: number): void {
  const tab = tabs[index];
  if (!tab) return;
  tab.focus();
  tab.scrollIntoView({ block: "nearest", inline: "nearest" });
}

export function TabList({ className, onKeyDown, ...rest }: TabListProps) {
  const { variant } = useTabsContext();

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    const tabs = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
    );
    if (tabs.length === 0) return;

    const currentIndex = tabs.indexOf(document.activeElement as HTMLButtonElement);

    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        focusTab(tabs, currentIndex === -1 ? 0 : (currentIndex + 1) % tabs.length);
        break;
      case "ArrowLeft":
        event.preventDefault();
        focusTab(tabs, currentIndex === -1 ? 0 : (currentIndex - 1 + tabs.length) % tabs.length);
        break;
      case "Home":
        event.preventDefault();
        focusTab(tabs, 0);
        break;
      case "End":
        event.preventDefault();
        focusTab(tabs, tabs.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div
      {...rest}
      role="tablist"
      className={cx(styles.list, className)}
      data-variant={variant}
      onKeyDown={handleKeyDown}
    />
  );
}
