# Timeline · Web

Event rail: node circles joined by a line, each entry carrying a title,
body, time meta and semantic color.

## When to use

- Chronological events: releases, approvals, build logs
- Semantic node colors (success / info / warning / error)
- Horizontal timelines or right-side rails

## Examples

### Basic

<Demo name="timeline-web-basic" description="Semantic type nodes + dashed line segments." />

### Size

<Demo name="timeline-web-size" description="size enlarges titles; icon-size enlarges nodes." />

### Item placement

<Demo name="timeline-web-item-placement" description="item-placement: left (default) / right." />

### Horizontal

<Demo name="timeline-web-horizontal" description="horizontal layout." />

### Custom icons

<Demo name="timeline-web-customize-icon" description="icon slot replaces the node circle; color overrides." />

## API

### SnTimeline Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| horizontal | `boolean` | `false` | Horizontal layout |
| item-placement | `'left' \| 'right'` | `'left'` | Rail side (ignored when horizontal) |
| size | `'medium' \| 'large'` | `'medium'` | Title font size (14 / 16px) |
| icon-size | `number` | `undefined` | Node edge length in px (default 14) |

### SnTimeline Slots

| Name | Params | Notes |
| --- | --- | --- |
| default | `()` | `SnTimelineItem` entries |

### SnTimelineItem Props

| Name | Type | Default | Notes |
| --- | --- | --- | --- |
| type | `'default' \| 'success' \| 'info' \| 'warning' \| 'error'` | `'default'` | Semantic node color |
| title | `string` | `undefined` | Entry title; `header` slot overrides |
| content | `string` | `undefined` | Entry body; `default` slot overrides |
| time | `string \| number` | `undefined` | Time meta; `footer` slot overrides |
| color | `string` | `undefined` | Custom node color (ring border / icon) |
| line-type | `'default' \| 'dashed'` | `'default'` | Line style after this node |

### SnTimelineItem Slots

| Name | Params | Notes |
| --- | --- | --- |
| default | `()` | Entry body, overrides `content` |
| icon | `()` | Custom node icon, replaces the circle |
| header | `()` | Entry title, overrides `title` |
| footer | `()` | Time meta, overrides `time` |

The last entry draws no rail; dashed segments use a 10px gradient dash.

See the component `ai-description.md` for the full contract.
