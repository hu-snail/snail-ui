# sn-checkbox / sn-checkbox-group — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end checkbox pair.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Checkbox option (`sn-checkbox`) and its multi-select container
(`sn-checkbox-group`). The group owns the array `v-model`; children read it
through `provide`/`inject` and inherit every unset prop from the group —
wot-ui's "继承自 CheckboxGroup" contract.

## Reference Library

Per AGENTS.md §112, the API surface mirrors wot-ui `wd-checkbox` /
`wd-checkbox-group` (https://wot-ui.cn/component/checkbox.html). New props
added here MUST also be added to the parity list.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-checkbox-group v-model="picked" :max="2">
  <sn-checkbox name="a">苹果</sn-checkbox>
  <sn-checkbox name="b">香蕉</sn-checkbox>
</sn-checkbox-group>
```

```ts
import SnCheckbox from '@snui/uni-src/components/sn-checkbox/sn-checkbox.vue'
import SnCheckboxGroup from '@snui/uni-src/components/sn-checkbox/sn-checkbox-group.vue'
```

## sn-checkbox Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `modelValue` | `string \| number \| boolean` | `false` | no | Standalone value; ignored inside a group. |
| `name` | `string \| number \| boolean` | `''` | no | Identity inside `sn-checkbox-group`. |
| `type` | `'circle' \| 'square' \| 'button' \| 'dot'` | inherits group (`'circle'`) | no | Shape preset. |
| `checkedColor` | `string` | inherits group (`''`) | no | Checked color (CSS color, inline override). |
| `uncheckedColor` | `string` | inherits group (`''`) | no | Unchecked color. |
| `disabled` | `boolean` | inherits group (`false`) | no | Disables this option. |
| `readonly` | `boolean` | inherits group (`false`) | no | Read-only. |
| `indeterminate` | `boolean` | `false` | no | Half-checked (highest visual priority). |
| `trueValue` | `string \| number \| boolean` | `true` | no | Standalone "checked" value. |
| `falseValue` | `string \| number \| boolean` | `false` | no | Standalone "unchecked" value. |
| `size` | `'large' \| undefined` | inherits group | no | Size preset. |
| `placement` | `'left' \| 'right'` | inherits group (`'left'`) | no | Tick position. |
| `direction` | `'horizontal' \| 'vertical'` | inherits group (`'vertical'`) | no | Layout hint. |
| `maxWidth` | `string` | `''` | no | Max width of the label. |
| `customLabelClass` | `string` | `''` | no | Class on the label text. |
| `customClass` | `string` | `''` | no | Class on the root node. |
| `customStyle` | `string` | `''` | no | Inline style on the root node. |

## sn-checkbox Events

| Name | Payload | When |
|---|---|---|
| `update:modelValue` | `(value)` | Standalone toggle. |
| `change` | `(value)` | Toggle (standalone value, or the child's `name` inside a group). |

## sn-checkbox Slots

| Name | Description |
|---|---|
| `default` | Label text. |
| `icon` | Custom icon (scoped `{ isChecked }`). |

## sn-checkbox-group Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `modelValue` | `Array<string \| number \| boolean>` | `[]` | no | Selected values. |
| `type` | `'circle' \| 'square' \| 'button' \| 'dot'` | `'circle'` | no | Shape inherited by children. |
| `checkedColor` / `uncheckedColor` | `string` | `''` | no | Colors inherited by children. |
| `disabled` | `boolean` | `false` | no | Disables every child. |
| `readonly` | `boolean` | `false` | no | Makes every child read-only. |
| `min` | `number` | `0` | no | Minimum selection count (`0` = unconstrained). |
| `max` | `number` | `0` | no | Maximum selection count (`0` = unconstrained). |
| `size` | `'large' \| undefined` | `undefined` | no | Size inherited by children. |
| `placement` | `'left' \| 'right'` | `'left'` | no | Placement inherited by children. |
| `direction` | `'horizontal' \| 'vertical'` | `'vertical'` | no | Layout direction. |
| `customClass` / `customStyle` | `string` | `''` | no | Root forwarding. |

## sn-checkbox-group Events

| Name | Payload | When |
|---|---|---|
| `update:modelValue` | `(value: Array)` | Selection changed. |
| `change` | `(value: Array)` | Alias of `update:modelValue`. |

## sn-checkbox-group Exposed API

| Member | Signature | Description |
|---|---|---|
| `toggle` | `(name, nextChecked: boolean) => void` | Apply a selection change for one option. |
| `toggleAll` | `(checked: boolean, skipDisabled?: boolean) => void` | Select / deselect every registered child. |
| `isChecked` | `(name) => boolean` | Query the current selection. |

## Tokens Consumed (end: mp)

| Token | Purpose |
|---|---|
| `--sn-mp-color-control-unchecked` | Unchecked ring / border |
| `--sn-mp-color-action-primary` | Checked plate / chip |
| `--sn-mp-color-action-primary-soft` | Checked `button` chip fill |
| `--sn-mp-color-control-knob` | Tick glyph color plate |
| `--sn-mp-color-text-on-primary` | Tick glyph stroke |
| `--sn-mp-color-text-primary` | Label text |
| `--sn-mp-color-background-soft` | `button` chip surface |

## Accessibility

- Root is `role="checkbox"` with `aria-checked="true" | "false" | "mixed"`
  (`indeterminate` → `mixed`).
- `aria-disabled` / `aria-readonly` mirror the effective (inherited) state.
- `tabindex` flips to `-1` when disabled / read-only.
- The group is `role="group"`.

## Versioning

`@snui/uni@0.4.0` — initial release. Part of AUI-MP-008 (M1 录入类 uni components).
