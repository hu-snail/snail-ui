# Dialer — Lucky Wheel (uni)

`sn-dialer` is a lucky draw wheel: sectors are driven by the prize list; the host decides the winning index and calls `run(index)` to settle.

## When to use

- Marketing lucky draws
- Results decided by the backend, with the frontend only animating

## Demos

### Basic

Tap the center GO to fire `click` (request the result), then call `run(index)`; `done(index)` fires when the wheel settles.

<Demo name="dialer-mp" description="6-prize wheel, random target on GO, result shown on done." />

### Sector colors

Sectors alternate through `prizeBgColors`; a prize item's `color` wins. Sector count equals `prizeList.length` (2-12).

## API

### Props

| Name            | Type              | Default                  | Description                                       |
| --------------- | ----------------- | ------------------------ | ------------------------------------------------- |
| `prizeList`     | `SnDialerPrize[]` | `[]`                     | Prizes (`{ id, name, img?, color? }`, 2-12 items) |
| `turns`         | `number`          | `5`                      | Rotation turns                                    |
| `duration`      | `number`          | `3`                      | Rotation duration (seconds)                       |
| `size`          | `string`          | `'600rpx'`               | Wheel diameter                                    |
| `prizeBgColors` | `string[]`        | `['#FFF0A3', '#FFFCE6']` | Alternating sector colors                         |
| `borderColor`   | `string`          | `'#FFD752'`              | Wheel border color                                |
| `fontSize`      | `string`          | `'24rpx'`                | Prize name font size                              |
| `color`         | `string`          | `undefined`              | Prize name color (text token)                     |
| `customClass`   | `string`          | `undefined`              | Root custom class                                 |
| `customStyle`   | `string`          | `undefined`              | Root custom style                                 |

### Events

| Name    | Payload           | Description                             |
| ------- | ----------------- | --------------------------------------- |
| `click` | —                 | Pointer tapped (ignored while spinning) |
| `done`  | `(index: number)` | Settled on the prize index              |

### Slots

| Name      | Payload           | Description                               |
| --------- | ----------------- | ----------------------------------------- |
| `prize`   | `{ item, index }` | Custom prize content                      |
| `pointer` | —                 | Custom pointer; defaults to the GO button |

### Methods

| Name  | Type                      | Description                                      |
| ----- | ------------------------- | ------------------------------------------------ |
| `run` | `(index: number) => void` | Spin to the prize index (ignored while spinning) |
