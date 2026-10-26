# SnInput (Web)

Web-end text input component for `@snui/vue-web`. Phase 1 contract — v3.x surface.

## When to use

Use SnInput for any single-line text entry: text, password, email, number,
tel, url, search, or multi-line textarea. It pairs with `SnFormItem` for
validation surfacing (status + error message slots).

## Props

| Prop           | Type                                                | Default     | Notes                                                                |
| -------------- | --------------------------------------------------- | ----------- | -------------------------------------------------------------------- |
| modelValue     | `string \| number`                                  | `''`        | Bound via `v-model`. Coerced to `number` when `type="number"`.       |
| type           | `'text' \| 'password' \| 'email' \| 'number' \| 'tel' \| 'url' \| 'search' \| 'textarea'` | `'text'` | `textarea` renders a multi-line text area. |
| size           | `'tiny' \| 'small' \| 'medium' \| 'large'`          | `'medium'`  | Drives height + font-size.                                            |
| placeholder    | `string`                                            | `''`        | Native placeholder.                                                  |
| disabled       | `boolean`                                           | `false`     | Native `disabled` attribute + aria-disabled.                          |
| readonly       | `boolean`                                           | `false`     | Read-only — value is visible but not editable.                        |
| maxlength      | `number`                                            | —           | Forwarded to native `maxlength`.                                      |
| minlength      | `number`                                            | —           | Forwarded to native `minlength`.                                      |
| min / max / step | `number`                                          | —           | Numeric inputs only.                                                 |
| rows           | `number`                                            | `3`         | Textarea only.                                                       |
| showCount      | `boolean`                                           | `false`     | Show running counter `current / max`.                                 |
| clearable      | `boolean`                                           | `false`     | Show × button to clear value.                                         |
| status         | `'default' \| 'error' \| 'warning'`                 | `'default'` | Drives border color + `aria-invalid`. Set by FormItem on validate.    |
| required       | `boolean`                                           | `false`     | Sets `aria-required`.                                                 |
| ariaLabel      | `string`                                            | —           | Accessible name.                                                      |

## Events

| Event               | Payload                                          | When                                  |
| ------------------- | ------------------------------------------------ | ------------------------------------- |
| `update:modelValue` | `(value: string \| number)`                      | Every keystroke (v-model sync).       |
| `input`             | `(value: string \| number, event: Event)`        | Native `input` event.                 |
| `change`            | `(value: string \| number, event: Event)`        | Native `change` (blur / Enter).       |
| `focus`             | `(event: FocusEvent)`                            | Native `focus`.                       |
| `blur`              | `(event: FocusEvent)`                            | Native `blur`.                        |
| `clear`             | `()`                                             | User activated the × button.          |

## Slots

| Slot          | Description                                                  |
| ------------- | ---------------------------------------------------------- |
| `prefix`      | Renders inside the input box on the left.                  |
| `suffix`      | Renders inside the input box on the right.                 |
| `clear-icon`  | Custom content for the × clear button.                    |
| `count`       | Custom counter (receives `{ current, max }` scoped props). |

## Tokens

Visual properties resolve through `var(--sn-web-input-*)` aliases with
fallbacks to generic component tokens. Override per-instance by setting
`--sn-web-input-bg` / `--sn-web-input-border-color` / etc. on a parent
selector.

| Token                                 | Default                | Purpose            |
| ------------------------------------- | ---------------------- | ------------------ |
| `--sn-web-input-bg`                   | `--sn-web-color-background-surface` | Background         |
| `--sn-web-input-text-color`           | `--sn-web-color-text-primary`        | Text              |
| `--sn-web-input-border-color`          | `--sn-web-color-border-default`      | Border (idle)     |
| `--sn-web-input-border-color-focus`   | `--sn-web-color-action-primary`      | Border (focus)    |
| `--sn-web-input-placeholder-color`    | `--sn-web-color-text-tertiary`       | Placeholder text  |
| `--sn-web-input-padding-x`            | `10px`                                 | Horizontal pad    |
| `--sn-web-input-radius`                | `6px`                                  | Corner radius     |
| `--sn-web-focus-ring`                 | rgba brand                              | Focus halo        |

## Accessibility

- Native `<input>` / `<textarea>` element — no custom ARIA role needed.
- `aria-invalid` mirrors `status="error"`.
- `aria-required="true"` when `required`.
- `aria-disabled="true"` when `disabled` (in addition to native `disabled`).
- Pair with `<label>` outside the component or pass `aria-label`.

## Tree-shakeability

SnInput ships as a named ESM export. Apps that do not import it get
no SnInput code in their bundle. SnInput does not depend on SnIcon.

## When NOT to use

- Use a native `<select>` for option lists.
- Use SnButton with `type="submit"` inside a `<form>` for submission.
- Use SnFormItem for validation messages; SnInput itself only paints status.