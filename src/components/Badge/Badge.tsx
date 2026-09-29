import type { ComponentProps, ReactNode } from "react";
import { cx } from "../../utils/cx.ts";
import styles from "./Badge.module.scss";

export type BadgeVariant = "neutral" | "positive" | "negative";

export interface BadgeProps extends Omit<ComponentProps<"span">, "children"> {
  variant?: BadgeVariant;
  children: ReactNode;
}

export function Badge({ variant = "neutral", className, children, ...rest }: BadgeProps) {
  return (
    <span className={cx(styles.badge, className)} data-variant={variant} {...rest}>
      {children}
    </span>
  );
}
