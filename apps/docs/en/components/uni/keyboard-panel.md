# KeyboardPanel · uni-app

`sn-keyboard-panel` is the **embedded keypad view** of `@snui/uni` (additive — the reference library has no panel variant; registered in AGENTS.md §112.3a): the same numeric / car-plate / custom layouts as `sn-keyboard` (shared key model in `sn-keyboard-keys.ts`) rendered inline with **no popup** — no scrim, no `visible` / `close` semantics. The host owns visibility and placement: drop it under an input row, inside a host-drawn sheet, or into any custom container.

The bottom row always fills all three cells (same contract as `sn-keyboard`): a slot without an `extraKey` renders the **collapse glyph key**, which emits `collapse` here (there is no sheet to close — the host hides its own container or yields back to the system input), so there is never a hole or an over-wide `0`. The header renders only when it has content: a `title` or the car-plate language toggle (`mode="car"`); there is no close button.

## Basic usage

Default + decimal + plate panels; the glyph key emits `collapse`.

<Demo name="keyboard-panel-mp-basic" description="Embedded keypad panels: default / decimal (extraKey=.) / plate (mode=car); the glyph key emits collapse." />

## Props

| Prop                          | Type                             | Default     | Description                                                                             |
| ----------------------------- | -------------------------------- | ----------- | --------------------------------------------------------------------------------------- |
| `modelValue`                  | `string`                         | `''`        | Current value (`v-model`)                                                               |
| `mode`                        | `'default' \| 'custom' \| 'car'` | `'default'` | Layout preset                                                                           |
| `maxlength`                   | `number`                         | `Infinity`  | Maximum value length                                                                    |
| `showDeleteKey`               | `boolean`                        | `true`      | Render the delete key                                                                   |
| `randomKeyOrder`              | `boolean`                        | `false`     | Shuffle the digit keys                                                                  |
| `extraKey`                    | `string \| string[]`             | `undefined` | Extra digit-grid key(s); an unsupplied slot renders the collapse key (fires `collapse`) |
| `carLang`                     | `'zh' \| 'en'`                   | `'zh'`      | Car-plate language (`v-model:car-lang`)                                                 |
| `autoSwitchLang`              | `boolean`                        | `false`     | Switch to letters after the province char                                               |
| `title`                       | `string`                         | `''`        | Optional header title; the header renders only with content                             |
| `deleteText`                  | `string`                         | `''`        | Delete key aria label                                                                   |
| `customClass` / `customStyle` | `string`                         | `''`        | Root class / inline style                                                               |

## Events

| Event               | Description                                           | Payload                |
| ------------------- | ----------------------------------------------------- | ---------------------- |
| `update:modelValue` | Value changed                                         | `(value: string)`      |
| `update:carLang`    | Car language changed                                  | `(lang: 'zh' \| 'en')` |
| `input`             | A character key was pressed                           | `(key: string)`        |
| `delete`            | Delete key pressed (**hold to repeat**)               | —                      |
| `collapse`          | The collapse key was tapped (the host owns dismissal) | —                      |

## Differences from sn-keyboard

- No popup system: `visible` / `closeText` / `closeButtonLoading` / `modal` / `hideOnClickOutside` / `lockScroll` / `safeAreaInsetBottom` / `rootPortal` do not exist.
- The header carries only the title and (in car mode) the language toggle — no close button.
- The collapse key emits `collapse` instead of closing a sheet.
- The panel rounds all four corners (`--sn-mp-radius-xl`); key geometry hooks reuse the `--sn-keyboard-*` names, so one override retunes both components.

## Theme tokens

| Token                                                     | Purpose                                      |
| --------------------------------------------------------- | -------------------------------------------- |
| `--sn-mp-color-background-subtle`                         | Panel surface                                |
| `--sn-mp-color-background-elevated`                       | Key plates                                   |
| `--sn-mp-color-background-sunken`                         | Plate function key                           |
| `--sn-mp-color-action-primary`                            | Custom-mode collapse key                     |
| `--sn-mp-color-text-primary` / `-secondary` / `-tertiary` | Key + header text                            |
| `--sn-keyboard-key-height` / `-gap` / `-key-radius`       | Key geometry hooks (shared with sn-keyboard) |

## Accessibility

- The root is `role="group"` with `aria-label="keyboard"`; every key is `role="button"` with an `aria-label`.
- The collapse key carries `aria-label="collapse"`; the delete key uses `deleteText` (default "删除").

## Dark mode

Every color resolves through a `--sn-mp-*` token and there is no light literal fallback. Under `.sn-theme-dark` everything flips automatically. Verify with `<sn-config-provider theme="dark">` wrapping this component.
