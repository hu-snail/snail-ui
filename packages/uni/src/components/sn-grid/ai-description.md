# sn-grid / sn-grid-item — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-grid / sn-grid-item component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
>
> Internal reference metadata (AGENTS.md §112.2a / §114.4 — never surfaces in
> the user-facing docs): reference library `wd-grid / wd-grid-item`, prop surface mirrored 1:1.

## Purpose

Icon / text grid. The container publishes column count, gutter, square,
clickable, hover class, direction, icon size and centring through
`provide()`; cells read them back so one prop drives every cell.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-grid :column="3">
  <sn-grid-item text="首页" icon="Home" />
</sn-grid>
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnGrid } from '@snui/uni/components/sn-grid/sn-grid.vue'
import { SnGridItem } from '@snui/uni/components/sn-grid/sn-grid-item.vue'
```

## Props — sn-grid

| Name | Type | Default | Description |
|---|---|---|---|
| `column` | `number` | `3` | Column count and cell gutter (px). |
| `gutter` | `number` | `0` | Column count and cell gutter (px). |
| `border` | `boolean` | `false` | Inner rules, square cells, tap feedback. |
| `square` | `boolean` | `false` | Inner rules, square cells, tap feedback. |
| `clickable` | `boolean` | `false` | Inner rules, square cells, tap feedback. |
| `bgColor` | `string` | `''` | Surface override and pressed-state class. |
| `hoverClass` | `string` | `'sn-grid-item__content--hover'` | Surface override and pressed-state class. |
| `center` | `boolean` | `true` | Content flow. |
| `direction` | enum | `'vertical'` | Content flow. |
| `reverse` | `boolean` | `false` | Content flow. |
| `iconSize` | `string` | `'28px'` | Icon size inherited by every cell. |
| `customClass` | `string` | `''` | Root forwarding. |
| `customStyle` | `string` | `''` | Root forwarding. |

## Props — sn-grid-item

| Name | Type | Default | Description |
|---|---|---|---|
| `text` | `string` | `''` | Label and truncation. |
| `ellipsis` | `boolean` | `false` | Label and truncation. |
| `icon` | `string` | `''` | Icon resolution. |
| `iconColor` | `string` | `''` | Icon resolution. |
| `iconPrefix` | `string` | `''` | Icon resolution. |
| `cssIcon` | `boolean \| string` | `false` | Icon resolution. |
| `isDot` | `boolean` | `false` | Badge rendering. |
| `value` | `string \| number` | `undefined` | Badge rendering. |
| `max` | `number` | `99` | Badge rendering. |
| `url` | `string` | `''` | Forwarded through `click` only — no self-navigation. |
| `linkType` | enum | `'navigateTo'` | Forwarded through `click` only — no self-navigation. |
| `customClass` | `string` | `''` | Cell root forwarding. |
| `customStyle` | `string` | `''` | Cell root forwarding. |

## Events

| Name | Payload | Description |
|---|---|---|
| `click` | `{ url, linkType }` | Cell tapped while `clickable` or when `url` is set. |

## Slots

| Name | Scope | Description |
|---|---|---|
| `default (grid)` | — | Cell list. |
| `default` | — | Cell content areas. |
| `icon` | — | Cell content areas. |
| `text (item)` | — | Cell content areas. |

## Tokens Consumed (end: mp)

| Token | CSS Variable | Purpose |
|---|---|---|
| Surface / feedback | `--sn-mp-color-background-surface`, `--sn-mp-color-background-soft` | Grid surface and tap feedback |
| Border | `--sn-mp-color-border-subtle` | Inner rules |
| Text | `--sn-mp-color-text-primary`, `--sn-mp-color-text-secondary` | Label and icon |
| Badge | `--sn-mp-color-feedback-danger`, `--sn-mp-color-text-on-primary` | Badge fill and text |
| Font / radius / spacing | `--sn-mp-font-size-md`, `--sn-mp-radius-full`, `--sn-mp-spacing-4` | Label and cell geometry |

## Accessibility

- The grid is `role="list"` and every cell is `role="listitem"`.
- Badges are decorative text; `text` carries the meaning.
- Icons are decorative; the icon name is not announced.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Versioning

`@snui/uni@0.1.0` — layout (AUI-MP-LAY-002).
