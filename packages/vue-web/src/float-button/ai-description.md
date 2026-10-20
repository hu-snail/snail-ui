# SnFloatButton + SnFloatButtonGroup — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end float button pair.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A floating action button pinned to a viewport corner (`SnFloatButton`), plus a
collapsible stack of them sharing one corner (`SnFloatButtonGroup`). Typical
use: "new item" / "help" / "back to top" actions that must stay reachable while
the page scrolls, and sites where several such actions should collapse behind a
single trigger.

## Reference Library

**Explicit divergence from the naive-ui 1:1 rule**: naive-ui has NO float button
component (verified against naive-ui `src/components.ts`), so — like `SnComment`
in the data-display batch — this pair mirrors Ant Design Vue instead:

- `SnFloatButton` → `FloatButton`
  (https://antdv.com/components/float-button)
- `SnFloatButtonGroup` → `FloatButton.Group`

naive-ui's nearest relative is `n-back-top` (which this library implements
separately as `SnBackTop`); the fixed-corner offset model (`right` / `bottom` /
`top` / `left` / `placement`) is borrowed from it.

## Import

```ts
import { SnFloatButton, SnFloatButtonGroup } from '@snui/vue-web'
```

## Props

### SnFloatButton

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `type` | `'default' \| 'primary'` | `'default'` | no | Filled color: surface background or brand fill. |
| `shape` | `'circle' \| 'square'` | `'circle'` | no | Square renders the icon above a `description` line. |
| `icon` | `IconComponent` (lucide component) | `undefined` | no | Icon component; the `icon` slot overrides it. |
| `iconSize` | `number \| string` | `18` | no | Size forwarded to the embedded `SnIcon`. |
| `description` | `string` | `undefined` | no | Text under the icon. Rendered for `shape="square"` only. |
| `tooltip` | `string` | `undefined` | no | Sets the native `title` **and** the accessible name (`aria-label`). No tooltip component is used. |
| `badge` | `number \| string` | `undefined` | no | Count bubble; hidden when `undefined`, `0` or `''`. |
| `badgeDot` | `boolean` | `false` | no | Render a dot when there is no count to show. A count wins over the dot. |
| `href` | `string` | `undefined` | no | When set the root renders `<a href>`, otherwise `<button type="button">`. |
| `target` | `'_blank' \| '_self' \| '_parent' \| '_top'` | `undefined` | no | Native link target; only meaningful with `href`. |
| `disabled` | `boolean` | `false` | no | Suppresses `click` and sets `aria-disabled="true"`. |
| `visible` | `boolean` | `true` | no | `v-if` the whole button. |
| `placement` | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'bottom-right'` | no | Fixed corner. Ignored inside a group. |
| `right` | `number \| string` | `undefined` | no | Explicit right offset; overrides the placement axis. |
| `bottom` | `number \| string` | `undefined` | no | Explicit bottom offset; overrides the placement axis. |
| `top` | `number \| string` | `undefined` | no | Explicit top offset; overrides the placement axis. |
| `left` | `number \| string` | `undefined` | no | Explicit left offset; overrides the placement axis. |
| `zIndex` | `number` | `1000` | no | Stacking order of the fixed root. Ignored inside a group. |

Corner defaults: with the default `placement="bottom-right"` and no explicit
offsets the button is pinned at `right: 24px; bottom: 24px`. `placement` only
fills the axis the caller did not offset explicitly, so `top: 8` keeps
`right: 24px` but drops `bottom`.

### SnFloatButtonGroup

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `shape` | `'circle' \| 'square'` | `'circle'` | no | Handed to every child and overrides the child's own `shape`. |
| `open` | `boolean` | `undefined` | no | Controlled open state (`v-model:open`). Omitted = uncontrolled. |
| `trigger` | `'click' \| 'hover'` | `'click'` | no | Gesture that opens the stack. |
| `placement` | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'bottom-right'` | no | Fixed corner of the group (and of its children). |
| `right` / `bottom` / `top` / `left` | `number \| string` | `undefined` | no | Explicit offsets overriding `placement` (defaults `right`/`bottom` = 24). |
| `zIndex` | `number` | `1000` | no | Stacking order of the fixed root. |
| `gap` | `number` | `12` | no | Vertical gap between the stacked children (and to the trigger). |
| `triggerIcon` | `IconComponent` (lucide component) | lucide `Plus` | no | Trigger glyph; rotated 45° while open. |
| `triggerTooltip` | `string` | `undefined` | no | Sets the trigger's native `title` and accessible name. |

## Slots

### SnFloatButton

| Name | Params | Description |
|---|---|---|
| `icon` | `()` | Replaces the icon. |
| `description` | `()` | Replaces the `description` text. |
| `default` | `()` | Replaces the whole inner content (icon + description). |

### SnFloatButtonGroup

| Name | Params | Description |
|---|---|---|
| `default` | `()` | The `SnFloatButton` children, stacked above the trigger. |
| `trigger` | `()` | Replaces the built-in trigger button entirely. |

## Events

### SnFloatButton

| Name | Payload | Description |
|---|---|---|
| `click` | `MouseEvent` | Native click. Not emitted while `disabled` (the handler also calls `preventDefault`, so a disabled link does not navigate). |

### SnFloatButtonGroup

| Name | Payload | Description |
|---|---|---|
| `update:open` | `boolean` | The open state changed (`v-model:open`). Only emitted on an actual change. |
| `openChange` | `boolean` | Event-style alias of `update:open`. |

## Behaviour

- Positioning: the root is `position: fixed` with an inline style computed from
  `placement` / explicit offsets / `zIndex`. Inside a group the child renders
  `position: static`, full width, and ignores its own offsets and `zIndex` —
  the group owns the corner for the whole stack.
- Group context: the group `provide`s `sn-float-button-group` (a reactive
  `{ shape }` object). A child `inject`s it, inherits `shape`, and keeps working
  standalone because the inject falls back to `null`.
- Open state: uncontrolled by default (`mergedOpen` ← an internal ref); passing
  `open` makes it controlled and the internal state stops driving the view.
  `update:open` / `openChange` fire only when the requested value differs from
  the current one.
- The stack is revealed with `v-show` (children stay mounted, so their own
  state survives a collapse) inside a `<Transition>` that animates opacity +
  `translateY`.
- `trigger="hover"`: `mouseenter` opens, `mouseleave` closes. While an open
  hover stack exists a document-level `mousemove` guard also collapses it when
  the pointer leaves the group (covering overlays / fast exits).
- The trigger always toggles on click, whatever `trigger` is.
- Icons: only `SnIcon` renders SVGs (AGENTS.md §113). With no `icon` prop and
  no `icon` slot, no icon element is rendered at all — never the
  `.sn-icon--missing` placeholder.
- Dispose (AGENTS.md §41): the document `mousemove` guard is removed as soon as
  the stack closes and on unmount.

## Divergences

- **naive-ui parity**: no naive-ui counterpart exists for either component, so
  the API surface mirrors Ant Design Vue `FloatButton` / `FloatButton.Group`
  (registered divergence, same wording as `SnComment`).
- **Tooltip**: the reference renders a real tooltip for `tooltip` /
  `tooltip.title`. Here `tooltip` only sets the native `title` attribute and
  `aria-label`; no tooltip component, portal or timer is involved. This keeps
  the button disposable-free and avoids pulling the overlay stack into a
  corner-pinned action.
- **Badge**: `@snui/vue-web` ships no `SnBadge` yet, so the count bubble is
  rendered inline by `SnFloatButton` (`.sn-float-button__badge`, anchored to the
  icon box). `badge`/`badgeDot` truthiness mirrors `Badge`.
- **Positioning model**: the reference only exposes `style` for placement. Here
  `placement` + `right` / `bottom` / `top` / `left` + `zIndex` mirror
  `SnBackTop`'s fixed-corner model, which is the library convention for
  floating widgets. `placement` never overrides an axis the caller offset
  explicitly.
- **Trigger glyph**: the reference's group trigger is `CloseOutlined` /
  `MenuOutlined` (or a custom `icon`). Here the trigger is a plain
  `SnFloatButton` whose `triggerIcon` (default lucide `Plus`) rotates 45° while
  open.
- **`gap`**: parameterised (default 12) instead of the reference's hard-coded
  vertical rhythm.
- **Custom `trigger` slot**: the slot replaces the trigger button *and* its
  wiring — a custom trigger must call `update:open` / `v-model:open` itself and
  provide its own `aria-expanded` / `aria-haspopup`, because the built-in
  ARIA wiring lives on the default trigger.
- **`visible`** is a first-class prop (the reference leaves conditional
  rendering to userland).
- No `FloatButton.BackTop` / `FloatButton.PurePanel` sub-components and no
  `Group.menu` popup mode yet.

## Tokens Consumed (end: web)

| Token | Use |
|---|---|
| `--sn-web-color-background-elevated` | Default button surface. |
| `--sn-web-color-text-primary` | Default icon / description color. |
| `--sn-web-color-border-subtle` | Default border. |
| `--sn-web-color-action-primary` | Primary fill; default hover accent. |
| `--sn-web-color-action-primary-hover` | Primary hover fill. |
| `--sn-web-color-text-on-primary` | Foreground on a primary fill / badge. |
| `--sn-web-color-feedback-danger` | Badge bubble background. |
| `--sn-web-focus-ring` | Keyboard focus outline. |
| `--sn-web-shadow-md`, `--sn-web-shadow-sm` | Floating elevation (group children sit lighter). |
| `--sn-web-radius-full`, `--sn-web-radius-md` | Circle / square radius, badge pill. |
| `--sn-web-font-size-sm`, `--sn-web-font-size-xs` | Description / badge type. |
| `--sn-web-font-line-height-tight` | Description / badge line-height. |

Metrics (px): 40px circle button, 44px minimum for the square variant, badge
16px tall (8px dot), default corner offset 24px, default stack gap 12px,
default icon size 18px.

## Accessibility

- Both components render real interactive elements: `SnFloatButton` is a
  `<button type="button">` (or `<a>` when `href` is set), the group trigger is
  an `SnFloatButton`, and the group shell is `role="group"`.
- Accessible name: `tooltip` (button) / `triggerTooltip` (trigger) set both the
  native `title` and `aria-label`. The button falls back to `description` as its
  name, so a square button with a visible description line is announced even
  without a tooltip.
- `disabled` sets `aria-disabled="true"` and suppresses `click`; the root stays
  focusable (ARIA disabled pattern) rather than using the native `disabled`
  attribute.
- The group trigger exposes `aria-haspopup="true"` and
  `aria-expanded` reflecting the open state; the collapsed stack is
  `aria-hidden="true"` (and `display: none`), so its buttons leave the
  accessibility tree and the tab order.
- Icons are decorative: `SnIcon` renders `aria-hidden="true"`, so the label must
  come from `tooltip` / `description`.
- `:focus-visible` draws a focus ring from `--sn-web-focus-ring`.

## Versioning

`@snui/vue-web@0.1.0` — initial release. Float button batch (Ant Design Vue
`FloatButton` / `FloatButton.Group` reference, explicit naive-ui divergence).