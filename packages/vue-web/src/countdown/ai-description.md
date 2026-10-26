# SnCountdown — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end countdown
> component. Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware
> listing. **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

Counts down from `duration` (ms) to zero, rendering `HH:MM:SS` (with
optional decimal precision) or a custom render of the remaining time info.
`finish` fires exactly once when zero is reached; `reset()` restarts.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-countdown` (https://www.naiveui.com/zh-CN/light/components/countdown).

## Import

```ts
import SnCountdown from '@snui/vue-web/src/countdown/SnCountdown.vue';
```

## Props

| Name        | Type                                                              | Default | Required | Description                                               |
| ----------- | ----------------------------------------------------------------- | ------- | -------- | --------------------------------------------------------- |
| `duration`  | `number`                                                          | `0`     | no       | Countdown length in ms (non-reactive).                    |
| `active`    | `boolean`                                                         | `true`  | no       | Whether the countdown is ticking.                         |
| `precision` | `0 \| 1 \| 2 \| 3`                                                | `0`     | no       | Displayed precision: 0 = seconds, 1-3 add decimal digits. |
| `render`    | `(info: { hours, minutes, seconds, milliseconds }) => VNodeChild` | —       | no       | Custom render for the remaining time info.                |

## Events

| Name     | Parameters | Description                                                       |
| -------- | ---------- | ----------------------------------------------------------------- |
| `finish` | —          | Countdown reached zero (once per run; fires again after `reset`). |

## Slots

None (use the `render` prop for custom output).

## Exposed Methods

| Name    | Parameters | Description                            |
| ------- | ---------- | -------------------------------------- |
| `reset` | —          | Restore the full duration and restart. |

## Divergences from the reference API

- Renders a neutral inline `<span class="sn-countdown">` wrapper (naive
  renders a bare text fragment; web-end components carry the marker
  attribute).
- Timer scheduling clamps sub-millisecond delays to 1 ms — identical to
  browser `setTimeout(0)` clamping, and required for deterministic
  fake-timer testing. Timer calls use bare `setTimeout` / `clearTimeout`
  (the reference uses `window.setTimeout` — equivalent in browsers).
- No config-provider / locale integration (output is numeric text).

## Accessibility

- The ticking value is announced as plain text; for long countdowns pair
  it with an `aria-live="off"` region or render a static target time for
  screen readers.

## Tokens Consumed (end: web)

None — plain text wrapper, no styling in the reference either.

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-DD-003.
