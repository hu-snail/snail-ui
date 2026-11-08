# Checkbox · uni-app

The checkbox pair for uni-app (H5 / WeChat MP / App): `sn-checkbox-group` (parent, owns the array `v-model`) + `sn-checkbox` (child, identified by `name`). easycom auto-registration (both files live in `sn-checkbox/`); geometry in `rpx`, colors from `--sn-mp-*` tokens.

Every child prop documented as "inherits from CheckboxGroup" is declared as `undefined` and read from the parent when unset — exactly wot-ui's inheritance contract.

## Basic usage

The parent holds an array `v-model`; each child identifies itself with `name`.

<Demo name="checkbox-mp-basic" description="sn-checkbox-group array v-model + sn-checkbox name." />

## Shapes (`type`: `circle` / `square` / `button` / `dot`)

`type` can be set on the parent (children inherit) or on an individual child (overrides the parent).

<Demo name="checkbox-mp-type" description="Four shapes: circle / square / button / dot." />

## Limits & states (`min` / `max` / `disabled` / `readonly` / `indeterminate` / `toggleAll`)

With `max > 0` extra selections are refused; with `min > 0` selections below the floor cannot be cleared. `indeterminate` is the half-checked state (highest visual priority, `aria-checked="mixed"`). The parent exposes `toggle` / `toggleAll` / `isChecked` for imperative use through a ref.

<Demo name="checkbox-mp-group-limits" description="min/max limits; whole-group disabled / readonly; indeterminate; toggleAll select-all / clear-all." />

## Standalone usage & remaining props (`v-model` / `trueValue` / `falseValue` / `checkedColor` / `size` / `placement` / `maxWidth`)

Outside a group `v-model` works directly and `true-value` / `false-value` set custom values; `checked-color` / `unchecked-color`, `size="large"`, `placement="right"`, `max-width` + `custom-label-class` and `custom-class` / `custom-style` each apply independently.

<Demo name="checkbox-mp-standalone-style" description="Standalone `v-model` with `trueValue` / `falseValue`; `checkedColor` / `uncheckedColor`; `size` large and `placement` right; `maxWidth` + `customLabelClass`; `customClass` / `customStyle`." />

## Props (sn-checkbox)

| Prop               | Type                                        | Default                 | Description                                 |
| ------------------ | ------------------------------------------- | ----------------------- | ------------------------------------------- |
| `modelValue`       | `string \| number \| boolean`               | `false`                 | Standalone bound value.                     |
| `name`             | `string \| number \| boolean`               | `''`                    | Identity inside the group.                  |
| `type`             | `'circle' \| 'square' \| 'button' \| 'dot'` | inherits (`'circle'`)   | Shape.                                      |
| `checkedColor`     | `string`                                    | inherits (`''`)         | Checked color (CSS color, inline override). |
| `uncheckedColor`   | `string`                                    | inherits (`''`)         | Unchecked color.                            |
| `disabled`         | `boolean`                                   | inherits (`false`)      | Disables this option.                       |
| `readonly`         | `boolean`                                   | inherits (`false`)      | Read-only.                                  |
| `indeterminate`    | `boolean`                                   | `false`                 | Half-checked state.                         |
| `trueValue`        | `string \| number \| boolean`               | `true`                  | Standalone "checked" value.                 |
| `falseValue`       | `string \| number \| boolean`               | `false`                 | Standalone "unchecked" value.               |
| `size`             | `'large' \| undefined`                      | inherits                | Size preset.                                |
| `placement`        | `'left' \| 'right'`                         | inherits (`'left'`)     | Tick position.                              |
| `direction`        | `'horizontal' \| 'vertical'`                | inherits (`'vertical'`) | Layout direction.                           |
| `maxWidth`         | `string`                                    | `''`                    | Max label width.                            |
| `customLabelClass` | `string`                                    | `''`                    | Class on the label.                         |
| `customClass`      | `string`                                    | `''`                    | Class on the root node.                     |
| `customStyle`      | `string`                                    | `''`                    | Inline style on the root node.              |

## Props (sn-checkbox-group)

| Prop                              | Type                                        | Default      | Description                                 |
| --------------------------------- | ------------------------------------------- | ------------ | ------------------------------------------- |
| `modelValue`                      | `Array<string \| number \| boolean>`        | `[]`         | Selected values.                            |
| `type`                            | `'circle' \| 'square' \| 'button' \| 'dot'` | `'circle'`   | Shape inherited by children.                |
| `checkedColor` / `uncheckedColor` | `string`                                    | `''`         | Colors inherited by children.               |
| `disabled`                        | `boolean`                                   | `false`      | Disables every option.                      |
| `readonly`                        | `boolean`                                   | `false`      | Read-only for every option.                 |
| `min`                             | `number`                                    | `0`          | Minimum selection count; `0` unconstrained. |
| `max`                             | `number`                                    | `0`          | Maximum selection count; `0` unconstrained. |
| `size`                            | `'large' \| undefined`                      | `undefined`  | Size inherited by children.                 |
| `placement`                       | `'left' \| 'right'`                         | `'left'`     | Tick position inherited by children.        |
| `direction`                       | `'horizontal' \| 'vertical'`                | `'vertical'` | Children layout direction.                  |
| `customClass` / `customStyle`     | `string`                                    | `''`         | Root forwarding.                            |

## Events

| Event               | Component         | Description                                | Payload          |
| ------------------- | ----------------- | ------------------------------------------ | ---------------- |
| `update:modelValue` | sn-checkbox       | Standalone value changed                   | `(value)`        |
| `change`            | sn-checkbox       | Toggled (payload is `name` inside a group) | `(value)`        |
| `update:modelValue` | sn-checkbox-group | Selection array changed                    | `(value: Array)` |
| `change`            | sn-checkbox-group | Fires together with `update:modelValue`    | `(value: Array)` |

## Exposed API (sn-checkbox-group)

| Member      | Signature                                            | Description                               |
| ----------- | ---------------------------------------------------- | ----------------------------------------- |
| `toggle`    | `(name, nextChecked: boolean) => void`               | Apply a single-option change.             |
| `toggleAll` | `(checked: boolean, skipDisabled?: boolean) => void` | Select / deselect every registered child. |
| `isChecked` | `(name) => boolean`                                  | Query the current selection.              |

## Slots

| Slot      | Component         | Description                          |
| --------- | ----------------- | ------------------------------------ |
| `default` | sn-checkbox       | Label text.                          |
| `icon`    | sn-checkbox       | Custom icon, scoped `{ isChecked }`. |
| `default` | sn-checkbox-group | Child list.                          |

## Theme variables

| Variable                            | Purpose                                    |
| ----------------------------------- | ------------------------------------------ |
| `--sn-mp-color-control-unchecked`   | Unchecked border / ring                    |
| `--sn-mp-color-action-primary`      | Checked plate / button-chip checked border |
| `--sn-mp-color-action-primary-soft` | Button-chip checked fill                   |
| `--sn-mp-color-control-knob`        | Tick glyph plate                           |
| `--sn-mp-color-text-on-primary`     | Tick glyph stroke                          |
| `--sn-mp-color-text-primary`        | Label text                                 |
| `--sn-mp-color-background-soft`     | Button-chip surface                        |

## Accessibility

- Root is `role="checkbox"` with `aria-checked="true" | "false" | "mixed"` (`indeterminate` → `mixed`).
- `aria-disabled` / `aria-readonly` reflect the effective (inherited) state.
- `tabindex` drops to `-1` when disabled / read-only.
- The group is `role="group"`.

## Dark mode

Every color resolves through `--sn-mp-color-*` with no light-only fallback, so `.sn-theme-dark` flips the unchecked ring, checked plate, button-chip fill and label text. Verify with:
