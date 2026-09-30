export type BadgeVariant = "neutral" | "positive" | "negative";

export type BadgeProps = {
  variant?: BadgeVariant;
  label: string;
  className?: string;
};
