# SnDescriptions — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end descriptions
> component. Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware
> listing. **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A grouped key/value detail list rendered as a bordered or borderless
table, with multi-column layout, per-entry spans and label placement
control. Used for detail panels, order summaries, entity inspectors.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-descriptions`
(https://www.naiveui.com/zh-CN/light/components/descriptions).

## Import

```ts
import SnDescriptions from '@snui/vue-web/src/descriptions/SnDescriptions.vue'
import SnDescriptionsItem from '@snui/vue-web/src/descriptions/SnDescriptionsItem.vue'
```

## Props (SnDescriptions)

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `title` | `string` | `undefined` | no | Title above the table; the `header` slot overrides it. |
| `column` | `number` | `3` | no | Total logical columns of the grid. |
| `label-placement` | `'left' \| 'top'` | `'top'` | no | Where labels sit relative to content. |
| `label-align` | `'left' \| 'right' \| 'center'` | `'left'` | no | Label text alignment. |
| `separator` | `string` | `':'` | no | Inline separator (`left` + no border only). |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | no | Font scale + cell padding. |
| `bordered` | `boolean` | `false` | no | Bordered grid with tinted label cells. |
| `label-class` | `string` | `undefined` | no | Class applied to every label cell/span. |
| `label-style` | `string \| CSSProperties` | `undefined` | no | Style applied to every label cell/span. |
| `content-class` | `string` | `undefined` | no | Class applied to every content cell/span. |
| `content-style` | `string \| CSSProperties` | `undefined` | no | Style applied to every content cell/span. |

## Props (SnDescriptionsItem)

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `label` | `string` | `undefined` | no | Label text (the `label` slot overrides it). |
| `span` | `number` | `1` | no | Columns this entry occupies. |
| `label-class` / `label-style` | `string` / `string \| CSSProperties` | `undefined` | no | Per-entry label overrides. |
| `content-class` / `content-style` | `string` / `string \| CSSProperties` | `undefined` | no | Per-entry content overrides. |

## Slots

| Component | Name | Description |
|---|---|---|
| SnDescriptions | `default` | `<SnDescriptionsItem>` entries. |
| SnDescriptions | `header` | Header content (overrides `title`). |
| SnDescriptionsItem | `default` | Entry content. |
| SnDescriptionsItem | `label` | Label content (overrides `label`). |

## Events

None — pure display component.

## Divergences from the reference API

- The deprecated `columns` alias is not implemented (`column` only).
- Non-item children are filtered silently (reference warns in dev).
- Fragment children (`<template v-for>` items) are flattened
  recursively — data-driven item lists work.
- **Host-chrome quarantine.** The component renders a real
  `<table>` / `<th>` / `<td>`, so a host page's own table chrome
  (`.vp-doc th { background-color }`, `.vp-doc th, .vp-doc td { border-top }`,
  `.vp-doc table { border; border-radius; font-size }`) used to tie with the
  component's single-class rules and win on stylesheet order — the
  borderless grid rendered as a tinted, ruled table with a frame. Every
  table / row / cell rule is now qualified with the root class
  (`.sn-descriptions .sn-descriptions__*`), and the bordered block still
  wins by source order.

## Layout contract

- The grid has `column * 2` physical tracks; `top` placement emits a
  hidden `visibility: collapse` sizing row.
- A row's last entry stretches to fill remaining tracks.
- `separator` renders only for `label-placement="left"` + `bordered=false`.
- Non-bordered cells use the reference `thPadding` / `tdPadding` scale
  (`0 12px 8px 0` and `0 0 12px 0`; small `0 0 8px 0`, large `0 0 16px 0`);
  the bordered grid uses `12px 16px` (`8px 12px` small / `16px 24px` large).

## Tokens Consumed (end: web)

| Token | CSS Variable | Purpose |
|---|---|---|
| Text primary | `--sn-web-color-text-primary` | Title / label text |
| Text secondary | `--sn-web-color-text-secondary` | Content text |
| Background surface / subtle | `--sn-web-color-background-*` | Bordered cell backgrounds |
| Border subtle | `--sn-web-color-border-subtle` | Bordered grid lines |

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-DD-005.
