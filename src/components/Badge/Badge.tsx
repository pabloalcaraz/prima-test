import styles from "./Badge.module.scss";
import type { BadgeProps } from "./Badge.types.ts";

export function Badge({ variant = "neutral", label }: BadgeProps) {
  return (
    <span className={styles.badge} data-variant={variant}>
      {label}
    </span>
  );
}
