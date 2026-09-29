// Registers jest-dom matchers (toBeVisible, toHaveAttribute...) on Vitest's expect.
import "@testing-library/jest-dom/vitest";

// jsdom has no layout engine, so Element.scrollIntoView is not implemented.
// TabList calls it on keyboard navigation; stub it so those tests don't throw.
Element.prototype.scrollIntoView ??= function scrollIntoView() {};
