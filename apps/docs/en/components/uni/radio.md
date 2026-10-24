# Radio · uni-app

The radio pair for uni-app (H5 / WeChat MP / App): `sn-radio-group` (parent, owns the single-value `v-model`) + `sn-radio` (child, identified by `value`). easycom auto-registration (both files live in `sn-radio/`); geometry in `rpx`, colors from `--sn-mp-*` tokens.

The child is only meaningful inside the parent; every prop documented as "inherits from wd-radio-group" is declared as `undefined` and read from the parent when unset.

## Basic usage

The parent holds a single-value `v-model`; each child identifies itself with `value`. A `modelValue` of `undefined` means nothing is selected.

<Demo name="radio-mp-basic" description="sn-radio-group single-value v-model + sn-radio value." />

## Shapes (`type`: `circle` / `dot` / `square` / `button`)

`type` can be set on the parent (children inherit) or on an individual child (overrides the parent); the `button` shape turns the whole row into a chip.

<Demo name="radio-mp-type" description="Four shapes: circle / dot / square / button (button with direction=horizontal)." />

## States (`allowUncheck` / `disabled` / `readonly` / `placement`)

`allowUncheck` lets a second tap clear the selection (emits `undefined`); `disabled` / `readonly` genuinely block events; `placement` puts the marker on the left or the right of the label.

<Demo name="radio-mp-states" description="allowUncheck clears the selection; whole-group disabled / readonly; placement='right'." />

## Colors & custom class names (`checkedColor` / `uncheckedColor` / `customLabelClass` / `customClass` / `customStyle`)

`checked-color` / `unchecked-color` can be set on the group and overridden on a single `sn-radio`; `custom-label-class` lands on the label text node and `custom-class` / `custom-style` on the root.

<Demo name="radio-mp-colors-custom" description="`checkedColor` / `uncheckedColor` at group level with a per-option override; `customLabelClass` lands on the label node; `customClass` / `customStyle` on the root." />

## Props (sn-radio)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string \| number \| boolean` | `''` | This option's value, matched against the parent's `v-model`. |
| `type` | `'circle' \| 'dot' \| 'square' \| 'button'` | inherits (`'circle'`) | Shape. |
| `checkedColor` | `string` | inherits (`''`) | Checked color (CSS color, inline override). |
| `uncheckedColor` | `string` | inherits (`''`) | Unchecked color. |
| `disabled` | `boolean` | inherits (`false`) | Disables this option. |
| `readonly` | `boolean` | inherits (`false`) | Read-only. |
| `placement` | `'left' \| 'right'` | inherits (`'left'`) | Marker position. |
| `direction` | `'horizontal' \| 'vertical'` | inherits (`'vertical'`) | Layout direction. |
| `customLabelClass` | `string` | `''` | Class on the label. |
| `customClass` | `string` | `''` | Class on the root node. |
| `customStyle` | `string` | `''` | Inline style on the root node. |

## Props (sn-radio-group)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| boolean \| undefined` | `undefined` | Currently selected value. |
| `type` | `'circle' \| 'dot' \| 'square' \| 'button'` | `'circle'` | Shape inherited by children. |
| `checkedColor` / `uncheckedColor` | `string` | `''` | Colors inherited by children. |
| `disabled` | `boolean` | `false` | Disables the whole group. |
| `readonly` | `boolean` | `false` | Read-only for the whole group. |
| `placement` | `'left' \| 'right'` | `'left'` | Marker position inherited by children. |
| `direction` | `'horizontal' \| 'vertical'` | `'vertical'` | Children layout direction. |
| `allowUncheck` | `boolean` | `false` | Tapping the selected radio clears it. |
| `customClass` / `customStyle` | `string` | `''` | Root forwarding. |

## Events

| Event | Component | Description | Payload |
| --- | --- | --- | --- |
| `change` | sn-radio | This option was selected (payload is its own `value`) | `(value)` |
| `update:modelValue` | sn-radio-group | Selection changed (`undefined` when cleared via `allowUncheck`) | `(value)` |
| `change` | sn-radio-group | Fires together with `update:modelValue` | `(value)` |

## Exposed API (sn-radio-group)

| Member | Signature | Description |
| --- | --- | --- |
| `select` | `(value) => void` | Select a value programmatically. |
| `isChecked` | `(value) => boolean` | Query the current selection. |

## Slots

| Slot | Component | Description |
| --- | --- | --- |
| `default` | sn-radio | Label text. |
| `default` | sn-radio-group | Child list. |

## Theme variables

| Variable | Purpose |
| --- | --- |
| `--sn-mp-color-control-unchecked` | Unchecked ring |
| `--sn-mp-color-action-primary` | Checked ring fill |
| `--sn-mp-color-control-knob` | Inner dot plate |
| `--sn-mp-color-action-primary-soft` | Button-chip checked fill |
| `--sn-mp-color-background-soft` | Button-chip surface |
| `--sn-mp-color-text-primary` | Label text |

## Accessibility

- Root is `role="radio"` with `aria-checked="true" | "false"`.
- `aria-disabled` / `aria-readonly` reflect the effective (inherited) state.
- `tabindex` drops to `-1` when disabled / read-only.
- The group is `role="radiogroup"`.

## Dark mode

Every color resolves through `--sn-mp-color-*` with no light-only fallback, so `.sn-theme-dark` / `page.sn-theme-dark` flips the unchecked ring, checked fill, button-chip fill and label text. Verify with:

