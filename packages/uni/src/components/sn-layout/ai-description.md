# sn-layout / sn-col — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-layout / sn-col component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.
>
> Internal reference metadata (AGENTS.md §112.2a / §114.4 — never surfaces in
> the user-facing docs): reference library `wd-row / wd-col (wd-layout)`, prop surface mirrored 1:1.

## Purpose

24-column flex grid. The row publishes its gutter through `provide()`; the
column reads it back as symmetric padding, and the row pulls out by half a
gutter so first and last columns stay flush with the container.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-layout :gutter="16">
  <sn-col :span="12">左</sn-col>
  <sn-col :span="12">右</sn-col>
</sn-layout>
```

```ts
// Optional explicit import (when easycom is disabled)
import { SnLayout } from '@snui/uni/components/sn-layout/sn-layout.vue';
import { SnCol } from '@snui/uni/components/sn-layout/sn-col.vue';
```

## Props — sn-layout

| Name          | Type                                                                                  | Default   | Description           |
| ------------- | ------------------------------------------------------------------------------------- | --------- | --------------------- |
| `gutter`      | `number`                                                                              | `0`       | Column gutter in px.  |
| `justify`     | `'start' \| 'center' \| 'end' \| 'space-between' \| 'space-around' \| 'space-evenly'` | `'start'` | Main-axis alignment.  |
| `align`       | `'top' \| 'middle' \| 'bottom'`                                                       | `'top'`   | Cross-axis alignment. |
| `customClass` | `string`                                                                              | `''`      | Root forwarding.      |
| `customStyle` | `string`                                                                              | `''`      | Root forwarding.      |

## Props — sn-col

| Name          | Type     | Default | Description                              |
| ------------- | -------- | ------- | ---------------------------------------- |
| `span`        | `number` | `24`    | Column width in 24ths (clamped to 1…24). |
| `offset`      | `number` | `0`     | Left offset in 24ths.                    |
| `customClass` | `string` | `''`    | Column root forwarding.                  |
| `customStyle` | `string` | `''`    | Column root forwarding.                  |

## Events

None. The state is driven entirely by props (AGENTS.md §18 — the runtime
renders state, it does not own business transitions).

## Slots

| Name               | Scope | Description     |
| ------------------ | ----- | --------------- |
| `default (layout)` | —     | Column list.    |
| `default (col)`    | —     | Column content. |

## Tokens Consumed (end: mp)

No colour tokens: the pair emits geometry only (`flex-basis` / `margin` / `padding`). Colour comes from the content inside each column — a layout component should not have a look of its own.

## Accessibility

- The components add no role or aria attributes: they are pure layout containers.
- No keyboard interaction, so no `tabindex`.
- Mobile only: interaction is `tap`; miniprogram has no keyboard focus.

## Versioning

`@snui/uni@0.1.0` — layout (AUI-MP-LAY-003).
