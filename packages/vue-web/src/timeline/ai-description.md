# SnTimeline — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end timeline
> component. Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware
> listing. **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

An event rail: node dots joined by a line, each entry carrying a title,
body, time meta and semantic node color. Vertical or horizontal, content
`mode` (left / right / alternate; horizontal reads top / bottom /
alternate), cross-axis labels, solid/hollow or fully custom nodes, and
solid / dashed / dotted rail segments.

## Reference Library

Per AGENTS.md §112, the base API surface mirrors naive-ui `n-timeline`
(https://www.naiveui.com/zh-CN/light/components/timeline). The display
modes (`direction` / `mode` / `label-position` / `label` / `position`) and
node customization (`dot-color` / `dot-type` / `dot` slot) follow
arco-design's timeline, documented as divergences below.

## Import

```ts
import SnTimeline from '@snui/vue-web/src/timeline/SnTimeline.vue';
import SnTimelineItem from '@snui/vue-web/src/timeline/SnTimelineItem.vue';
```

## Props (SnTimeline)

| Name             | Type                                                    | Default      | Required | Description                                                                     |
| ---------------- | ------------------------------------------------------- | ------------ | -------- | ------------------------------------------------------------------------------- |
| `direction`      | `'vertical' \| 'horizontal'`                            | `'vertical'` | no       | Layout axis; wins over the legacy `horizontal` flag.                            |
| `mode`           | `'left' \| 'right' \| 'top' \| 'bottom' \| 'alternate'` | `'left'`     | no       | Side the rail (the axis) sits on — the content takes the opposite side; `alternate` flips by item index. Vertical reads left / right, horizontal reads top / bottom; off-axis values are normalized to the direction's default. Wins over the legacy `item-placement`. |
| `label-position` | `'same' \| 'relative'`                                  | `'relative'` | no       | `relative`: labels across the axis from the content; `same`: content side, adjacent to the rail. |
| `horizontal`     | `boolean`                                               | `false`      | no       | Legacy: horizontal layout (`direction="horizontal"` preferred).                 |
| `item-placement` | `'left' \| 'right'`                                     | `'left'`     | no       | Legacy: rail side (vertical only; `mode` preferred).                            |
| `size`           | `'medium' \| 'large'`                                   | `'medium'`   | no       | Title scale (14/16 px).                                                         |
| `icon-size`      | `number`                                                | `undefined`  | no       | Node/icon edge length in px (default 14).                                       |

## Props (SnTimelineItem)

| Name        | Type                                                       | Default     | Required | Description                                                     |
| ----------- | ---------------------------------------------------------- | ----------- | -------- | --------------------------------------------------------------- |
| `type`      | `'default' \| 'success' \| 'info' \| 'warning' \| 'error'` | `'default'` | no       | Semantic node color.                                            |
| `title`     | `string`                                                   | `undefined` | no       | Entry title (`header` slot overrides).                          |
| `content`   | `string`                                                   | `undefined` | no       | Entry body (`default` slot overrides).                          |
| `time`      | `string \| number`                                         | `undefined` | no       | Meta line (`footer` slot overrides).                            |
| `dot-color` | `string`                                                   | `undefined` | no       | Custom node color; wins over `color`.                           |
| `color`     | `string`                                                   | `undefined` | no       | Legacy: custom node color (ring border / icon color).           |
| `dot-type`  | `'solid' \| 'hollow'`                                      | `'solid'`   | no       | Node fill: filled dot (half the icon edge) or 2px ring.         |
| `line-type` | `'default' \| 'dashed' \| 'dotted'`                        | `'default'` | no       | Rail segment style after this node.                             |
| `label`     | `string`                                                   | `undefined` | no       | Label text (e.g. a date) placed per the container `label-position` (`label` slot overrides). |
| `position`  | `'left' \| 'right' \| 'top' \| 'bottom'`                   | `undefined` | no       | Fix the content side under `mode="alternate"` (vertical: left/right, horizontal: top/bottom). |

## Slots

| Component      | Name      | Description                                        |
| -------------- | --------- | -------------------------------------------------- |
| SnTimeline     | `default` | `<SnTimelineItem>` entries (direct children).      |
| SnTimelineItem | `default` | Entry body (overrides `content`).                  |
| SnTimelineItem | `dot`     | Full custom node DOM — highest node priority.      |
| SnTimelineItem | `icon`    | Custom node icon (the `dot` slot wins).            |
| SnTimelineItem | `label`   | Label text (overrides `label`).                    |
| SnTimelineItem | `header`  | Entry title (overrides `title`).                   |
| SnTimelineItem | `footer`  | Meta line (overrides `time`).                      |

## Events

None — pure display component.

## Divergences from the reference API

- Display modes, labels and node customization follow arco-design's
  timeline (`direction` / `mode` / `label-position` / `dot-color` /
  `dot-type` / `dot` slot / `position`); naive-ui has no equivalents.
- The default node is a **solid** dot (`dot-type="solid"`, half the icon
  edge); the naive-style hollow ring is `dot-type="hollow"`.
- An item rendered outside a timeline degrades with the default config;
  the reference throws in dev.
- Semantic node colors resolve to full-strength `--sn-web-color-feedback-*`
  tokens (the reference ring is a solid 2px border).
- Items must be direct children of `SnTimeline` (the `alternate` parity
  uses a registration index; wrappers would break the nth-child-free
  registry order).

## Layout contract

- Each item is a grid: `[opposite][rail][main]` columns (vertical) or the
  transposed rows (horizontal). `alternate` uses `1fr` side columns so the
  rail stays centered; content opposite the axis is right-aligned toward
  it.
- Node priority: `dot` slot > `icon` slot > circle.
- The last entry draws no rail segment (`:last-child` CSS).
- Dashed segments use a 10px gradient dash and dotted segments a 2/6px
  gradient dot (180° vertical / 90° horizontal).
- Horizontal items are separated by a 40px column gap; each item's line
  bridges the gap so segments connect node to node.
- Component-private layout variables: `--sn-timeline-gap` (horizontal column
  gap, default 40px), `--sn-timeline-label-w` (vertical cross-axis label
  column width, default 108px — one width for every item keeps the rail
  straight), `--sn-timeline-h-label-h` (horizontal label row height, default
  18px — keeps the rail band on one y), `--sn-timeline-icon-size` (node edge,
  set by the `icon-size` prop), `--sn-timeline-axis` / `--sn-timeline-axis-y`
  (axis position inside the rail cell) and `--sn-timeline-line-color`.
- The item stylesheet must stay flat: nesting the sheet inside
  `.sn-timeline-item { … }` turns every selector into a descendant selector,
  so `display: grid` and the mode templates stop matching and the items
  collapse into a stack. A CSS guard test asserts the flat shape.

## Tokens Consumed (end: web)

| Token                                      | CSS Variable                   | Purpose                  |
| ------------------------------------------ | ------------------------------ | ------------------------ |
| Text primary / secondary / tertiary        | `--sn-web-color-text-*`        | Title / body / meta text |
| Feedback info / success / warning / danger | `--sn-web-color-feedback-*`    | Semantic node colors     |
| Background surface                         | `--sn-web-color-background-surface` | Rail line mix + hollow ring fill |

## Versioning

`@snui/vue-web@0.1.0` — Part of AUI-WEB-DD-020. Display modes / labels /
custom nodes added additively (`direction`, `mode`, `label-position`,
`label`, `position`, `dot-color`, `dot-type`, `dot` slot, `dotted`
line-type); legacy `horizontal` / `item-placement` / `color` still work.
