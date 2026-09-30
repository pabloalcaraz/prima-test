import type { ReactNode } from "react";
import type { BadgeVariant } from "../Badge/Badge.types.ts";

export type TabsVariant = "pill" | "underline";

type TabsValueProps =
  | { value: string; defaultValue?: never }
  | { value?: never; defaultValue: string };

export type TabsProps = TabsValueProps & {
  variant?: TabsVariant;
  onValueChange?: (value: string) => void;
  className?: string;
  children: ReactNode;
};

type AccessibleName =
  | { "aria-label": string; "aria-labelledby"?: never }
  | { "aria-labelledby": string; "aria-label"?: never };

export type TabListProps = AccessibleName & {
  className?: string;
  children: ReactNode;
};

export type TabBadge = {
  label: string;
  variant?: BadgeVariant;
};

export type TabProps = {
  value: string;
  badge?: TabBadge;
  className?: string;
  children: ReactNode;
};

export type TabPanelProps = {
  value: string;
  className?: string;
  children: ReactNode;
};

export type TabsContextValue = {
  variant: TabsVariant;
  selectedValue: string;
  select: (value: string) => void;
  getTabId: (value: string) => string;
  getPanelId: (value: string) => string;
};
