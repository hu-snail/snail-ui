# sn-input (Uni)

Uni-end text input component for `@snui/uni`. Mobile-first ergonomics,
matches the surface area of the web-end `SnInput` (AUI-WEB-003 / AUI-MP-003).

## When to use

Use sn-input for single-line text entry on mobile: text, password, email,
number, tel, url, search, or multi-line textarea. Pairs with sn-form-item
for validation surfacing.

## Props

| Prop                                                      | Type                                                             | Default                               | Notes                                                                               |
| --------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------- | ----------------------------------------------------------------------------------- |
| modelValue                                                | `string \| number`                                               | `''`                                  | Bound via `v-model`. Coerced to `number` when `type="number"`.                      |
| type                                                      | text / password / email / number / tel / url / search / textarea | `'text'`                              | `textarea` renders a `<textarea>`.                                                  |
| size                                                      | `'small' \| 'medium' \| 'large'`                                 | `'medium'`                            | Mobile-first 3-step size.                                                           |
| placeholder                                               | `string`                                                         | `''`                                  | Native placeholder.                                                                 |
| disabled                                                  | `boolean`                                                        | `false`                               | Native `disabled` attribute + opacity.                                              |
| readonly                                                  | `boolean`                                                        | `false`                               | Read-only — value is visible but not editable.                                      |
| maxlength                                                 | `number`                                                         | —                                     | Forwarded to native `maxlength`.                                                    |
| minlength                                                 | `number`                                                         | —                                     | Forwarded to native `minlength`.                                                    |
| min / max / step                                          | `number`                                                         | —                                     | Numeric inputs only.                                                                |
| rows                                                      | `number`                                                         | `3`                                   | Textarea only.                                                                      |
| showCount                                                 | `boolean`                                                        | `false`                               | Show running counter `current / max`.                                               |
| clearable                                                 | `boolean`                                                        | `false`                               | Circular clear chip (token disc + surface ×). `focusWhenClear` re-focuses the field after clearing (H5; MP keyboards open on tap). |
| status                                                    | `'default' \| 'error' \| 'warning'`                              | `'default'`                           | Drives border color + `aria-invalid`.                                               |
| required                                                  | `boolean`                                                        | `false`                               | Sets `aria-required`.                                                               |
| ariaLabel                                                 | `string`                                                         | —                                     | Accessible name.                                                                    |
| error                                                     | `boolean`                                                        | `false`                               | Error chrome (`sn-input--error`) + `aria-invalid`. Same visual as `status="error"`. |
| cursorSpacing                                             | `number`                                                         | `0`                                   | Forwarded as the MP native `cursor-spacing`.                                        |
| confirmHold                                               | `boolean`                                                        | `false`                               | Forwarded as the MP native `confirm-hold`.                                          |
| ignoreCompositionEvent                                    | `boolean`                                                        | `true`                                | Forwarded as the MP native `ignore-composition-event`.                              |
| enableNative                                              | `boolean`                                                        | `true`                                | Forwarded as the MP native `enable-native` (Alipay MP).                             |
| confirmType / holdKeyboard / adjustPosition / alwaysEmbed | `string` / `boolean`                                             | `'done'` / `false` / `true` / `false` | Other MP native input attributes, forwarded to the inner `<input>` / `<textarea>`.  |

## Events

| Event               | Payload                                   | When                            |
| ------------------- | ----------------------------------------- | ------------------------------- |
| `update:modelValue` | `(value: string \| number)`               | Every keystroke (v-model sync). |
| `input`             | `(value: string \| number, event: Event)` | Native `input` event.           |
| `change`            | `(value: string \| number, event: Event)` | Native `change` (blur / Enter). |
| `focus`             | `(event: Event)`                          | Native `focus`.                 |
| `blur`              | `(event: Event)`                          | Native `blur`.                  |
| `clear`             | `()`                                      | User activated the × button.    |

## Slots

| Slot         | Description                                                |
| ------------ | ---------------------------------------------------------- |
| `prefix`     | Renders inside the input box on the left.                  |
| `suffix`     | Renders inside the input box on the right.                 |
| `clear-icon` | Custom content for the × clear button.                     |
| `count`      | Custom counter (receives `{ current, max }` scoped props). |

## Tokens

Geometry in rpx. Visual tokens resolve through `var(--sn-mp-input-*)`
aliases with fallbacks to existing `--sn-mp-color-*` tokens.

| Token                              | Default                            | Purpose          |
| ---------------------------------- | ---------------------------------- | ---------------- |
| `--sn-mp-input-bg`                 | `--sn-mp-color-background-surface` | Background       |
| `--sn-mp-input-text-color`         | `--sn-mp-color-text-primary`       | Text             |
| `--sn-mp-input-border-color`       | `--sn-mp-color-border-default`     | Border (idle)    |
| `--sn-mp-input-border-color-focus` | `--sn-mp-color-action-primary`     | Border (focus)   |
| `--sn-mp-input-placeholder-color`  | `--sn-mp-color-text-tertiary`      | Placeholder text |
| `--sn-mp-input-padding-x`          | `20rpx`                            | Horizontal pad   |
| `--sn-mp-input-radius`             | `12rpx`                            | Corner radius    |
| `--sn-input-icon-size`             | `var(--sn-mp-icon-size-medium)`    | In-field glyph size (prefix / suffix / clear / password toggle) |
| `--sn-input-icon-color`            | `var(--sn-mp-color-text-tertiary)` | In-field glyph color |

## Radius presets (additive)

`radius` tiers map to the shared radius token scale; `default` keeps
`--sn-mp-input-radius` (12rpx):

| Tier      | Radius                    |
| --------- | ------------------------- |
| `sm`      | `--sn-mp-radius-sm` (8rpx) |
| `default` | `--sn-mp-input-radius`    |
| `lg`      | `--sn-mp-radius-lg` (16rpx) |
| `xl`      | `--sn-mp-radius-xl` (24rpx) |
| `pill`    | fully rounded             |
| `square`  | 0                         |

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
