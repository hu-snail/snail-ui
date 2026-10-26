# Dialog · uni-app

`sn-dialog` is the centred modal of `@snui/uni` (mobile / miniprogram / H5): `alert` / `confirm` / `prompt` flavours, a status icon, a full-width header image, custom action rows and a prompt field with regex / function validation. Auto-registered through easycom (`components/sn-dialog/sn-dialog.vue` → `<sn-dialog>`); geometry uses `rpx`.

> **Component form only**: wot-ui's `useDialog()` function API (`show` / `alert` / `confirm` / `prompt` / `close`) is **not implemented** this round — uni-app has no reliable programmatic mount point on every target. Use the component form with `v-model`.

## Basic usage

`type` decides the button set: `alert` has a single confirm button, `confirm` adds cancel, `prompt` also renders an input.

<Demo name="dialog-mp-basic" description="alert / confirm / prompt, with length validation on prompt." />

## Flavours and icons

- `icon`: `success` / `info` / `warning` / `danger`, or a name from the sn-icon registry
- `iconColor`: overrides the status icon color
- `theme="text"`: buttons switch to a borderless text style
- `actionLayout="vertical"`: stack the buttons
- `headerImage`: full-width image above the body

<Demo name="dialog-mp-variant" description="success / warning icons, text-theme buttons, stacked buttons." />

## Custom actions and guards

- `actions`: `{ name, color?, disabled? }[]` — when set it replaces the default confirm / cancel buttons
- `beforeConfirm`: return `false` (or resolve `false`) to veto the confirm and keep the dialog open
- `showClose` / `closeOnClickModal`: top-right close button / close on scrim tap

<Demo name="dialog-mp-actions" description="Custom action rows (with a disabled entry) and a beforeConfirm veto." />

## Custom panel styles

`customStyle` lands on the panel node and stacks with the component's own layout styles; `selector` / `rootPortal` are declared for the function API and wot-ui parity and have no effect in the component form.

<Demo name="dialog-mp-custom" description="custom-style adds padding and a min-width; selector / root-portal are parity declarations." />

## Props

| Prop                 | Type                                | Default        | Description                                                                                     |
| -------------------- | ----------------------------------- | -------------- | ----------------------------------------------------------------------------------------------- |
| `modelValue`         | `boolean`                           | `false`        | Visibility (`v-model`)                                                                          |
| `title`              | `string`                            | `''`           | Title text                                                                                      |
| `msg`                | `string`                            | `''`           | Message body                                                                                    |
| `type`               | `'alert' \| 'confirm' \| 'prompt'`  | `'alert'`      | Dialog flavour                                                                                  |
| `theme`              | `'button' \| 'text'`                | `'button'`     | Button style                                                                                    |
| `zIndex`             | `number`                            | `99`           | Stacking level                                                                                  |
| `lazyRender`         | `boolean`                           | `true`         | Defer body rendering until first open                                                           |
| `headerImage`        | `string`                            | `''`           | Full-width image above the body                                                                 |
| `icon`               | `string`                            | `''`           | Status icon: `success` / `info` / `warning` / `danger`, or a custom name                        |
| `iconColor`          | `string`                            | `''`           | Icon color                                                                                      |
| `iconProps`          | `Record<string, unknown>`           | `{}`           | Props forwarded to the inner `sn-icon`                                                          |
| `inputValue`         | `string \| number`                  | `''`           | Initial prompt value (also `v-model:input-value`)                                               |
| `inputProps`         | `Record<string, unknown>`           | `{}`           | Props forwarded to `sn-input` in prompt mode                                                    |
| `textareaProps`      | `Record<string, unknown>`           | `{}`           | When non-empty, prompt mode renders `sn-textarea`                                               |
| `inputPattern`       | `RegExp`                            | —              | Regexp the prompt value must match                                                              |
| `inputValidate`      | `(value) => boolean \| string`      | —              | Function validator; a string return is the error message                                        |
| `inputError`         | `string`                            | `''`           | Fallback error message                                                                          |
| `showErr`            | `boolean`                           | `false`        | Show the validation message                                                                     |
| `actionLayout`       | `'horizontal' \| 'vertical'`        | `'horizontal'` | Button arrangement                                                                              |
| `showCancelButton`   | `boolean`                           | —              | Defaults to `false` for `alert`, `true` otherwise                                               |
| `confirmButtonText`  | `string`                            | `''`           | Confirm label (falls back to 确定)                                                              |
| `cancelButtonText`   | `string`                            | `''`           | Cancel label (falls back to 取消)                                                               |
| `confirmButtonProps` | `string \| object \| null`          | `{}`           | Confirm button option — string is the label, object is spread onto `sn-button`, `null` hides it |
| `cancelButtonProps`  | `string \| object \| null`          | —              | Cancel button option, same grammar                                                              |
| `actions`            | `DialogAction[]`                    | `[]`           | Custom action rows; takes precedence over the default buttons                                   |
| `closeOnClickModal`  | `boolean`                           | `false`        | Close on scrim tap                                                                              |
| `showClose`          | `boolean`                           | `false`        | Show the top-right close button                                                                 |
| `beforeConfirm`      | `() => boolean \| Promise<boolean>` | —              | Guard before confirming                                                                         |
| `selector`           | `string`                            | `''`           | Instance id (parity only; inert in the component form)                                          |
| `customClass`        | `string`                            | `''`           | Custom class for the root node                                                                  |
| `customStyle`        | `string`                            | `''`           | Custom inline style for the panel                                                               |

`DialogAction` = `{ name?: string; color?: string; disabled?: boolean }`.

## Events

| Event               | Description                                             | Payload                             |
| ------------------- | ------------------------------------------------------- | ----------------------------------- |
| `update:modelValue` | `v-model` sync                                          | `boolean`                           |
| `update:inputValue` | Prompt value changed                                    | `string \| number`                  |
| `confirm`           | Confirmed (after validation + `beforeConfirm`)          | `{ action: 'confirm', inputValue }` |
| `cancel`            | Cancelled                                               | —                                   |
| `close`             | Dialog closed (confirm / cancel / close button / scrim) | —                                   |
| `select`            | A custom action row was tapped                          | `{ item, index }`                   |

## Slots

| Slot      | Description                                                               |
| --------- | ------------------------------------------------------------------------- |
| `header`  | Custom header area                                                        |
| `image`   | Custom image area (replaces `headerImage`)                                |
| `title`   | Custom title area. Slot props: `{ icon, title, iconProps }`               |
| `default` | Custom body. Slot props: `{ msg, type, inputValue, showErr, inputError }` |
| `actions` | Custom action area. Slot props: `{ confirm, cancel, close }`              |

## Theme variables

| Variable                                  | Purpose                       |
| ----------------------------------------- | ----------------------------- |
| `--sn-mp-color-text-primary`              | Title + body base color       |
| `--sn-mp-color-text-secondary`            | Message text                  |
| `--sn-mp-color-text-tertiary`             | Close icon                    |
| `--sn-mp-color-action-primary`            | Default status icon color     |
| `--sn-mp-color-feedback-danger`           | Validation message            |
| `--sn-mp-color-border-subtle`             | Custom action row separator   |
| `--sn-mp-font-size-xl`                    | Title size                    |
| `--sn-mp-font-size-md`                    | Body / action row size        |
| `--sn-mp-font-size-sm`                    | Validation message size       |
| `--sn-mp-font-line-height-tight`          | Title line height             |
| `--sn-mp-font-line-height-normal`         | Body line height              |
| `--sn-mp-font-weight-medium`              | Title / emphasised row weight |
| `--sn-mp-spacing-1` … `--sn-mp-spacing-6` | Internal rhythm               |
| `--sn-mp-radius-lg`                       | Header image corners          |

## Accessibility

- The popup supplies `role="dialog"` + `aria-modal="true"`
- Close button: `role="button"` + `aria-label="close"`
- Custom action rows: `role="button"` + `aria-disabled`
- No keyboard interception — mobile targets have no global key events

## Dark mode

The panel surface, text and status colors all come from semantic tokens (`--sn-mp-color-background-elevated` / `--sn-mp-color-text-*` / `--sn-mp-color-feedback-*`), all overridden in the dark block of `@snui/tokens-mp/styles`, so it adapts automatically. Verify with sn-config-provider 的 theme 设为 dark:

> A literal passed through `iconColor` (e.g. `#5b8def`) does not flip with the theme — prefer colors written as `var(--sn-mp-*)` in dark mode.

## Related

- Bottom action panel: [`sn-action-sheet`](/en/components/uni/action-sheet)
- Lightweight toast: [`sn-toast`](/en/components/uni/toast)
