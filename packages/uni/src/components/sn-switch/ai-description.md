# sn-switch — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-switch component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

On/off toggle for mobile / miniprogram. `activeValue` / `inactiveValue` map
arbitrary `boolean | string | number` payloads onto the rail state, and
`beforeChange` vetoes a toggle (sync or async) before anything is emitted.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-switch`
(https://wot-ui.cn/component/switch.html). New props added here MUST also be
added to the wd-switch parity list.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-switch v-model="enabled" active-text="开" inactive-text="关" />
```

```ts
import SnSwitch from '@snui/uni-src/components/sn-switch/sn-switch.vue'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `modelValue` | `boolean \| string \| number` | `false` | no | Bound value, compared against `activeValue`. |
| `disabled` | `boolean` | `false` | no | Disables interaction, dims the rail. |
| `inactiveActionIcon` | `string` | `''` | no | Knob icon while inactive (registry name). |
| `activeActionIcon` | `string` | `''` | no | Knob icon while active (registry name). |
| `activeIcon` | `string` | `''` | no | Rail icon while active — overrides `activeText`. |
| `inactiveIcon` | `string` | `''` | no | Rail icon while inactive — overrides `inactiveText`. |
| `classPrefix` | `string` | `'wd-icon'` | no | Icon class prefix (declared for wd-switch parity). |
| `inactiveActionCssIcon` | `boolean \| string` | `false` | no | Treat `inactiveActionIcon` as a CSS class. |
| `activeActionCssIcon` | `boolean \| string` | `false` | no | Treat `activeActionIcon` as a CSS class. |
| `activeCssIcon` | `boolean \| string` | `false` | no | Treat `activeIcon` as a CSS class. |
| `inactiveCssIcon` | `boolean \| string` | `false` | no | Treat `inactiveIcon` as a CSS class. |
| `activeText` | `string` | `''` | no | Label inside the rail while on. |
| `inactiveText` | `string` | `''` | no | Label inside the rail while off. |
| `activeValue` | `boolean \| string \| number` | `true` | no | Value meaning "on" (strict equality). |
| `inactiveValue` | `boolean \| string \| number` | `false` | no | Value meaning "off" (strict equality). |
| `activeColor` | `string` | `''` | no | Active rail color (CSS color, inline override). |
| `inactiveColor` | `string` | `''` | no | Inactive rail color. |
| `size` | `string \| number` | `undefined` | no | Rail size; a number is treated as rpx. |
| `shape` | `'round' \| 'square'` | `'round'` | no | Rail shape. |
| `loading` | `boolean` | `false` | no | Spinner in the knob; blocks interaction. |
| `beforeChange` | `() => boolean \| Promise<boolean>` | `undefined` | no | Veto the toggle; `false` (or a rejection) aborts. |
| `customClass` | `string` | `''` | no | Class on the root node. |
| `customStyle` | `string` | `''` | no | Inline style on the root node. |

## Events

| Name | Payload | When |
|---|---|---|
| `update:modelValue` | `(value)` | Toggle accepted (post `beforeChange`). |
| `change` | `(value)` | Same moment as `update:modelValue`. |

## Slots

None. Rail content comes from `activeText` / `inactiveText` / the icon props.

## Tokens Consumed (end: mp)

| Token | Purpose |
|---|---|
| `--sn-mp-color-control-unchecked` | Inactive rail |
| `--sn-mp-color-action-primary` | Active rail + knob glyph |
| `--sn-mp-color-control-knob` | Knob plate |
| `--sn-mp-color-text-on-primary` | Rail label / rail icon |
| `--sn-mp-radius-full` / `-sm` / `-xs` | Round vs square geometry |
| `--sn-mp-color-border-subtle` | Loading spinner ring |

## Accessibility

- Root is `role="switch"` with `aria-checked="true" | "false"`.
- `aria-disabled="true"` when `disabled`.
- `tabindex` flips to `-1` when blocked (disabled / loading / pending).

## Versioning

`@snui/uni@0.4.0` — initial release. Part of AUI-MP-010 (M1 录入类 uni components).
