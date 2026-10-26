# PasswordInput · uni-app

`sn-password-input` is the boxed password field of `@snui/uni`: a visually hidden native `<input>` drives the soft keyboard while the visible row is a set of token-styled boxes. easycom auto-registration (`components/sn-password-input/sn-password-input.vue` → `<sn-password-input>`); geometry in `rpx`. The caret is pure CSS (a static 2rpx bar shown only while `focused`), so there is no timer to dispose.

## Basic usage

Boxed PIN field: `length` sets the box count, `mask` toggles the dots and `focused` drives the caret (pair it with the keyboard visibility).

<Demo name="password-input-mp-basic" description="Boxed PIN field: `length` sets the box count, `mask` toggles the dots and `focused` drives the caret (pair it with the keyboard visibility)." />

## Plain text, error & gap (`mask` / `errorInfo` / `gutter`)

`mask=false` shows the characters; `errorInfo` overrides `info` and turns the borders danger-colored; `gutter` sets the gap.

<Demo name="password-input-mp-error-gutter" description="`mask=false` shows the characters; `errorInfo` overrides `info` and turns the borders danger-colored; `gutter` sets the gap." />

## Root class & inline style (`customClass` / `customStyle`)

`custom-class` is appended to the root node (alongside `sn-password-input`) and `custom-style` is the root inline style; the component's own `gutter` variable comes first and `custom-style` is appended after it.

<Demo name="password-input-mp-custom-style" description="`customClass` is appended to the root; `customStyle` is appended after the component's own gutter variable and can override other properties." />

## Props

| Prop                          | Type               | Default | Description                           |
| ----------------------------- | ------------------ | ------- | ------------------------------------- |
| `modelValue`                  | `string`           | `''`    | Current value                         |
| `mask`                        | `boolean`          | `true`  | Render dots instead of characters     |
| `info` / `errorInfo`          | `string`           | `''`    | Helper / error text (error wins)      |
| `gutter`                      | `number \| string` | `0`     | Gap between boxes                     |
| `length`                      | `number`           | `6`     | Number of boxes                       |
| `focused`                     | `boolean`          | `true`  | Show the caret in the first empty box |
| `customClass` / `customStyle` | `string`           | `''`    | Root class / inline style             |

## Events

| Event               | Description               | Payload           |
| ------------------- | ------------------------- | ----------------- |
| `update:modelValue` | Value changed             | `(value: string)` |
| `change`            | Value changed (same tick) | `(value: string)` |
| `focus` / `blur`    | Native field focus / blur | `(event: Event)`  |

## Slots

This component exposes no slots.

## Theme tokens

| Token                                                              | Purpose                                |
| ------------------------------------------------------------------ | -------------------------------------- |
| ``--sn-mp-color-input-bg` / `-border` / `-border-focus` / `-text`` | Box surface, border, focus ring, glyph |
| `--sn-mp-color-feedback-danger`                                    | Error border + message                 |
| `--sn-mp-color-action-primary`                                     | Caret                                  |
| `--sn-mp-color-text-tertiary`                                      | Helper text                            |
| `--sn-mp-radius-md`                                                | Box corners                            |
| ``--sn-mp-font-size-xl` / `-sm``                                   | Glyph / message size                   |

## Accessibility

- The box row is `role="group"` with `aria-label` carrying "password, N of M".
- Each box has an `aria-label` ("digit N").
- The native input carries `aria-label="password"` and is the keyboard source only.

## Dark mode

Every color resolves through a `--sn-mp-*` token and there is no light literal fallback. Under `.sn-theme-dark` / `page.sn-theme-dark` the text, surfaces, borders and state colors flip automatically. Verify with:
