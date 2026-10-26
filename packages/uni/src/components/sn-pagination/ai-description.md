# sn-pagination — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-pagination component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
>
> Internal reference metadata (AGENTS.md §112.2a / §114.4 — never surfaces in
> the user-facing docs): reference library `wd-pagination`, prop surface mirrored 1:1.

## Purpose

Page stepper for mobile. `total` + `pageSize` wins over `totalPage`, and
the visible window is clamped to five entries with ellipses so a phone never
has to fit a full numeric strip.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-pagination v-model="page" :total-page="8" show-message />
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnPagination } from '@snui/uni/components/sn-pagination/sn-pagination.vue'
```

## Props

| Name | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `number` | `1` | Current page. |
| `totalPage` | `number` | `1` | Page count (overridden by `total`). |
| `total` | `number` | `0` | Dataset size; takes precedence. |
| `pageSize` | `number` | `10` | Dataset size; takes precedence. |
| `prevText` | `string` | `''` | Button labels. |
| `nextText` | `string` | `''` | Button labels. |
| `showIcon` | `boolean` | `false` | Step icons / counter. |
| `showMessage` | `boolean` | `false` | Step icons / counter. |
| `buttonVariant` | `'base' \| 'plain' \| 'dashed' \| 'text'` | `'text'` | Button look. |
| `hideIfOnePage` | `boolean` | `false` | Hide when there is one page. |
| `customClass` | `string` | `''` | Root forwarding. |
| `customStyle` | `string` | `''` | Root forwarding. |

## Events

| Name | Payload | Description |
|---|---|---|
| `update:modelValue` | `number` | Page changed. |
| `change` | `{ value }` | Page changed. |

## Slots

| Name | Scope | Description |
|---|---|---|
| `prev` | `{ modelValue, totalPageNum, total, pageSize }` | Custom button / list / counter. |
| `size` | `{ modelValue, totalPageNum, total, pageSize }` | Custom button / list / counter. |
| `next` | `{ modelValue, totalPageNum, total, pageSize }` | Custom button / list / counter. |
| `message` | `{ modelValue, totalPageNum, total, pageSize }` | Custom button / list / counter. |

## Tokens Consumed (end: mp)

| Token | CSS Variable | Purpose |
|---|---|---|
| Surface / border | `--sn-mp-color-background-surface`, `--sn-mp-color-border-default` | Base variant button |
| Text | `--sn-mp-color-text-secondary`, `--sn-mp-color-text-tertiary`, `--sn-mp-color-text-disabled` | Page, ellipsis and disabled labels |
| Action primary | `--sn-mp-color-action-primary` | Active page fill and button labels |
| Text on primary | `--sn-mp-color-text-on-primary` | Active page label |
| Font / radius | `--sn-mp-font-size-sm`, `--sn-mp-font-size-xs`, `--sn-mp-radius-sm` | Typography and button radius |

## Accessibility

- Root is `role="navigation"` with `aria-label="Pagination"`.
- Every page entry is `role="button"`; the current one carries `aria-current="page"`.
- Prev / next become `aria-disabled="true"` at the ends, which also blocks the tap.
- Ellipses are `aria-hidden="true"`.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Versioning

`@snui/uni@0.1.0` — navigation (AUI-MP-NAV-006).
