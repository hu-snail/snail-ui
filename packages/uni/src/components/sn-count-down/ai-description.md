# sn-count-down — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-count-down component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Countdown timer rendered through a format string, with day / hour / minute / second / millisecond tokens and an optional sub-second tick.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-count-down`
(https://wot-ui.cn/component/count-down.html). New props added here MUST also be
added to the wd-count-down parity list.

## Format tokens

`DD` days (unpadded) · `DDD` days (3-digit padded) · `HH` hours · `mm`
minutes · `ss` seconds · `S` milliseconds (3-digit padded).

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-count-down :time="3600000" format="HH:mm:ss" />
```

```ts
import { SnCountDown } from '@snui/uni';
```

## Props

| Name          | Type    | Default    | Required | Description                                          |
| ------------- | ------- | ---------- | -------- | ---------------------------------------------------- |
| `time`        | number  | 0          | no       | Countdown length in milliseconds.                    |
| `millisecond` | boolean | false      | no       | Tick every ~16ms and expose the `S` token.           |
| `format`      | string  | 'HH:mm:ss' | no       | Format string.                                       |
| `autoStart`   | boolean | true       | no       | Start automatically on mount / after `time` changes. |
| `customClass` | string  | ''         | no       | Custom class for the root node.                      |
| `customStyle` | string  | ''         | no       | Custom inline style for the root node.               |

## Exposed methods

`start()` · `pause()` · `reset()` — the uni-side stand-in for imperative calls on
the component instance.

## Events

| Event    | Payload             | Description                            |
| -------- | ------------------- | -------------------------------------- |
| `change` | SnCountDownTimeData | Fires on every tick.                   |
| `finish` | —                   | Fires when the countdown reaches zero. |

`SnCountDownTimeData` = `{ total, days, hours, minutes, seconds, milliseconds }`.

## Slots

| Slot      | Description                                     |
| --------- | ----------------------------------------------- |
| `default` | Custom rendering. Props: `SnCountDownTimeData`. |

## Tokens Consumed (end: mp)

| Token              | CSS Variable                      | Purpose           |
| ------------------ | --------------------------------- | ----------------- |
| Text primary       | `--sn-mp-color-text-primary`      | Timer text        |
| Font size MD       | `--sn-mp-font-size-md`            | Timer text size   |
| Line height normal | `--sn-mp-font-line-height-normal` | Timer line height |

## Accessibility

- Root: `role="timer"` with `aria-label` set to the formatted text.

## Dispose

One `setInterval` — cleared on `finish`, on `time` / `millisecond` changes, on
`pause()` and in `onBeforeUnmount` (AGENTS.md §41).

## Versioning

`@snui/uni@0.5.0` — initial release.
