# Popconfirm · Web

`SnPopconfirm` is a lightweight confirmation bubble: clicking the trigger opens a small card with a warning icon, a message, and Cancel / Confirm buttons — a less interruptive alternative to a modal dialog.

## When to use

- Confirming irreversible actions (delete, take offline, clear).
- The blast radius is small enough that a full dialog is overkill.
- One sentence is enough to explain the consequence.

## Demos

### Basic usage

Click to open; default labels are Cancel / Confirm and the confirm button is primary; returning `false` keeps the bubble open.

<Demo name="popconfirm-web-basic" description="default confirm, custom texts, slot icon and veto on close" />

### Async confirm

When the callback returns a Promise the bubble stays open until it settles; resolving to `false` keeps it open — fits request-first flows.

<Demo name="popconfirm-web-async" description="Promise callback: hold open while pending, stay open on failure" />

### Icon variants

The `icon` prop replaces the built-in warning glyph, the `#icon` slot owns colour and size, and `show-icon="false"` drops the area entirely.

<Demo name="popconfirm-web-icon" description="lucide component, danger-coloured slot icon and no icon" />

### Custom action row

The `#action` slot replaces the built-in button row; paired with `v-model:show` the app decides when to close, so extra options fit in.

<Demo name="popconfirm-web-action" description="don't-ask-again checkbox plus a custom confirm button" />

## API

### Props

| Prop                  | Type                                                                                                                                                                 | Default     | Notes                                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------ |
| show                  | `boolean`                                                                                                                                                            | `undefined` | Show state; `undefined` = uncontrolled mode driven by internal state.                                        |
| default-show          | `boolean`                                                                                                                                                            | `false`     | Initial state for uncontrolled mode.                                                                         |
| trigger               | `'hover' \| 'click' \| 'focus' \| 'manual'`                                                                                                                          | `'click'`   | Opening gesture; `'manual'` is driven by `show` only.                                                        |
| placement             | `'top-start' \| 'top' \| 'top-end' \| 'right-start' \| 'right' \| 'right-end' \| 'bottom-start' \| 'bottom' \| 'bottom-end' \| 'left-start' \| 'left' \| 'left-end'` | `'top'`     | Requested side; can flip when space runs out.                                                                |
| delay                 | `number \| [number, number]`                                                                                                                                         | `100`       | Open debounce (ms); the array's second item overrides the close delay.                                       |
| duration              | `number`                                                                                                                                                             | `100`       | Close debounce (ms).                                                                                         |
| show-arrow            | `boolean`                                                                                                                                                            | `false`     | Render the arrow pointing at the trigger.                                                                    |
| arrow-point-to-center | `boolean`                                                                                                                                                            | `false`     | Aim the arrow at the bubble centre instead of the trigger edge.                                              |
| arrow-class           | `string`                                                                                                                                                             | `undefined` | Class on the arrow element.                                                                                  |
| arrow-style           | `CSSProperties`                                                                                                                                                      | `undefined` | Inline style on the arrow element.                                                                           |
| content               | `string`                                                                                                                                                             | `''`        | Confirmation message, between the icon and the action row.                                                   |
| icon                  | `IconComponent`                                                                                                                                                      | `undefined` | Leading icon component; falls back to the built-in warning glyph.                                            |
| show-icon             | `boolean`                                                                                                                                                            | `true`      | Render the leading icon area.                                                                                |
| negative-text         | `string`                                                                                                                                                             | `'取消'`    | Cancel button label.                                                                                         |
| positive-text         | `string`                                                                                                                                                             | `'确定'`    | Confirm button label.                                                                                        |
| negative-button-props | `Record<string, unknown>`                                                                                                                                            | `undefined` | Extra props forwarded to the cancel button.                                                                  |
| positive-button-props | `Record<string, unknown>`                                                                                                                                            | `undefined` | Extra props forwarded to the confirm button.                                                                 |
| on-positive-click     | `(e: MouseEvent) => boolean \| Promise<boolean> \| void`                                                                                                             | `undefined` | Confirm callback; `false` (also when resolved asynchronously) vetoes closing, bindable as `@positive-click`. |
| on-negative-click     | `(e: MouseEvent) => boolean \| Promise<boolean> \| void`                                                                                                             | `undefined` | Cancel callback with the same veto semantics, bindable as `@negative-click`.                                 |
| disabled              | `boolean`                                                                                                                                                            | `false`     | Suppress showing entirely.                                                                                   |
| display-directive     | `'if' \| 'show'`                                                                                                                                                     | `'if'`      | `'if'` unmounts on hide; `'show'` keeps the node and toggles `display`.                                      |
| flip                  | `boolean`                                                                                                                                                            | `true`      | Flip to the opposite side when space runs out.                                                               |
| keep-alive-on-hover   | `boolean`                                                                                                                                                            | `true`      | Keep open while the pointer is inside the bubble.                                                            |
| animated              | `boolean`                                                                                                                                                            | `true`      | Enter / leave animation on or off.                                                                           |
| width                 | `number \| 'trigger'`                                                                                                                                                | `undefined` | Width; `'trigger'` matches the trigger, a number sets a fixed px width.                                      |
| to                    | `string \| HTMLElement \| false`                                                                                                                                     | `'body'`    | Teleport target; `false` renders it inline.                                                                  |
| z-index               | `number`                                                                                                                                                             | `undefined` | Explicit stacking order.                                                                                     |
| content-class         | `string`                                                                                                                                                             | `undefined` | Class on the inner body.                                                                                     |
| content-style         | `CSSProperties`                                                                                                                                                      | `undefined` | Inline style on the inner body.                                                                              |
| on-clickoutside       | `(e: MouseEvent) => void`                                                                                                                                            | `undefined` | Called when a click lands outside the bubble and its trigger.                                                |

### Events

| Name          | Payload   | Notes                                                                                                                                     |
| ------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `update:show` | `boolean` | Show state changed, pairs with `v-model:show`; confirm / cancel callbacks go through the `on-positive-click` / `on-negative-click` props. |

### Slots

| Slot    | Notes                                                               |
| ------- | ------------------------------------------------------------------- |
| default | Trigger element — the visible node the bubble anchors to.           |
| icon    | Leading icon area — replaces the built-in icon and the `icon` prop. |
| action  | Action row — replaces the built-in cancel / confirm buttons.        |

### Methods

| Name      | Type            | Notes                                                      |
| --------- | --------------- | ---------------------------------------------------------- |
| `show`    | `() => void`    | Programmatic show, still bound by `disabled`.              |
| `hide`    | `() => void`    | Programmatic hide.                                         |
| `isShown` | `() => boolean` | Read the effective show state (controlled + uncontrolled). |

## Tokens

| Token              | CSS variable                        | Purpose             |
| ------------------ | ----------------------------------- | ------------------- |
| Background surface | `--sn-web-color-background-surface` | Card + arrow fill   |
| Border subtle      | `--sn-web-color-border-subtle`      | Card + arrow border |
| Card shadow        | `--sn-web-card-shadow`              | Card elevation      |
| Text primary       | `--sn-web-color-text-primary`       | Message text        |
| Feedback warning   | `--sn-web-color-feedback-warning`   | Default icon colour |

## Accessibility

- Panel: `role="dialog"` + `aria-modal="false"` (non-trapping popover).
- Trigger wrapper: `aria-expanded` + `aria-haspopup="dialog"`.
- The icon area is decorative (`aria-hidden`) so it is not announced twice.
- The two built-in buttons are real buttons with visible labels, focusable and keyboard-triggerable; a custom `#action` slot must keep the same reachability and focus order.

## AI Patch Boundary

| Safe for AI to generate                                                  | Requires human review                                                               |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| `content`, `positive-text` / `negative-text` copy and static `placement` | Business requests and close policy inside `on-positive-click` / `on-negative-click` |
| `show-icon` / `icon` display switches                                    | Failure rollback via returning `Promise<false>`                                     |
| Static composition in docs and demos                                     | Controlled `v-model:show` binding and external state wiring                         |

See the component `ai-description.md` for the full contract.
