# FloatingToc (Web)

`SnFloatingToc` is a table of contents pinned to the page edge. Collapsed, it is a rail of short bars that tracks the scroll position and highlights the current section; hover, focus or click expands it into a clickable section list.

## When to use

- Long documents, specs and terms pages need an always-available wayfinding control.
- The body area is too narrow for a permanent sidebar, so the TOC floats over the edge.

Avoid it on pages short enough not to scroll.

## Examples

### Basic

The rail follows the scroll container and expands on hover.

<Demo name="floating-toc-web-basic" description="Rail tracks scrolling; hover expands the section list" />

### Placements and trigger modes

`placement` decides which edge the rail sits on; `trigger-mode="press"` switches to click-to-open.

<Demo name="floating-toc-web-placements" description="Left with hover, right with press" />

### Hierarchical

`level` shortens deeper bars and indents panel entries to express the outline.

<Demo name="floating-toc-web-hierarchical" description="Levels 1 / 2 / 3" />

### Controlled

Pass `open` to own the expanded state; `open-change` reports every change.

<Demo name="floating-toc-web-controlled" description="Controlled open with open-change" />

## Composition

`SnFloatingToc` is a compound component:

```vue
<SnFloatingToc placement="right">
  <SnFloatingTocTrigger>
    <SnFloatingTocBar href="#intro" title="Intro" />
    <SnFloatingTocBar href="#usage" title="Usage" :level="2" />
  </SnFloatingTocTrigger>
  <SnFloatingTocContent aria-label="On this page">
    <SnFloatingTocItem href="#intro" />
    <SnFloatingTocItem href="#usage" :level="2" />
  </SnFloatingTocContent>
</SnFloatingToc>
```

| Part                   | Responsibility                                                            |
| ---------------------- | ------------------------------------------------------------------------- |
| `SnFloatingToc`        | Root: open state, placement, delays, section registry, scroll measurement |
| `SnFloatingTocTrigger` | Pointer / focus / keyboard interaction target for the rail                |
| `SnFloatingTocBar`     | One indicator line; also the section registration (`href` / `title`)      |
| `SnFloatingTocContent` | The expanded floating panel                                               |
| `SnFloatingTocItem`    | A clickable entry inside the panel                                        |

## API

### SnFloatingToc Props

| Name              | Type                      | Default     | Description                                                                                                          |
| ----------------- | ------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------- |
| `placement`       | `'left' \| 'right'`       | `'right'`   | Edge the rail sits on.                                                                                               |
| `triggerMode`     | `'hover' \| 'press'`      | `'hover'`   | `hover` opens on pointer / focus after a delay; `press` toggles on click.                                            |
| `open`            | `boolean`                 | `undefined` | Controlled open state. Omit to stay uncontrolled.                                                                    |
| `defaultOpen`     | `boolean`                 | `false`     | Initial open state when uncontrolled.                                                                                |
| `openDelay`       | `number`                  | `200`       | Milliseconds before opening after hover / focus (hover mode only).                                                   |
| `closeDelay`      | `number`                  | `300`       | Milliseconds before closing after pointer / focus leaves (hover mode only).                                          |
| `scrollContainer` | `string \| HTMLElement`   | `undefined` | Scroll container. Defaults to the sections' nearest scrollable ancestor, then the document.                          |
| `bound`           | `number`                  | `0`         | Distance in px below the container top at which a section becomes active. Positive switches later, negative earlier. |
| `onOpenChange`    | `(open: boolean) => void` | `undefined` | Called when the open state changes.                                                                                  |

### SnFloatingTocBar Props

| Name      | Type      | Default     | Description                                                                                     |
| --------- | --------- | ----------- | ----------------------------------------------------------------------------------------------- |
| `href`    | `string`  | `''`        | Section anchor (`'#intro'`); the unique registry key for the section.                           |
| `title`   | `string`  | `''`        | Section label, reused by the matching panel entry.                                              |
| `level`   | `number`  | `1`         | Nesting depth, 1 = top level. Deeper levels render shorter bars.                                |
| `active`  | `boolean` | `undefined` | Force the active highlight. Omit to let the root decide from the scroll.                        |
| `summary` | `string`  | `''`        | One-line summary for the hover preview; falls back to the section's own text (first 120 chars). |

### SnFloatingTocContent Props

| Name        | Type                | Default     | Description                                                  |
| ----------- | ------------------- | ----------- | ------------------------------------------------------------ |
| `offset`    | `number`            | `8`         | Distance in px between the rail and the panel.               |
| `placement` | `'left' \| 'right'` | `undefined` | Direction the panel opens; defaults to the root's placement. |
| `ariaLabel` | `string`            | `undefined` | Accessible name of the panel (`role="dialog"`).              |

### SnFloatingTocItem Props

| Name     | Type      | Default     | Description                                      |
| -------- | --------- | ----------- | ------------------------------------------------ |
| `href`   | `string`  | `''`        | Section anchor this entry navigates to.          |
| `title`  | `string`  | `''`        | Label; falls back to the matching bar's `title`. |
| `level`  | `number`  | `1`         | Nesting depth; deeper levels are indented.       |
| `active` | `boolean` | `undefined` | Force the active highlight.                      |

### SnFloatingTocTrigger Props

None — it only wires pointer, focus and keyboard handling. Native `span` attributes pass through.

### Events

| Name          | Payload   | Description             |
| ------------- | --------- | ----------------------- |
| `open-change` | `boolean` | Open state has changed. |

### Slots

| Part    | Name      | Description                  |
| ------- | --------- | ---------------------------- |
| root    | `default` | Trigger + Content.           |
| Trigger | `default` | The bar indicators.          |
| Bar     | `default` | Custom bar content.          |
| Content | `default` | The section entries (items). |
| Item    | `default` | Custom entry label.          |

### Exposed

| Name         | Type                      | Description                              |
| ------------ | ------------------------- | ---------------------------------------- |
| `activeHref` | `string \| null`          | `href` of the section currently in view. |
| `setOpen`    | `(open: boolean) => void` | Open / close the panel programmatically. |
| `refresh`    | `() => void`              | Re-measure section offsets.              |

## How the active section is chosen

The active section is the last one whose viewport top has passed the `bound` line. Before anything passes it, the first section stays active so the rail is never blank.

`bound` keeps `SnAnchor`'s name and sign: `0` is the viewport top, a positive value moves the line down the page (switching later), a negative value moves it above the viewport (switching earlier).

## Hover preview

Resting the pointer on a single bar floats a small card on the content side showing that section's title and a one-line summary.

The summary comes from the explicit `summary` prop when given; otherwise from the section element's own text, whitespace-collapsed and cut at 120 characters. A page that already has headings and paragraphs therefore needs no second source of truth.

The card is `pointer-events: none` (it never steals the hover that shows it) and disappears as soon as the panel expands — the panel already lists every section, so a single-bar preview would only repeat it.

## Controlled and uncontrolled

Without `open` the component owns the state; delays, clicks and keys act on it.

With `open` the component never mutates that state — it reports through `open-change` and the host decides.

Pointer and keyboard activation differ: in hover mode a click on the trigger only _confirms_ the panel (the pointer has normally opened it on entry), so it never closes it; `Enter` / `Space` keep toggling in both modes. In press mode a click stays a toggle.

## Scroll container

Without `scrollContainer` the component walks up from the first section element to the nearest scrollable ancestor, falling back to the document. In docs sites, dialogs and split panes pass it explicitly to avoid mis-detection.

## Accessibility

- The root is `<nav aria-label="Table of contents">`, so the rail is a named navigation landmark.
- The trigger is `role="button"`, `tabindex="0"`, `aria-haspopup="dialog"`, `aria-expanded`, with a `:focus-visible` ring.
- The panel is `role="dialog"`; name it with `aria-label` or `aria-labelledby`.
- Entries are real `<button type="button">` elements; the active entry carries `aria-current="location"`.
- The collapsed bars are decorative (`aria-hidden`): they serve pointer input, and the keyboard path is the trigger's arrow keys plus the panel entries, so they add no tab stops.
- Keyboard: `Enter` / `Space` toggles, `Escape` closes, `ArrowUp` / `ArrowDown` move between sections and scroll to them.
- `prefers-reduced-motion: reduce` turns the section scroll into an instant jump.

## Theming

The component consumes `--sn-web-*` tokens (table below) and also exposes HeroUI-compatible local variables you can override on any ancestor: `--floating-toc-bar-width` (16px), `--floating-toc-bar-active-width` (24px), `--floating-toc-bar-height` (2px), `--floating-toc-bar-level-step` (3px), `--floating-toc-bar-gap` (12px), `--floating-toc-item-indent` (0.75rem), `--floating-toc-content-width` (224px) — plus the AUI addition `--floating-toc-preview-width` (232px, the hover preview width) — and `--floating-toc-color-bar`, `--floating-toc-color-active`.

| Token                                | Use                              |
| ------------------------------------ | -------------------------------- |
| `--sn-web-color-action-primary`      | Active bar / active entry colour |
| `--sn-web-color-border-default`      | Inactive bar; panel border       |
| `--sn-web-color-background-elevated` | Panel background                 |
| `--sn-web-color-background-subtle`   | Entry hover background           |
| `--sn-web-color-background-overlay`  | Entry pressed background         |
| `--sn-web-color-text-primary`        | Entry text on hover              |
| `--sn-web-color-text-secondary`      | Default entry text               |
| `--sn-web-color-text-disabled`       | Disabled entry text              |
| `--sn-web-font-size-sm`              | Entry font size                  |
| `--sn-web-font-weight-medium`        | Active entry weight              |
| `--sn-web-shadow-lg`                 | Panel shadow                     |
| `--sn-web-radius-full`               | Bar cap radius                   |
| `--sn-web-spacing-6`                 | Distance from the viewport edge  |
| `--sn-web-focus-ring`                | Keyboard focus ring              |

## Reference and divergences

naive-ui has no equivalent, so this is an additive AUI component mirroring **HeroUI Pro `FloatingToc`** (https://heroui.pro/docs/react/components/floating-toc) 1:1.

Additive differences (none change existing semantics):

- `Bar` / `Item` gained `href` / `title`: the React parts read sections from their own tree; in Vue the bar carries the registration.
- Added `scrollContainer` and `bound` (`bound` reuses SnAnchor's name and sign).
- The panel is not teleported; it lives inside the fixed root subtree.
- The hover preview (`summary` + derived text) and `--floating-toc-preview-width` are AUI additions; HeroUI's Bar has no tooltip.

## Known trade-offs

- HeroUI's overlay collision flipping is not implemented yet (a narrow viewport will not flip the panel to the other side).
- Panel geometry beyond the CSS variables is hard-coded from tokens; `SnConfigProvider` has no FloatingTocTheme yet.
