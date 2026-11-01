# sn-sn-plate-input — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end License-plate entry field: one box per plate position, tapping opens the shared car keyboard..
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

License-plate entry field: one box per plate position, tapping opens the shared car keyboard.

## Reference Library

Per AGENTS.md §112 the car-key model is shared with `sn-keyboard` (mode: 'car').
The field itself has **no wot-ui counterpart** — it is an AUI-additive component
(Human 指令 2026-11-01), registered in AGENTS.md §112.3a. New props added here
MUST also be added to that registration.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-plate-input v-model="plate" title="请输入车牌号" />
```

```ts
import SnPlateInput from '@snui/uni-src/components/sn-plate-input/sn-plate-input.vue';
```

## Props

| Name                          | Type                   | Default          | Description                                                         |
| ----------------------------- | ---------------------- | ---------------- | ------------------------------------------------------------------- |
| `modelValue`                  | `string`               | `''`             | Current plate, e.g. `京A12345`.                                     |
| `maxlength`                   | `number`               | `7`              | Box count — 7 standard plates, 8 new-energy.                        |
| `title`                       | `string`               | `'请输入车牌号'` | Keyboard title.                                                     |
| `disabled`                    | `boolean`              | `false`          | Tapping no longer opens the keyboard.                               |
| `visible`                     | `boolean \| undefined` | `undefined`      | Keyboard visibility (`v-model:visible`); uncontrolled when omitted. |
| `customClass` / `customStyle` | `string`               | `''`             | Root forwarding.                                                    |

## Events

| Name                | Payload            | When                                          |
| ------------------- | ------------------ | --------------------------------------------- |
| `update:modelValue` | `(value: string)`  | Value changed (value clamped to `maxlength`). |
| `change`            | `(value: string)`  | Same tick as `update:modelValue`.             |
| `update:visible`    | `(value: boolean)` | Keyboard visibility changed.                  |
| `open`              | —                  | Field tapped, keyboard about to open.         |
| `close`             | —                  | Keyboard closed (close button / scrim).       |

## Behavior

- Tapping the box row opens `sn-keyboard` (mode `'car'`): province → letter/digit
  layouts, hold-to-repeat delete, safe-area padding — all keyboard-owned.
- `auto-switch-lang` is on: the first province char flips the layout to letters.
- The car language resets to 省份 whenever the value is emptied, so the next
  plate starts over.
- The `tap` trigger sits on the box row, so taps inside the keyboard popup
  (scrim included) never bubble back into `open()`.
- The caret is a static CSS bar shown while open — no timers, nothing to dispose.

## Tokens Consumed (end: mp)

| Token                                                                   | Purpose                                |
| ----------------------------------------------------------------------- | -------------------------------------- |
| `--sn-plate-input-gap` / `-box-bg` / `-radius`                          | Component-local geometry / color hooks |
| `--sn-mp-color-input-bg` / `-border` / `-border-focus` / `-text`        | Box surface, border, focus ring, glyph |
| `--sn-mp-color-border-subtle` / `-background-subtle` / `-text-disabled` | Disabled box                           |
| `--sn-mp-color-action-primary`                                          | Caret                                  |
| `--sn-mp-radius-md`                                                     | Box corners                            |
| `--sn-mp-font-size-xl`                                                  | Glyph size                             |

## Accessibility

- The box row is `role="group"` with `aria-label` "plate number, N of M".
- Each box has an `aria-label` ("position N"); the root carries `aria-disabled` when frozen.
- The keyboard is keyboard-owned (`sn-keyboard`), which carries its own a11y contract.

## Versioning

`@snui/uni@0.5.0` — initial release.
