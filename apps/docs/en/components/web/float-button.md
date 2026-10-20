# FloatButton · Web

`SnFloatButton` is a floating action button pinned to a viewport corner;
`SnFloatButtonGroup` collapses several of them into one corner and stacks them
above the trigger when opened.

## When to use

- An action that must stay reachable while the page scrolls: new item, help,
  back to top, share
- Several floating entries in the same corner that should collapse behind a
  single trigger and expand on demand
- A float entry that needs one of the two shapes (circle / square with text), a
  count badge, or an `href` link root

Not the right fit when the page is short, or when the entry belongs in the page
layout — use a plain `SnButton` instead of a viewport-pinned float button.

## Examples

### Basic

Default circle, `type="primary"` circle, and `shape="square"` with a
`description` line.

<Demo name="float-button-web-basic" description="Default circle / primary circle / square with text, three corner offsets." />

### Group

`SnFloatButtonGroup` owns the fixed corner for the whole stack (the children
only render content), and `v-model:open` can take over the open state.

<Demo name="float-button-web-group" description="Three actions stacked in one corner, opened through a controlled v-model:open." />

### Badge and link

`badge` renders a count, `badgeDot` renders a dot without a number, and `href`
switches the root element from `<button>` to `<a>`.

<Demo name="float-button-web-badge-link" description="Count badge / dot badge / href + target link root." />

## API

### SnFloatButton Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| type | `'default' \| 'primary'` | `'default'` | Fill: surface background or brand color |
| shape | `'circle' \| 'square'` | `'circle'` | Square adds a `description` line under the icon |
| icon | `IconComponent` (lucide component) | `undefined` | Icon component; the `icon` slot overrides it |
| iconSize | `number \| string` | `18` | Size forwarded to the embedded `SnIcon` |
| description | `string` | `undefined` | Text under the icon; rendered for `shape="square"` only |
| tooltip | `string` | `undefined` | Sets the native `title` and the accessible name (`aria-label`); no tooltip component is rendered |
| badge | `number \| string` | `undefined` | Count bubble; hidden when `undefined`, `0` or `''` |
| badgeDot | `boolean` | `false` | Dot without a number; a count wins over the dot |
| href | `string` | `undefined` | Renders `<a href>` instead of `<button type="button">` |
| target | `'_blank' \| '_self' \| '_parent' \| '_top'` | `undefined` | Native link target, only meaningful with `href` |
| disabled | `boolean` | `false` | Suppresses `click` and sets `aria-disabled="true"` |
| visible | `boolean` | `true` | `v-if` the whole button |
| placement | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'bottom-right'` | Fixed corner; ignored inside a group |
| right / bottom / top / left | `number \| string` | `undefined` | Explicit offset overriding the placement axis |
| zIndex | `number` | `1000` | Stacking order; ignored inside a group |

### SnFloatButtonGroup Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| shape | `'circle' \| 'square'` | `'circle'` | Handed to every child and overrides the child's own `shape` |
| open | `boolean` | `undefined` | Controlled open state (`v-model:open`); omitted = uncontrolled |
| trigger | `'click' \| 'hover'` | `'click'` | Gesture that opens the stack |
| placement | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'bottom-right'` | Fixed corner of the whole group |
| right / bottom / top / left | `number \| string` | `undefined` | Explicit offsets overriding `placement` (defaults `right` / `bottom` = 24) |
| zIndex | `number` | `1000` | Stacking order of the fixed root |
| gap | `number` | `12` | Vertical gap between the stacked children (and to the trigger) |
| triggerIcon | `IconComponent` (lucide component) | lucide `Plus` | Trigger glyph, rotated 45° while open |
| triggerTooltip | `string` | `undefined` | Sets the trigger's native `title` and accessible name |

### Events

| Name | Component | Payload | Notes |
| --- | --- | --- | --- |
| click | SnFloatButton | `MouseEvent` | Native click; not emitted while `disabled` |
| update:open | SnFloatButtonGroup | `boolean` | Open state changed (`v-model:open`), only on an actual change |
| openChange | SnFloatButtonGroup | `boolean` | Event-style alias of `update:open` |

### Slots

| Name | Component | Params | Notes |
| --- | --- | --- | --- |
| icon | SnFloatButton | `()` | Replaces the icon |
| description | SnFloatButton | `()` | Replaces the `description` text |
| default | SnFloatButton | `()` | Replaces the whole inner content (icon + text) |
| default | SnFloatButtonGroup | `()` | The stacked `SnFloatButton` children |
| trigger | SnFloatButtonGroup | `()` | Replaces the built-in trigger entirely |

## Positioning

The `SnFloatButton` root is `position: fixed`; its inline style is computed from
`placement`, the explicit offsets and `zIndex`. The defaults are
`bottom-right` with `right: 24px` / `bottom: 24px`.

`placement` only fills the axis the caller did not offset explicitly, so
`placement="bottom-right"` with `top: 8` uses `8px` vertically and still keeps
`right: 24px`.

Inside `SnFloatButtonGroup` a child becomes `position: static` and full width:
the group owns the position, and the child's own `placement` / offsets /
`zIndex` stop applying.

## Controlled and uncontrolled

`SnFloatButtonGroup` is uncontrolled by default — the trigger opens and closes
it, and `update:open` / `openChange` are emitted for the new value.

Passing `open` makes it controlled: the internal state no longer drives the
view, and `v-model:open` is the shortest wiring. To tell "no `open` passed"
apart from "`open=false`", `open` declares an explicit `undefined` default;
otherwise Vue's boolean-prop casting would turn the missing value into `false`
and the group could never open.

## Accessibility

- `SnFloatButton` renders a real `<button type="button">` (an `<a>` when `href`
  is set), the group trigger is a real `SnFloatButton`, and the group shell is
  `role="group"`.
- `tooltip` / `triggerTooltip` write both the native `title` and `aria-label`;
  without a tooltip a square button falls back to `description` as its
  accessible name.
- The trigger carries `aria-haspopup="true"` and an `aria-expanded` that tracks
  the open state; the collapsed stack is `aria-hidden="true"` plus
  `display: none`, so its buttons leave the accessibility tree and the tab
  order.
- `disabled` uses `aria-disabled="true"` and blocks `click`; the root stays
  focusable (the ARIA disabled pattern).
- Icons go through `SnIcon`, which renders `aria-hidden="true"`, so the name
  must come from `tooltip` / `description`.

## Theming

The pair consumes `--sn-web-*` token aliases (surface, text, border, brand
color, focus ring, shadows, radii, font sizes and line-height). Retheming means
overriding those tokens.

## Known Divergences / Deferred

- naive-ui ships no float button, so this pair follows Ant Design Vue
  `FloatButton` / `FloatButton.Group` — an explicit divergence documented the
  same way as `SnComment`.
- `tooltip` only writes the native `title` plus `aria-label`; no tooltip
  component is involved, which also keeps the button disposable-free.
- The library ships no `SnBadge` yet, so the count bubble is rendered inline by
  `SnFloatButton`.
- The `trigger` slot replaces the built-in trigger *and* its wiring: a custom
  trigger has to drive `v-model:open` and provide its own `aria-expanded` /
  `aria-haspopup`.
- `FloatButton.BackTop`, `FloatButton.PurePanel` and the group popup-menu mode
  are not implemented yet.

See the component `ai-description.md` for the full contract.