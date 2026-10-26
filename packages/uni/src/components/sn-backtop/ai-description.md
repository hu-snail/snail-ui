# sn-backtop — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-backtop component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
>
> Internal reference metadata (AGENTS.md §112.2a / §114.4 — never surfaces in
> the user-facing docs): reference library `wd-backtop`, prop surface mirrored 1:1.

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

| Name          | Type                   | Default    | Description                                       |
| ------------- | ---------------------- | ---------- | ------------------------------------------------- |
| `scrollTop`   | `number`               | `0`        | Scroll distance from the host.                    |
| `text`        | `string`               | `''`       | Button label.                                     |
| `top`         | `number`               | `300`      | Visibility threshold (px) / scroll duration (ms). |
| `duration`    | `number`               | `100`      | Visibility threshold (px) / scroll duration (ms). |
| `zIndex`      | `number`               | `10`       | Stacking level.                                   |
| `iconStyle`   | `string`               | `''`       | Extra icon style over the upward rotation.        |
| `shape`       | `'circle' \| 'square'` | `'circle'` | Button shape.                                     |
| `bottom`      | `number`               | `100`      | Edge distances in px.                             |
| `right`       | `number`               | `20`       | Edge distances in px.                             |
| `customStyle` | `string`               | `''`       | Root forwarding.                                  |
| `customClass` | `string`               | `''`       | Root forwarding.                                  |

## Events

| Name    | Payload | Description                                               |
| ------- | ------- | --------------------------------------------------------- |
| `click` | `Event` | Button tapped; the host may scroll its own `scroll-view`. |

## Slots

| Name      | Description            |
| --------- | ---------------------- |
| `default` | Custom button content. |

## Tokens Consumed (end: mp)

| Token                   | CSS Variable                                                       | Purpose                  |
| ----------------------- | ------------------------------------------------------------------ | ------------------------ |
| Surface / border        | `--sn-mp-color-background-surface`, `--sn-mp-color-border-default` | Button chrome            |
| Text                    | `--sn-mp-color-text-primary`, `--sn-mp-color-text-secondary`       | Icon and label           |
| Elevation               | `--sn-mp-shadow-sm`                                                | Button shadow            |
| Radius / font / spacing | `--sn-mp-radius-full`, `--sn-mp-font-size-xs`, `--sn-mp-spacing-1` | Shape and label geometry |

## Accessibility

- Root is `role="button"` with `aria-label` from `text` (`Back to top` default).
- While hidden it also carries `aria-hidden="true"` and swallows taps.
- Scrolling goes through `uni.pageScrollTo`; a host without it is skipped and `click` still fires.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Versioning

`@snui/uni@0.1.0` — navigation (AUI-MP-NAV-008).
