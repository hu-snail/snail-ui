# SnDropdown (Web)

Web-end dropdown action menu for `@snui/vue-web`. Mirrors naive-ui
`n-dropdown`'s core surface (mixed rows + dividers, six bottom/top
placements, click/hover trigger, one-level submenu) plus Arco's
`trigger="contextMenu"` right-click mode.

## When to use

Use SnDropdown when clicking (or hovering) a trigger should offer a compact
list of **actions** — row menus on tables, "more" buttons, toolbar
overflow. It is an action menu, not a value picker: use SnSelect when the
user picks a value.

## Props

| Prop      | Type                                                                              | Default    | Notes                                                                                                                                           |
| --------- | --------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| options   | `Array<{ key, label?, disabled?, icon?, children? } \| { type: 'divider', key }>` | `[]`       | Action rows and separators, mixed. Keys required (naive contract).                                                                              |
| placement | `'bottom' \| 'bottom-start' \| 'bottom-end' \| 'top' \| 'top-start' \| 'top-end'` | `'bottom'` | Vertical half flips when the viewport lacks room; the alignment suffix survives the flip.                                                       |
| trigger   | `'click' \| 'hover' \| 'contextMenu'`                                             | `'hover'`  | Hover closes on a fixed 300ms grace delay. Keyboard works regardless. `contextMenu` opens on right-click anchored to the pointer (Arco parity). |
| disabled  | `boolean`                                                                         | `false`    | Blocks open entirely (click / hover / keyboard).                                                                                                |
| size      | `'small' \| 'medium' \| 'large'`                                                  | `'medium'` | Row height + font preset (28/34/40px).                                                                                                          |
| show      | `boolean \| undefined`                                                            | —          | Controlled mode when passed: the panel follows the prop and the component only emits `update:show`. Omit for uncontrolled.                      |

## Events

| Event          | Payload                           | When                                                                                     |
| -------------- | --------------------------------- | ---------------------------------------------------------------------------------------- |
| `update:show`  | `(show: boolean)`                 | Every show-state change (controlled AND uncontrolled).                                   |
| `select`       | `(key, option: SnDropdownOption)` | A row was activated (click / Enter). The payload carries the consumer's original object. |
| `clickoutside` | `(MouseEvent)`                    | A mousedown landed outside trigger + panels while open (then the menu closes).           |

## Slots

| Slot      | Description                                                                                       |
| --------- | ------------------------------------------------------------------------------------------------- |
| `default` | Trigger content. Render a focusable element (e.g. a button) — its keydown bubbles to the wrapper. |

## Submenu

An option with `children` renders as a parent row (chevron arrow) and opens
a right-slide second-level panel anchored to the row (`right-start`; flips
left near the viewport's right edge, clamped vertically). Opens on hover;
with `trigger="click"` a click toggles it. **One nesting level** — deeper
`children` arrays are ignored.

## Context menu (right-click)

With `trigger="contextMenu"` (Arco Design Vue parity):

- A right-click on the trigger content **replaces the native context menu**
  (`preventDefault`) and opens the panel anchored to the **pointer**
  position. Right-clicking again while open re-anchors the panel to the new
  position.
- The `placement` prop keeps its meaning around the pointer: the alignment
  suffix applies to the cursor point (`bottom-start` → menu's left edge at
  the cursor) and the requested vertical half flips when it lacks room.
- The keyboard surface (Enter / Space / ArrowDown) still works and anchors
  the panel to the trigger rect, since no pointer coordinate exists.
- Left-clicks do nothing; click/hover trigger modes leave the native
  context menu untouched.

## Keyboard

- `Enter` / `Space` / `ArrowDown` — open the menu.
- `ArrowUp` / `ArrowDown` — move the highlight (wraps; skips disabled rows and dividers; parents included).
- `Enter` — activate the highlighted row (parent → opens its submenu) and close on leaves.
- `ArrowRight` / `ArrowLeft` — enter / leave the open submenu.
- `Escape` — close the whole dropdown.

## Tokens

All styling resolves through `--sn-web-dropdown-*` aliases with
`--sn-web-color-*` fallbacks:

| Token                                          | Default                              | Purpose                  |
| ---------------------------------------------- | ------------------------------------ | ------------------------ |
| `--sn-web-dropdown-menu-bg`                    | `--sn-web-color-background-elevated` | Panel fill               |
| `--sn-web-dropdown-menu-border-color`          | `--sn-web-color-border-subtle`       | Panel border             |
| `--sn-web-dropdown-menu-radius`                | `3px`                                | Panel corner radius      |
| `--sn-web-dropdown-menu-shadow`                | naive popover triple                 | Panel elevation          |
| `--sn-web-dropdown-menu-z-index`               | `1000`                               | Stacking                 |
| `--sn-web-dropdown-menu-padding-y`             | `5px`                                | Panel vertical pad       |
| `--sn-web-dropdown-option-height`              | `28/34/40px` (per size)              | Row height               |
| `--sn-web-dropdown-option-padding-x`           | `12px`                               | Row horizontal pad       |
| `--sn-web-dropdown-option-text-color`          | `--sn-web-color-text-primary`        | Row text                 |
| `--sn-web-dropdown-option-text-color-disabled` | `--sn-web-color-text-disabled`       | Disabled row text        |
| `--sn-web-dropdown-option-bg-hover`            | `--sn-web-color-background-subtle`   | Hover/keyboard highlight |
| `--sn-web-dropdown-option-icon-color`          | `--sn-web-color-text-secondary`      | Row icon tint            |
| `--sn-web-dropdown-option-arrow-color`         | `--sn-web-color-text-tertiary`       | Submenu chevron          |
| `--sn-web-dropdown-divider-color`              | `--sn-web-color-border-subtle`       | Separator fill           |
| `--sn-web-dropdown-divider-margin`             | `5px 0`                              | Separator spacing        |

## Accessibility

- Trigger wrapper: `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`, `aria-disabled`.
- Panels: `role="menu"` + `aria-orientation="vertical"`; keyboard highlight exposed via `aria-activedescendant`.
- Rows: `role="menuitem"` + `aria-disabled`; parent rows add `aria-haspopup` + `aria-expanded`.
- Separators: `role="separator"`.

## When NOT to use

- Picking a value for a form — use SnSelect.
- Site navigation with active state — use SnMenu.
- A bubble with arbitrary content — use SnTooltip / SnPopover.
