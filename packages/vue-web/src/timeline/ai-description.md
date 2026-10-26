# SnTimeline — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end timeline
> component. Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware
> listing. **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

An event rail: node circles joined by a line, each entry carrying a
title, body, time meta and semantic node color. Vertical or horizontal,
left/right rail placement, dashed segments, custom node icons.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-timeline`
(https://www.naiveui.com/zh-CN/light/components/timeline).

## Import

```ts
import SnTimeline from '@snui/vue-web/src/timeline/SnTimeline.vue';
import SnTimelineItem from '@snui/vue-web/src/timeline/SnTimelineItem.vue';
```

## Props (SnTimeline)

| Name             | Type                  | Default     | Required | Description                                  |
| ---------------- | --------------------- | ----------- | -------- | -------------------------------------------- |
| `horizontal`     | `boolean`             | `false`     | no       | Lay the entries out horizontally.            |
| `item-placement` | `'left' \| 'right'`   | `'left'`    | no       | Which side the rail sits on (vertical only). |
| `size`           | `'medium' \| 'large'` | `'medium'`  | no       | Title scale (14/16 px).                      |
| `icon-size`      | `number`              | `undefined` | no       | Node/icon edge length in px (default 14).    |

## Props (SnTimelineItem)

| Name        | Type                                                       | Default     | Required | Description                                   |
| ----------- | ---------------------------------------------------------- | ----------- | -------- | --------------------------------------------- |
| `type`      | `'default' \| 'success' \| 'info' \| 'warning' \| 'error'` | `'default'` | no       | Semantic node color.                          |
| `title`     | `string`                                                   | `undefined` | no       | Entry title (`header` slot overrides).        |
| `content`   | `string`                                                   | `undefined` | no       | Entry body (`default` slot overrides).        |
| `time`      | `string \| number`                                         | `undefined` | no       | Meta line (`footer` slot overrides).          |
| `color`     | `string`                                                   | `undefined` | no       | Custom node color (ring border / icon color). |
| `line-type` | `'default' \| 'dashed'`                                    | `'default'` | no       | Rail segment style after this node.           |

## Slots

| Component      | Name      | Description                             |
| -------------- | --------- | --------------------------------------- |
| SnTimeline     | `default` | `<SnTimelineItem>` entries.             |
| SnTimelineItem | `default` | Entry body (overrides `content`).       |
| SnTimelineItem | `icon`    | Custom node icon (replaces the circle). |
| SnTimelineItem | `header`  | Entry title (overrides `title`).        |
| SnTimelineItem | `footer`  | Meta line (overrides `time`).           |

## Events

None — pure display component.

## Divergences from the reference API

- An item rendered outside a timeline degrades with the default config;
  the reference throws in dev.
- Semantic node colors resolve to full-strength `--sn-web-color-feedback-*`
  tokens (the reference ring is a solid 2px border).

## Layout contract

- The last entry draws no rail segment (`:last-child` CSS).
- The node ring is a hollow 2px circle; the `icon` slot replaces it.
- Dashed segments use a 10px gradient dash (180° vertical / 90° horizontal).

## Tokens Consumed (end: web)

| Token                                      | CSS Variable                   | Purpose                  |
| ------------------------------------------ | ------------------------------ | ------------------------ |
| Text primary / secondary / tertiary        | `--sn-web-color-text-*`        | Title / body / meta text |
| Feedback info / success / warning / danger | `--sn-web-color-feedback-*`    | Semantic node colors     |
| Border subtle                              | `--sn-web-color-border-subtle` | Rail line + default node |

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-DD-020.
