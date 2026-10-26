# Lucky Grid (uni)

`sn-lucky` is a grid lucky draw: `play()` starts the cycling highlight around the perimeter; the host calls `stop(index)` with the result to decelerate and settle.

## When to use

- Marketing grid draws
- Backend-decided results with a two-phase animation (accelerate → settle)

## Demos

### Basic

Tap the center button to start; request the result after `start`, then call `stop(index)`; `end(index)` fires on settle. Prizes run clockwise along the perimeter with the button in the middle.

<Demo name="lucky-mp" description="3×3 grid, play/stop two-phase animation, custom prize slot." />

### Custom cells and button

The `prize` slot receives `{ item, index, isActive }`; the `button` slot receives `{ isPlaying }`.

## API

### Props

| Name          | Type             | Default     | Description                                           |
| ------------- | ---------------- | ----------- | ----------------------------------------------------- |
| `rows`        | `number`         | `3`         | Rows (≥3)                                             |
| `cols`        | `number`         | `3`         | Columns (≥3)                                          |
| `prizes`      | `SnLuckyPrize[]` | `[]`        | Prizes along the perimeter (`{ name, img?, color? }`) |
| `gutter`      | `string`         | `'8rpx'`    | Cell gap                                              |
| `cellHeight`  | `string`         | `'120rpx'`  | Cell height                                           |
| `speed`       | `number`         | `60`        | Cycling step interval (ms)                            |
| `customClass` | `string`         | `undefined` | Root custom class                                     |
| `customStyle` | `string`         | `undefined` | Root custom style                                     |

### Events

| Name    | Payload           | Description                |
| ------- | ----------------- | -------------------------- |
| `start` | —                 | `play()` started           |
| `end`   | `(index: number)` | Settled on the prize index |

### Slots

| Name     | Payload                     | Description          |
| -------- | --------------------------- | -------------------- |
| `prize`  | `{ item, index, isActive }` | Custom prize cell    |
| `button` | `{ isPlaying }`             | Custom center button |

### Methods

| Name   | Type                      | Description                                   |
| ------ | ------------------------- | --------------------------------------------- |
| `play` | `() => void`              | Start the cycling highlight                   |
| `stop` | `(index: number) => void` | Decelerate to the index (ignored before play) |
