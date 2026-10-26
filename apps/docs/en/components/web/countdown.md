# Countdown · Web

Countdown (n-countdown aligned): ticks from `duration` (ms) down to zero, rendering `HH:MM:SS` with optional decimal precision and custom rendering.

## When to use

- Flash sales, verification codes, exams — remaining time.
- Millisecond-level display (precision 1-3).
- Fully custom output via the `render` function.

## Basic

<Demo name="countdown-web-basic" description="duration 5000ms, active toggles ticking." />

### Precision

<Demo name="countdown-web-precision" description="precision 0 / 1 / 2 / 3." />

### Custom render

<Demo name="countdown-web-render" description="render receives the remaining time info." />

### Reset

<Demo name="countdown-web-reset" description="reset() restores the full duration." />

## API

### SnCountdown Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| duration | `number` | `0` | Total duration in ms (non-reactive) |
| active | `boolean` | `true` | Whether ticking |
| precision | `0 \| 1 \| 2 \| 3` | `0` | Decimal precision of the seconds |
| render | `(info: { hours, minutes, seconds, milliseconds }) => VNodeChild` | `undefined` | Custom render function |

### SnCountdown Events

| Event | Parameters | Notes |
| --- | --- | --- |
| finish | — | Fired once per run at zero (again after reset) |

### SnCountdown Methods

| Method | Parameters | Notes |
| --- | --- | --- |
| reset | — | Restore the full duration |

The displayed value rounds up within the current precision step (4999 ms still shows second 5), matching naive.

See the component `ai-description.md` for the full contract.
