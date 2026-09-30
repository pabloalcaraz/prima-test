import type { ComponentProps, ReactNode } from "react";

export type BadgeVariant = "neutral" | "positive" | "negative";

export type BadgeProps = Omit<ComponentProps<"span">, "children"> & {
  variant?: BadgeVariant;
  children: ReactNode;
};
