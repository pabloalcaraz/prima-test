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
pnpm dev             # small demo page (src/index.tsx), for a quick manual check
pnpm test            # vitest
pnpm check           # biome lint + format check
pnpm tsc             # typecheck (project references)
pnpm tokens          # regenerate src/styles/tokens.css from src/tokens
pnpm build-storybook # static Storybook build (storybook-static/)
```

`pnpm tokens:check` regenerates the tokens and fails if the output differs
from what is committed. That is what catches a token change that someone
forgot to regenerate.

## Project structure

```
scripts/generate-tokens.ts   token source -> src/styles/tokens.css
src/
  tokens/                    token source of truth (palette, color, spacing, radius, typography, breakpoints)
  styles/                    tokens.css (generated), global reset, scss breakpoint mixin
  foundations/               Storybook docs pages for the tokens above
  components/
    Badge/
    Tabs/
  index.ts                   public exports
  index.tsx                  dev playground (pnpm dev)
```

## Design tokens

Tokens are defined once, in TypeScript, under `src/tokens`. A small script
(`scripts/generate-tokens.ts`, run with Node's native TypeScript support)
reads those files and writes `src/styles/tokens.css` as CSS custom
properties. Components only ever read the CSS variables; Storybook's
Foundations pages import the same TypeScript objects, so the docs and the
generated CSS cannot drift apart. This is the same idea as Style Dictionary,
without adding a dependency for a token set this small.

Two layers:

- **Primitives** (`palette.ts`): raw color values, our own names
  (`navy900`, `gray100`...).
- **Semantic** (`color.ts`): role-based names taken directly from the Figma
  file (`inverse`, `surfaceHover`, `onNeutral`...), each pointing at a
  primitive. Components only reference semantic tokens, so remapping a role
  is a one-line change.

`onNeutral` and `inverse` currently resolve to the same hex value but are
kept as two separate tokens: one is text color, the other a background. If
the palette changes and they diverge, nothing downstream needs to be touched.

Units: spacing and font sizes are emitted in `rem` (px / 16), so layout
scales with the user's root font size. Hairlines stay in pixels: the 1px
pill border, the 2px focus ring, the 3px underline indicator, and radius
values (radius describes a shape, not a length meant to scale with type
size).

Breakpoint: `mobile` is `768`, defined once in `breakpoints.ts` and mirrored
in `src/styles/_breakpoints.scss` (`$mobile-max`), since CSS custom
properties can't be used inside a media query. The two files carry a comment
pointing at each other.

## Components API

### `Tabs`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"pill" \| "underline"` | `"pill"` | Visual style applied to every tab in the group. |
| `value` | `string` | - | Selected tab, for controlled usage. Pair it with `onValueChange`. Excludes `defaultValue`. |
| `defaultValue` | `string` | - | Initial tab, for uncontrolled usage. Excludes `value`. |
| `onValueChange` | `(value: string) => void` | - | Called when the user selects a different tab. Not called again for the tab that is already selected. |
| `children` | `ReactNode` | - | `TabList` and `TabPanel` elements. |

`value`/`defaultValue` are a discriminated union: TypeScript requires exactly
one of the two, so it is not possible to render `Tabs` without a starting
selection.

### `TabList`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `aria-label` | `string` | - | Accessible name for the tab list. Required unless `aria-labelledby` is set. |
| `aria-labelledby` | `string` | - | Accessible name by reference. Required unless `aria-label` is set. |

Plus the rest of the native `div` props. TypeScript enforces that at least
one of the two labeling props is present.

### `Tab`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | - | Links this tab to the `TabPanel` with the same value. |
| `children` | `ReactNode` | - | Tab label. |
| `badge` | `{ label: ReactNode; variant?: BadgeVariant }` | - | Renders a `Badge` after the label. |

Plus native `button` props, minus the ones the component manages itself
(`role`, `type`, `value`, `disabled`, `aria-selected`, `aria-controls`,
`tabIndex`).

### `TabPanel`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | - | Value of the `Tab` this panel belongs to. |

Plus native `div` props.

### `Badge`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"neutral" \| "positive" \| "negative"` | `"neutral"` | Background color. |
| `children` | `ReactNode` | - | Label text. |

Plus native `span` props (minus `children`, which is required and typed
separately).

All exports are named exports (`Tab`, `TabList`, `TabPanel`, `Tabs`, `Badge`)
rather than dot notation (`Tabs.List`). Named exports are tree-shakable
without extra bundler configuration and keep each component's own prop types
simple to reference on their own.

## Accessibility

Tabs follow the [WAI-ARIA APG tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
with **automatic activation**: moving keyboard focus to a tab selects it
immediately, the same way a click does. This matches how most tab
implementations already behave and keeps the interaction model simple. The
alternative (manual activation, selecting only on Enter/Space) is listed
under Next steps in case it is ever needed for a panel with an expensive
render.

| Key | Action |
| --- | --- |
| `Tab` | Moves focus into the tab list (lands on the selected tab) or out to the active panel |
| `ArrowRight` | Moves focus to the next tab, wraps to the first |
| `ArrowLeft` | Moves focus to the previous tab, wraps to the last |
| `Home` | Moves focus to the first tab |
| `End` | Moves focus to the last tab |

Other decisions:

- **Roving tabindex.** Only the selected tab has `tabIndex={0}`; the rest
  have `tabIndex={-1}`. `Tab` from outside the list lands on the selected
  tab, not the first one.
- **Keyboard handling lives in `TabList`**, not in a shared registration
  context. On `ArrowLeft`/`ArrowRight`/`Home`/`End` it queries its own DOM
  for `[role="tab"]` and moves focus directly. This is simpler than keeping
  an ordered list of registered tabs in sync, and the order always matches
  what is actually rendered, since it comes straight from the DOM.
- **Panels stay mounted.** `TabPanel` renders unconditionally and toggles the
  native `hidden` attribute instead of unmounting. Every `aria-controls`
  reference always resolves to a real element, and panel-local state (scroll
  position, form input, etc.) survives switching tabs. The trade-off is that
  inactive panel content still exists in the DOM.
- **Styling reads `aria-selected`, not a separate CSS class.** The look of a
  selected tab (`[aria-selected="true"]` in `Tabs.module.scss`) can't drift
  from what is semantically selected, because there is only one source of
  truth for that state.
- **Badge text is part of the tab's accessible name.** A tab with a badge
  like "Files" + "Warning" gets the accessible name "Files Warning" for free,
  since the badge is plain text inside the `button`. No extra ARIA wiring
  needed, and it reads naturally with a screen reader.
- **Focus ring:** `:focus-visible` only (not on `:focus`), 2px solid ring in
  `--ds-color-inverse`, 2px offset. The tab list has 4px of padding with a
  matching negative margin so the ring doesn't get clipped by
  `overflow-x: auto`.
- **Hover styles are wrapped in `@media (hover: hover)`**, so touch devices
  don't get a sticky hover state after tapping.
- **`prefers-reduced-motion: reduce`** turns off the color transitions on
  tabs and the underline indicator.
- **`TabList` requires an accessible name at the type level.** `aria-label`
  and `aria-labelledby` are a discriminated union, so omitting both is a
  compile error, not something caught by an a11y linter later.
- Inter is self-hosted via `@fontsource-variable/inter`, so there is no
  request to Google Fonts.

## Responsive

"Mobile" is a CSS media query (`max-width: 768px`), not a component prop.
Below that width, tabs shrink (height 50px -> 42px, tighter padding and
gaps) and the badge gets smaller padding and radius. The tab list scrolls
horizontally when tabs overflow (`overflow-x: auto`, scrollbar hidden), no
scroll affordance yet (see Next steps).

## Decisions and trade-offs

- **DOM query over a registration context for keyboard navigation.** A
  context that tracks registered tabs would work too, but adds a moving
  part (registration/unregistration on mount/unmount) to keep in sync with
  something the DOM already knows. Querying `[role="tab"]` inside the
  `TabList` on each key press is a few lines and cannot get out of sync.
- **Panels always mounted.** See Accessibility above. Chosen over
  conditional rendering because it removes a whole class of "my
  `aria-controls` points nowhere" bugs, at the cost of some inactive DOM.
- **Named exports over `Tabs.List` / `Tabs.Tab` dot notation.** Both work;
  named exports were simpler to type here since `TabsProps` is itself a
  union (controlled vs uncontrolled), and attaching that to a namespace
  object made the types harder to read at the call site.
- **No Icon or Timer props.** The Figma `Tab` component exposes `Icon` and
  `Timer` toggles, but neither has a visual spec (icon set, sizing, timer
  format), so they are left out rather than guessed. See Next steps.
- **No disabled state, no vertical orientation, no manual activation mode.**
  None of these appear in the Figma file for this component, so they were
  not built. The APG pattern and the current architecture (context + DOM
  query) support adding them later without a rewrite.
- **No Tailwind, no headless UI library.** Required by the brief. Styling is
  SCSS Modules driven entirely by the CSS custom properties from the token
  layer.

## Testing

14 tests, `vitest` + Testing Library, no snapshots. Coverage is chosen for
behavior, not line count.

`Tabs.test.tsx` (10 tests):

- ARIA wiring: tablist has its accessible name, every tab's `aria-controls`
  matches its panel's id, every panel's `aria-labelledby` matches its tab's
  id.
- `defaultValue` selects the right tab and shows only its panel.
- Click switches selection and panel.
- `ArrowRight`/`ArrowLeft` move focus and selection together, and wrap at
  both ends.
- `Home`/`End` jump to the first/last tab.
- Roving tabindex: only the selected tab is reachable by `Tab`, and pressing
  `Tab` from it moves focus to its panel.
- Controlled mode: clicking a tab calls `onValueChange` but the selection
  only changes if the parent updates `value`.
- Badge renders inside the tab, is part of its accessible name, and carries
  the right `variant`.
- Using `Tab` outside `Tabs` throws a clear error instead of crashing on a
  missing context.
- `onValueChange` fires once per real selection change, and not again when
  focus/click lands on the tab that is already selected.

`Badge.test.tsx` (4 tests): renders its label, defaults to `neutral`, and
applies `positive`/`negative` when passed.

## Next steps

- Icon and Timer support on `Tab` (present as component properties in
  Figma, no visual spec provided).
- Disabled tab state.
- Vertical orientation.
- Manual activation mode (select on Enter/Space instead of on focus), for
  cases where switching tabs is expensive.
- Scroll affordance (arrows or edge fade) for an overflowing tab list on
  desktop, where the horizontal scroll is less discoverable than on touch.
- Visual regression tests against the Storybook stories.
- Publish this as a versioned package instead of a source-only repository.
