# sn-textarea — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-textarea component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Multi-line text entry for mobile / miniprogram. Mobile-specific mirror of
`sn-input`'s textarea mode with the full `wd-textarea` surface (counter,
clear button, auto-height, soft-keyboard hints).

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-textarea`
(https://wot-ui.cn/component/textarea.html). New props added here MUST also
be added to the wd-textarea parity list.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-textarea v-model="text" placeholder="请输入..." />
```

```ts
// Optional explicit import (source path — dist entry is wired by the package index)
import SnTextarea from '@snui/uni-src/components/sn-textarea/sn-textarea.vue'
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `modelValue` | `string \| number` | `''` | no | v-model value; numbers render as strings. |
| `placeholder` | `string` | `'请输入...'` | no | Placeholder text (wd-textarea default). |
| `placeholderStyle` | `string` | `''` | no | Inline style for the placeholder pseudo-element. |
| `placeholderClass` | `string` | `''` | no | Class on the placeholder pseudo-element. |
| `disabled` | `boolean` | `false` | no | Native `disabled` + blocks every emit. |
| `readonly` | `boolean` | `false` | no | Visible but not editable; blocks emits. |
| `maxlength` | `number` | `-1` | no | Max length; `-1` means unlimited. |
| `clearable` | `boolean` | `false` | no | Show the × clear button. |
| `prefixIcon` | `string` | `''` | no | Front icon name, resolved via the sn-icon registry. |
| `iconPrefix` | `string` | `''` | no | Front icon CSS class (bypasses the registry). |
| `cssIcon` | `boolean \| string` | `false` | no | Treat `prefixIcon` as a CSS class name. |
| `showWordLimit` | `boolean` | `false` | no | Show `current / max`; requires `maxlength > 0`. |
| `clearTrigger` | `'always' \| 'focus'` | `'always'` | no | When the × button is visible. |
| `focusWhenClear` | `boolean` | `true` | no | Declared for parity; re-focus is a no-op on uni-end. |
| `error` | `boolean` | `false` | no | Red border + `aria-invalid`. |
| `focus` | `boolean` | `false` | no | Focus on mount. |
| `autoFocus` | `boolean` | `false` | no | Auto-focus + raise the soft keyboard. |
| `autoHeight` | `boolean` | `false` | no | Grow with content. |
| `fixed` | `boolean` | `false` | no | Fixed-position mode (keyboard does not push the field). |
| `cursorSpacing` | `number` | `0` | no | Distance between caret and keyboard (px). |
| `cursor` | `number` | `-1` | no | Initial caret position; `-1` = unset. |
| `confirmType` | `'send' \| 'search' \| 'next' \| 'go' \| 'done'` | `undefined` | no | Soft-keyboard confirm label. |
| `confirmHold` | `boolean` | `false` | no | Keep the keyboard when confirm is tapped. |
| `showConfirmBar` | `boolean` | `true` | no | Show the "完成" toolbar above the keyboard. |
| `selectionStart` | `number` | `-1` | no | Initial selection start. |
| `selectionEnd` | `number` | `-1` | no | Initial selection end. |
| `adjustPosition` | `boolean` | `true` | no | Auto-scroll when the keyboard covers the field. |
| `disableDefaultPadding` | `boolean` | `false` | no | Drop the iOS default inner padding. |
| `holdKeyboard` | `boolean` | `false` | no | Keep the keyboard when the page is tapped. |
| `ignoreCompositionEvent` | `boolean` | `true` | no | `false` emits `input` mid-composition. |
| `inputmode` | `'none' \| 'text' \| 'decimal' \| 'numeric' \| 'tel' \| 'search' \| 'email' \| 'url'` | `'text'` | no | Soft-keyboard type hint. |
| `enableNative` | `boolean` | `true` | no | Alipay MP native textarea (avoids the keyboard jump). |
| `compact` | `boolean \| undefined` | `undefined` | no | Strip padding / background for form rows. |
| `customTextareaClass` | `string` | `''` | no | Class on the inner `<textarea>`. |
| `customClass` | `string` | `''` | no | Class on the root node. |
| `customStyle` | `string` | `''` | no | Inline style on the root node. |

## Events

| Name | Payload | When |
|---|---|---|
| `update:modelValue` | `(value: string)` | Every keystroke (v-model sync). |
| `input` | `(value: string, event: Event)` | Native input. |
| `change` | `(value: string, event: Event)` | Native change. |
| `focus` / `blur` | `(event: Event)` | Native focus / blur. |
| `clear` | `()` | × button tapped. |
| `linechange` | `(event: Event)` | Native `linechange`. |
| `confirm` | `(value: string)` | Soft-keyboard confirm. |
| `keyboardheightchange` | `(event: Event)` | Keyboard height changed. |
| `click` | `(event: Event)` | Root tapped. |

## Slots

| Name | Description |
|---|---|
| `default` | — (no default slot; the native textarea is the content) |
| `prefix` | Content before the field. |
| `count` | Custom counter (scoped `{ current, max }`). |
| `clear-icon` | Custom × glyph. |

## Tokens Consumed (end: mp)

| Token | Purpose |
|---|---|
| `--sn-mp-color-input-bg` | Field background |
| `--sn-mp-color-input-text` | Field text |
| `--sn-mp-color-input-placeholder` | Placeholder |
| `--sn-mp-color-input-border` | Idle border |
| `--sn-mp-color-input-border-focus` | Focus border |
| `--sn-mp-color-feedback-danger` | Error border |
| `--sn-mp-input-padding-x` / `--sn-mp-input-radius` | Geometry |

## Accessibility

- Native `<textarea>` — no custom role needed.
- `aria-invalid="true"` when `error`; `aria-disabled` / `aria-readonly` mirror the props.
- `aria-label` defaults to the placeholder text.
- Counter has `aria-live="polite"`.

## Versioning

`@snui/uni@0.4.0` — initial release. Part of AUI-MP-006 (M1 录入类 uni components).
