# Notification (Web)

`SnNotificationProvider` + `useNotification()` provide global notifications: lightweight feedback cards stacked in a screen corner, auto-dismissed after a duration, and closable on demand.

Unlike `SnAlert` (inline, stays in the document flow) and `SnDialog` (blocking, requires a user decision), notifications are transient global overlays.

## When to use

- Async feedback for operations: saved, upload failed, export finished.
- System-level messages: announcements, quota warnings, maintenance notices.
- Multiple transient messages stacked in a corner.

Not suitable: decisions belong in `SnDialog`; persistent in-section messages belong in `SnAlert`.

## Demos

### Basic usage

Wrap your app (or a subtree) in `SnNotificationProvider`, then trigger notifications by calling `useNotification()` inside a descendant's `setup()`. The same demo also covers a sticky `duration: 0` card, handle-based closing and `destroyAll()`:

<Demo name="notification-web-basic" description="Provider wrapper + four notification types + destroyAll" />

### Four semantic types

`info` / `success` / `warning` / `error` each drive their own built-in icon and colour; omitting `type` falls back to `default` (no icon):

<Demo name="notification-web-types" description="Icon and colour comparison across the four semantic types" />

### Stack placement

`placement` picks the corner the stack is anchored to — six positions across the top and bottom edges. Switching it moves notifications already on screen; `bottom` placements grow upward:

<Demo name="notification-web-placement" description="Six placement buttons; notifications move to the chosen corner" />

### Max count

`max` caps how many notifications are visible at once; pushing past the cap evicts the oldest first:

<Demo name="notification-web-max" description="max=3: keep pushing and watch the oldest card get evicted" />

### Custom content and handle-based closing

`avatar` / `meta` / `footer` / `description` combine into a custom card; the handle returned by `create()` can be held and destroyed at any time:

<Demo name="notification-web-custom" description="Avatar + meta timestamp + footer actions + held handle destroy" />

## API

### Props

`SnNotificationProvider` props:

| Name              | Type                                                                                | Default       | Description                                                                                                            |
| ----------------- | ----------------------------------------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `placement`       | `'top' \| 'top-right' \| 'top-left' \| 'bottom' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` | Corner/edge anchoring the stack. Bottom placements grow upward (new cards appear at the bottom).                       |
| `max`             | `number`                                                                            | `Infinity`    | Max notifications on screen at once; overflow evicts the oldest first.                                                 |
| `to`              | `string \| HTMLElement`                                                             | `'body'`      | Teleport target for the stack container.                                                                               |
| `container-style` | `string \| CSSProperties`                                                           | `undefined`   | Extra inline style merged onto the stack container.                                                                    |
| `scrollable`      | `boolean`                                                                           | `false`       | Scroll the stack internally when it outgrows the viewport (max height = viewport height minus the top/bottom offsets). |

The provider's default slot carries the trigger area (see Slots below).

### NotificationOptions

`create()` and the four shortcuts all take this object:

| Property           | Type                                                       | Default     | Description                                                                                                     |
| ------------------ | ---------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------- |
| `type`             | `'default' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'default'` | Semantic type — drives the built-in icon + colour; `'default'` renders no icon.                                 |
| `title`            | `string`                                                   | `undefined` | Heading line (bold).                                                                                            |
| `content`          | `string`                                                   | `undefined` | Primary body text.                                                                                              |
| `description`      | `string`                                                   | `undefined` | Secondary body text under `content`.                                                                            |
| `meta`             | `string`                                                   | `undefined` | Small caption line (e.g. a timestamp).                                                                          |
| `avatar`           | `() => VNodeChild`                                         | `undefined` | Leading avatar render function.                                                                                 |
| `footer`           | `() => VNodeChild`                                         | `undefined` | Footer render function.                                                                                         |
| `duration`         | `number`                                                   | `3000`      | Auto-close delay in ms; `0` or a negative value disables auto-close.                                            |
| `closable`         | `boolean`                                                  | `true`      | Render the close button.                                                                                        |
| `keepAliveOnHover` | `boolean`                                                  | `true`      | Pause the `duration` countdown while hovered; resumes with the remaining time on leave.                         |
| `onClose`          | `() => void`                                               | `undefined` | Called when the notification closes (close button / countdown / `destroy()` / `destroyAll()` / `max` eviction). |
| `onAfterEnter`     | `() => void`                                               | `undefined` | Called after the enter transition finishes.                                                                     |
| `onAfterLeave`     | `() => void`                                               | `undefined` | Called after the leave transition finishes.                                                                     |

### NotificationReactive

The handle returned for each notification:

| Method    | Signature    | Description                                                                                                                 |
| --------- | ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `destroy` | `() => void` | Close that notification: fires its `onClose`, plays the leave transition, then removes it. A no-op once it is already gone. |

### Slots

`SnNotification` is the card that actually renders, batched internally by the provider; use it directly for a fully custom stack:

| Name      | Params | Description                                     |
| --------- | ------ | ----------------------------------------------- |
| `default` | `()`   | Body content — replaces `content`.              |
| `header`  | `()`   | Heading — replaces `title`.                     |
| `icon`    | `()`   | Custom type icon — replaces the built-in glyph. |
| `footer`  | `()`   | Footer — replaces the `footer` render function. |
| `avatar`  | `()`   | Avatar — replaces the `avatar` render function. |

The `default` slot of `SnNotificationProvider` carries the trigger area; `useNotification()` must be called inside one of its descendants.

### Methods

Call `useNotification()` inside the `setup()` of a **descendant** of `SnNotificationProvider` to get a `NotificationApi`:

| Method       | Signature                                                | Description                                                         |
| ------------ | -------------------------------------------------------- | ------------------------------------------------------------------- |
| `create`     | `(options: NotificationOptions) => NotificationReactive` | Push a notification, typed by `options.type` (default `'default'`). |
| `info`       | `(options: NotificationOptions) => NotificationReactive` | `create` with `type: 'info'` forced.                                |
| `success`    | `(options: NotificationOptions) => NotificationReactive` | `create` with `type: 'success'` forced.                             |
| `warning`    | `(options: NotificationOptions) => NotificationReactive` | `create` with `type: 'warning'` forced.                             |
| `error`      | `(options: NotificationOptions) => NotificationReactive` | `create` with `type: 'error'` forced.                               |
| `destroyAll` | `() => void`                                             | Remove every notification on screen, firing each entry's `onClose`. |

The four shortcuts override `options.type`. Calling `useNotification()` without a provider never throws: it logs a structured `PROVIDER_MISSING` warning and returns a safe no-op API (every method is side-effect free, and the handle's `destroy()` is a no-op too).

## Tokens

No dedicated required tokens — colours come from the semantic token layer. The following `--sn-web-notification-*` variables provide size/layer overrides (built-in fallback applies when undefined):

| Token                                      | Fallback       | Description                   |
| ------------------------------------------ | -------------- | ----------------------------- |
| `--sn-web-notification-width`              | `330px`        | Card width                    |
| `--sn-web-notification-padding`            | `14px 16px`    | Card padding                  |
| `--sn-web-notification-gap`                | `8px`          | Gap between cards             |
| `--sn-web-notification-offset`             | `24px`         | Distance from the screen edge |
| `--sn-web-notification-z-index`            | `6000`         | Stack z-index                 |
| `--sn-web-notification-icon-color-info`    | info colour    | `info` icon colour            |
| `--sn-web-notification-icon-color-success` | info colour    | `success` icon colour         |
| `--sn-web-notification-icon-color-warning` | warning colour | `warning` icon colour         |
| `--sn-web-notification-icon-color-error`   | danger colour  | `error` icon colour           |

Also consumed: `--sn-web-color-background-elevated` (card surface), `--sn-web-color-text-primary` / `-secondary` / `-tertiary` (title/body, description, meta + close glyph), `--sn-web-color-feedback-info` / `-warning` / `-danger` (type icon colours), `--sn-web-color-border-subtle` (card border), `--sn-web-color-background-subtle` (close-button hover fill), `--sn-web-card-radius` / `--sn-web-card-shadow` (rounding + elevation), `--sn-web-icon-size-small` / `-medium` (icon sizes), `--sn-web-button-radius` (close-button rounding), `--sn-web-focus-ring` (close-button focus ring).

## Accessibility

- Stack container: `role="region"` + `aria-label="Notifications"`.
- Cards: `role="alert"` (assertive) for `error` / `warning`, `role="status"` (polite) otherwise.
- Type icon column is `aria-hidden="true"`; semantics are carried by the text.
- Close button is a real `<button type="button">` with `aria-label="关闭"` and a `:focus-visible` ring.
- The container itself is `pointer-events: none`; only the cards are interactive, so it never blocks the rest of the page.

## AI Patch Boundary

| Field                                                 | AI-safe to modify       | Notes                                                           |
| ----------------------------------------------------- | ----------------------- | --------------------------------------------------------------- |
| `type` / `title` / `content` / `description` / `meta` | yes                     | Pure data fields; safe for AI-generated patches                 |
| `duration` / `closable` / `keepAliveOnHover`          | yes                     | Behaviour switches affecting a single card                      |
| `placement` / `max` / `scrollable`                    | yes                     | Stack-level presentation config                                 |
| `avatar` / `footer` / `header` / `icon` slots         | no — needs human review | Render functions / VNodes; not statically verifiable in a patch |
| `onClose` / `onAfterEnter` / `onAfterLeave`           | no — needs human review | Business side-effect callbacks                                  |
| `to` / `container-style`                              | no — needs human review | Affects global mount point and stacking context                 |

## Known trade-offs

- Enter/leave animations are CSS slide + fade transitions (with a height collapse), not per-frame JS animation.
- Notification content is a one-shot snapshot: mutating the original options object after `create()` does not update the card — destroy and re-create instead.
- No in-place `update()` API.
