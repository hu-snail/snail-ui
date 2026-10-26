# sn-sn-sort-button — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end Tri-state sort toggle (ascending / reset / descending) with configurable cycle order and an underline variant..
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Tri-state sort toggle (ascending / reset / descending) with configurable cycle order and an underline variant.

## Reference Library

Per AGENTS.md §112, the API surface mirrors wot-ui `wd-sort-button`
(https://wot-ui.cn/component/sort-button.html). New props added here MUST also be
added to the parity list.


## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-sort-button v-model="direction" title="Price" allow-reset />
```

```ts
import SnSortButton from '@snui/uni-src/components/sn-sort-button/sn-sort-button.vue'
```


## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `1 \| 0 \| -1` | `0` | Current direction. |
| `title` | `string` | `''` | Button label. |
| `allowReset` | `boolean` | `false` | Include the reset state in the cycle. |
| `descFirst` | `boolean` | `false` | Cycle to descending first. |
| `line` | `boolean` | `false` | Render an underline. |
| `customClass` / `customStyle` | `string` | `''` | Root forwarding. |


## Events

| Name | Payload | When |
| --- | --- | --- |
| `update:modelValue` | `(value: 1 \| 0 \| -1)` | Direction changed. |
| `change` | `{ value }` | Direction changed (same tick). |


## Tokens Consumed (end: mp)

| Token | Purpose |
| --- | --- |
| `--sn-mp-color-text-secondary` | Idle label |
| `--sn-mp-color-text-tertiary` | Idle arrow |
| `--sn-mp-color-action-primary` | Active label / arrow / underline |
| `--sn-mp-color-border-default` | `line` underline |
| `--sn-mp-radius-md` | Corners |
| `--sn-mp-font-size-md` | Label size |


## Accessibility

- Root is `role="button"` with `aria-sort` mapped to `ascending` / `descending` / `none` and a focusable `tabindex="0"`.


## Versioning

`@snui/uni@0.5.0` — initial release.
