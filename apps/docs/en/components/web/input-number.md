# InputNumber · Web

Numeric input with steppers (press-and-hold) plus a tail ↑ / ↓ spinner (up increments, down decrements), bounds clamp, precision, stepStrictly, format / parse.

## Basic

<Demo name="input-number-web-basic" description="v-model + stepper buttons." />

## Bounds & step

<Demo name="input-number-web-bounds" description="min / max / step / stepStrictly snapping." />

## Precision

<Demo name="input-number-web-precision" description="Decimal rounding." />

## Format / parse

<Demo name="input-number-web-format" description="Display formatting + parse back to number." />

## Button placement / sizes

<Demo name="input-number-web-layout" description="buttonPlacement: left / both / right; buttonMode: symbol (− +) / spinner (↑ ↓); five sizes." />

## Disabled / readonly / clearable

<Demo name="input-number-web-states" description="disabled / readonly / clearable." />

## API

### SnInputNumber Props

| Prop                  | Type                                         | Default    | Notes                                                                                        |
| --------------------- | -------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------- |
| modelValue            | `number \| null`                             | `null`     | v-model (empty is null)                                                                      |
| min / max             | `number`                                     | —          | Bounds clamp                                                                                 |
| step                  | `number`                                     | `1`        | Step                                                                                         |
| precision             | `number`                                     | —          | Decimals                                                                                     |
| stepStrictly          | `boolean`                                    | `false`    | Snap to step grid                                                                            |
| size                  | `'mini'\|'tiny'\|'small'\|'medium'\|'large'` | `'medium'` | Size                                                                                         |
| showButton            | `boolean`                                    | `true`     | Show steppers                                                                                |
| buttonPlacement       | `'left'\|'both'\|'right'`                    | `'right'`  | Stepper placement (symbol mode: right/left pair at the tail/head, both split, value centred) |
| buttonMode            | `'symbol'\|'spinner'`                        | `'symbol'` | Glyph family, mutually exclusive: symbol = − / +, spinner = one ↑ / ↓ plate                  |
| buttonBackground      | `string`                                     | —          | Stepper button background (any CSS background value)                                         |
| buttonHoverBackground | `string`                                     | —          | Stepper hover background (`both` placement only)                                             |
| clearable             | `boolean`                                    | `false`    | Clear button                                                                                 |
| format                | `(value: number) => string`                  | —          | Display format                                                                               |
| parse                 | `(text: string) => number \| null`           | —          | Parse                                                                                        |
| validator             | `(value: number) => boolean`                 | —          | Pre-commit validator (reject keeps old value)                                                |

### SnInputNumber Slots

| Slot                       | Notes                                  |
| -------------------------- | -------------------------------------- |
| `prefix` / `suffix`        | Content before / after the field       |
| `minus-icon` / `plus-icon` | Custom stepper glyphs (default − / +)  |
| `up-icon` / `down-icon`    | Custom ↑ / ↓ spinner halves (defaults) |

Per-instance CSS vars: `--sn-web-input-number-btn-bg` / `--sn-web-input-number-btn-hover-bg`.

`role="spinbutton"`; ArrowUp/Down, PageUp/Down (×10), Home/End to bounds.

See the component `ai-description.md` for the full contract.
