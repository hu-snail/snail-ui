# sn-input (Uni)

Uni-end text input component for `@snui/uni`. Mobile-first ergonomics,
matches the surface area of the web-end `SnInput` (AUI-WEB-003 / AUI-MP-003).

## When to use

Use sn-input for single-line text entry on mobile: text, password, email,
number, tel, url, search, or multi-line textarea. Pairs with sn-form-item
for validation surfacing.

## Props

| Prop           | Type                                              | Default     | Notes                                                                |
| -------------- | ------------------------------------------------- | ----------- | -------------------------------------------------------------------- |
| modelValue     | `string \| number`                                | `''`         | Bound via `v-model`. Coerced to `number` when `type="number"`.        |
| type           | text / password / email / number / tel / url / search / textarea | `'text'` | `textarea` renders a `<textarea>`. |
| size           | `'small' \| 'medium' \| 'large'`                  | `'medium'`  | Mobile-first 3-step size.                                            |
| placeholder    | `string`                                          | `''`        | Native placeholder.                                                  |
| disabled       | `boolean`                                         | `false`     | Native `disabled` attribute + opacity.                               |
| readonly       | `boolean`                                         | `false`     | Read-only — value is visible but not editable.                        |
| maxlength      | `number`                                          | —           | Forwarded to native `maxlength`.                                      |
| minlength      | `number`                                          | —           | Forwarded to native `minlength`.                                      |
| min / max / step | `number`                                        | —           | Numeric inputs only.                                                 |
| rows           | `number`                                          | `3`         | Textarea only.                                                       |
| showCount      | `boolean`                                         | `false`     | Show running counter `current / max`.                                 |
| clearable      | `boolean`                                         | `false`     | Show × button to clear value.                                         |
| status         | `'default' \| 'error' \| 'warning'`               | `'default'` | Drives border color + `aria-invalid`.                                |
| required       | `boolean`                                         | `false`     | Sets `aria-required`.                                                 |
| ariaLabel      | `string`                                          | —           | Accessible name.                                                      |

## Events

| Event               | Payload                                          | When                                  |
| ------------------- | ------------------------------------------------ | ------------------------------------- |
| `update:modelValue` | `(value: string \| number)`                      | Every keystroke (v-model sync).       |
| `input`             | `(value: string \| number, event: Event)`        | Native `input` event.                 |
| `change`            | `(value: string \| number, event: Event)`        | Native `change` (blur / Enter).       |
| `focus`             | `(event: Event)`                                 | Native `focus`.                       |
| `blur`              | `(event: Event)`                                 | Native `blur`.                        |
| `clear`             | `()`                                             | User activated the × button.          |

## Slots

| Slot          | Description                                                  |
| ------------- | ---------------------------------------------------------- |
| `prefix`      | Renders inside the input box on the left.                  |
| `suffix`      | Renders inside the input box on the right.                 |
| `clear-icon`  | Custom content for the × clear button.                    |
| `count`       | Custom counter (receives `{ current, max }` scoped props). |

## Tokens

Geometry in rpx. Visual tokens resolve through `var(--sn-mp-input-*)`
aliases with fallbacks to existing `--sn-mp-color-*` tokens.

| Token                                 | Default                | Purpose            |
| ------------------------------------- | ---------------------- | ------------------ |
| `--sn-mp-input-bg`                    | `--sn-mp-color-background-surface` | Background         |
| `--sn-mp-input-text-color`            | `--sn-mp-color-text-primary`        | Text              |
| `--sn-mp-input-border-color`          | `--sn-mp-color-border-default`      | Border (idle)     |
| `--sn-mp-input-border-color-focus`    | `--sn-mp-color-action-primary`      | Border (focus)    |
| `--sn-mp-input-placeholder-color`     | `--sn-mp-color-text-tertiary`       | Placeholder text  |
| `--sn-mp-input-padding-x`             | `20rpx`                                | Horizontal pad    |
| `--sn-mp-input-radius`                | `12rpx`                                | Corner radius     |

## Accessibility

- Native `<input>` / `<textarea>` element — no custom ARIA role needed.
- `aria-invalid` mirrors `status="error"`.
- `aria-required="true"` when `required`.
- Pair with a visible `<label>` outside the component (form usage) or
  pass `aria-label` for icon-only contexts.

## When NOT to use

- Use a native `<picker>` for option lists.
- Use sn-button for submission actions.
- Use sn-form-item for validation messages; sn-input itself only paints status.