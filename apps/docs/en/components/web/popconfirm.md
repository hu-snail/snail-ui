# Popconfirm · Web

`SnPopconfirm` is a lightweight confirmation bubble: clicking the trigger
opens a small card with a warning icon, a message, and Cancel / Confirm
buttons — a less interruptive alternative to a modal dialog.

## When to use

- Confirming irreversible actions (delete, take offline, clear).
- The blast radius is small enough that a full dialog is overkill.
- One sentence is enough to explain the consequence.

## Basic

Click to open; default labels are Cancel / Confirm and the confirm button
is primary. Returning `false` (or `Promise<false>`) from
`on-positive-click` keeps the bubble open.

<Demo name="popconfirm-web-basic" description="default confirm, custom texts, custom icon and veto on close" />

### Async confirm

When the callback returns a Promise the bubble stays open until it
settles; resolving to `false` keeps it open — fits request-first flows.

<Demo name="popconfirm-web-async" description="Promise callback: hold open while pending, stay open on failure" />

## API

### Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| show | `boolean` | `undefined` | Show state; `undefined` = uncontrolled mode. |
| default-show | `boolean` | `false` | Initial state for uncontrolled mode. |
| trigger | `'hover' \| 'click' \| 'focus' \| 'manual'` | `'click'` | Opening gesture. |
| placement | `'top-start' \| 'top' \| 'top-end' \| 'right-start' \| 'right' \| 'right-end' \| 'bottom-start' \| 'bottom' \| 'bottom-end' \| 'left-start' \| 'left' \| 'left-end'` | `'top'` | Bubble position relative to the trigger. |
| delay | `number \| [number, number]` | `100` | Open debounce (ms). |
| duration | `number` | `100` | Close debounce (ms). |
| show-arrow | `boolean` | `false` | Render the directional arrow. |
| arrow-point-to-center | `boolean` | `false` | Aim the arrow at the bubble centre. |
| arrow-class / arrow-style | `string` / `CSSProperties` | `undefined` | Arrow element class / style. |
| content | `string` | `''` | The confirmation message. |
| icon | `IconComponent` | built-in warning icon | Leading icon, rendered in the feedback-warning colour. |
| show-icon | `boolean` | `true` | Render the leading icon area. |
| negative-text | `string` | `'取消'` | Cancel button label. |
| positive-text | `string` | `'确定'` | Confirm button label. |
| negative-button-props | `Record<string, unknown>` | `undefined` | Extra props forwarded to the cancel button. |
| positive-button-props | `Record<string, unknown>` | `undefined` | Extra props forwarded to the confirm button. |
| on-positive-click | `(e: MouseEvent) => boolean \| Promise<boolean> \| void` | `undefined` | Confirm callback; `false` (sync or resolved) vetoes closing. |
| on-negative-click | `(e: MouseEvent) => boolean \| Promise<boolean> \| void` | `undefined` | Cancel callback; same veto semantics. |
| disabled | `boolean` | `false` | Suppress showing entirely. |
| display-directive | `'if' \| 'show'` | `'if'` | Unmount on hide or keep the node. |
| flip | `boolean` | `true` | Flip to the opposite side when space runs out. |
| keep-alive-on-hover | `boolean` | `true` | Keep open while the pointer is inside. |
| animated | `boolean` | `true` | Enter animation on/off. |
| width | `number \| 'trigger'` | `undefined` | Bubble width. |
| to | `string \| HTMLElement \| false` | `'body'` | Teleport target. |
| z-index | `number` | `undefined` | Explicit stacking order. |
| content-class / content-style | `string` / `CSSProperties` | `undefined` | Inner body class / style. |
| on-clickoutside | `(e: MouseEvent) => void` | `undefined` | Click outside the bubble and trigger. |

### Events

| Name | Payload | Notes |
| --- | --- | --- |
| `update:show` | `boolean` | Show state change. |
| `positive-click` | `MouseEvent` | Confirm clicked (same as the `on-positive-click` prop). |
| `negative-click` | `MouseEvent` | Cancel clicked (same as the `on-negative-click` prop). |

### Slots

| Slot | Notes |
| --- | --- |
| default | Trigger element. |
| icon | Leading icon area — replaces the built-in icon and the `icon` prop. |
| action | Action row — replaces the two built-in buttons. |

### Methods

| Name | Type | Notes |
| --- | --- | --- |
| `show` | `() => void` | Programmatic show. |
| `hide` | `() => void` | Programmatic hide. |
| `isShown` | `() => boolean` | Read the current show state. |

## Tokens

| Token | CSS variable | Purpose |
| --- | --- | --- |
| Background surface | `--sn-web-color-background-surface` | Card + arrow fill |
| Border subtle | `--sn-web-color-border-subtle` | Card + arrow border |
| Card shadow | `--sn-web-card-shadow` | Card elevation |
| Text primary | `--sn-web-color-text-primary` | Message text |
| Feedback warning | `--sn-web-color-feedback-warning` | Default icon colour |

## Accessibility

- Panel: `role="dialog"` + `aria-modal="false"`.
- Trigger wrapper: `aria-expanded` + `aria-haspopup="dialog"`.
- The icon area is decorative (`aria-hidden`); both action buttons are
  real buttons with visible labels, focusable and keyboard-triggerable.

## AI Patch Boundary

| Safe for AI to generate | Requires human review |
| --- | --- |
| `content`, `positive-text` / `negative-text` copy and static `placement` | Business requests and close policy inside `on-positive-click` / `on-negative-click` |
| `show-icon` / `icon` display switches | Failure rollback via returning `Promise<false>` |
| Static composition in docs and demos | Controlled `v-model:show` binding and external state wiring |

See the component `ai-description.md` for the full contract.
