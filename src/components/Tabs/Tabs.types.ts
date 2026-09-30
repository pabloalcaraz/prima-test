import type { ReactNode } from "react";
import type { BadgeVariant } from "../Badge/Badge.types.ts";

export type TabsVariant = "pill" | "underline";

type ControlledProps = {
  value: string;
  onValueChange: (value: string) => void;
  defaultValue?: never;
};

type UncontrolledProps = {
  defaultValue: string;
  onValueChange?: (value: string) => void;
  value?: never;
};

export type TabsProps = (ControlledProps | UncontrolledProps) & {
  variant?: TabsVariant;
  children: ReactNode;
};

type AccessibleName =
  | { "aria-label": string; "aria-labelledby"?: never }
  | { "aria-labelledby": string; "aria-label"?: never };

export type TabListProps = AccessibleName & {
  children: ReactNode;
};

export type TabBadge = {
  label: string;
  variant?: BadgeVariant;
};

export type TabProps = {
  value: string;
  label: string;
  badge?: TabBadge;
};

export type TabPanelProps = {
  value: string;
  children: ReactNode;
};

export type TabsContextValue = {
  variant: TabsVariant;
  selectedValue: string;
  select: (value: string) => void;
  getTabId: (value: string) => string;
  getPanelId: (value: string) => string;
};
