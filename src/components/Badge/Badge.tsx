import { cx } from "../../utils/cx.ts";
import styles from "./Badge.module.scss";
import type { BadgeProps } from "./Badge.types.ts";

export function Badge({ variant = "neutral", label, className }: BadgeProps) {
  return (
    <span className={cx(styles.badge, className)} data-variant={variant}>
      {label}
    </span>
  );
}
