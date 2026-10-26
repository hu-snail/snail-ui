# sn-navbar — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-navbar component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
>
> Internal reference metadata (AGENTS.md §112.2a / §114.4 — never surfaces in
> the user-facing docs): reference library `wd-navbar`, prop surface mirrored 1:1.

## Purpose

Top navigation bar for mobile and miniprogram. Carries the page title, an
optional back arrow / left text, right-side actions, and an optional
miniprogram capsule. Supports fixed positioning with a matching placeholder,
a hairline bottom border and status-bar safe-area padding.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-navbar title="首页" left-arrow />
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnNavbar } from '@snui/uni/components/sn-navbar/sn-navbar.vue'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `title` | `string` | `''` | no | Title text. |
| `leftText` | `string` | `''` | no | Left-side label. |
| `rightText` | `string` | `''` | no | Right-side label. |
| `leftArrow` | `boolean` | `false` | no | Render the back arrow on the left. |
| `bordered` | `boolean` | `false` | no | Hairline bottom border. |
| `fixed` | `boolean` | `false` | no | Pin the bar to the top of the viewport. |
| `placeholder` | `boolean` | `false` | no | Reserve the bar height in flow when `fixed`. |
| `zIndex` | `number` | `10` | no | Stacking level (only written when `fixed`). |
| `safeAreaInsetTop` | `boolean` | `false` | no | Add status-bar height as top padding. |
| `leftDisabled` | `boolean` | `false` | no | Dim the left zone and block its events. |
| `rightDisabled` | `boolean` | `false` | no | Dim the right zone and block its events. |
| `customClass` | `string` | `''` | no | Extra class on the root node. |
| `customStyle` | `string` | `''` | no | Inline style appended to the root node. |

## Events

| Name | Payload | Description |
|---|---|---|
| `click-left` | `Event` | Left zone tapped. Blocked while `leftDisabled`. |
| `click-right` | `Event` | Right zone tapped. Blocked while `rightDisabled`. |
| `back` | `Event` | Emitted alongside `click-left` when `leftArrow` is on. |
| `back-home` | `Event` | Capsule zone tapped (WeChat "return home" idiom). |

## Slots

| Name | Description |
|---|---|
| `capsule` | Custom capsule; suppresses the left zone. |
| `left` | Left content, overrides `leftArrow` / `leftText`. |
| `title` | Title content, overrides `title`. |
| `right` | Right content, overrides `rightText`. |

## Tokens Consumed (end: mp)

| Token | CSS Variable | Purpose |
|---|---|---|
| Background surface | `--sn-mp-color-background-surface` | Bar background |
| Text primary | `--sn-mp-color-text-primary` | Title colour |
| Border subtle | `--sn-mp-color-border-subtle` | Hairline bottom border |
| Action primary | `--sn-mp-color-action-primary` | Side-zone label colour |
| Font size | `--sn-mp-font-size-md`, `--sn-mp-font-size-lg` | Side / title typography |
| Font weight | `--sn-mp-font-weight-medium` | Title weight |
| Spacing | `--sn-mp-spacing-1`, `--sn-mp-spacing-3` | Icon gap and side padding |

## Accessibility

- Root carries `role="navigation"` and `aria-label` from `title`.
- Side zones are `role="button"` with `aria-disabled` mirroring the props.
- The fixed-mode placeholder is `aria-hidden="true"` — it is pure geometry.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Versioning

`@snui/uni@0.1.0` — navigation family (AUI-MP-NAV-001).
