# sn-fab — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-fab component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Floating action button with an expanding action menu: 8 anchor presets, 4 expansion directions, 5 color themes and optional dragging.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-fab`
(https://wot-ui.cn/component/fab.html). New props added here MUST also be added to
the wd-fab parity list.

## Dragging (AGENTS.md §41)

`draggable` uses uni's own gesture events (`@touchstart` / `@touchmove` /
`@touchend` on the trigger) — no `window` listener, no `document.body`
measurement. The delta accumulates in component state and is applied as a
`translate` offset, clamped with `uni.getSystemInfoSync()` when available. Drag
does not snap to an edge after release (the reference does).

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-fab v-model:active="open" type="primary" position="right-bottom">
  <sn-button round @click="onAdd">新增</sn-button>
</sn-fab>
```

```ts
import { SnFab } from '@snui/uni'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `active` | boolean | false | no | Whether the menu is expanded (`v-model:active`). |
| `type` | 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'primary' | no | Color theme. |
| `position` | FabPosition | 'right-bottom' | no | Anchor preset. |
| `draggable` | boolean | false | no | Allow dragging the trigger. |
| `direction` | 'top' | 'right' | 'bottom' | 'left' | 'top' | no | Menu expansion direction. |
| `disabled` | boolean | false | no | Disable the whole button. |
| `inactiveIcon` | string | 'plus' | no | Icon while collapsed (registry name). |
| `activeIcon` | string | 'close' | no | Icon while expanded (registry name). |
| `zIndex` | number | 99 | no | Stacking level. |
| `gap` | SnFabGap | { top: 16, right: 16, bottom: 16, left: 16 } | no | Default gap from each edge. |
| `expandable` | boolean | true | no | Expand on tap; `false` emits `click` instead. |
| `top` | number | — | no | Explicit top offset (overrides `gap.top`). |
| `bottom` | number | — | no | Explicit bottom offset (overrides `gap.bottom`). |
| `left` | number | — | no | Explicit left offset (overrides `gap.left`). |
| `right` | number | — | no | Explicit right offset (overrides `gap.right`). |
| `customClass` | string | '' | no | Custom class for the root node. |
| `customStyle` | string | '' | no | Custom inline style for the root node. |

`SnFabGap` = `{ top?, right?, bottom?, left? }` (all px).
`FabPosition` = `'left-top' | 'right-top' | 'left-bottom' | 'right-bottom' | 'left-center' | 'right-center' | 'top-center' | 'bottom-center'`.

## Events

| Event | Payload | Description |
|---|---|---|
| `update:active` | boolean | Menu expanded / collapsed (`v-model:active`). |
| `click` | — | Trigger tapped while `expandable` is false. |

## Slots

| Slot | Description |
|---|---|
| `default` | Action items rendered inside the expandable menu. |
| `trigger` | Fully custom trigger content (replaces the icon). |

## Tokens Consumed (end: mp)

| Token | CSS Variable | Purpose |
|---|---|---|
| Action primary | `--sn-mp-color-action-primary` | `type="primary"` fill |
| Feedback success / info / warning / danger | `--sn-mp-color-feedback-success …` | Other `type` fills |
| Text on primary | `--sn-mp-color-text-on-primary` | Trigger icon color |
| Shadow LG | `--sn-mp-shadow-lg` | Trigger elevation |
| Radius full | `--sn-mp-radius-full` | Trigger shape |
| Spacing 2 / 3 | `--sn-mp-spacing-2 / -3` | Menu gap + root gap |

## Accessibility

- Trigger: `role="button"` + `aria-expanded` + `aria-disabled`.
- Menu container: `aria-hidden` mirrors the expanded state.

## Dispose

No global listener and no timer: the drag delta is plain component state, and the
gesture events live on the trigger node itself.

## Versioning

`@snui/uni@0.5.0` — initial release.
