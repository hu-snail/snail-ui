# sn-typing — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-typing component.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
> Reference library: lime-ui `l-typing` (additive business component, AUI-BIZ-006).

## Purpose

"Typing" indicator for chat / generation scenes: pulsing dots plus an optional label. Pure CSS animation (opacity/transform, index classes instead of nth-child); no timers, nothing to dispose.

## Import

```vue
<sn-typing text="对方正在输入…" />
```

## Props

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `text` | `string` | `'输入中'` | no | Label; empty string = dots only. |
| `dotCount` | `number` | `3` | no | Dot count (clamped 1-5). |
| `speed` | `number` | `350` | no | Pulse period per dot (ms). |
| `activeDotColor` | `string` | primary token | no | Dot color. |
| `customClass` | `string` | `''` | no | Root custom class. |
| `customStyle` | `string` | `''` | no | Root custom style. |
