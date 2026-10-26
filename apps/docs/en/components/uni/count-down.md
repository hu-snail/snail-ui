# CountDown · uni-app

`sn-count-down` is the countdown of `@snui/uni` (mobile / miniprogram / H5): a `format` string renders days / hours / minutes / seconds / milliseconds, `millisecond` enables sub-second ticks, and the instance exposes `start` / `pause` / `reset`. Auto-registered through easycom (`components/sn-count-down/sn-count-down.vue` → `<sn-count-down>`); geometry uses `rpx`.

## Basic usage

`format` supports `DD` (days, unpadded) / `DDD` (days, padded to 3) / `HH` / `mm` / `ss` / `S` (milliseconds, padded to 3); every other character passes through.

<Demo name="count-down-mp-basic" description="Three formats plus the finish callback." />

## Controls and milliseconds

With a `ref` on the instance you can call `start()` / `pause()` / `reset()`; `millisecond` refreshes every ~16ms and exposes `S`.

<Demo name="count-down-mp-control" description="Start / pause / reset, plus millisecond rendering." />

## auto-start and custom classes

`autoStart` defaults to `true`: the countdown starts on mount and a `time` change resets and restarts it. With `false` the component stays idle, `reset()` does not restart it either, and only an explicit `start()` begins timing. `customClass` / `customStyle` apply to the root node.

<Demo name="count-down-mp-autostart" description="auto-start=false with a manual start, reset staying idle, and customClass / customStyle." />

## Props

| Prop        | Type    | Default    | Description                                         |
| ----------- | ------- | ---------- | --------------------------------------------------- |
| time        | number  | 0          | Countdown length in milliseconds                    |
| millisecond | boolean | false      | Enable millisecond ticks (~16ms)                    |
| format      | string  | 'HH:mm:ss' | Format string                                       |
| autoStart   | boolean | true       | Start automatically on mount / after `time` changes |
| customClass | string  | ''         | Custom class for the root node                      |
| customStyle | string  | ''         | Custom inline style for the root node               |

Exposed methods: `start()` / `pause()` / `reset()`. `SnCountDownTimeData` = `{ total, days, hours, minutes, seconds, milliseconds }`.

## Events

| Event  | Description                           | Payload             |
| ------ | ------------------------------------- | ------------------- |
| change | Fires on every tick                   | SnCountDownTimeData |
| finish | Fires when the countdown reaches zero | —                   |

## Slots

| Slot    | Description                                            |
| ------- | ------------------------------------------------------ |
| default | Custom rendering; slot props are `SnCountDownTimeData` |

## Theme variables

| Variable                        | Purpose          |
| ------------------------------- | ---------------- |
| --sn-mp-color-text-primary      | Timer text       |
| --sn-mp-font-size-md            | Text size        |
| --sn-mp-font-line-height-normal | Text line height |

## Accessibility

- Root: `role="timer"` with `aria-label` set to the formatted text

## Dark mode

The text color uses `--sn-mp-color-text-primary`, overridden in the dark block of `@snui/tokens-mp/styles`, so it adapts automatically. Verify with sn-config-provider 的 theme 设为 dark:

## Related

- Number roll-up: [`sn-count-to`](/en/components/uni/count-to)
- Progress bar: [`sn-progress`](/en/components/uni/progress)
