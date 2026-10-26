# SnTransfer — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end transfer component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A double-panel shuttle list: source (unselected) on the left, target
(selected) on the right, with per-panel check-all headers
(indeterminate-capable), four move buttons (selected / all × right /
left), and optional per-panel label filtering.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-transfer` (https://www.naiveui.com/zh-CN/light/components/transfer).
Task ID: AUI-WEB-FORM-017.

## Import

```ts
import SnTransfer from '@snui/vue-web/src/transfer/SnTransfer.vue';
// or, once registered by the package entry:
import { SnTransfer } from '@snui/vue-web';
```

## Props

| Name                      | Type                                                                    | Default     | Required | Description                                                          |
| ------------------------- | ----------------------------------------------------------------------- | ----------- | -------- | -------------------------------------------------------------------- |
| `options`                 | `Array<{ label: string; value: string \| number; disabled?: boolean }>` | `[]`        | no       | Transferable entries.                                                |
| `value`                   | `Array<string \| number> \| undefined`                                  | `undefined` | no       | Selected (target) values (controlled); falls back to internal state. |
| `defaultValue`            | `Array<string \| number>`                                               | `[]`        | no       | Initial selected values for uncontrolled mode.                       |
| `filterable`              | `boolean`                                                               | `false`     | no       | Show a filter input in each panel.                                   |
| `sourceFilterPlaceholder` | `string \| undefined`                                                   | `undefined` | no       | Source filter placeholder (falls back to 请搜索).                    |
| `targetFilterPlaceholder` | `string \| undefined`                                                   | `undefined` | no       | Target filter placeholder (falls back to 请搜索).                    |
| `size`                    | `'small' \| 'medium' \| 'large'`                                        | `'medium'`  | no       | Row / button scale.                                                  |
| `disabled`                | `boolean`                                                               | `false`     | no       | Disable every control.                                               |
| `sourceTitle`             | `string \| undefined`                                                   | `undefined` | no       | Source panel title (falls back to 源).                               |
| `targetTitle`             | `string \| undefined`                                                   | `undefined` | no       | Target panel title (falls back to 目标).                             |
| `renderSourceLabel`       | `({ option }) => VNodeChild \| undefined`                               | `undefined` | no       | Custom source row label renderer.                                    |
| `renderTargetLabel`       | `({ option }) => VNodeChild \| undefined`                               | `undefined` | no       | Custom target row label renderer.                                    |

## Events

| Name           | Payload                            | Description                                    |
| -------------- | ---------------------------------- | ---------------------------------------------- |
| `update:value` | `(value: Array<string \| number>)` | Selected values committed by a move operation. |

## Slots

None (row customization goes through the `renderSourceLabel` /
`renderTargetLabel` function props, matching the reference API shape).

## Divergences from the reference API

- The per-item checkbox "selected" state is internal-only; the
  reference's `selected` / `default-selected` / `on-update:selected`
  controlled surface is not exposed (§112 future marker).
- `virtual-scroll` is not implemented — panels scroll natively
  (§112 future marker).
- Target panel order follows the `value` array order.
- Move buttons: single chevron moves CHECKED items, double chevron moves
  ALL movable items; DOM order → ⇉ ⇇ ⇠ (选中右移 / 全部右移 / 选中左移 /
  全部左移).
- Fixed zh locale strings (源 / 目标 / 请搜索 / 无数据); no config-provider
  / RTL integration.
- Theme → web tokens: panel borders `--sn-web-color-border-default` /
  `-subtle`, row heights derived from `--sn-web-button-height-*`, list
  height overridable via `--sn-transfer-list-height`.

## Accessibility

- Both lists: `role="listbox"` + `aria-multiselectable="true"` +
  localized `aria-label`; rows: `role="option"` with dynamic
  `aria-selected` / `aria-disabled`.
- Header checkboxes: `aria-checked="mixed"` via SnCheckbox
  `indeterminate`; option checkboxes carry the option label as
  `aria-label`.
- Move buttons carry Chinese `aria-label`s (右移选中项 / 全部右移 /
  左移选中项 / 全部左移) and are disabled when inapplicable.
- Rows toggle on click; the embedded native checkbox keeps keyboard
  (Tab + Space) operability.

## Tokens Consumed (end: web)

| Token                                | CSS Variable                                                                                  | Purpose                          |
| ------------------------------------ | --------------------------------------------------------------------------------------------- | -------------------------------- |
| Border default / subtle              | `--sn-web-color-border-default`, `--sn-web-color-border-subtle`                               | Panel / header borders           |
| Background surface / subtle          | `--sn-web-color-background-surface`, `--sn-web-color-background-subtle`                       | Panel + header / row hover       |
| Text primary / tertiary / disabled   | `--sn-web-color-text-primary`, `--sn-web-color-text-tertiary`, `--sn-web-color-text-disabled` | Row, count, disabled-option text |
| Input radius                         | `--sn-web-input-radius`                                                                       | Panel radius                     |
| Button height small / medium / large | `--sn-web-button-height-*`                                                                    | Row heights per size             |

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-FORM-017.
