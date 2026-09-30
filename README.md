# Tabs Design System

A `Tabs` component with pill and underline variants, plus a standalone `Badge`
component that can be attached to a tab. Built for the Prima front-end
take-home test.

Live Storybook: https://pabloalcaraz.github.io/prima-test/

## Getting started

Requires Node >=24. The package manager is pnpm, pinned via `packageManager`
in `package.json` (corepack picks it up automatically).

```bash
pnpm install

pnpm storybook       # component docs and playgrounds, http://localhost:6006
pnpm test            # vitest
pnpm check           # biome lint + format check
pnpm tsc             # typecheck (project references)
pnpm build-storybook # static Storybook build (storybook-static/)
```

## Project structure

```
src/
  styles/        tokens.css, global reset, scss breakpoint mixin
  components/
    Badge/
    Tabs/
  index.ts       public exports
```

## Design tokens

Tokens are CSS custom properties in `src/styles/tokens.css`, in two layers:

- **Primitives** (`--ds-palette-*`): raw color values, our own names
  (`navy900`, `gray100`...).
- **Semantic** (`--ds-color-*`): role-based names taken from the Figma file
  (`inverse`, `surfaceHover`, `onNeutral`...), each pointing at a primitive.
  Components only reference semantic tokens, so remapping a role is a
  one-line change.

`onNeutral` and `inverse` resolve to the same hex but stay separate tokens:
one is text color, the other a background.

Spacing and font sizes are in `rem`, so layout scales with the user's root
font size. Hairlines (1px border, 2px focus ring, 3px underline) and radius
stay in pixels. Tab heights (50px, 42px on mobile) are component sizes, not
spacing tokens, so they live as local custom properties in `Tabs.module.scss`.

The mobile breakpoint (768px) is a SCSS mixin in `_breakpoints.scss`, since
CSS custom properties can't be used inside a media query.

## Components API

### `Tabs`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"pill" \| "underline"` | `"pill"` | Visual style applied to every tab in the group. |
| `value` | `string` | - | Selected tab, for controlled usage. Pair it with `onValueChange`. Excludes `defaultValue`. |
| `defaultValue` | `string` | - | Initial tab, for uncontrolled usage. Excludes `value`. |
| `onValueChange` | `(value: string) => void` | - | Called when the user selects a different tab. |
| `children` | `ReactNode` | - | `TabList` and `TabPanel` elements. |

`value`/`defaultValue` are a discriminated union: TypeScript requires exactly
one of the two.

### `TabList`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `aria-label` | `string` | - | Accessible name for the tab list. Required unless `aria-labelledby` is set. |
| `aria-labelledby` | `string` | - | Accessible name by reference. Required unless `aria-label` is set. |

Plus native `div` props. Omitting both labeling props is a compile error.

### `Tab`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | - | Links this tab to the `TabPanel` with the same value. |
| `children` | `ReactNode` | - | Tab label. |
| `badge` | `{ label: ReactNode; variant?: BadgeVariant }` | - | Renders a `Badge` after the label. |

Plus native `button` props, minus the ones the component manages (`id`,
`role`, `type`, `value`, `disabled`, `aria-selected`, `aria-controls`,
`tabIndex`).

### `TabPanel`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | - | Value of the `Tab` this panel belongs to. |

Plus native `div` props, minus the managed ones (`id`, `role`,
`aria-labelledby`, `tabIndex`, `hidden`).

### `Badge`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"neutral" \| "positive" \| "negative"` | `"neutral"` | Background color. |
| `children` | `ReactNode` | - | Label text. |

Plus native `span` props.

## Accessibility

Tabs follow the [WAI-ARIA APG tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
with **automatic activation**: moving keyboard focus to a tab selects it, the
same way a click does.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the tab list (lands on the selected tab) or out to the active panel |
| `ArrowRight` | Moves focus to the next tab, wraps to the first |
| `ArrowLeft` | Moves focus to the previous tab, wraps to the last |
| `Home` | Moves focus to the first tab |
| `End` | Moves focus to the last tab |

- **Roving tabindex.** Only the selected tab has `tabIndex={0}`.
- **Styling reads `aria-selected`**, so the selected look can't drift from
  the semantic state.
- **Badge text is part of the tab's accessible name** ("Files Warning"),
  since it is plain text inside the `button`.
- **Focus ring** on `:focus-visible` only: 2px, `--ds-color-inverse`, 2px
  offset. The tab list has 4px padding with a matching negative margin so
  `overflow-x: auto` doesn't clip it.
- **Hover styles live in `@media (hover: hover)`**, so touch devices don't
  get a sticky hover after tapping.
- Inter is self-hosted via `@fontsource-variable/inter`.

## Responsive

"Mobile" is a media query (`max-width: 768px`), not a prop. Below it, tabs
shrink (50px -> 42px, tighter padding and gaps) and the badge gets smaller
padding and radius. The tab list scrolls horizontally when tabs overflow:
the scrollbar is hidden on touch screens and thin with a mouse, where there
is no other obvious way to reach hidden tabs.

## Decisions and trade-offs

- **Keyboard navigation queries the DOM.** On arrow/Home/End, `TabList`
  looks up its own `[role="tab"]` elements. A registration context would
  work too, but adds mount/unmount bookkeeping for something the DOM already
  knows, and the order always matches what is rendered.
- **Panels stay mounted**, toggled with the native `hidden` attribute. Every
  `aria-controls` always resolves and panel state survives switching tabs, at
  the cost of inactive DOM.
- **Named exports over `Tabs.List` dot notation.** `TabsProps` is a union
  (controlled vs uncontrolled), which is harder to read when attached to a
  namespace object.
- **Only what is in Figma.** No Icon or Timer props (no visual spec), no
  disabled state, no vertical orientation, no manual activation.
- **No Tailwind, no headless UI library**, as required by the brief. SCSS
  Modules on top of the token custom properties.

## Testing

`vitest` + Testing Library, no snapshots. Tests cover behavior: ARIA wiring,
selection by click and keyboard (arrows with wrap, Home/End), roving
tabindex and focus moving to the panel, controlled mode, `onValueChange`
firing once per change, the badge inside the tab's accessible name, and
Badge variants.

## Next steps

- Icon and Timer support on `Tab`.
- Disabled tab state and vertical orientation.
- Manual activation mode (select on Enter/Space) for expensive panels.
- Scroll affordance (arrows or edge fade) for an overflowing tab list.
- Visual regression tests against the Storybook stories.
