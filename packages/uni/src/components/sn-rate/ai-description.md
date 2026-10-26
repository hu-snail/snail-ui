# sn-sn-rate — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end Star rating with half-star selection, per-icon colors and a clearable re-tap..
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Star rating with half-star selection, per-icon colors and a clearable re-tap.

## Reference Library

Per AGENTS.md §112, the API surface mirrors wot-ui `wd-rate`
(https://wot-ui.cn/component/rate.html). New props added here MUST also be
added to the parity list.


## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-rate v-model="score" :num="5" allow-half />
```

```ts
import SnRate from '@snui/uni-src/components/sn-rate/sn-rate.vue'
```


## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number \| null` | `null` | Current score. |
| `num` | `number` | `5` | Number of icons. |
| `readonly` | `boolean` | `false` | Render-only mode. |
| `size` | `string \| number` | `undefined` | Icon size (px design units). |
| `space` | `string \| number` | `undefined` | Gap between icons. |
| `color` | `string` | `''` | Inactive color (CSS color). |
| `activeColor` | `string \| string[]` | `''` | Active color, or one per icon. |
| `icon` / `activeIcon` | `string` | `'star'` | Registry icon names. |
| `iconPrefix` | `string` | `''` | Parity only (informational). |
| `cssIcon` | `boolean \| string` | `false` | Treat the icon names as CSS classes. |
| `disabled` / `readonly` | `boolean` | `false` | Blocked states. |
| `allowHalf` | `boolean` | `false` | Half-star selection. |
| `clearable` | `boolean` | `false` | Re-tap clears back to `null`. |
| `block` | `boolean` | `false` | Stretch across the row. |
| `customClass` / `customStyle` | `string` | `''` | Root forwarding. |


## Events

| Name | Payload | When |
| --- | --- | --- |
| `update:modelValue` | `(value: number \| null)` | Score changed. |
| `change` | `{ value }` | Score changed (same tick). |


## Tokens Consumed (end: mp)

| Token | Purpose |
| --- | --- |
| `--sn-mp-color-feedback-warning` | Default active star |
| `--sn-mp-color-text-disabled` | Default inactive star |
| `--sn-mp-spacing-2` | Default icon gap |


## Accessibility

- Root is `role="slider"` with `aria-valuemin` / `aria-valuemax` / `aria-valuenow` and `aria-readonly` / `aria-disabled`.
- Each icon is `role="button"` with `aria-pressed`; `tabindex` drops to `-1` when blocked.


## Versioning

`@snui/uni@0.5.0` — initial release.
