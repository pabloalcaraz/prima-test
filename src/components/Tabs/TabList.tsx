import type { KeyboardEvent } from "react";
import { cx } from "../../utils/cx.ts";
import styles from "./Tabs.module.scss";
import type { TabListProps } from "./Tabs.types.ts";
import { useTabsContext } from "./TabsContext.ts";

function focusTab(tabs: HTMLButtonElement[], index: number): void {
  const tab = tabs[index];
  if (!tab) return;
  tab.focus();
  tab.scrollIntoView({ block: "nearest", inline: "nearest" });
}

export function TabList({ className, children, ...labelProps }: TabListProps) {
  const { variant } = useTabsContext();

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
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
      {...labelProps}
      role="tablist"
      className={cx(styles.list, className)}
      data-variant={variant}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}
