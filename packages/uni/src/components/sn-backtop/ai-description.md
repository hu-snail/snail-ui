# sn-backtop — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-backtop component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
>
> Internal reference metadata (AGENTS.md §112.2a / §114.4 — never surfaces in
> the user-facing docs): reference library `wd-backtop`, prop surface mirrored 1:1.
> Additive beyond the reference (AUI-OPT-04, §112.3a): `size`, `theme`.

## Purpose

Floating "back to top" button. The scroll position arrives as the
`scrollTop` prop (page `onPageScroll` or a `scroll-view`'s `@scroll`), so the
component registers no listener it would have to dispose.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-backtop :scroll-top="scrollTop" text="顶部" />
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnBacktop } from '@snui/uni/components/sn-backtop/sn-backtop.vue';
```

## Props

| Name          | Type                                                                             | Default     | Description                                        |
| ------------- | -------------------------------------------------------------------------------- | ----------- | -------------------------------------------------- |
| `scrollTop`   | `number`                                                                         | `0`         | Scroll distance from the host.                     |
| `text`        | `string`                                                                         | `''`        | Button label.                                      |
| `top`         | `number`                                                                         | `300`       | Visibility threshold (px).                         |
| `duration`    | `number`                                                                         | `100`       | Scroll duration (ms).                              |
| `zIndex`      | `number`                                                                         | `10`        | Stacking level.                                    |
| `iconStyle`   | `string`                                                                         | `''`        | Extra icon style over the upward rotation.         |
| `shape`       | `'circle' \| 'square'`                                                           | `'circle'`  | Button shape.                                      |
| `bottom`      | `number`                                                                         | `100`       | Distance from the bottom edge (px).                |
| `right`       | `number`                                                                         | `20`        | Distance from the right edge (px).                 |
| `customStyle` | `string`                                                                         | `''`        | Root forwarding.                                   |
| `customClass` | `string`                                                                         | `''`        | Root forwarding.                                   |
| `size`        | `'small' \| 'medium' \| 'large'`                                                 | `'medium'`  | Button tier; icon follows `--sn-mp-icon-size-*`.   |
| `theme`       | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'`         | `'default'` | Semantic fill; content inverts to on-primary.      |

## Overflow contract

The root is a fixed-position flex column with `min-width` = the tier box
(72 / 88 / 104 rpx) and token horizontal padding, so the width shrinks to
fit: icon-only stays a perfect square / circle, a label grows the box, and
the label is capped (200 rpx, ellipsis) so no text length can stretch the
button. All forms — circle / square × icon / icon+text — stay inside the box.

## Events

| Name    | Payload | Description                                               |
| ------- | ------- | --------------------------------------------------------- |
| `click` | `Event` | Button tapped; the host may scroll its own `scroll-view`. |

## Slots

| Name      | Description            |
| --------- | ---------------------- |
| `default` | Custom button content. |

## Tokens Consumed (end: mp)

| Token                          | CSS Variable                                                                                                       | Purpose                          |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------ | -------------------------------- |
| Surface / border               | `--sn-mp-color-background-surface`, `--sn-mp-color-border-default`                                                 | Default theme chrome             |
| Theme fills                    | `--sn-mp-color-action-primary`, `--sn-mp-color-feedback-success/warning/danger/info`                               | `theme` fills (border follows)   |
| Inverted content               | `--sn-mp-color-text-on-primary`                                                                                    | Icon + label on themed fills     |
| Default content                | `--sn-mp-color-text-primary`, `--sn-mp-color-text-secondary`                                                       | Icon / label on the default      |
| Icon sizing                    | `--sn-mp-icon-size-small`, `--sn-mp-icon-size-medium`, `--sn-mp-icon-size-large`                                   | Icon length per `size` tier      |
| Elevation                      | `--sn-mp-shadow-sm`                                                                                                | Button shadow                    |
| Radius / font / spacing        | `--sn-mp-radius-full`, `--sn-mp-radius-md`, `--sn-mp-font-size-xs`, `--sn-mp-spacing-1`, `--sn-mp-spacing-3`       | Shape, label and padding rhythm  |

Theme routing uses four local slot variables on the root — `--sn-backtop-bg`,
`--sn-backtop-border`, `--sn-backtop-fg`, `--sn-backtop-label` — so Style
Packs can re-point a theme in one place. No `var(x, fallback)` (§112.5).

## Accessibility

- Root is `role="button"` with `aria-label` from `text` (`Back to top` default).
- While hidden it also carries `aria-hidden="true"` and swallows taps.
- Scrolling goes through `uni.pageScrollTo`; a host without it is skipped and `click` still fires.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Versioning

`@snui/uni@0.1.0` — navigation (AUI-MP-NAV-008). AUI-OPT-04 adds the
additive `size` / `theme` props, token-based icon sizing and the
overflow-proof content box (no breaking changes, §78).
