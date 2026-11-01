---
component: sn-keyboard-panel
title: KeyboardPanel 虚拟键盘面板（uni 端）
source: packages/uni/src/components/sn-keyboard-panel/sn-keyboard-panel.vue
reference: none — **additive** AUI component (wot-ui `wd-keyboard` has no panel variant; registered in AGENTS.md §112.3a)
---

> Human-readable + AI-parseable description of the uni-end embedded keypad view
> — the popup-free variant of `sn-keyboard` for hosts that own the container.

Embedded keypad view: the same numeric / car-plate / custom layouts as
`sn-keyboard` (`sn-keyboard-keys.ts` shared model) rendered inline in the page
— no popup, no scrim, no `visible` / `close` machinery. Embed it under an
input row, inside a host-owned sheet, or in any custom container.

## Props

| Prop              | Type                             | Default     | When                                                                |
| ----------------- | -------------------------------- | ----------- | ------------------------------------------------------------------- |
| `modelValue`      | `string`                         | `''`        | Current value (`v-model`).                                          |
| `mode`            | `'default' \| 'custom' \| 'car'` | `'default'` | Layout preset.                                                      |
| `maxlength`       | `number`                         | `Infinity`  | Maximum value length.                                               |
| `showDeleteKey`   | `boolean`                        | `true`      | Render the delete key (default / car layouts).                      |
| `randomKeyOrder`  | `boolean`                        | `false`     | Shuffle the digit keys (deterministic per mount).                   |
| `extraKey`        | `string \| string[]`             | `undefined` | Extra digit-grid key(s); an unsupplied slot renders the glyph key.  |
| `carLang`         | `'zh' \| 'en'`                   | `'zh'`      | Car-plate language (`v-model:car-lang`).                            |
| `autoSwitchLang`  | `boolean`                        | `false`     | Switch to letters after the province char.                          |
| `title`           | `string`                         | `''`        | Optional header title; the header renders only with content.        |
| `deleteText`      | `string`                         | `''`        | Delete key aria label.                                              |
| `customClass`     | `string`                         | `''`        | Root class forwarding.                                              |
| `customStyle`     | `string`                         | `''`        | Root inline style.                                                  |

## Events

| Name                | Payload            | When                                                        |
| ------------------- | ------------------ | ----------------------------------------------------------- |
| `update:modelValue` | `(value: string)`  | Value changed.                                              |
| `update:carLang`    | `(lang: 'zh' 'en')` | Car language changed.                                      |
| `input`             | `(key: string)`    | A character key was pressed.                                |
| `delete`            | —                  | Delete key pressed (hold repeats: 420 ms delay, 70 ms tick). |
| `collapse`          | —                  | The collapse glyph / aside close key was tapped — the host hides its own container or yields to the system input. |

## Layout

Identical to `sn-keyboard` (shared `buildDigitRows` / `buildCarRows`): bottom
row always fills three cells, the unsupplied extra-key slot renders the
collapse glyph, delete lives under the grid in default mode and in the aside
column in custom mode.

Differences from `sn-keyboard`:

- No popup / scrim / `visible` / `closeText` / `closeButtonLoading` /
  `modal` / `hideOnClickOutside` / `lockScroll` / `safeAreaInsetBottom` /
  `rootPortal` — the host owns the container.
- The header renders only when `title` is set or `mode: 'car'` (language
  toggle); there is no close button.
- The collapse key emits `collapse` instead of closing a sheet.

## Tokens Consumed (end: mp)

Same tokens and geometry hooks as `sn-keyboard` (`--sn-keyboard-key-height`,
`--sn-keyboard-gap`, `--sn-keyboard-key-radius`, …) — one override retunes both
components. The panel rounds all four corners (`--sn-mp-radius-xl`).

## Behaviour Notes

- Hold-to-repeat delete shares `createDeleteHold`; timers are cleared on
  release and on `onBeforeUnmount`.
- `randomKeyOrder` uses the same deterministic shuffle seed as
  `sn-keyboard` (stable across SSR / MP renders).
