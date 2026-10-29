# SortButton · uni-app

`sn-sort-button` is the tri-state sort toggle of `@snui/uni`: `1` ascending / `0` reset / `-1` descending. easycom auto-registration (`components/sn-sort-button/sn-sort-button.vue` → `<sn-sort-button>`); geometry in `rpx`. By default it toggles between ascending and descending; `allowReset` puts reset back into the cycle and `descFirst` starts with descending.

## Basic usage

Tri-state sort toggle: 1 ascending / 0 reset / -1 descending; by default it toggles between ascending and descending.

<Demo name="sort-button-mp-basic" description="Tri-state sort toggle: 1 ascending / 0 reset / -1 descending; by default it toggles between ascending and descending." />

## Reset, descending-first & underline (`allowReset` / `descFirst` / `line`)

`allowReset` puts 0 back into the cycle; `descFirst` starts with descending; `line` adds an underline.

<Demo name="sort-button-mp-reset-line" description="`allowReset` puts 0 back into the cycle; `descFirst` starts with descending; `line` adds an underline." />

## Root class & inline style (`customClass` / `customStyle`)

`custom-class` is appended to the root node (alongside `sn-sort-button`) and `custom-style` is the root inline style; together they can override padding, fill and radius.

<Demo name="sort-button-mp-custom-style" description="`customClass` is appended to the root; `customStyle` is the root inline style and can override padding, fill and radius." />

## Props

| Prop                          | Type           | Default | Description                          |
| ----------------------------- | -------------- | ------- | ------------------------------------ |
| `modelValue`                  | `1 \| 0 \| -1` | `0`     | Current direction                    |
| `title`                       | `string`       | `''`    | Button label                         |
| `allowReset`                  | `boolean`      | `false` | Include the reset state in the cycle |
| `descFirst`                   | `boolean`      | `false` | Cycle to descending first            |
| `line`                        | `boolean`      | `false` | Render an underline                  |
| `customClass` / `customStyle` | `string`       | `''`    | Root class / inline style            |

## Events

| Event               | Description                   | Payload                 |
| ------------------- | ----------------------------- | ----------------------- |
| `update:modelValue` | Direction changed             | `(value: 1 \| 0 \| -1)` |
| `change`            | Direction changed (same tick) | `{ value }`             |

## Slots

This component exposes no slots.

## Theme tokens

| Token                          | Purpose                          |
| ------------------------------ | -------------------------------- |
| `--sn-mp-color-text-secondary` | Idle label                       |
| `--sn-mp-color-text-tertiary`  | Idle arrow                       |
| `--sn-mp-color-action-primary` | Active label / arrow / underline |
| `--sn-mp-color-border-default` | `line` underline                 |
| `--sn-mp-radius-md`            | Corners                          |
| `--sn-mp-font-size-md`         | Label size                       |

## Accessibility

- Root is `role="button"` with `aria-sort` mapped to `ascending` / `descending` / `none` and a focusable `tabindex="0"`.

## Dark mode

Every color resolves through a `--sn-mp-*` token and there is no light literal fallback. Under `.sn-theme-dark` the text, surfaces, borders and state colors flip automatically. Verify with:
