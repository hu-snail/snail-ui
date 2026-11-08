# SnFloatingToc — AI-Friendly Component Description

> A floating table of contents pinned to the page edge: a compact rail of bars
> that tracks the scroll position and expands into a clickable section list on
> hover, focus or click.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

Give readers of a long document a persistent, low-noise wayfinding control:
the rail shows where they are, the expanded panel jumps anywhere. Typical use:
docs pages, changelogs, long-form articles, legal terms.

## Reference Library

naive-ui has no equivalent, so this is an additive AUI component (per
AGENTS.md §112.3a) and mirrors **HeroUI Pro `FloatingToc`**
(https://heroui.pro/docs/react/components/floating-toc) 1:1:

| HeroUI Pro part       | AUI component          |
| --------------------- | ---------------------- |
| `FloatingToc`         | `SnFloatingToc`        |
| `FloatingToc.Trigger` | `SnFloatingTocTrigger` |
| `FloatingToc.Bar`     | `SnFloatingTocBar`     |
| `FloatingToc.Content` | `SnFloatingTocContent` |
| `FloatingToc.Item`    | `SnFloatingTocItem`    |

## Import

```ts
import {
  SnFloatingToc,
  SnFloatingTocTrigger,
  SnFloatingTocBar,
  SnFloatingTocContent,
  SnFloatingTocItem,
} from '@snui/vue-web';
```

## SnFloatingToc Props

| Name              | Type                      | Default     | Description                                                                                                                                                                               |
| ----------------- | ------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `placement`       | `'left' \| 'right'`       | `'right'`   | Side of the page the TOC sits on; bars grow outward from it.                                                                                                                              |
| `triggerMode`     | `'hover' \| 'press'`      | `'hover'`   | `hover` opens on pointer / focus entry with delays; `press` toggles on click.                                                                                                             |
| `hoverAction`     | `'open' \| 'preview'`     | `'open'`    | What resting the pointer on the rail does. `open` expands the full panel (HeroUI behaviour); `preview` shows a single section's title + summary and leaves the panel to click / keyboard. |
| `open`            | `boolean`                 | `undefined` | Controlled open state. Omit it to keep the TOC uncontrolled.                                                                                                                              |
| `defaultOpen`     | `boolean`                 | `false`     | Initial open state when uncontrolled.                                                                                                                                                     |
| `openDelay`       | `number`                  | `200`       | Milliseconds before opening after hover / focus (hover mode).                                                                                                                             |
| `closeDelay`      | `number`                  | `300`       | Milliseconds before closing after pointer / focus leaves (hover mode).                                                                                                                    |
| `scrollContainer` | `string \| HTMLElement`   | `undefined` | Scroll container. Auto-detected from the sections' nearest scrollable ancestor, else the document.                                                                                        |
| `bound`           | `number`                  | `0`         | Distance in px below the container top at which a section counts as active. Positive delays the switch, negative advances it.                                                             |
| `onOpenChange`    | `(open: boolean) => void` | `undefined` | Fired whenever the open state changes.                                                                                                                                                    |

## SnFloatingTocBar Props

| Name      | Type      | Default     | Description                                                                                         |
| --------- | --------- | ----------- | --------------------------------------------------------------------------------------------------- |
| `href`    | `string`  | `''`        | Section anchor (`'#intro'`). Also the registry key for the section.                                 |
| `title`   | `string`  | `''`        | Label shown for this section in the expanded panel.                                                 |
| `level`   | `number`  | `1`         | Nesting depth, 1 = top level. Deeper levels render shorter bars.                                    |
| `summary` | `string`  | `''`        | One-line summary for the hover preview; falls back to the section element's text (first 120 chars). |
| `active`  | `boolean` | `undefined` | Force the active highlight. When omitted the root decides from scroll.                              |

## SnFloatingTocContent Props

| Name        | Type                | Default     | Description                                                       |
| ----------- | ------------------- | ----------- | ----------------------------------------------------------------- |
| `offset`    | `number`            | `8`         | Distance in px between the rail and the panel.                    |
| `placement` | `'left' \| 'right'` | `undefined` | Side the panel opens towards. Defaults to the root's `placement`. |
| `ariaLabel` | `string`            | `undefined` | Accessible name of the panel (`role="dialog"`).                   |

## SnFloatingTocItem Props

| Name     | Type      | Default     | Description                                                            |
| -------- | --------- | ----------- | ---------------------------------------------------------------------- |
| `href`   | `string`  | `''`        | Section anchor this entry navigates to.                                |
| `title`  | `string`  | `''`        | Label. Falls back to the matching bar's `title` via the root registry. |
| `level`  | `number`  | `1`         | Nesting depth, 1 = top level. Deeper levels are indented.              |
| `active` | `boolean` | `undefined` | Force the active highlight.                                            |

## SnFloatingTocTrigger Props

None — it only wires pointer, focus and keyboard handling. Native `span`
attributes pass through.

## Events

| Name          | Payload   | Description         |
| ------------- | --------- | ------------------- |
| `open-change` | `boolean` | Open state changed. |

## Slots

| Component | Slot      | Description                             |
| --------- | --------- | --------------------------------------- |
| root      | `default` | Trigger + Content.                      |
| trigger   | `default` | The bar indicators.                     |
| bar       | `default` | Custom bar content (replaces the line). |
| content   | `default` | The section entries.                    |
| item      | `default` | Custom label (defaults to `title`).     |

## Exposed

| Component | Name         | Type                      | Description                                                     |
| --------- | ------------ | ------------------------- | --------------------------------------------------------------- |
| root      | `activeHref` | `string \| null`          | `href` of the section currently in view.                        |
| root      | `preview`    | `object \| null`          | The bar card currently shown; `null` once the panel takes over. |
| root      | `setOpen`    | `(open: boolean) => void` | Open / close the panel programmatically.                        |
| root      | `refresh`    | `() => void`              | Re-measure section offsets.                                     |

## Behaviour

- The active section is the last one whose viewport top crossed the `bound`
  line; before anything crosses it, the first section wins so the indicator is
  never blank.
- Hover mode arms the open timer on pointer enter / focus and the close timer
  on leave / blur. A leave before the delay elapses cancels the open.
- In hover mode a pointer _click_ on the trigger only opens — the pointer has
  normally already opened the panel on entry, so a click confirms rather than
  dismisses. `Enter` / `Space` keep toggling in both modes.
- Press mode ignores hover entirely and toggles on click, `Enter` or `Space`.
- `hoverAction` picks between two mutually exclusive hover behaviours, so the
  panel and the single-bar card never stack on screen:
  - `open` (default): hovering the rail expands the full panel; no card.
  - `preview`: hovering a single bar shows a card with that section's title and
    summary (`summary` prop, else the section's own text, collapsed to one line
    and cut at 120 characters) and the panel stays shut until a click. Keyboard
    focus still opens the full panel in both modes, so nothing is
    pointer-only. The card is `pointer-events: none` and disappears as soon as
    the panel expands; while the panel is open the card is suppressed at the
    source, so the two overlays can never stack.
- Keyboard: `Enter` / `Space` toggle, `Escape` closes (from the trigger or the
  panel), `ArrowUp` / `ArrowDown` walk the sections and scroll to them.
- Clicking a bar or an item scrolls the section into view and highlights it
  immediately, before the smooth scroll lands.
- The scroll listener is registered in the capture phase so nested scrollers
  are seen; an `IntersectionObserver` re-measures on layout changes that emit
  no scroll event.
- Every listener, observer and timer is released on unmount.

## Notes on divergence

- `href` / `title` are AUI additions on Bar and Item: the HeroUI React parts
  read the section from their React tree, which in Vue would need a provider
  per section. The bar is the section registration here.
- `scrollContainer` and `bound` are AUI additions; `bound` keeps SnAnchor's
  name and sign convention so a page can use both.
- The panel is not teleported; it stays inside the fixed root subtree, so no
  portal container is needed.
- `hoverAction: 'preview'`, the per-bar summary card (`summary` + derived text)
  and `--floating-toc-preview-width` are AUI additions — HeroUI's Bar has no
  tooltip, and its hover always expands the panel.

## §112 future markers

- The rail geometry (`width`, `max-width`, `max-height` of the panel) beyond
  the HeroUI CSS variables is hard-coded from library tokens rather than a
  component token layer; `SnConfigProvider` does not model a
  `FloatingTocTheme` yet.
- HeroUI's RAC `Popover` gives the panel automatic collision flipping and
  `aria-controls` wiring; this version relies on CSS placement and does not
  flip when the viewport is narrow.

## Tokens Consumed (end: web)

| Token                                | Use                                     |
| ------------------------------------ | --------------------------------------- |
| `--sn-web-color-action-primary`      | Active bar and active item colour.      |
| `--sn-web-color-border-default`      | Inactive bar colour; panel border.      |
| `--sn-web-color-background-elevated` | Panel background.                       |
| `--sn-web-color-background-subtle`   | Item background on hover.               |
| `--sn-web-color-background-overlay`  | Item background on press.               |
| `--sn-web-color-text-primary`        | Item label on hover.                    |
| `--sn-web-color-text-secondary`      | Default item label.                     |
| `--sn-web-color-text-disabled`       | Disabled item label.                    |
| `--sn-web-font-size-sm`              | Item label size.                        |
| `--sn-web-font-family-body`          | Item label family.                      |
| `--sn-web-font-weight-medium`        | Active item weight.                     |
| `--sn-web-font-line-height-normal`   | Item line height.                       |
| `--sn-web-shadow-lg`                 | Panel shadow.                           |
| `--sn-web-radius-sm`                 | Trigger focus ring radius; item radius. |
| `--sn-web-radius-lg`                 | Panel radius.                           |
| `--sn-web-radius-full`               | Bar cap radius.                         |
| `--sn-web-spacing-1`                 | Item vertical padding.                  |
| `--sn-web-spacing-2`                 | Panel padding; item horizontal padding. |
| `--sn-web-spacing-6`                 | Distance from the viewport edge.        |
| `--sn-web-focus-ring`                | `:focus-visible` outline.               |

Host-overridable CSS variables on `.sn-floating-toc` (HeroUI parity):
`--floating-toc-bar-width` (16px), `--floating-toc-bar-active-width` (24px),
`--floating-toc-bar-height` (2px), `--floating-toc-bar-level-step` (3px),
`--floating-toc-bar-gap` (12px), `--floating-toc-item-indent` (0.75rem),
`--floating-toc-content-width` (224px) — plus the AUI addition
`--floating-toc-preview-width` (232px) for the hover preview — and
`--floating-toc-color-bar`, `--floating-toc-color-active`.

## Accessibility

- Root renders `<nav aria-label="Table of contents">`, so the rail is a
  landmark with a name.
- Trigger is `role="button"`, `tabindex="0"`, `aria-haspopup="dialog"`,
  `aria-expanded`. `:focus-visible` draws a focus ring.
- Panel is `role="dialog"`; pass `aria-label` (or `aria-labelledby`) to name it.
- Items are real `<button type="button">` elements and carry
  `aria-current="location"` when active.
- The collapsed bars are decorative (`aria-hidden`): they are a pointer
  affordance, and the equivalent keyboard path is the trigger's arrow keys
  plus the panel entries. They add no tab stops.
- `prefers-reduced-motion: reduce` turns the smooth section scroll into an
  instant jump.
- Disabled items keep `aria-disabled` / `disabled` semantics from the host.

## AI Patch Boundary

| Field          | Patchable | Notes                                           |
| -------------- | --------- | ----------------------------------------------- |
| `placement`    | yes       | `left` / `right`.                               |
| `triggerMode`  | yes       | `hover` / `press`.                              |
| `openDelay`    | yes       | Non-negative ms.                                |
| `closeDelay`   | yes       | Non-negative ms.                                |
| `bound`        | yes       | Any finite number.                              |
| `defaultOpen`  | yes       | Uncontrolled initial state only.                |
| `default` slot | no        | Composition is authored, not patched.           |
| registry sizes | no        | Internal measurement state — never AI-writable. |
| `activeHref`   | no        | Derived from the scroll position (read-only).   |

## Versioning

`@snui/vue-web` — initial release. Part of AUI-WEB-NAV-010 (M1 navigation Web
components).
