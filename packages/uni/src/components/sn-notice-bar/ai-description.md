# sn-notice-bar — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end sn-notice-bar component.
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Horizontal notice strip with a marquee, a static / wrapping mode and a vertical one-line-at-a-time mode. Optional leading icon and close button.

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors wot-ui `wd-notice-bar`
(https://wot-ui.cn/component/notice-bar.html). New props added here MUST also be
added to the wd-notice-bar parity list.

## Not implemented (documented divergences)

- `speed` is honoured as "px per second" by converting it into a keyframe
  duration from an estimated text width (character count × font size). The
  reference measures real text width, which a cross-end component cannot do.
- `direction="vertical"` shows one line at a time, advanced on an interval,
  instead of a scroll animation.

## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-notice-bar text="系统将在今晚 23:00 维护" />
```

```ts
import { SnNoticeBar } from '@snui/uni';
```

## Props

| Name              | Type         | Default    | Required     | Description                                       |
| ----------------- | ------------ | ---------- | ------------ | ------------------------------------------------- |
| `text`            | string       | string[]   | ''           | no                                                | Notice text (a string, or lines). |
| `type`            | 'warning'    | 'info'     | 'danger'     | 'warning'                                         | no                                | Semantic type — tint + fallback glyph. |
| `prefix`          | string       | ''         | no           | Leading icon name (sn-icon registry).             |
| `scrollable`      | boolean      | true       | no           | Enable the marquee.                               |
| `delay`           | number       | 1          | no           | Delay before the marquee starts, in seconds.      |
| `speed`           | number       | 50         | no           | Marquee speed in px per second.                   |
| `closable`        | boolean      | false      | no           | Show the close button.                            |
| `wrapable`        | boolean      | false      | no           | Wrap long text (only when `scrollable` is false). |
| `color`           | string       | ''         | no           | Text / icon color override.                       |
| `backgroundColor` | string       | ''         | no           | Background color override.                        |
| `direction`       | 'horizontal' | 'vertical' | 'horizontal' | no                                                | Scroll axis.                      |
| `customClass`     | string       | ''         | no           | Custom class for the root node.                   |
| `customStyle`     | string       | ''         | no           | Custom inline style for the root node.            |

## Events

| Event   | Payload         | Description                                   |
| ------- | --------------- | --------------------------------------------- |
| `close` | —               | Close button tapped (the strip hides itself). |
| `next`  | index: number   | Vertical mode advanced to the next line.      |
| `click` | { text, index } | Content area tapped.                          |

## Slots

| Slot      | Description                                          |
| --------- | ---------------------------------------------------- |
| `prefix`  | Custom leading content; overrides `prefix`.          |
| `suffix`  | Custom trailing content; overrides the close button. |
| `default` | Custom notice text (horizontal direction only).      |

## Tokens Consumed (end: mp)

| Token                           | CSS Variable                             | Purpose                  |
| ------------------------------- | ---------------------------------------- | ------------------------ |
| Feedback warning / warning soft | `--sn-mp-color-feedback-warning / -soft` | `type="warning"` tint    |
| Feedback info                   | `--sn-mp-color-feedback-info`            | `type="info"` foreground |
| Background subtle               | `--sn-mp-color-background-subtle`        | `type="info"` tint       |
| Feedback danger / danger soft   | `--sn-mp-color-feedback-danger / -soft`  | `type="danger"` tint     |
| Font size MD                    | `--sn-mp-font-size-md`                   | Text size                |
| Line height normal              | `--sn-mp-font-line-height-normal`        | Text line height         |
| Spacing 3 / 4                   | `--sn-mp-spacing-3 / -4`                 | Padding + icon gap       |

## Accessibility

- Root: `role="marquee"` with `aria-live="off"` while scrolling and `polite` when static.
- Leading icon wrapper: `aria-hidden="true"`.
- Close button: `role="button"` + `aria-label="close"`.

## Dispose

The horizontal marquee is pure CSS. Only the vertical mode needs a timer: one
`setInterval`, cleared in `onBeforeUnmount` and whenever `text` /
`direction` / `scrollable` change (AGENTS.md §41).

## Versioning

`@snui/uni@0.5.0` — initial release.
