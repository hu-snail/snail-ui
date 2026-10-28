# Timeline · Web

Event rail: node dots + connecting lines, each item with title, content, time and
semantic colors. Vertical / horizontal layouts, `mode` display types
(left / right / alternate) and cross-axis labels are supported.

## When to use

- Time-ordered events: releases, approvals, build logs
- Semantic nodes (success / info / warning / error) or fully custom nodes
- Alternating layout, horizontal timelines, or labels across the axis

## Examples

### Basic

<Demo name="timeline-web-basic" description="type semantic nodes + dashed line-type segments." />

### Size

<Demo name="timeline-web-size" description="size scales the title, icon-size scales the node." />

### Custom node

<Demo name="timeline-web-customize-dot" description="dot-color / dot-type set node color and solid/hollow fill; the dot slot takes full DOM (highest priority)." />

### Custom line style

<Demo name="timeline-web-customize-line" description="line-type: default solid / dashed / dotted." />

### Item placement

<Demo name="timeline-web-item-placement" description="item-placement: left (default) / right (legacy, prefer mode)." />

### Display modes

<Demo name="timeline-web-mode" description="mode=alternate flips sides by index; TimelineItem position fixes one item's side." />

### Vertical timeline with labels

<Demo name="timeline-web-label" description="mode=alternate + label: labels (dates) render across the axis." />

### Horizontal timeline

<Demo name="timeline-web-horizontal" description="direction=horizontal; horizontal mode reads top / bottom / alternate." />

### Label position

<Demo name="timeline-web-label-position" description="labelPosition: same renders beside the content near the rail, relative across the axis (default)." />

### Custom icon

<Demo name="timeline-web-customize-icon" description="icon slot replaces the circle node; color customizes it." />

## API

### SnTimeline Props

| Name           | Type                                                    | Default      | Notes                                                             |
| -------------- | ------------------------------------------------------- | ------------ | ----------------------------------------------------------------- |
| direction      | `'vertical' \| 'horizontal'`                            | `'vertical'` | Layout axis; wins over the legacy `horizontal` flag               |
| mode           | `'left' \| 'right' \| 'top' \| 'bottom' \| 'alternate'` | `'left'`     | Content side of the axis; alternate flips by index. Horizontal reads top / bottom (off-axis values are normalized) |
| label-position | `'same' \| 'relative'`                                  | `'relative'` | relative: across the axis; same: content side next to the rail    |
| horizontal     | `boolean`                                               | `false`      | Legacy: horizontal layout (prefer `direction`)                    |
| item-placement | `'left' \| 'right'`                                     | `'left'`     | Legacy: rail side (prefer `mode`)                                 |
| size           | `'medium' \| 'large'`                                   | `'medium'`   | Title size (14 / 16px)                                            |
| icon-size      | `number`                                                | `undefined`  | Node edge length (px, default 14)                                 |

### SnTimeline Slots

| Name    | Params | Notes              |
| ------- | ------ | ------------------ |
| default | `()`   | `SnTimelineItem`s  |

### SnTimelineItem Props

| Name      | Type                                                       | Default     | Notes                                        |
| --------- | ---------------------------------------------------------- | ----------- | -------------------------------------------- |
| type      | `'default' \| 'success' \| 'info' \| 'warning' \| 'error'` | `'default'` | Semantic node color                          |
| title     | `string`                                                   | `undefined` | Title; `header` slot overrides               |
| content   | `string`                                                   | `undefined` | Body; `default` slot overrides               |
| time      | `string \| number`                                         | `undefined` | Meta line; `footer` slot overrides           |
| dot-color | `string`                                                   | `undefined` | Custom node color (wins over `color`)        |
| color     | `string`                                                   | `undefined` | Legacy: custom node color                    |
| dot-type  | `'solid' \| 'hollow'`                                      | `'solid'`   | Node fill: filled dot / ring                 |
| line-type | `'default' \| 'dashed' \| 'dotted'`                        | `'default'` | Rail style after this node                   |
| label     | `string`                                                   | `undefined` | Label text (e.g. a date); `label` slot overrides |
| position  | `'left' \| 'right' \| 'top' \| 'bottom'`                   | `undefined` | Fix the content side under `mode=alternate`  |

### SnTimelineItem Slots

| Name    | Params | Notes                              |
| ------- | ------ | ---------------------------------- |
| default | `()`   | Body, overrides `content`          |
| dot     | `()`   | Full custom node DOM, highest priority |
| icon    | `()`   | Custom node icon (`dot` wins)      |
| label   | `()`   | Label text, overrides `label`      |
| header  | `()`   | Title, overrides `title`           |
| footer  | `()`   | Meta line, overrides `time`        |

Node priority: `dot` slot > `icon` slot > circle. The last item draws no rail line.

See the component `ai-description.md` for the full contract.
