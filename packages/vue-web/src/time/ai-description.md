# SnTime — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end time formatter
> component. Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware
> listing. **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

Formats a timestamp / Date as a datetime string, a date-only string, or a
relative distance (「3 天前」), rendered in a native `<time>` element (or a
bare text node with `text`).

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-time` (https://www.naiveui.com/zh-CN/light/components/time).

## Import

```ts
import SnTime from '@snui/vue-web/src/time/SnTime.vue';
```

## Props

| Name       | Type                                 | Default      | Required | Description                                              |
| ---------- | ------------------------------------ | ------------ | -------- | -------------------------------------------------------- |
| `time`     | `number \| Date`                     | mount time   | no       | Time to render (ms timestamp or Date).                   |
| `type`     | `'relative' \| 'date' \| 'datetime'` | `'datetime'` | no       | Rendered representation.                                 |
| `to`       | `number \| Date`                     | mount time   | no       | Base time for `type="relative"`.                         |
| `unix`     | `boolean`                            | `false`      | no       | Interpret `time` / `to` as unix timestamps in seconds.   |
| `format`   | `string`                             | —            | no       | Custom format string (date-fns token subset, see below). |
| `text`     | `boolean`                            | `false`      | no       | Render a bare text node instead of a `<time>` element.   |
| `timeZone` | `string`                             | —            | no       | IANA time zone used when formatting.                     |

## Events

None.

## Slots

None.

## Supported format tokens

`yyyy yy MMMM MMM MM M dd d EEEE EEE HH H hh h mm m ss s SSS a`, plus
`'…'` quoted literals (`''` = escaped quote). Month, weekday and day-period
names are built-in zh-CN (一月 / 星期四 / 上午).

## Divergences from the reference API

- naive builds on `date-fns` + `date-fns-tz`; this package has no date
  dependency, so `format` supports the common token subset above and
  relative wording is a `formatDistanceStrict(date, to,
{ addSuffix: true })` equivalent with built-in zh-CN strings
  (unit durations 365d / 30.4375d / 24h / 60m / 1s, half-up rounding; a
  sub-second distance renders 「不到 1 秒」 where date-fns zh-CN renders the
  CLDR quirk 「不到 5 秒」).
- `time-zone` resolves via `Intl.DateTimeFormat` (affects formatted output
  only, like the reference).
- No locale / config-provider integration — zh-CN wording is built in.
- The task briefing mentions a `unix-milliseconds` prop; the naive source
  has no such prop, so it is not implemented.

## Accessibility

- Renders a native `<time>` element by default (machine-readable
  semantics); `text` opts out to a bare text node for inline prose.

## Tokens Consumed (end: web)

None — unstyled text element, like the reference.

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-DD-019.
