# InputNumber · Web

Numeric input with steppers (press-and-hold), bounds clamp, precision, stepStrictly, format / parse.

## Basic

<Demo name="input-number-web-basic" description="v-model + stepper buttons." />

## Bounds & step

<Demo name="input-number-web-bounds" description="min / max / step / stepStrictly snapping." />

## Precision

<Demo name="input-number-web-precision" description="Decimal rounding." />

## Format / parse

<Demo name="input-number-web-format" description="Display formatting + parse back to number." />

## Button placement / sizes

<Demo name="input-number-web-layout" description="buttonPlacement: both / right; five sizes." />

## Disabled / readonly / clearable

<Demo name="input-number-web-states" description="disabled / readonly / clearable." />

## API

### SnInputNumber Props

| Prop            | Type                                         | Default    | Notes                                         |
| --------------- | -------------------------------------------- | ---------- | --------------------------------------------- |
| modelValue      | `number \| null`                             | `null`     | v-model (empty is null)                       |
| min / max       | `number`                                     | —          | Bounds clamp                                  |
| step            | `number`                                     | `1`        | Step                                          |
| precision       | `number`                                     | —          | Decimals                                      |
| stepStrictly    | `boolean`                                    | `false`    | Snap to step grid                             |
| size            | `'mini'\|'tiny'\|'small'\|'medium'\|'large'` | `'medium'` | Size                                          |
| showButton      | `boolean`                                    | `true`     | Show steppers                                 |
| buttonPlacement | `'both'\|'right'`                            | `'both'`   | Stepper placement                             |
| clearable       | `boolean`                                    | `false`    | Clear button                                  |
| format          | `(value: number) => string`                  | —          | Display format                                |
| parse           | `(text: string) => number \| null`           | —          | Parse                                         |
| validator       | `(value: number) => boolean`                 | —          | Pre-commit validator (reject keeps old value) |

`role="spinbutton"`; ArrowUp/Down, PageUp/Down (×10), Home/End to bounds.

See the component `ai-description.md` for the full contract.
