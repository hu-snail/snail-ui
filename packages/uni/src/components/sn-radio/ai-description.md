# sn-radio / sn-radio-group — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end radio pair.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Radio option (`sn-radio`) and its single-select container
(`sn-radio-group`). The group owns the single-value `v-model`; children read
it through `provide`/`inject` and inherit every unset prop from the group —
wot-ui's "继承自 wd-radio-group" contract. `sn-radio` is only meaningful
inside a group.

## Reference Library

Per AGENTS.md §112, the API surface mirrors wot-ui `wd-radio` /
`wd-radio-group` (https://wot-ui.cn/component/radio.html). New props added
here MUST also be added to the parity list.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-radio-group v-model="picked">
  <sn-radio value="a">选项 A</sn-radio>
  <sn-radio value="b">选项 B</sn-radio>
</sn-radio-group>
```

```ts
import SnRadio from '@snui/uni-src/components/sn-radio/sn-radio.vue';
import SnRadioGroup from '@snui/uni-src/components/sn-radio/sn-radio-group.vue';
```

## sn-radio Props

| Name               | Type                                        | Default                       | Required | Description                                                 |
| ------------------ | ------------------------------------------- | ----------------------------- | -------- | ----------------------------------------------------------- |
| `value`            | `string \| number \| boolean`               | `''`                          | no       | This option's value, matched against the group's `v-model`. |
| `type`             | `'circle' \| 'dot' \| 'square' \| 'button'` | inherits group (`'circle'`)   | no       | Shape preset.                                               |
| `checkedColor`     | `string`                                    | inherits group (`''`)         | no       | Checked color (CSS color, inline override).                 |
| `uncheckedColor`   | `string`                                    | inherits group (`''`)         | no       | Unchecked color.                                            |
| `disabled`         | `boolean`                                   | inherits group (`false`)      | no       | Disables this option.                                       |
| `readonly`         | `boolean`                                   | inherits group (`false`)      | no       | Read-only.                                                  |
| `placement`        | `'left' \| 'right'`                         | inherits group (`'left'`)     | no       | Marker position.                                            |
| `direction`        | `'horizontal' \| 'vertical'`                | inherits group (`'vertical'`) | no       | Layout hint.                                                |
| `customLabelClass` | `string`                                    | `''`                          | no       | Class on the label text.                                    |
| `customClass`      | `string`                                    | `''`                          | no       | Class on the root node.                                     |
| `customStyle`      | `string`                                    | `''`                          | no       | Inline style on the root node.                              |

## sn-radio Events

| Name     | Payload   | When                                                   |
| -------- | --------- | ------------------------------------------------------ |
| `change` | `(value)` | This option was selected (payload is its own `value`). |

## sn-radio Slots

| Name      | Description |
| --------- | ----------- |
| `default` | Label text. |

## sn-radio-group Props

| Name                              | Type                                        | Default      | Required | Description                                      |
| --------------------------------- | ------------------------------------------- | ------------ | -------- | ------------------------------------------------ |
| `modelValue`                      | `string \| number \| boolean \| undefined`  | `undefined`  | no       | Currently selected value.                        |
| `type`                            | `'circle' \| 'dot' \| 'square' \| 'button'` | `'circle'`   | no       | Shape inherited by children.                     |
| `checkedColor` / `uncheckedColor` | `string`                                    | `''`         | no       | Colors inherited by children.                    |
| `disabled`                        | `boolean`                                   | `false`      | no       | Disables every child.                            |
| `readonly`                        | `boolean`                                   | `false`      | no       | Makes every child read-only.                     |
| `placement`                       | `'left' \| 'right'`                         | `'left'`     | no       | Placement inherited by children.                 |
| `direction`                       | `'horizontal' \| 'vertical'`                | `'vertical'` | no       | Layout direction.                                |
| `allowUncheck`                    | `boolean`                                   | `false`      | no       | Tapping the selected radio clears the selection. |
| `customClass` / `customStyle`     | `string`                                    | `''`         | no       | Root forwarding.                                 |

## sn-radio-group Events

| Name                | Payload   | When                                                             |
| ------------------- | --------- | ---------------------------------------------------------------- |
| `update:modelValue` | `(value)` | Selection changed (`undefined` when cleared via `allowUncheck`). |
| `change`            | `(value)` | Alias of `update:modelValue`.                                    |

## sn-radio-group Exposed API

| Member      | Signature            | Description                      |
| ----------- | -------------------- | -------------------------------- |
| `select`    | `(value) => void`    | Select a value programmatically. |
| `isChecked` | `(value) => boolean` | Query the current selection.     |

## Tokens Consumed (end: mp)

| Token                               | Purpose                    |
| ----------------------------------- | -------------------------- |
| `--sn-mp-color-control-unchecked`   | Unchecked ring             |
| `--sn-mp-color-action-primary`      | Checked ring fill          |
| `--sn-mp-color-control-knob`        | Inner dot plate            |
| `--sn-mp-color-action-primary-soft` | Checked `button` chip fill |
| `--sn-mp-color-background-soft`     | `button` chip surface      |
| `--sn-mp-color-text-primary`        | Label text                 |

## Accessibility

- Root is `role="radio"` with `aria-checked="true" | "false"`.
- `aria-disabled` / `aria-readonly` mirror the effective (inherited) state.
- `tabindex` flips to `-1` when disabled / read-only.
- The group is `role="radiogroup"`.

## Versioning

`@snui/uni@0.4.0` — initial release. Part of AUI-MP-009 (M1 录入类 uni components).
