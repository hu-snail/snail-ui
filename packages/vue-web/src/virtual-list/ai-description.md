# SnVirtualList — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end virtual list component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A virtual scrolling container: renders only the rows inside the viewport
(plus overscan) while a full-height sizer keeps native scrollbar
geometry. Supports fixed row heights and ResizeObserver-measured dynamic
heights.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-virtual-list` (https://www.naiveui.com/zh-CN/light/components/virtual-list).
Task ID: AUI-WEB-DD-029.

## Import

```ts
import SnVirtualList from '@snui/vue-web/src/virtual-list/SnVirtualList.vue';
// or, once registered by the package entry:
import { SnVirtualList } from '@snui/vue-web';
```

## Props

| Name            | Type                                                 | Default     | Required | Description                                                                   |
| --------------- | ---------------------------------------------------- | ----------- | -------- | ----------------------------------------------------------------------------- |
| `items`         | `Array<Record<string, unknown> \| string \| number>` | `[]`        | no       | Full data list; only the visible window renders.                              |
| `itemSize`      | `number`                                             | `30`        | no       | Fixed row height in px; also the fallback estimate for unmeasured rows.       |
| `itemResizable` | `boolean`                                            | `false`     | no       | Measure rendered rows via ResizeObserver and reflow from measured heights.    |
| `keyField`      | `string`                                             | `'value'`   | no       | Object field used as the render key (primitives / missing field fall back).   |
| `overscan`      | `number`                                             | `3`         | no       | Extra rows rendered above / below the visible window.                         |
| `visibleHeight` | `number \| undefined`                                | `undefined` | no       | Pin the viewport height in px; when omitted the container height is measured. |

## Events

| Name               | Payload               | Description                                     |
| ------------------ | --------------------- | ----------------------------------------------- |
| `scroll`           | `(event: Event)`      | Native scroll event of the container.           |
| `update:scrollTop` | `(scrollTop: number)` | Scroll offset committed after the rAF throttle. |

## Slots

| Name   | Params            | Description                                               |
| ------ | ----------------- | --------------------------------------------------------- |
| `item` | `{ item, index }` | Row content. Default fallback renders primitives as text. |

## Divergences from the reference API

- Minimal self-contained implementation (no external dependency):
  scroll container + full-height sizer + translateY window; positions
  come from `index * itemSize` (fixed) or a prefix-sum table with binary
  search (resizable).
- `itemResizable` measures downward only — unmeasured rows fall back to
  `itemSize`; re-measuring does not shift rows above the measured window.
- Not generic-typed: `items` accepts loose object / primitive entries
  (the reference is generic).
- Added prop `visibleHeight` (px) to pin the viewport without CSS layout
  (the reference sizes the container through CSS).
- The item content slot is named `item` (the reference renders its
  default slot).
- Prefix-sum recompute is O(n) per measure / list change (documented
  simplification; no incremental tree).

## Accessibility

- Container: `role="list"`; rows: `role="listitem"`.
- Native scroll container — keyboard scrolling and screen-reader
  scrollbar semantics come for free.

## Tokens Consumed (end: web)

| Token        | CSS Variable                  | Purpose  |
| ------------ | ----------------------------- | -------- |
| Text primary | `--sn-web-color-text-primary` | Row text |

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-DD-029.
