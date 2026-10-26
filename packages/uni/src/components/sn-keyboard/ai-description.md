# sn-sn-keyboard — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end On-screen keypad for numeric / car-plate / custom entry. Caps the value at `maxlength`, supports extra keys and a car-language toggle..
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

On-screen keypad for numeric / car-plate / custom entry. Caps the value at `maxlength`, supports extra keys and a car-language toggle.

## Reference Library

Per AGENTS.md §112, the API surface mirrors wot-ui `wd-keyboard`
(https://wot-ui.cn/component/keyboard.html). New props added here MUST also be
added to the parity list.


## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-keyboard v-model="amount" v-model:visible="open" :maxlength="6" title="金额" />
```

```ts
import SnKeyboard from '@snui/uni-src/components/sn-keyboard/sn-keyboard.vue'
```


## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `visible` | `boolean` | `false` | Keyboard visibility. |
| `modelValue` | `string` | `''` | Current value. |
| `title` | `string` | `''` | Keyboard title. |
| `mode` | `'default' \| 'custom' \| 'car'` | `'default'` | Layout preset. |
| `zIndex` | `number` | `100` | Stacking level. |
| `maxlength` | `number` | `Infinity` | Maximum value length. |
| `showDeleteKey` | `boolean` | `true` | Render the delete key. |
| `randomKeyOrder` | `boolean` | `false` | Shuffle the digit keys. |
| `closeText` / `deleteText` | `string` | `''` | Button labels. |
| `closeButtonLoading` | `boolean` | `false` | Spinner in the close button. |
| `modal` / `hideOnClickOutside` / `lockScroll` | `boolean` | `false` / `true` / `true` | Scrim behaviour. |
| `safeAreaInsetBottom` | `boolean` | `true` | Safe-area padding. |
| `extraKey` | `string \| string[]` | `undefined` | Extra digit-grid key(s). |
| `carLang` | `'zh' \| 'en'` | `'zh'` | Car-plate language (`v-model:car-lang`). |
| `autoSwitchLang` | `boolean` | `false` | Switch to letters after the province char. |
| `customClass` / `customStyle` | `string` | `''` | Root forwarding. |
| `rootPortal` | `boolean` | `false` | **Declared, not implemented** — forwarded to `sn-popup`; miniprogram has no portal host. |


## Events

| Name | Payload | When |
| --- | --- | --- |
| `update:modelValue` | `(value: string)` | Value changed. |
| `update:visible` | `(value: boolean)` | Visibility changed. |
| `update:carLang` | `(lang: 'zh' '|' 'en')` | Car language changed. |
| `input` | `(key: string)` | A character key was pressed. |
| `delete` | — | Delete key pressed. |
| `close` | — | Keyboard closed. |


## Not Implemented

`root-portal` — declared and forwarded to `sn-popup`, but uni-app miniprograms
have no portal host, so it has no visual effect.


## Tokens Consumed (end: mp)

| Token | Purpose |
| --- | --- |
| `--sn-mp-color-background-elevated` | Keyboard surface |
| `--sn-mp-color-background-soft` | Key plate |
| `--sn-mp-color-background-sunken` | Custom-mode delete plate |
| `--sn-mp-color-text-primary` / `-secondary` / `-tertiary` | Key + header text |
| `--sn-mp-radius-md` | Key corners |
| `--sn-mp-font-size-md` / `-sm` / `-xl` | Label sizes |


## Accessibility

- Every key is `role="button"` with an `aria-label` (the glyph, or "delete" / the close label).
- The close button carries `aria-busy` while `closeButtonLoading` is set.
- The scrim is `aria-hidden`; the panel is the `sn-popup` `role="dialog"`.


## Versioning

`@snui/uni@0.5.0` — initial release.
