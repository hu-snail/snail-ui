# Typing (uni)

`sn-typing` is the "typing" indicator for chat / generation scenarios: pulsing dots plus an optional label.

## When to use

- Placeholder bubble while waiting for a reply
- AI generation / customer-service processing indicator

## Demos

### Basic

Defaults to the "输入中" label plus 3 dots; the label can be emptied, and color / count / speed are adjustable.

<Demo name="typing-mp" description="Default / custom label and dot color / bubble scenario." />

## API

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string` | `'输入中'` | Label next to the dots (empty = dots only) |
| `dotCount` | `number` | `3` | Dot count (clamped to 1-5) |
| `speed` | `number` | `350` | Pulse period per dot (ms) |
| `activeDotColor` | `string` | `undefined` | Dot color (primary token) |
| `customClass` | `string` | `undefined` | Root custom class |
| `customStyle` | `string` | `undefined` | Root custom style |

## Dark mode

Everything resolves from `--sn-mp-*` tokens and adapts automatically.
