# PlateInput · uni-app

`sn-plate-input` is the license-plate entry field of `@snui/uni`: one box per plate position, tapping the box row raises the shared `sn-keyboard` (`mode: 'car'`) — province → letter/digit auto-switching, hold-to-repeat delete, popup chrome and safe-area all owned by the keyboard; this component only wires value + visibility. easycom auto-registration (`components/sn-plate-input/sn-plate-input.vue` → `<sn-plate-input>`); geometry in `rpx`. The caret is pure CSS (a static 2rpx bar shown while the keyboard is open), so there is no timer to dispose.

## Basic usage

Tap the box row to raise the plate keyboard: picking the first province character flips to the letter/digit layout; holding delete repeats; clearing starts the next plate back on provinces.

<Demo name="plate-input-mp-basic" description="Tap the boxes to raise the shared car keyboard (province → letters auto-switch, hold-to-repeat delete)." />

## New-energy plates & disabled

`maxlength=8` renders 8 boxes (new-energy plates); `disabled` freezes the field and ignores taps.

<Demo name="plate-input-mp-new-energy" description="`maxlength=8` for new-energy plates; `disabled` freezes the field." />

## Props

| Prop                          | Type                   | Default          | Description                                                        |
| ----------------------------- | ---------------------- | ---------------- | ------------------------------------------------------------------ |
| `modelValue`                  | `string`               | `''`             | Current plate (e.g. `京A12345`)                                    |
| `maxlength`                   | `number`               | `7`              | Box count (7 standard, 8 new-energy)                               |
| `title`                       | `string`               | `'请输入车牌号'` | Keyboard title                                                     |
| `disabled`                    | `boolean`              | `false`          | Freeze the field (taps no longer open the keyboard)                |
| `visible`                     | `boolean \| undefined` | `undefined`      | Keyboard visibility (`v-model:visible`); uncontrolled when omitted |
| `customClass` / `customStyle` | `string`               | `''`             | Root class / style forwarding                                      |

## Events

| Event               | Description                              | Params             |
| ------------------- | ---------------------------------------- | ------------------ |
| `update:modelValue` | Value changed (clamped to the box count) | `(value: string)`  |
| `change`            | Value changed (same tick)                | `(value: string)`  |
| `update:visible`    | Keyboard visibility changed              | `(value: boolean)` |
| `open`              | Field tapped, keyboard about to open     | —                  |
| `close`             | Keyboard closed (close button / scrim)   | —                  |

## Slots

This component provides no slots.

## Theme variables

| Variable                                                                | Purpose                                        |
| ----------------------------------------------------------------------- | ---------------------------------------------- |
| `--sn-plate-input-gap` / `-box-bg` / `-radius`                          | Component-local hooks (gap / cell bg / radius) |
| `--sn-mp-color-input-bg` / `-border` / `-border-focus` / `-text`        | Cell surface, border, focus border, glyph      |
| `--sn-mp-color-border-subtle` / `-background-subtle` / `-text-disabled` | Disabled cell                                  |
| `--sn-mp-color-action-primary`                                          | Caret                                          |
| `--sn-mp-radius-md`                                                     | Cell corners                                   |
| `--sn-mp-font-size-xl`                                                  | Glyph size                                     |

## Accessibility

- The box row is `role="group"` with `aria-label` "plate number, N of M".
- Each box carries an `aria-label` ("position N"); the root carries `aria-disabled` when frozen.
- The keyboard itself is `sn-keyboard`, which ships its own a11y contract.

## Dark mode

Every color resolves through `--sn-mp-*` tokens with no light fallback. Under `.sn-theme-dark` text, surfaces, borders and state colors flip automatically. The keyboard (`sn-keyboard`) and popup (`sn-popup`) follow the same contract.
