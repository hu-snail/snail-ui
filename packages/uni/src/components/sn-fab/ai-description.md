# sn-fab — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-fab component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Floating action button with an expanding action menu: 8 anchor presets, 4 expansion directions (`up` / `down` / `left` / `right`, legacy `top` / `bottom` accepted), two expansion shapes (line stack / arc fan), 5 color themes and optional dragging.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-fab`
(https://wot-ui.cn/component/fab.html). New props added here MUST also be added to
the wd-fab parity list.

## Additive (AUI-OPT-02)

- `direction` additionally accepts `up` / `down` — additive aliases of `top` /
  `bottom` (default changed from `top` to `up`; the rendered result is
  identical, so §78 compatibility holds).
- The root now lays the menu out strictly along `direction` (`up` → column,
  `down` → column-reverse, `left` → row, `right` → row-reverse). Side-centred
  anchors no longer force a horizontal stack — the direction prop wins.
- The menu slides out along the direction axis (fade + translate) while
  expanding.
- The trigger glyph is sized with `--sn-mp-icon-size-large` (40rpx ≈ 0.42 of
  the 96rpx trigger) instead of a hard-coded pixel box.

## Additive (AUI-OPT-19) — Fan mode

- `mode: 'line' | 'fan'` (default `'line'`). `'line'` is the wd-fab 1:1 stack;
  `'fan'` arranges action items along an arc that blooms out of the trigger
  centre (back-out easing + a 40 ms per-item stagger; collapsed, every item
  rests on the trigger centre with `scale(0.4)` / `opacity: 0`).
- `actions: SnFabAction[]` — structured item source for fan mode
  (`{ icon: string | IconData, text?, color?, disabled? }`). Items render as
  icon+text pills when `text` is present, icon-only bubbles otherwise. Tapping
  an item emits `action` and auto-closes the fan (documented divergence: the
  wd-fab slot items stay manually closed). The `default` slot is ignored in
  fan mode; it remains the line-mode contract.
- `fanRadius: number` (default `96`, px) — distance from the trigger centre to
  an item centre.
- Geometry per anchor (screen coords, 0° = right, 90° = down): corner anchors
  open an oblique 90° quadrant fan into the screen (`left-top` → 45°,
  `right-top` → 135°, `right-bottom` → 225°, `left-bottom` → 315°);
  edge-centre anchors open a symmetric 120° fan (`top-center` → 90°,
  `bottom-center` → 270°, `left-center` → 0°, `right-center` → 180°). Items
  step 45° apart, evenly re-spread when the span cap kicks in.

## Dragging (AGENTS.md §41)

`draggable` uses uni's own gesture events (`@touchstart` / `@touchmove` /
`@touchend` on the trigger) — no `window` listener, no `document.body`
measurement. The delta accumulates in component state and is applied as a
`translate` offset, clamped with `uni.getSystemInfoSync()` when available. Drag
does not snap to an edge after release (the reference does).

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-fab v-model:active="open" type="primary" position="right-bottom" direction="up">
  <view class="action-item">…</view>
</sn-fab>
```

```ts
import { SnFab } from '@snui/uni';
```

## Props

| Name           | Type                                                      | Default                                      | Required | Description                                                 |
| -------------- | --------------------------------------------------------- | -------------------------------------------- | -------- | ----------------------------------------------------------- |
| `active`       | boolean                                                   | false                                        | no       | Whether the menu is expanded (`v-model:active`).            |
| `type`         | 'primary' \| 'success' \| 'info' \| 'warning' \| 'danger' | 'primary'                                    | no       | Color theme.                                                |
| `position`     | FabPosition                                               | 'right-bottom'                               | no       | Anchor preset.                                              |
| `draggable`    | boolean                                                   | false                                        | no       | Allow dragging the trigger.                                 |
| `direction`    | 'up' \| 'down' \| 'left' \| 'right' \| 'top' \| 'bottom'  | 'up'                                         | no       | Menu expansion direction; `up`/`down` alias `top`/`bottom`. |
| `mode`         | 'line' \| 'fan'                                           | 'line'                                       | no       | Expansion shape: stack (wd-fab 1:1) or arc (AUI-OPT-19).    |
| `actions`      | SnFabAction[]                                             | []                                           | no       | Fan-mode items; the slot is ignored in fan mode.            |
| `fanRadius`    | number                                                    | 96                                           | no       | Fan radius in px (trigger centre → item centre).            |
| `disabled`     | boolean                                                   | false                                        | no       | Disable the whole button.                                   |
| `inactiveIcon` | string                                                    | 'plus'                                       | no       | Icon while collapsed (registry name).                       |
| `activeIcon`   | string                                                    | 'close'                                      | no       | Icon while expanded (registry name).                        |
| `zIndex`       | number                                                    | 99                                           | no       | Stacking level.                                             |
| `gap`          | SnFabGap                                                  | { top: 16, right: 16, bottom: 16, left: 16 } | no       | Default gap from each edge.                                 |
| `expandable`   | boolean                                                   | true                                         | no       | Expand on tap; `false` emits `click` instead.               |
| `top`          | number                                                    | —                                            | no       | Explicit top offset (overrides `gap.top`).                  |
| `bottom`       | number                                                    | —                                            | no       | Explicit bottom offset (overrides `gap.bottom`).            |
| `left`         | number                                                    | —                                            | no       | Explicit left offset (overrides `gap.left`).                |
| `right`        | number                                                    | —                                            | no       | Explicit right offset (overrides `gap.right`).              |
| `customClass`  | string                                                    | ''                                           | no       | Custom class for the root node.                             |
| `customStyle`  | string                                                    | ''                                           | no       | Custom inline style for the root node.                      |

`SnFabGap` = `{ top?, right?, bottom?, left? }` (all px).
`SnFabAction` = `{ icon: string | IconData, text?, color?, disabled? }` — `text` turns the item into a pill, `color` tints the icon (prefer `var(--sn-mp-color-*)`), `disabled` dims and blocks taps.
`FabPosition` = `'left-top' | 'right-top' | 'left-bottom' | 'right-bottom' | 'left-center' | 'right-center' | 'top-center' | 'bottom-center'`.

## Events

| Event           | Payload            | Description                                   |
| --------------- | ------------------ | --------------------------------------------- |
| `update:active` | boolean            | Menu expanded / collapsed (`v-model:active`). |
| `click`         | —                  | Trigger tapped while `expandable` is false.   |
| `action`        | SnFabAction, index | Fan item tapped (auto-closes the fan).        |

## Slots

| Slot      | Description                                       |
| --------- | ------------------------------------------------- |
| `default` | Action items for line mode (ignored in fan mode). |
| `trigger` | Fully custom trigger content (replaces the icon). |

## Tokens Consumed (end: mp)

| Token                                      | CSS Variable                       | Purpose                      |
| ------------------------------------------ | ---------------------------------- | ---------------------------- |
| Action primary                             | `--sn-mp-color-action-primary`     | `type="primary"` fill        |
| Feedback success / info / warning / danger | `--sn-mp-color-feedback-success …` | Other `type` fills           |
| Text on primary                            | `--sn-mp-color-text-on-primary`    | Trigger icon color           |
| Icon size large                            | `--sn-mp-icon-size-large`          | Trigger glyph size (40rpx)   |
| Shadow LG                                  | `--sn-mp-shadow-lg`                | Trigger elevation            |
| Radius full                                | `--sn-mp-radius-full`              | Trigger shape                |
| Spacing 3 / 4                              | `--sn-mp-spacing-3 / -4`           | Menu/root gap + slide offset |

## Accessibility

- Trigger: `role="button"` + `aria-expanded` + `aria-disabled`.
- Menu container: `aria-hidden` mirrors the expanded state.

## AI Patch Boundary

- Patchable: `type` / `position` / `direction` / `mode` / `fanRadius` / `gap` /
  `zIndex` / `inactiveIcon` / `activeIcon` / `disabled` / `expandable` /
  per-side offsets / `actions` items (icon / text / color / disabled).
- Read-only: the drag offset (runtime gesture result) and the `default` /
  `trigger` slot structure (business data).
- `active` is controlled (`v-model:active`) — write back via the event.

## Dispose

No global listener and no timer: the drag delta is plain component state, and the
gesture events live on the trigger node itself.

## Versioning

`@snui/uni@0.5.0` — initial release.
