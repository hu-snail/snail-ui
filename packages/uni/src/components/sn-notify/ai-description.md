# sn-notify — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-notify component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Banner notification that slides in from the top or bottom edge, stays for a configurable duration and slides out. Supports multi-line messages, a close button and a floating card variant.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-notify`
(https://wot-ui.cn/component/notify.html). New props added here MUST also be
added to the wd-notify parity list.

## Not implemented (documented divergences)

- **Function API** (`useNotify()`) — use the component form with
  `v-model:visible`.
- `root-portal` — no portal host on miniprogram.
- `selector` — accepted for parity, no effect in the component form.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-notify v-model:visible="open" type="success" message="保存成功" />
```

```ts
import { SnNotify } from '@snui/uni';
```

## Props

| Name          | Type      | Default    | Required  | Description                                  |
| ------------- | --------- | ---------- | --------- | -------------------------------------------- |
| `visible`     | boolean   | false      | no        | Visibility (`v-model:visible`).              |
| `type`        | 'primary' | 'success'  | 'warning' | 'danger'                                     | 'danger'                                    | no  | Semantic type — fill color + default glyph. |
| `message`     | string    | number     | ''        | no                                           | Message text; `\n` renders as a line break. |
| `duration`    | number    | 3000       | no        | Auto-dismiss delay in ms; `0` keeps it open. |
| `position`    | 'top'     | 'bottom'   | 'top'     | no                                           | Anchor of the banner.                       |
| `color`       | string    | ''         | no        | Text color override.                         |
| `background`  | string    | ''         | no        | Background color override.                   |
| `zIndex`      | number    | 99         | no        | Stacking level.                              |
| `safeHeight`  | number    | string     | —         | no                                           | Extra top offset (bare number = px).        |
| `closable`    | boolean   | false      | no        | Show the close button.                       |
| `variant`     | 'filled'  | 'floating' | 'filled'  | no                                           | Edge-to-edge bar or inset rounded card.     |
| `selector`    | string    | ''         | no        | Instance id (parity only).                   |
| `customClass` | string    | ''         | no        | Custom class for the root node.              |
| `customStyle` | string    | ''         | no        | Custom inline style for the root node.       |

## Events

| Event            | Payload | Description                                        |
| ---------------- | ------- | -------------------------------------------------- |
| `update:visible` | boolean | v-model sync (also fires on auto-dismiss / close). |
| `click`          | Event   | Banner body tapped.                                |
| `opened`         | —       | Banner finished appearing.                         |
| `closed`         | —       | Banner finished leaving (node unmounted).          |

## Slots

| Slot      | Description                                       |
| --------- | ------------------------------------------------- |
| `default` | Custom notification content (replaces `message`). |

## Tokens Consumed (end: mp)

| Token                               | CSS Variable                        | Purpose                       |
| ----------------------------------- | ----------------------------------- | ----------------------------- |
| Action primary                      | `--sn-mp-color-action-primary`      | `type="primary"` filled fill  |
| Feedback success / warning / danger | `--sn-mp-color-feedback-success …`  | Filled fills + floating icons |
| Text on primary                     | `--sn-mp-color-text-on-primary`     | Filled variant text           |
| Text primary                        | `--sn-mp-color-text-primary`        | Floating variant text         |
| Background elevated                 | `--sn-mp-color-background-elevated` | Floating card surface         |
| Shadow MD                           | `--sn-mp-shadow-md`                 | Floating card shadow          |
| Font size MD                        | `--sn-mp-font-size-md`              | Message size                  |
| Line height normal                  | `--sn-mp-font-line-height-normal`   | Message line height           |
| Spacing 3 / 4 / 5                   | `--sn-mp-spacing-3 …`               | Padding + icon gap            |
| Radius LG                           | `--sn-mp-radius-lg`                 | Floating card corners         |

## Accessibility

- Banner body: `role="alert"` + `aria-live="assertive"`.
- Close button: `role="button"` + `aria-label="close"`.
- Status glyph: `aria-hidden="true"` (semantics carried by the message).

## Dispose

The auto-dismiss timer and the leave timer are the only resources; both are
cleared on close, on re-open and in `onBeforeUnmount` (AGENTS.md §41).

## Versioning

`@snui/uni@0.5.0` — initial release.
