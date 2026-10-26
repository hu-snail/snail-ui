# SnCalendar — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end calendar
> component. Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware
> listing. **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A month-view calendar panel for browsing dates and picking a day, with
per-cell custom content, out-of-month graying, a today marker and a
selected-date bar.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-calendar`
(https://www.naiveui.com/zh-CN/light/components/calendar, source
`src/calendar/src/Calendar.tsx`).

## Import

```ts
import SnCalendar from '@snui/vue-web/src/calendar/SnCalendar.vue';
```

## Props

| Name               | Type                                   | Default     | Required | Description                                                                   |
| ------------------ | -------------------------------------- | ----------- | -------- | ----------------------------------------------------------------------------- |
| `value`            | `number \| null`                       | `undefined` | no       | Selected date (millisecond timestamp), v-model:value.                         |
| `default-value`    | `number \| null`                       | `null`      | no       | Uncontrolled initial selection; also anchors the first panel month.           |
| `is-date-disabled` | `(ts: number) => boolean \| undefined` | `undefined` | no       | Return true to disable a date (receives the cell's local-midnight timestamp). |

## Events

| Name           | Parameters                                     | Description                                                                                                                  |
| -------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `update:value` | `(value: number, time: { year, month, date })` | Selection changed; `month` is 1-based. Supports v-model:value.                                                               |
| `panel-change` | `(info: { year, month })`                      | Panel year/month switched (month is 1-based); fired by the prev / next / today buttons and by clicking an out-of-month cell. |

## Slots

| Name      | Parameters              | Description                                                         |
| --------- | ----------------------- | ------------------------------------------------------------------- |
| `default` | `{ year, month, date }` | Custom content under the day number, per cell (`month` is 1-based). |
| `header`  | `{ year, month }`       | Custom header title.                                                |

## Structure

- Header: `yyyy年M月` title (overridable via `header`) + a joined
  [prev / 今天 / next] button group with inline SVG chevrons.
- Grid: Monday-first weeks; the first row renders `'周一'…'周日'` inline
  weekday labels; the grid is 28 / 35 / 42 cells depending on the month
  (whole-week padding, like the reference `strip` behavior).
- Cell states: `--selected` (3px bottom bar), `--current` (filled circle),
  `--other-month` / `--disabled` (grayed, `--disabled` adds
  `cursor: not-allowed`).

## Divergences from the reference API

- Weekday labels and the header title are fixed zh-CN strings
  ('周一'…'周日', numeric `yyyy年M月`); the reference derives them from its
  locale system (its zh-CN default is also Monday-first).
- The action group is rendered as internal joined buttons with inline SVG
  glyphs (the reference composes NButtonGroup + NButton).
- Cells expose `role="gridcell"`, `aria-selected`, `aria-disabled` and the
  buttons carry `aria-label` (the reference ships no ARIA).
- Grid length follows the reference: 28 / 35 / 42 cells (a Monday-starting
  28-day month renders 4 rows).

## Accessibility

- The grid container has `role="grid"` + `aria-label="日历"`; cells expose
  `role="gridcell"` with `aria-selected` / `aria-disabled`.
- Action buttons are real `<button>` elements with `aria-label`
  (上个月 / 下个月) and `:focus-visible` outline.

## Tokens Consumed (end: web)

| Token                                            | CSS Variable                        | Purpose                                                           |
| ------------------------------------------------ | ----------------------------------- | ----------------------------------------------------------------- |
| Text primary / secondary / disabled / on-primary | `--sn-web-color-text-*`             | Title, body, grayed cells, today circle                           |
| Action primary                                   | `--sn-web-color-action-primary`     | Today circle, selection bar                                       |
| Background surface                               | `--sn-web-color-background-surface` | Button + cell base surface                                        |
| Text primary + surface via color-mix             | —                                   | Grid lines / button outlines 6%, cell hover 4.7%, button hover 2% |
| Focus ring                                       | `--sn-web-focus-ring`               | Button `:focus-visible` outline                                   |

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-DD-001.
