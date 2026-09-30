import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge, type BadgeVariant } from "./Badge.tsx";

describe("Badge", () => {
  it("defaults to the neutral variant", () => {
    render(<Badge>Label</Badge>);
    expect(screen.getByText("Label")).toHaveAttribute("data-variant", "neutral");
  });

  it.each<BadgeVariant>(["positive", "negative"])("applies the %s variant", (variant) => {
    render(<Badge variant={variant}>Label</Badge>);
    expect(screen.getByText("Label")).toHaveAttribute("data-variant", variant);
  });
});
