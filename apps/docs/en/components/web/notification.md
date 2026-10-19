# Notification (Web)

`SnNotificationProvider` + `useNotification()` provide global notification feedback: lightweight info / success / warning / error cards stacked in a screen corner, auto-dismissed after a duration, and closable on demand.

Unlike `SnAlert` (inline, stays in the document flow) and `SnDialog` (blocking, requires a user decision), notifications are transient global overlays.

## When to use

- Async feedback for operations: saved, upload failed, export finished.
- System-level messages: announcements, quota warnings, maintenance notices.
- Multiple transient messages stacked in a corner.

Not suitable: decisions belong in `SnDialog`; persistent in-section messages belong in `SnAlert`.

## Basic usage

Wrap your app (or a subtree) in `SnNotificationProvider`, then call `useNotification()` inside a descendant's `setup()`. The four semantic types:

<Demo name="notification-web-basic" description="Provider wrapper + four notification types + destroyAll" />

## API

### SnNotificationProvider Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `placement` | `'top' \| 'top-right' \| 'top-left' \| 'bottom' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` | Screen corner/edge anchoring the stack. Bottom placements grow upward. |
| `max` | `number` | `Infinity` | Max cards visible at once; overflow evicts the oldest first. |
| `to` | `string \| HTMLElement` | `'body'` | Teleport target for the stack container. |
| `container-style` | `string \| CSSProperties` | `undefined` | Extra inline style merged onto the stack container. |
| `scrollable` | `boolean` | `false` | Scroll the stack internally when it outgrows the viewport. |

### useNotification()

Call inside the `setup()` of a component nested under `SnNotificationProvider`. Returns `NotificationApi`:

| Method | Signature | Description |
| --- | --- | --- |
| `create` | `(options: NotificationOptions) => NotificationReactive` | Push a notification; `options.type` defaults to `'default'` (no icon). |
| `info` | `(options) => NotificationReactive` | `create` with `type: 'info'` forced. |
| `success` | `(options) => NotificationReactive` | `create` with `type: 'success'` forced. |
| `warning` | `(options) => NotificationReactive` | `create` with `type: 'warning'` forced. |
| `error` | `(options) => NotificationReactive` | `create` with `type: 'error'` forced. |
| `destroyAll` | `() => void` | Remove every notification on screen. |

`NotificationReactive` is the per-notification handle: `destroy()` closes that notification (firing `onClose`).

Calling `useNotification()` without a provider never throws: it logs a structured `PROVIDER_MISSING` warning and returns a safe no-op API.

### NotificationOptions

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'default' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'default'` | Semantic type — drives the built-in icon + colour. |
| `title` | `string` | `undefined` | Heading line. |
| `content` | `string` | `undefined` | Primary body text. |
| `description` | `string` | `undefined` | Secondary body text under `content`. |
| `meta` | `string` | `undefined` | Small caption line (e.g. a timestamp). |
| `avatar` | `() => VNodeChild` | `undefined` | Leading avatar render function. |
| `footer` | `() => VNodeChild` | `undefined` | Footer render function. |
| `duration` | `number` | `3000` | Auto-close delay in ms; `0` disables auto-close. |
| `closable` | `boolean` | `true` | Render the close button. |
| `keepAliveOnHover` | `boolean` | `true` | Pause the countdown while hovered; resumes with the remaining time. |
| `onClose` | `() => void` | `undefined` | Called on every close path (close button, countdown, `destroy()`, `destroyAll()`). |
| `onAfterEnter` | `() => void` | `undefined` | Enter transition finished. |
| `onAfterLeave` | `() => void` | `undefined` | Leave transition finished. |

### Slots (SnNotification card)

The provider renders cards internally; `SnNotification` is available for fully custom stacks:

| Name | Params | Description |
| --- | --- | --- |
| `default` | `()` | Body content — replaces `content`. |
| `header` | `()` | Heading — replaces `title`. |
| `icon` | `()` | Custom type icon — replaces the built-in glyph. |
| `footer` | `()` | Footer — replaces the `footer` render function. |
| `avatar` | `()` | Avatar — replaces the `avatar` render function. |

## Usage example

```vue
<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { SnButton, SnNotificationProvider, useNotification } from '@snui/vue-web'

// useNotification must run in the setup() of a provider descendant
const Trigger = defineComponent({
  name: 'NotificationTrigger',
  setup() {
    const notification = useNotification()

    const notify = () => {
      const handle = notification.success({
        title: 'Saved',
        content: 'Your configuration is now active.',
        duration: 3000,
      })
      // Close early when needed: handle.destroy()
    }

    return () => h(SnButton, { type: 'primary', onClick: notify }, () => 'Save')
  },
})
</script>

<template>
  <SnNotificationProvider>
    <Trigger />
  </SnNotificationProvider>
</template>
```

## Theming

No dedicated required tokens — colours come from the semantic token layer. The following `--sn-web-notification-*` variables provide size/layer overrides (built-in fallback applies when undefined):

| Token | Fallback | Description |
| --- | --- | --- |
| `--sn-web-notification-width` | `330px` | Card width |
| `--sn-web-notification-padding` | `14px 16px` | Card padding |
| `--sn-web-notification-gap` | `8px` | Gap between cards |
| `--sn-web-notification-offset` | `24px` | Distance from the screen edge |
| `--sn-web-notification-z-index` | `6000` | Stack z-index |
| `--sn-web-notification-icon-color-info` | info colour | `info` icon colour |
| `--sn-web-notification-icon-color-success` | info colour | `success` icon colour |
| `--sn-web-notification-icon-color-warning` | warning colour | `warning` icon colour |
| `--sn-web-notification-icon-color-error` | danger colour | `error` icon colour |

Also consumed: `--sn-web-color-background-elevated` (card surface), `--sn-web-color-text-primary` / `-secondary` / `-tertiary` (title/body, description, meta + close glyph), `--sn-web-color-feedback-info` / `-warning` / `-danger` (type icon colours), `--sn-web-color-border-subtle` (card border), `--sn-web-color-background-subtle` (close-button hover fill), `--sn-web-card-radius` / `--sn-web-card-shadow` (rounding + elevation), `--sn-web-icon-size-small` / `-medium` (icon sizes), `--sn-web-button-radius` (close-button rounding), `--sn-web-focus-ring` (close-button focus ring).

## Accessibility

- Stack container: `role="region"` + `aria-label="Notifications"`.
- Cards: `role="alert"` (assertive) for `error` / `warning`, `role="status"` (polite) otherwise.
- Type icon column is `aria-hidden="true"`; semantics are carried by the text.
- Close button is a real `<button type="button">` with `aria-label="关闭"` and a `:focus-visible` ring.

## AI Patch Boundary

| Field | AI-safe to modify | Notes |
| --- | --- | --- |
| `type` / `title` / `content` / `description` / `meta` | yes | Pure data fields; safe for AI-generated patches |
| `duration` / `closable` / `keepAliveOnHover` | yes | Behaviour switches affecting a single card |
| `placement` / `max` / `scrollable` | yes | Stack-level presentation config |
| `avatar` / `footer` / `header` / `icon` slots | no — needs human review | Render functions / VNodes; not statically verifiable in a patch |
| `onClose` / `onAfterEnter` / `onAfterLeave` | no — needs human review | Business side-effect callbacks |
| `to` / `container-style` | no — needs human review | Affects global mount point and stacking context |

## Known trade-offs

- Enter/leave animations are CSS slide + fade transitions (with a height collapse), not per-frame JS animation.
- Notification content is a one-shot snapshot: mutating the original options object after `create()` does not update the card — destroy and re-create instead.
- No in-place `update()` API.
