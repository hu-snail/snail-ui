# sn-cell / sn-cell-group — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-cell / sn-cell-group component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
>
> Internal reference metadata (AGENTS.md §112.2a / §114.4 — never surfaces in
> the user-facing docs): reference library `wd-cell / wd-cell-group`, prop surface mirrored 1:1.

## Purpose

List row plus its grouping container. The group owns the card surface and
section heading; rows inherit `border` / `titleWidth` / `center` / `layout` /
`valueAlign` / `card` through `provide`/`inject`, and an explicit row prop always wins.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-cell-group title="账户">
  <sn-cell title="用户名" value="Ada" is-link />
</sn-cell-group>
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnCell } from '@snui/uni/components/sn-cell/sn-cell.vue';
import { SnCellGroup } from '@snui/uni/components/sn-cell/sn-cell-group.vue';
```

## Props — sn-cell-group

| Name          | Type         | Default        | Description                      |
| ------------- | ------------ | -------------- | -------------------------------- |
| `title`       | `string`     | `''`           | Section heading and group value. |
| `value`       | `string`     | `''`           | Section heading and group value. |
| `border`      | `boolean`    | `true`         | Outer border / card style.       |
| `insert`      | `boolean`    | `false`        | Outer border / card style.       |
| `layout`      | inherit-able | `'horizontal'` | Values inherited by every row.   |
| `valueAlign`  | inherit-able | `'right'`      | Values inherited by every row.   |
| `titleWidth`  | inherit-able | `undefined`    | Values inherited by every row.   |
| `center`      | inherit-able | `false`        | Values inherited by every row.   |
| `card`        | inherit-able | `false`        | Per-row card style, inherited.   |
| `customClass` | `string`     | `''`           | Root forwarding.                 |
| `customStyle` | `string`     | `''`           | Root forwarding.                 |

## Props — sn-cell

| Name               | Type                            | Default     | Description                                                          |
| ------------------ | ------------------------------- | ----------- | -------------------------------------------------------------------- |
| `title`            | `string`                        | `''`        | Row content; placeholder shows only when value is empty.             |
| `value`            | `string \| number`              | `''`        | Row content; placeholder shows only when value is empty.             |
| `placeholder`      | `string`                        | `''`        | Row content; placeholder shows only when value is empty.             |
| `label`            | `string`                        | `''`        | Row content; placeholder shows only when value is empty.             |
| `prefixIcon`       | `string`                        | `''`        | Leading icon name.                                                   |
| `suffixIcon`       | `string`                        | `''`        | Trailing icon name.                                                  |
| `iconSize`         | `string \| number`              | `undefined` | Tier names (tiny/small/medium/large/xlarge) map to `--sn-mp-icon-size-*` (default: medium); bare numbers are rpx design values. |
| `iconColor`         | `string`                       | `''`        | SVG icon colour (pass `var(--sn-mp-color-*)` token). Additive (AUI-OPT-01). |
| `prefixIconData`    | `IconData`                     | `undefined` | Leading icon data object (built-in set / custom), wins over `prefixIcon`. Additive (AUI-OPT-01). |
| `suffixIconData`    | `IconData`                     | `undefined` | Trailing icon data object (built-in set / custom), wins over `suffixIcon`. Additive (AUI-OPT-01). |
| `prefixIconUrl`     | `string`                       | `''`        | Leading image URL via `<image>`; below `prefixIconData`, above `prefixIcon`. Additive (AUI-OPT-01). |
| `suffixIconUrl`     | `string`                       | `''`        | Trailing image URL via `<image>`; below `suffixIconData`, above `suffixIcon`. Additive (AUI-OPT-01). |
| `card`              | `boolean`                      | `undefined` | Card style: row renders as an independent rounded card; inherits group when unset. Additive (AUI-OPT-01). |
| `iconPrefix`       | `string`                        | `''`        | Iconfont class prefix.                                               |
| `cssIcon`          | `boolean \| string`             | `false`     | Render a font icon.                                                  |
| `to`               | `string`                        | `''`        | Link behaviour; `to` / `replace` are forwarded through `click` only. |
| `replace`          | `boolean`                       | `false`     | Link behaviour; `to` / `replace` are forwarded through `click` only. |
| `clickable`        | `boolean`                       | `false`     | Link behaviour; `to` / `replace` are forwarded through `click` only. |
| `isLink`           | `boolean`                       | `false`     | Link behaviour; `to` / `replace` are forwarded through `click` only. |
| `arrowDirection`   | enum                            | `'right'`   | Link behaviour; `to` / `replace` are forwarded through `click` only. |
| `size`             | `'default' \| 'large'`          | `'default'` | Row size.                                                            |
| `border`           | `boolean`                       | `undefined` | Inner border; wins over the group.                                   |
| `titleWidth`       | `string \| number`              | `undefined` | Title column width.                                                  |
| `center`           | `boolean`                       | `undefined` | Vertical centring.                                                   |
| `layout`           | `'horizontal' \| 'vertical'`    | `undefined` | Row layout.                                                          |
| `valueAlign`       | `'left' \| 'right' \| 'center'` | `undefined` | Value alignment.                                                     |
| `required`         | `boolean`                       | `false`     | Required marker and truncation.                                      |
| `asteriskPosition` | enum                            | `'start'`   | Required marker and truncation.                                      |
| `hideAsterisk`     | `boolean`                       | `false`     | Required marker and truncation.                                      |
| `ellipsis`         | `boolean`                       | `false`     | Required marker and truncation.                                      |
| `useTitleSlot`     | `boolean`                       | `true`      | Toggle the title / label slots.                                      |
| `useLabelSlot`     | `boolean`                       | `true`      | Toggle the title / label slots.                                      |
| `custom*Class (6)` | `string`                        | `''`        | Per-area class hooks.                                                |

## Events

| Name    | Payload                       | Description                               |
| ------- | ----------------------------- | ----------------------------------------- |
| `click` | `Event`, `{ to, replace }`    | Row tapped while `clickable` or `isLink`. |

## Slots

| Name              | Scope | Description                           |
| ----------------- | ----- | ------------------------------------- |
| `prefix`          | —     | Row areas.                            |
| `title`           | —     | Row areas.                            |
| `label`           | —     | Row areas.                            |
| `default`         | —     | Row areas.                            |
| `suffix`          | —     | Row areas.                            |
| `title`           | —     | Group heading, group value, row list. |
| `value`           | —     | Group heading, group value, row list. |
| `default (group)` | —     | Group heading, group value, row list. |

## Tokens Consumed (end: mp)

| Token                   | CSS Variable                                                                                | Purpose                        |
| ----------------------- | ------------------------------------------------------------------------------------------- | ------------------------------ |
| Surface / feedback      | `--sn-mp-color-background-surface`, `--sn-mp-color-background-soft`                         | Row surface and tap feedback   |
| Border                  | `--sn-mp-color-border-subtle`                                                               | Inner border and group outline |
| Text                    | `--sn-mp-color-text-primary`, `--sn-mp-color-text-secondary`, `--sn-mp-color-text-tertiary` | Title, value / label, arrow    |
| Placeholder / required  | `--sn-mp-color-input-placeholder`, `--sn-mp-color-feedback-danger`                          | Placeholder and asterisk       |
| Font / radius / spacing | `--sn-mp-font-size-md`, `--sn-mp-radius-lg`, `--sn-mp-spacing-3`                            | Typography and row geometry    |
| Icon                    | `--sn-mp-icon-size-tiny` … `--sn-mp-icon-size-xlarge`, `--sn-mp-icon-stroke-width`           | Icon tier sizes and SVG stroke |

## Accessibility

- Interactive rows (`clickable` / `isLink`) are `role="button"` with `aria-label` from `title`; static rows carry no role.
- The required asterisk is `aria-hidden="true"`; required semantics belong to the host form layer.
- Arrows and icons are decorative; the title carries the meaning.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Versioning

`@snui/uni@0.1.0` — display (AUI-MP-DS-002).
