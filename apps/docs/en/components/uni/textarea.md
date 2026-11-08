# Textarea · uni-app

Cross-end multi-line text input for uni-app (H5 / WeChat MP / App). easycom auto-registration (`components/sn-textarea/sn-textarea.vue` → `<sn-textarea>`); geometry in `rpx`, colors from `--sn-mp-*` tokens.

## Basic usage

`v-model` binds the value; the default `placeholder` matches wot-ui (`请输入...`).

<Demo name="textarea-mp-basic" description="v-model binding + placeholder." />

## Word limit & clear (`showWordLimit` / `clearable`)

`showWordLimit` only renders the counter when `maxlength > 0` (`-1` means unlimited and hides the counter). `clearable` renders the × button; `clearTrigger` controls when it appears.

<Demo name="textarea-mp-counter-clear" description="showWordLimit + maxlength counter; clearable; error state." />

## States (`autoHeight` / `readonly` / `disabled` / `compact`)

`autoHeight` grows the field with its content; `readonly` / `disabled` genuinely block events (no `update:modelValue` emit); `compact` drops the border and background for inline form rows.

<Demo name="textarea-mp-states" description="autoHeight / readonly / disabled / compact." />
## Leading icon & placeholder (`prefixIcon` / `iconPrefix` / `cssIcon` / `placeholderStyle` / `placeholderClass`)

`prefixIcon` resolves through the sn-icon registry; `iconPrefix` + `cssIcon` apply the string as a raw CSS class and skip the registry. `placeholderStyle` injects inline styles into the placeholder and `placeholderClass` adds one extra class to it.

<Demo name="textarea-mp-prefix-icon" description="prefixIcon via the registry; iconPrefix + cssIcon via a CSS class; placeholderStyle / placeholderClass restyle the placeholder." />

## Clear timing (`clearTrigger` / `focusWhenClear`)

`clearTrigger="always"` shows the × as soon as there is a value; `"focus"` only shows it while focused. `focusWhenClear` decides whether the field tries to re-focus after clearing (a placeholder on the uni-end — the soft keyboard is already dismissed).

<Demo name="textarea-mp-clear-trigger" description="clearTrigger: always / focus controls when the × shows; focusWhenClear controls re-focus after clearing." />

## Native miniprogram attributes (MP-only)

`focus` / `autoFocus` / `fixed` / `cursor` / `selectionStart` / `selectionEnd` / `cursorSpacing` / `adjustPosition` / `disableDefaultPadding` / `holdKeyboard` / `confirmType` / `confirmHold` / `showConfirmBar` / `ignoreCompositionEvent` / `enableNative` / `inputmode` are all forwarded to the underlying native `<textarea>`.

<Demo name="textarea-mp-mp-runtime" description="focus / autoFocus / fixed / cursor / selection-* / cursorSpacing / adjustPosition / disableDefaultPadding / holdKeyboard / confirmType / confirmHold / showConfirmBar / ignoreCompositionEvent / enableNative / inputmode." />

## Custom style mount points (`customClass` / `customStyle` / `customTextareaClass`)

`customClass` / `customStyle` land on the root node; `customTextareaClass` lands on the inner native `<textarea>`.

<Demo name="textarea-mp-custom-class" description="customClass + customStyle on the root; customTextareaClass on the inner textarea." />

## Props

| Prop                              | Type                                                                                  | Default       | Description                                                              |
| --------------------------------- | ------------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------ |
| `modelValue`                      | `string \| number`                                                                    | `''`          | Bound value; numbers render as strings.                                  |
| `placeholder`                     | `string`                                                                              | `'请输入...'` | Placeholder text.                                                        |
| `placeholderStyle`                | `string`                                                                              | `''`          | Inline style for the placeholder.                                        |
| `placeholderClass`                | `string`                                                                              | `''`          | Class on the placeholder.                                                |
| `disabled`                        | `boolean`                                                                             | `false`       | Native `disabled` + blocks every emit.                                   |
| `readonly`                        | `boolean`                                                                             | `false`       | Visible but not editable; blocks emits.                                  |
| `maxlength`                       | `number`                                                                              | `-1`          | Max length; `-1` means unlimited.                                        |
| `clearable`                       | `boolean`                                                                             | `false`       | Show the × clear button.                                                 |
| `prefixIcon`                      | `string`                                                                              | `''`          | Front icon name (sn-icon registry).                                      |
| `iconPrefix`                      | `string`                                                                              | `''`          | Front icon CSS class.                                                    |
| `cssIcon`                         | `boolean \| string`                                                                   | `false`       | Treat `prefixIcon` as a CSS class.                                       |
| `showWordLimit`                   | `boolean`                                                                             | `false`       | Show the counter; needs `maxlength > 0`.                                 |
| `clearTrigger`                    | `'always' \| 'focus'`                                                                 | `'always'`    | When the × button is visible.                                            |
| `focusWhenClear`                  | `boolean`                                                                             | `true`        | Re-focus after clear (no-op on uni-end; the soft keyboard is dismissed). |
| `error`                           | `boolean`                                                                             | `false`       | Error state (red border + `aria-invalid`).                               |
| `focus`                           | `boolean`                                                                             | `false`       | Focus on mount.                                                          |
| `autoFocus`                       | `boolean`                                                                             | `false`       | Auto-focus and raise the soft keyboard.                                  |
| `autoHeight`                      | `boolean`                                                                             | `false`       | Grow with content.                                                       |
| `fixed`                           | `boolean`                                                                             | `false`       | Fixed-position mode.                                                     |
| `cursorSpacing`                   | `number`                                                                              | `0`           | Caret-to-keyboard distance (px).                                         |
| `cursor`                          | `number`                                                                              | `-1`          | Initial caret position; `-1` = unset.                                    |
| `confirmType`                     | `'send' \| 'search' \| 'next' \| 'go' \| 'done'`                                      | —             | Soft-keyboard confirm label.                                             |
| `confirmHold`                     | `boolean`                                                                             | `false`       | Keep the keyboard when confirm is tapped.                                |
| `showConfirmBar`                  | `boolean`                                                                             | `true`        | Show the toolbar above the keyboard.                                     |
| `selectionStart` / `selectionEnd` | `number`                                                                              | `-1`          | Initial selection range.                                                 |
| `adjustPosition`                  | `boolean`                                                                             | `true`        | Auto-scroll when the keyboard covers the field.                          |
| `disableDefaultPadding`           | `boolean`                                                                             | `false`       | Drop the iOS default inner padding.                                      |
| `holdKeyboard`                    | `boolean`                                                                             | `false`       | Keep the keyboard when the page is tapped.                               |
| `ignoreCompositionEvent`          | `boolean`                                                                             | `true`        | `false` emits `input` mid-composition.                                   |
| `inputmode`                       | `'none' \| 'text' \| 'decimal' \| 'numeric' \| 'tel' \| 'search' \| 'email' \| 'url'` | `'text'`      | Soft-keyboard type hint.                                                 |
| `enableNative`                    | `boolean`                                                                             | `true`        | Alipay MP native textarea.                                               |
| `compact`                         | `boolean`                                                                             | —             | Compact mode (left to sn-form-item when unset).                          |
| `customTextareaClass`             | `string`                                                                              | `''`          | Class on the inner `<textarea>`.                                         |
| `customClass`                     | `string`                                                                              | `''`          | Class on the root node.                                                  |
| `customStyle`                     | `string`                                                                              | `''`          | Inline style on the root node.                                           |

## Events

| Event                  | Description                   | Payload                         |
| ---------------------- | ----------------------------- | ------------------------------- |
| `update:modelValue`    | v-model sync, every keystroke | `(value: string)`               |
| `input`                | Native input                  | `(value: string, event: Event)` |
| `change`               | Native change                 | `(value: string, event: Event)` |
| `focus` / `blur`       | Focus / blur                  | `(event: Event)`                |
| `clear`                | × button tapped               | —                               |
| `linechange`           | Native line-count change      | `(event: Event)`                |
| `confirm`              | Soft-keyboard confirm         | `(value: string)`               |
| `keyboardheightchange` | Keyboard height changed       | `(event: Event)`                |
| `click`                | Root tapped                   | `(event: Event)`                |

## Slots

| Slot         | Description                                   |
| ------------ | --------------------------------------------- |
| `prefix`     | Content above the field (icon / custom node). |
| `count`      | Custom counter, scoped `{ current, max }`.    |
| `clear-icon` | Custom × glyph.                               |

## Theme variables

| Variable                                                   | Purpose                 |
| ---------------------------------------------------------- | ----------------------- |
| `--sn-mp-color-input-bg`                                   | Field background        |
| `--sn-mp-color-input-text`                                 | Text color              |
| `--sn-mp-color-input-placeholder`                          | Placeholder             |
| `--sn-mp-color-input-border`                               | Idle border             |
| `--sn-mp-color-input-border-focus`                         | Focus border            |
| `--sn-mp-color-feedback-danger`                            | Error border            |
| `--sn-mp-color-text-tertiary`                              | Counter text            |
| `--sn-mp-color-background-soft`                            | × button plate          |
| `--sn-mp-input-padding-x`                                  | Horizontal padding      |
| `--sn-mp-input-radius`                                     | Corner radius           |
| `--sn-mp-font-size-md` / `--sn-mp-font-line-height-normal` | Body size / line height |

## Accessibility

- Native `<textarea>` — no extra role needed.
- `aria-invalid="true"` on `error`; `aria-disabled` / `aria-readonly` mirror the props.
- `aria-label` defaults to the placeholder text.
- The counter container carries `aria-live="polite"`.

## Dark mode

Every color resolves through a `--sn-mp-color-*` token with **no** light-only fallback, so `.sn-theme-dark` flips the background, text, border and placeholder automatically. Verify with sn-config-provider 的 theme 设为 dark:
