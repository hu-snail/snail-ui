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
import { SnNavbar } from '@snui/uni/components/sn-navbar/sn-navbar.vue';
```

## Props

| Name               | Type      | Default | Required | Description                                                                                                                                                                                                                                                                                                                                        |
| ------------------ | --------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`            | `string`  | `''`    | no       | Title text.                                                                                                                                                                                                                                                                                                                                        |
| `leftText`         | `string`  | `''`    | no       | Left-side label.                                                                                                                                                                                                                                                                                                                                   |
| `rightText`        | `string`  | `''`    | no       | Right-side label.                                                                                                                                                                                                                                                                                                                                  |
| `leftArrow`        | `boolean` | `false` | no       | Render the back arrow on the left.                                                                                                                                                                                                                                                                                                                 |
| `bordered`         | `boolean` | `false` | no       | Hairline bottom border.                                                                                                                                                                                                                                                                                                                            |
| `fixed`            | `boolean` | `false` | no       | Pin the bar to the top of the viewport.                                                                                                                                                                                                                                                                                                            |
| `placeholder`      | `boolean` | `false` | no       | Reserve the bar height in flow when `fixed` (mirrors the safe-area box when `safeAreaInsetTop`).                                                                                                                                                                                                                                                   |
| `zIndex`           | `number`  | `10`    | no       | Stacking level (only written when `fixed`).                                                                                                                                                                                                                                                                                                        |
| `safeAreaInsetTop` | `boolean` | `false` | no       | Add status-bar height as top padding.                                                                                                                                                                                                                                                                                                              |
| `leftDisabled`     | `boolean` | `false` | no       | Dim the left zone and block its events.                                                                                                                                                                                                                                                                                                            |
| `rightDisabled`    | `boolean` | `false` | no       | Dim the right zone and block its events.                                                                                                                                                                                                                                                                                                           |
| `customClass`      | `string`  | `''`    | no       | Extra class on the root node.                                                                                                                                                                                                                                                                                                                      |
| `customStyle`      | `string`  | `''`    | no       | Inline style appended to the root node.                                                                                                                                                                                                                                                                                                            |
| `autoBack`         | `boolean` | `true`  | no       | AUI additive (wd-navbar only emits): the arrow performs the cross-end back navigation itself — `uni.navigateBack` when the page stack has a previous page. Set `false` when the host owns the transition (it still receives `back` / `click-left`).                                                                                                |
| `backFallback`     | `string`  | `''`    | no       | AUI additive: page opened through `uni.reLaunch` when the stack has no previous page (page opened directly / refreshed). Empty = no fallback.                                                                                                                                                                                                      |
| `mpCapsule`        | `boolean` | `true`  | no       | AUI additive: auto-render the built-in «返回 + 首页» capsule when the runtime measured a system capsule (WeChat MP environment) **and** the host provided no `#capsule` slot **and** the left zone is empty. The back half reuses `autoBack` / `backFallback`; the home half emits `back-home`. Set `false` to opt out. Has no effect on H5 / App. |

## Default back behaviour (AUI additive)

`leftArrow` taps navigate back on every end without host code:

- page stack depth > 1 → `uni.navigateBack({ delta: 1 })`;
- stack holds only the current page → `navigateBack` is **not** called (H5
  clamps delta to 0 and reloads) — `backFallback` is `uni.reLaunch`ed instead;
- no uni host (unit tests / static render) → the tap stays inert.

This is why the demo shell no longer needs `window.history` / `globalThis.uni`
branches: neither exists on App / uni-app x.

## Events

| Name          | Payload | Description                                                                                                                             |
| ------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `click-left`  | `Event` | Left zone tapped. Blocked while `leftDisabled`.                                                                                         |
| `click-right` | `Event` | Right zone tapped. Blocked while `rightDisabled`.                                                                                       |
| `back`        | `Event` | Emitted alongside `click-left` when `leftArrow` is on (or from the built-in capsule's back button), before the default back navigation. |
| `back-home`   | `Event` | Capsule zone tapped (WeChat "return home" idiom); also the built-in capsule's home button.                                              |

## Built-in MP capsule (AUI additive)

A WeChat MP page with custom navigation must draw the left «返回 + 首页»
capsule itself (WeChat only draws the right system capsule). When `mpCapsule`
is on (default) and the runtime measured a system capsule, the bar renders the
built-in capsule automatically — no per-page hand-drawing:

- trigger: measured capsule present, no `#capsule` slot, left zone empty;
- back half → emits `back`, then the `autoBack` / `backFallback` navigation
  (same contract as the arrow, minus `click-left`);
- home half → emits `back-home` only (host decides where "home" is);
- look: faint hairline pill (`--sn-mp-color-border-subtle`) with secondary
  icon colour (`--sn-mp-color-text-secondary`), 64rpx tall;
- a `#capsule` slot or any left content suppresses it; `:mp-capsule="false"`
  turns it off. H5 / App never render it.

## Slots

| Name      | Description                                       |
| --------- | ------------------------------------------------- |
| `capsule` | Custom capsule; suppresses the left zone.         |
| `left`    | Left content, overrides `leftArrow` / `leftText`. |
| `title`   | Title content, overrides `title`.                 |
| `right`   | Right content, overrides `rightText`.             |

## Tokens Consumed (end: mp)

| Token              | CSS Variable                                   | Purpose                               |
| ------------------ | ---------------------------------------------- | ------------------------------------- |
| Background surface | `--sn-mp-color-background-surface`             | Bar background                        |
| Text primary       | `--sn-mp-color-text-primary`                   | Title colour                          |
| Text secondary     | `--sn-mp-color-text-secondary`                 | Built-in capsule icon colour          |
| Border subtle      | `--sn-mp-color-border-subtle`                  | Hairline bottom border / capsule pill |
| Action primary     | `--sn-mp-color-action-primary`                 | Side-zone label colour                |
| Font size          | `--sn-mp-font-size-md`, `--sn-mp-font-size-lg` | Side / title typography               |
| Font weight        | `--sn-mp-font-weight-medium`                   | Title weight                          |
| Spacing            | `--sn-mp-spacing-1`, `--sn-mp-spacing-3`       | Icon gap and side padding             |

## Accessibility

- Root carries `role="navigation"` and `aria-label` from `title`.
- Side zones are `role="button"` with `aria-disabled` mirroring the props.
- The fixed-mode placeholder is `aria-hidden="true"` — it is pure geometry.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Versioning

`@snui/uni@0.1.0` — navigation family (AUI-MP-NAV-001).
