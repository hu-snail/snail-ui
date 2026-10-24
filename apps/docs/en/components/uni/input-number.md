# InputNumber · uni-app

`sn-input-number` is the numeric stepper of `@snui/uni` (mobile / mini-program / H5): an editable field with a pair of action buttons. easycom auto-registration (`components/sn-input-number/sn-input-number.vue` → `<sn-input-number>`); geometry in `rpx`, colors from `--sn-mp-*` tokens. Every commit path (buttons / typing / blur) runs through the same normalization: clamp into `[min, max]`, snap onto the `step` grid when `stepStrictly` is set, round to `precision`, then ask `beforeChange`.

## Basic usage

Basic sn-input-number: min / max bounds, step and precision.

<Demo name="input-number-mp-basic" description="Basic sn-input-number: min / max bounds, step and precision." />

## Themes & states (`theme` / `round` / `disabled` / `longPress`)

Four themes (default / outline / outline-split / primary), plus round, disabled and long-press repeat.

<Demo name="input-number-mp-theme-state" description="Four themes (default / outline / outline-split / primary), plus round, disabled and long-press repeat." />
## Disabling the field and each button independently (`disableInput` / `disableMinus` / `disablePlus` / `withoutInput` / `inputWidth`)

`disabled` locks the whole stepper; the three `disable*` props lock one part each; `withoutInput` leaves only the buttons; `inputWidth` sizes the field (a number is an rpx design value).

<Demo name="input-number-mp-controls" description="disableInput / disableMinus / disablePlus; withoutInput leaves the buttons only; inputWidth." />

## Value rules & commit timing (`stepStrictly` / `allowNull` / `placeholder` / `beforeChange` / `immediateChange` / `updateOnInit` / `inputType` / `adjustPosition` / `custom*`)

`stepStrictly` snaps values onto the `step` grid; `allowNull` lets the field stay empty; `beforeChange` can veto every change; `immediateChange=false` commits on blur / button only; `updateOnInit` corrects an out-of-range value on mount; `inputType` / `adjustPosition` are forwarded to the native field; `customClass` / `customStyle` land on the root node.

<Demo name="input-number-mp-commit-hooks" description="stepStrictly; allowNull + placeholder; beforeChange veto; immediateChange=false; updateOnInit; inputType; adjustPosition." />

## Custom styling (`customClass` / `customStyle`)

<Demo name="input-number-mp-custom-class" description="The customClass and customStyle mount points." />

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `number \| string` | `0` | Bound value |
| `min` | `number` | `1` | Lower bound |
| `max` | `number` | `Number.MAX_SAFE_INTEGER` | Upper bound |
| `step` | `number` | `1` | Increment / decrement step |
| `stepStrictly` | `boolean` | `false` | Snap every value onto the step grid |
| `precision` | `number \| string` | `0` | Decimal places kept after a commit |
| `disabled` | `boolean` | `false` | Disables the whole stepper |
| `disableInput` | `boolean` | `false` | Disables the field only |
| `disableMinus` | `boolean` | `false` | Disables the minus button only |
| `disablePlus` | `boolean` | `false` | Disables the plus button only |
| `withoutInput` | `boolean` | `false` | Hide the field, buttons only |
| `inputWidth` | `number \| string` | `undefined` | Field width; a number is an rpx design value |
| `allowNull` | `boolean` | `false` | Allow the field to hold an empty string |
| `placeholder` | `string` | `''` | Placeholder for an empty field |
| `adjustPosition` | `boolean` | `true` | Auto-scroll when the keyboard covers the field |
| `beforeChange` | `(value) => boolean \| Promise<boolean>` | `undefined` | Veto hook for every commit |
| `longPress` | `boolean` | `false` | Repeat the step while a button is held |
| `immediateChange` | `boolean` | `true` | Commit while typing; `false` commits on blur |
| `updateOnInit` | `boolean` | `true` | Emit a corrected value on mount |
| `inputType` | `'number' \| 'digit'` | `'digit'` | Native keyboard type |
| `theme` | `'default' \| 'outline' \| 'outline-split' \| 'primary'` | `'default'` | Visual theme |
| `round` | `boolean` | `false` | Fully rounded action buttons |
| `customClass` / `customStyle` | `string` | `''` | Root class / inline style |

## Events

| Event | Description | Payload |
| --- | --- | --- |
| `update:modelValue` | Value committed | `(value: number \| string)` |
| `change` | Value committed (same tick) | `{ value }` |
| `focus` | Field focused | `{ value, height }` |
| `blur` | Field blurred | `{ value }` |

## Slots

This component exposes no slots.

## Theme tokens

| Token | Purpose |
| --- | --- |
| ``--sn-mp-color-background-soft`` | Stepper surface |
| ``--sn-mp-color-background-elevated`` | Action-button plate |
| ``--sn-mp-color-text-primary` / `-secondary` / `-disabled`` | Value / buttons / disabled |
| ``--sn-mp-color-action-primary` / `-soft`` | `primary` theme fills |
| ``--sn-mp-color-text-on-primary`` | `primary` plus glyph |
| ``--sn-mp-color-border-default` / `-subtle`` | `outline` border / divider |
| ``--sn-mp-radius-md` / `-sm` / `-full`` | Corner presets |

## Accessibility

- Root is `role="group"` with `aria-disabled`.
- Both action buttons are `role="button"` with `aria-label` ("increase" / "decrease"); at the bounds they get `aria-disabled="true"` and `tabindex="-1"`.
- The field carries `aria-label` (the placeholder, else "number input").

## Dark mode

Every color resolves through a `--sn-mp-*` token and there is no light literal fallback. Under `.sn-theme-dark` / `page.sn-theme-dark` the text, surfaces, borders and state colors flip automatically. Verify with:

