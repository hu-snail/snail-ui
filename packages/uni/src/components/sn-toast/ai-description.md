# sn-toast — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-toast component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Transient lightweight message shown for a moment and auto-dismissed. Optional status glyph or spinner, four anchors, optional blocking scrim.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-toast`
(https://wot-ui.cn/component/toast.html). New props added here MUST also be added
to the wd-toast parity list.

## Not implemented (documented divergences)

- **Function API** (`useToast()` and its `success` / `error` / `warning` /
  `info` / `loading` / `close` helpers) — uni-app has no reliable programmatic
  mount point on every target. Use the component form with `v-model`.
- `selector` — accepted for parity, no effect in the component form.
- `class-prefix` / `css-icon` — accepted for parity; uni icons are `IconData`
  objects resolved through `sn-icon`, so the iconfont-class path is inert.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-toast v-model="visible" msg="保存成功" icon-name="success" />
```

```ts
import { SnToast } from '@snui/uni'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `modelValue` | boolean | false | no | Visibility (v-model) — counterpart of the internal `show` state. |
| `msg` | string | '' | no | Message text. |
| `duration` | number | 2000 | no | Auto-close delay in ms; `0` keeps it open. |
| `direction` | 'horizontal' | 'vertical' | 'horizontal' | no | Layout direction of icon + text. |
| `iconName` | '' | 'success' | 'error' | 'warning' | 'loading' | 'info' | '' | no | Built-in icon kind. |
| `iconSize` | number | string | — | no | Icon size (bare number = rpx). |
| `loadingType` | 'circular' | 'spinner' | 'dots' | 'wave' | 'circular' | no | Spinner shape for `icon-name="loading"`. |
| `loadingColor` | string | '' | no | Spinner color override. |
| `loadingSize` | number | string | — | no | Spinner size (bare number = rpx). |
| `iconColor` | string | '' | no | Status glyph color override. |
| `position` | 'top' | 'middle-top' | 'middle' | 'bottom' | 'middle' | no | Anchor of the toast box. |
| `zIndex` | number | 100 | no | Stacking level. |
| `cover` | boolean | false | no | Render a blocking full-screen scrim. |
| `iconClass` | string | '' | no | Custom class for the icon node (parity). |
| `classPrefix` | string | 'wd-icon' | no | Icon class prefix (parity; inert). |
| `cssIcon` | boolean | string | false | no | CSS-icon mode (parity; inert). |
| `selector` | string | '' | no | Instance id (parity only). |
| `customClass` | string | '' | no | Custom class for the root node. |
| `customStyle` | string | '' | no | Custom inline style for the toast box. |

## Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | boolean | v-model sync (also fires on auto-close). |
| `opened` | — | Toast finished appearing. |
| `closed` | — | Toast finished closing (after the fade). |
| `click` | — | Toast box tapped. |

## Slots

| Slot | Description |
|---|---|
| `default` | Custom message content (replaces `msg`). |
| `icon` | Custom icon area. |

## Tokens Consumed (end: mp)

| Token | CSS Variable | Purpose |
|---|---|---|
| Text on primary | `--sn-mp-color-text-on-primary` | Toast text |
| Background sunken | `--sn-mp-color-background-sunken` | Toast surface |
| Background overlay | `--sn-mp-color-background-overlay` | `cover` scrim |
| Font size MD | `--sn-mp-font-size-md` | Message size |
| Line height normal | `--sn-mp-font-line-height-normal` | Message line height |
| Spacing 3 / 5 / 6 | `--sn-mp-spacing-3 / -5 / -6` | Padding + icon gap |
| Radius LG | `--sn-mp-radius-lg` | Toast box corners |

## Accessibility

- Toast box: `role="alert"` + `aria-live="assertive"`.
- Scrim: `aria-hidden="true"`, transparent unless `cover` is set.
- No keyboard interaction (auto-dismissing).

## Dispose

Two timers: the auto-close timer and the leave-transition timer. Both are
cleared on close, on re-open and in `onBeforeUnmount` (AGENTS.md §41).

## Versioning

`@snui/uni@0.5.0` — initial release.
