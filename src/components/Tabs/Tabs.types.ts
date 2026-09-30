import type { ComponentProps, ReactNode } from "react";
import type { BadgeVariant } from "../Badge/Badge.types.ts";

export type TabsVariant = "pill" | "underline";

type TabsValueProps =
  | { value: string; defaultValue?: never }
  | { value?: never; defaultValue: string };

export type TabsProps = TabsValueProps &
  Omit<ComponentProps<"div">, "value" | "defaultValue"> & {
    variant?: TabsVariant;
    onValueChange?: (value: string) => void;
    children: ReactNode;
  };

type AccessibleName =
  | { "aria-label": string; "aria-labelledby"?: never }
  | { "aria-labelledby": string; "aria-label"?: never };

export type TabListProps = Omit<ComponentProps<"div">, "role"> & AccessibleName;

export type TabBadge = {
  label: string;
  variant?: BadgeVariant;
};

type ManagedTabProps =
  | "id"
  | "role"
  | "type"
  | "value"
  | "disabled"
  | "aria-selected"
  | "aria-controls"
  | "tabIndex";

export type TabProps = Omit<ComponentProps<"button">, ManagedTabProps> & {
  value: string;
  children: ReactNode;
  badge?: TabBadge;
};

type ManagedTabPanelProps = "id" | "role" | "aria-labelledby" | "tabIndex" | "hidden";

export type TabPanelProps = Omit<ComponentProps<"div">, ManagedTabPanelProps> & {
  value: string;
};

export type TabsContextValue = {
  variant: TabsVariant;
  selectedValue: string;
  select: (value: string) => void;
  getTabId: (value: string) => string;
  getPanelId: (value: string) => string;
};
