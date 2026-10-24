# sn-dialog — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-dialog component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Modal alert / confirm / prompt box centred on the screen. Supports a status
icon, a full-width header image, custom action rows, a prompt field with regex /
function validation, and a `beforeConfirm` guard.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-dialog`
(https://wot-ui.cn/component/dialog.html). New props added here MUST also be
added to the wd-dialog parity list.

## Not implemented (documented divergences)

- **Function API** (`useDialog().show` / `alert` / `confirm` / `prompt` /
  `close`) — uni-app has no reliable programmatic mount point on every target.
  Use the component form with `v-model`.
- `root-portal` — no portal host on miniprogram.
- `selector` — accepted for parity, no effect in the component form.
- `iconProps` / `inputProps` / `textareaProps` are `Record<string, unknown>`
  passthroughs instead of typed `Partial<IconProps>` / `Partial<InputProps>`.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-dialog v-model="open" type="confirm" title="删除" msg="确定删除？" />
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnDialog } from '@snui/uni'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `modelValue` | `boolean` | `false` | no | Visibility (v-model) — component-form counterpart of `show()`. |
| `title` | `string` | `''` | no | Title text. |
| `msg` | `string` | `''` | no | Message body text. |
| `type` | `'alert' \| 'confirm' \| 'prompt'` | `'alert'` | no | Dialog flavour. |
| `theme` | `'button' \| 'text'` | `'button'` | no | Button style. |
| `zIndex` | `number` | `99` | no | Stacking level. |
| `lazyRender` | `boolean` | `true` | no | Defer body rendering until first open. |
| `headerImage` | `string` | `''` | no | Full-width image above the body. |
| `icon` | `string` | `''` | no | Status icon: `success` / `info` / `warning` / `danger`, or a registry icon name. |
| `iconColor` | `string` | `''` | no | Status icon color override. |
| `iconProps` | `Record<string, unknown>` | `{}` | no | Props forwarded to the inner sn-icon. |
| `inputValue` | `string \| number` | `''` | no | Prompt value (also `v-model:inputValue`). |
| `inputProps` | `Record<string, unknown>` | `{}` | no | Props forwarded to the inner sn-input. |
| `textareaProps` | `Record<string, unknown>` | `{}` | no | When non-empty, prompt mode renders sn-textarea instead. |
| `inputPattern` | `RegExp` | — | no | Regexp the prompt value must match. |
| `inputValidate` | `(value) => boolean \| string` | — | no | Function validator; a string return is the error message. |
| `inputError` | `string` | `''` | no | Fallback message shown when validation fails. |
| `showErr` | `boolean` | `false` | no | Show the validation message under the input. |
| `actionLayout` | `'horizontal' \| 'vertical'` | `'horizontal'` | no | Action button arrangement. |
| `showCancelButton` | `boolean` | — | no | Defaults to `false` for `alert`, `true` otherwise. |
| `confirmButtonText` | `string` | `''` | no | Confirm button label (falls back to 确定). |
| `cancelButtonText` | `string` | `''` | no | Cancel button label (falls back to 取消). |
| `confirmButtonProps` | `string \| object \| null` | `{}` | no | Confirm button option — label, extra sn-button props, or `null` to hide. |
| `cancelButtonProps` | `string \| object \| null` | — | no | Cancel button option, same grammar. |
| `actions` | `DialogAction[]` | `[]` | no | Custom action rows; replaces the button row. |
| `closeOnClickModal` | `boolean` | `false` | no | Close when the scrim is tapped. |
| `showClose` | `boolean` | `false` | no | Show the top-right close button. |
| `beforeConfirm` | `() => boolean \| Promise<boolean>` | — | no | Guard that can veto a confirm. |
| `selector` | `string` | `''` | no | Instance id (parity only). |
| `customClass` | `string` | `''` | no | Custom class for the root node. |
| `customStyle` | `string` | `''` | no | Custom inline style for the panel. |

`DialogAction` = `{ name?: string; color?: string; disabled?: boolean }`.

## Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `boolean` | v-model sync. |
| `update:inputValue` | `string \| number` | Prompt value changed. |
| `confirm` | `{ action: 'confirm', inputValue }` | Confirm tapped (after validation + `beforeConfirm`). |
| `cancel` | — | Cancel tapped. |
| `close` | — | Dialog closed (confirm / cancel / close button / scrim). |
| `select` | `{ item, index }` | A custom action row was tapped. |

## Slots

| Slot | Description |
|---|---|
| `header` | Custom header area. |
| `image` | Custom image area (replaces `headerImage`). |
| `title` | Custom title area. Props: `{ icon, title, iconProps }`. |
| `default` | Custom body. Props: `{ msg, type, inputValue, showErr, inputError }`. |
| `actions` | Custom action area. Props: `{ confirm, cancel, close }`. |

## Tokens Consumed (end: mp)

| Token | CSS Variable | Purpose |
|---|---|---|
| Text primary | `--sn-mp-color-text-primary` | Title + body base |
| Text secondary | `--sn-mp-color-text-secondary` | Message text |
| Text tertiary | `--sn-mp-color-text-tertiary` | Close icon |
| Action primary | `--sn-mp-color-action-primary` | Default status icon |
| Feedback danger | `--sn-mp-color-feedback-danger` | Validation message |
| Border subtle | `--sn-mp-color-border-subtle` | Action row separator |
| Font size XL | `--sn-mp-font-size-xl` | Title |
| Font size MD | `--sn-mp-font-size-md` | Message + action rows |
| Font size SM | `--sn-mp-font-size-sm` | Validation message |
| Line height tight | `--sn-mp-font-line-height-tight` | Title |
| Line height normal | `--sn-mp-font-line-height-normal` | Body |
| Font weight medium | `--sn-mp-font-weight-medium` | Title + emphasised row |
| Spacing 1–6 | `--sn-mp-spacing-1` … `--sn-mp-spacing-6` | Internal rhythm |
| Radius LG | `--sn-mp-radius-lg` | Header image corners |

## Accessibility

- The popup panel carries `role="dialog"` + `aria-modal="true"` (from `sn-popup`).
- Close button: `role="button"` + `aria-label="close"`.
- Custom action rows: `role="button"` + `aria-disabled`.
- No keyboard handling on the uni end (miniprogram has no global key events).

## Dispose

No timer of its own — the enter / leave animation belongs to `sn-popup`, which
clears its own timer in `onBeforeUnmount`. The only internal state is the
in-flight `beforeConfirm` guard, which is a boolean flag.

## Versioning

`@snui/uni@0.5.0` — initial release. Feedback-category uni component (dialog
family).
