# Liquid (uni)

`sn-liquid` shows percentage progress with an animated water wave — a more expressive alternative to a linear progress bar.

## When to use

- Task completion, fundraising, or storage progress that fits a "rising level" metaphor

## Demos

### Basic

The water level is driven by `percent` (clamped to 0-100); `v-model:current` exposes the transitioning value. The center label defaults to the percentage and is slot-customizable.

<Demo name="liquid-mp" description="Basic / outline / custom wave color, with a button that raises the level." />

## API

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `percent` | `number` | `0` | Progress percentage (clamped to 0-100) |
| `size` | `string` | `'160rpx'` | Ball size |
| `duration` | `number` | `500` | Level transition duration (ms); 0 = instant |
| `outline` | `boolean` | `false` | Show the outer ring |
| `radius` | `string` | `'50%'` | Corner radius |
| `waveColor` | `string` | `undefined` | Wave color (primary token) |
| `innerColor` | `string` | `undefined` | Background above the water (soft primary token) |
| `customClass` | `string` | `undefined` | Root custom class |
| `customStyle` | `string` | `undefined` | Root custom style |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `update:current` | `(value: number)` | Transitioning level (for `v-model:current`) |

### Slots

| Name | Payload | Description |
| --- | --- | --- |
| `default` | — | Center content; defaults to `current%` |

## Dark mode

All colors come from `--sn-mp-*` tokens; wrap in `<sn-config-provider theme="dark">` to verify.
