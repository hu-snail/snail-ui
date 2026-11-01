# CodeInput · uni-app

`sn-code-input` is the boxed verification-code / PIN field of `@snui/uni`: a visually hidden native `<input>` drives the soft keyboard while the visible row is a set of token-styled boxes. easycom auto-registration (`components/sn-code-input/sn-code-input.vue` → `<sn-code-input>`); geometry in `rpx`. The caret is pure CSS (a static 2rpx bar shown only while `focused`), so there is no timer to dispose. Renamed from `sn-password-input` (Human directive 2026-11-01) — the reference ships this widget as the code-entry field.

## Basic usage

Boxed PIN field: `length` sets the box count, `mask` toggles the dots, `focused` drives the caret and the default `gutter=8` (16rpx gap) keeps cells apart — pass `gutter=0` for the flush layout.

<Demo name="code-input-mp-basic" description="Boxed PIN field: `length` sets the box count, `mask` toggles the dots and `focused` drives the caret (pair it with the keyboard visibility)." />

## Cell shape (`shape`)

`shape='box'` (framed, default) vs `shape='underline'` (bottom rule only); focus / error border colors follow automatically, and `background` works in both shapes.

<Demo name="code-input-mp-shape" description="`shape='box'` (default) vs `shape='underline'` cell shapes." />

## Cell background (`background`)

The `background` prop paints custom cell backgrounds: `var(--sn-mp-color-*)` tokens or any CSS color, riding `--sn-code-input-box-bg` and following dark mode automatically.

<Demo name="code-input-mp-background" description="The `background` prop paints custom cell backgrounds (tokens or any CSS color)." />

## Cell border (`border`)

`border='none'` strips every cell border — the box frame and the underline rule alike — leaving background-only cells; it pairs naturally with `background`, and the doodle skin's hand-drawn outline yields to it too.

<Demo name="code-input-mp-border" description="`border='none'` strips every cell border (the underline rule included) for background-only cells." />

## Plain text, error & gap (`mask` / `errorInfo` / `gutter`)

`mask=false` shows the characters; `errorInfo` overrides `info` and turns the borders danger-colored. The default 16rpx gap is tunable via `gutter` (explicit 0 restores the flush layout).

<Demo name="code-input-mp-error-gutter" description="`mask=false` shows the characters; `errorInfo` overrides `info` and turns the borders danger-colored; the default 16rpx gap is tunable via `gutter`." />

## Root class & inline style (`customClass` / `customStyle`)

`custom-class` is appended to the root node (alongside `sn-code-input`) and `custom-style` is the root inline style; the component's own `gutter` / `background` variables come first and `custom-style` is appended after it. The geometry hooks (`--sn-code-input-gap` / `-box-bg` / `-radius`) can be re-pointed from any host ancestor.

<Demo name="code-input-mp-custom-style" description="`customClass` is appended to the root; `customStyle` is appended after the component's own variables and can override other properties." />

## Props

| Prop                          | Type               | Default | Description                                         |
| ----------------------------- | ------------------ | ------- | --------------------------------------------------- |
| `modelValue`                  | `string`           | `''`    | Current value                                       |
| `mask`                        | `boolean`          | `true`  | Render dots instead of characters                   |
| `info` / `errorInfo`          | `string`           | `''`    | Helper / error text (error wins)                    |
| `gutter`                      | `number \| string` | `8`     | Gap between boxes (16rpx; `0` = flush)              |
| `border`                      | `'all' \| 'none'`  | `'all'` | `none` strips every cell border (additive, §112.3a) |
| `background`                  | `string`           | `''`    | Cell background color (additive, §112.3a)           |
| `length`                      | `number`           | `6`     | Number of boxes                                     |
| `focused`                     | `boolean`          | `true`  | Show the caret in the first empty box               |
| `customClass` / `customStyle` | `string`           | `''`    | Root class / inline style                           |

## Events

| Event               | Description               | Payload           |
| ------------------- | ------------------------- | ----------------- |
| `update:modelValue` | Value changed             | `(value: string)` |
| `change`            | Value changed (same tick) | `(value: string)` |
| `focus` / `blur`    | Native field focus / blur | `(event: Event)`  |

## Slots

This component exposes no slots.

## Theme tokens

| Token                                                            | Purpose                                   |
| ---------------------------------------------------------------- | ----------------------------------------- |
| `--sn-code-input-gap` / `-box-bg` / `-radius`                    | Component-local hooks (prop re-pointable) |
| `--sn-mp-color-input-bg` / `-border` / `-border-focus` / `-text` | Box surface, border, focus ring, glyph    |
| `--sn-mp-color-feedback-danger`                                  | Error border + message                    |
| `--sn-mp-color-action-primary`                                   | Caret                                     |
| `--sn-mp-color-text-tertiary`                                    | Helper text                               |
| `--sn-mp-radius-md`                                              | Box corners (0 for underline)             |
| `--sn-mp-font-size-xl` / `-sm`                                   | Glyph / message size                      |

## Accessibility

- The box row is `role="group"` with `aria-label` carrying "code, N of M".
- Each box has an `aria-label` ("digit N").
- The native input carries `aria-label="code"` and is the keyboard source only.

## Dark mode

Every color resolves through a `--sn-mp-*` token and there is no light literal fallback. Under `.sn-theme-dark` the text, surfaces, borders and state colors flip automatically. Verify with:
