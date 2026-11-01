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
import SnKeyboard from '@snui/uni-src/components/sn-keyboard/sn-keyboard.vue';
```

## Props

| Name                                          | Type                             | Default                   | Description                                                                              |
| --------------------------------------------- | -------------------------------- | ------------------------- | ---------------------------------------------------------------------------------------- |
| `visible`                                     | `boolean`                        | `false`                   | Keyboard visibility.                                                                     |
| `modelValue`                                  | `string`                         | `''`                      | Current value.                                                                           |
| `title`                                       | `string`                         | `''`                      | Keyboard title.                                                                          |
| `mode`                                        | `'default' \| 'custom' \| 'car'` | `'default'`               | Layout preset.                                                                           |
| `zIndex`                                      | `number`                         | `100`                     | Stacking level.                                                                          |
| `maxlength`                                   | `number`                         | `Infinity`                | Maximum value length.                                                                    |
| `showDeleteKey`                               | `boolean`                        | `true`                    | Render the delete key.                                                                   |
| `randomKeyOrder`                              | `boolean`                        | `false`                   | Shuffle the digit keys.                                                                  |
| `closeText` / `deleteText`                    | `string`                         | `''`                      | Button labels.                                                                           |
| `closeButtonLoading`                          | `boolean`                        | `false`                   | Spinner in the close button.                                                             |
| `modal` / `hideOnClickOutside` / `lockScroll` | `boolean`                        | `false` / `true` / `true` | Scrim behaviour.                                                                         |
| `safeAreaInsetBottom`                         | `boolean`                        | `true`                    | Safe-area padding.                                                                       |
| `extraKey`                                    | `string \| string[]`             | `undefined`               | Extra digit-grid key(s); an unsupplied slot renders the collapse key (fires `close`).    |
| `carLang`                                     | `'zh' \| 'en'`                   | `'zh'`                    | Car-plate language (`v-model:car-lang`).                                                 |
| `autoSwitchLang`                              | `boolean`                        | `false`                   | Switch to letters after the province char.                                               |
| `customClass` / `customStyle`                 | `string`                         | `''`                      | Root forwarding.                                                                         |
| `rootPortal`                                  | `boolean`                        | `false`                   | **Declared, not implemented** — forwarded to `sn-popup`; miniprogram has no portal host. |

## Events

| Name                | Payload            | When                         |
| ------------------- | ------------------ | ---------------------------- |
| `update:modelValue` | `(value: string)`  | Value changed.               |
| `update:visible`    | `(value: boolean)` | Visibility changed.          |
| `update:carLang`    | `(lang: 'zh' '     | ' 'en')`                     | Car language changed. |
| `input`             | `(key: string)`    | A character key was pressed. |
| `delete`            | —                  | Delete key pressed.          |
| `close`             | —                  | Keyboard closed (close button / scrim / collapse key). |

## Not Implemented

`root-portal` — declared and forwarded to `sn-popup`, but uni-app miniprograms
have no portal host, so it has no visual effect.

## Layout

| Mode      | Grid                                                                                                                               |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `default` | 3 columns × 4 rows; bottom row = `extraKey` slot (or the collapse glyph), `0`, delete.                                             |
| `custom`  | Same 3-column grid, bottom row = `extraKey`, `0`, `extraKey` + a right action column split in halves (delete on top, close below). |
| `car`     | 10 keys per row; the last (short) row stretches and carries the language key + delete.                                             |

Every cell is filled — the sheet never shows a bare hole. An unsupplied
`extraKey` slot renders the **collapse-to-system glyph key** (tapping it fires
`close`, mirroring the header close button), and `showDeleteKey: false` drops
the delete key while `0` spans the freed columns.

## Tokens Consumed (end: mp)

| Token                                                     | Purpose                              |
| --------------------------------------------------------- | ------------------------------------ |
| `--sn-mp-color-background-subtle`                         | Keypad sheet (the grey field)        |
| `--sn-mp-color-background-elevated`                       | Key plates + header toolbar          |
| `--sn-mp-color-background-sunken`                         | Plate language (function) key        |
| `--sn-mp-color-action-primary`                            | Close / "done" text button           |
| `--sn-mp-color-text-primary` / `-secondary` / `-tertiary` | Key + header text                    |
| `--sn-mp-color-text-on-primary`                           | Custom-mode close key label          |
| `--sn-mp-radius-md` / `-xl`                               | Header buttons / key + panel corners |
| `--sn-mp-shadow-xs`                                       | Key plate lift                       |
| `--sn-mp-font-size-sm` / `-md` / `-2xl`                   | Header / plate keys / digits         |

Component-local geometry hooks (override from `custom-class`, no prop needed):

| Variable                       | Default             | Purpose           |
| ------------------------------ | ------------------- | ----------------- |
| `--sn-keyboard-key-height`     | `104rpx`            | Digit key height  |
| `--sn-keyboard-car-key-height` | `84rpx`             | Plate key height  |
| `--sn-keyboard-gap`            | `12rpx`             | Digit grid gap    |
| `--sn-keyboard-car-gap`        | `8rpx`              | Plate grid gap    |
| `--sn-keyboard-padding`        | `16rpx`             | Key field padding |
| `--sn-keyboard-key-radius`     | `--sn-mp-radius-xl` | Key corner radius |

## Behaviour Notes

- The delete key **repeats while held** (420 ms delay, then every 70 ms). All
  timers are cleared on release, on close and on `onBeforeUnmount`.
- Press feedback rides uni `hover-class` (`sn-keyboard__key--pressed`) — the App
  end has no `:active` pseudo.
- `showDeleteKey: false` removes the delete key; `0` spans the freed columns
  while the collapse glyph keeps anchoring the row, so no empty plate is left
  behind.
- The `custom` action column is two equal halves: delete on top, close below.

## Accessibility

- Every glyph key is `role="button"` with an `aria-label` (the glyph, or the
  `deleteText` / close label). Inert slots carry no role.
- The close button carries `aria-busy` while `closeButtonLoading` is set.
- The scrim is `aria-hidden`; the panel is the `sn-popup` `role="dialog"`.

## Versioning

`@snui/uni@0.5.0` — initial release.
