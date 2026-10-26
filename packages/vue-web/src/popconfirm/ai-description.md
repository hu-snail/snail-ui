# SnPopconfirm — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end popconfirm
> component. Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware
> listing. **`end: web`** marker — consumed by `list_components({ end: 'web' })`.

## Purpose

A bubble confirmation box anchored to a trigger: warning icon + message

- cancel/confirm buttons. Clicking confirm/cancel can veto closing by
  returning `false` (sync) or `Promise<false>` (async — the bubble stays
  open until the Promise settles).

## Reference Library

Per AGENTS.md §112, this component's API surface mirrors naive-ui
`n-popconfirm` (https://www.naiveui.com/zh-CN/light/components/popconfirm).

## Import

```ts
import SnPopconfirm from '@snui/vue-web/src/popconfirm/SnPopconfirm.vue';
```

## Props

| Name                  | Type                                                                                                                                                                 | Default                | Required | Description                                                   |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | -------- | ------------------------------------------------------------- |
| `show`                | `boolean \| undefined`                                                                                                                                               | `undefined`            | no       | Show state; `undefined` = uncontrolled mode.                  |
| `defaultShow`         | `boolean`                                                                                                                                                            | `false`                | no       | Initial state for uncontrolled mode.                          |
| `trigger`             | `'hover' \| 'click' \| 'focus' \| 'manual'`                                                                                                                          | `'click'`              | no       | Gesture that opens the bubble.                                |
| `placement`           | `'top-start' \| 'top' \| 'top-end' \| 'right-start' \| 'right' \| 'right-end' \| 'bottom-start' \| 'bottom' \| 'bottom-end' \| 'left-start' \| 'left' \| 'left-end'` | `'top'`                | no       | Bubble position relative to the trigger.                      |
| `delay`               | `number \| [number, number]`                                                                                                                                         | `100`                  | no       | Open debounce (ms).                                           |
| `duration`            | `number`                                                                                                                                                             | `100`                  | no       | Close debounce (ms).                                          |
| `showArrow`           | `boolean`                                                                                                                                                            | `false`                | no       | Render the directional arrow.                                 |
| `arrowPointToCenter`  | `boolean`                                                                                                                                                            | `false`                | no       | Aim the arrow at the bubble centre.                           |
| `arrowClass`          | `string`                                                                                                                                                             | `undefined`            | no       | Class on the arrow element.                                   |
| `arrowStyle`          | `CSSProperties`                                                                                                                                                      | `undefined`            | no       | Style on the arrow element.                                   |
| `content`             | `string`                                                                                                                                                             | `''`                   | no       | The confirmation message.                                     |
| `icon`                | `IconComponent`                                                                                                                                                      | lucide `AlertTriangle` | no       | Leading icon component (rendered in feedback-warning colour). |
| `showIcon`            | `boolean`                                                                                                                                                            | `true`                 | no       | Render the leading icon area.                                 |
| `negativeText`        | `string`                                                                                                                                                             | `'取消'`               | no       | Cancel button label.                                          |
| `positiveText`        | `string`                                                                                                                                                             | `'确定'`               | no       | Confirm button label.                                         |
| `negativeButtonProps` | `Record<string, unknown>`                                                                                                                                            | `undefined`            | no       | Extra props forwarded to the cancel SnButton.                 |
| `positiveButtonProps` | `Record<string, unknown>`                                                                                                                                            | `undefined`            | no       | Extra props forwarded to the confirm SnButton.                |
| `onPositiveClick`     | `(e: MouseEvent) => boolean \| Promise<boolean> \| void`                                                                                                             | `undefined`            | no       | Confirm callback; `false` / `Promise<false>` vetoes closing.  |
| `onNegativeClick`     | `(e: MouseEvent) => boolean \| Promise<boolean> \| void`                                                                                                             | `undefined`            | no       | Cancel callback; same veto semantics.                         |
| `disabled`            | `boolean`                                                                                                                                                            | `false`                | no       | Suppress showing entirely.                                    |
| `displayDirective`    | `'if' \| 'show'`                                                                                                                                                     | `'if'`                 | no       | `'if'` unmounts on hide; `'show'` keeps the node.             |
| `flip`                | `boolean`                                                                                                                                                            | `true`                 | no       | Flip to the opposite side when space runs out.                |
| `keepAliveOnHover`    | `boolean`                                                                                                                                                            | `true`                 | no       | Keep open while the pointer is inside (hover trigger).        |
| `animated`            | `boolean`                                                                                                                                                            | `true`                 | no       | Enter animation on/off.                                       |
| `width`               | `number \| 'trigger'`                                                                                                                                                | `undefined`            | no       | Fixed px width, or `'trigger'`.                               |
| `to`                  | `string \| HTMLElement \| false`                                                                                                                                     | `'body'`               | no       | Teleport target; `false` renders inline.                      |
| `zIndex`              | `number`                                                                                                                                                             | `undefined`            | no       | Explicit stacking order (default 9999).                       |
| `contentClass`        | `string`                                                                                                                                                             | `undefined`            | no       | Class on the inner body.                                      |
| `contentStyle`        | `CSSProperties`                                                                                                                                                      | `undefined`            | no       | Style on the inner body.                                      |
| `onClickoutside`      | `(e: MouseEvent) => void`                                                                                                                                            | `undefined`            | no       | Click outside the bubble and trigger.                         |

## Events

| Name             | Payload      | Description                                                   |
| ---------------- | ------------ | ------------------------------------------------------------- |
| `update:show`    | `boolean`    | Show state change (v-model:show).                             |
| `positive-click` | `MouseEvent` | Confirm button clicked (alias of the `onPositiveClick` prop). |
| `negative-click` | `MouseEvent` | Cancel button clicked (alias of the `onNegativeClick` prop).  |

## Slots

| Name      | Description                                                      |
| --------- | ---------------------------------------------------------------- |
| `default` | Trigger element (the visible target).                            |
| `icon`    | Leading icon area — overrides the `icon` prop and default glyph. |
| `action`  | Action row — replaces the two built-in buttons.                  |

## Divergences from the reference API

- Trigger renders from the default slot; the message is the `content`
  prop (the reference uses `#trigger` + default slot for the message).
- Action order is negative-left / positive-right (取消 · 确定).
- A pending async callback holds the bubble open but does not put the
  button into a loading state.
- Inherited popover props not meaningful for a confirmation (`header`,
  `raw`, `overlap`, `scrollable`, `x`/`y`) are omitted.

## Accessibility

- Panel: `role="dialog"` + `aria-modal="false"`.
- Trigger wrapper: `aria-expanded` + `aria-haspopup="dialog"`.
- Icon area is `aria-hidden="true"`; action buttons are real buttons
  with visible labels.

## Tokens Consumed (end: web)

| Token              | CSS Variable                        | Purpose             |
| ------------------ | ----------------------------------- | ------------------- |
| Background surface | `--sn-web-color-background-surface` | Card + arrow fill   |
| Border subtle      | `--sn-web-color-border-subtle`      | Card + arrow border |
| Card shadow        | `--sn-web-card-shadow`              | Card elevation      |
| Text primary       | `--sn-web-color-text-primary`       | Message text        |
| Feedback warning   | `--sn-web-color-feedback-warning`   | Default icon colour |

## Versioning

`@snui/vue-web@0.1.0` — initial release. Part of AUI-WEB-FB-010.
