# SnNotification / SnNotificationProvider — AI-Friendly Component Description

> Human-readable + AI-parseable description of the web-end notification
> components. Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware
> listing. **`end: web`** marker — consumed by `list_components({ end: 'web' })`.
>
> Task: AUI-WEB-FB-012.

## Meta Information (internal)

Per AGENTS.md §112 / §114.4, the reference-library relation is recorded here
and in the SFC header comments — never in user-facing docs.

- Reference library: naive-ui `n-notification` + `n-notification-provider` +
  `useNotification` (https://www.naiveui.com/zh-CN/light/components/notification)
- Files: `SnNotification.vue` (card), `SnNotificationProvider.vue` (stack +
  provide), `use-notification.ts` (inject + no-op fallback),
  `notification-types.ts` (public types)
- Exported (main-thread registration in `index.ts`): `SnNotification`,
  `SnNotificationProvider`, `useNotification`, and the
  `notification-types.ts` type surface

## Purpose

Global, stacked, self-dismissing feedback for operation results and system
messages. Cards appear in a fixed screen corner, pause their countdown while
hovered, and are removed by countdown, close button, handle `destroy()`, or
`destroyAll()`.

## Import

```ts
import { SnNotification, SnNotificationProvider, useNotification } from '@snui/vue-web';
```

## Component Surface

### `<SnNotificationProvider>` Props

| Name             | Type                                                                                | Default       | Description                                                            |
| ---------------- | ----------------------------------------------------------------------------------- | ------------- | ---------------------------------------------------------------------- |
| `placement`      | `'top' \| 'top-right' \| 'top-left' \| 'bottom' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` | Screen corner/edge anchoring the stack.                                |
| `max`            | `number`                                                                            | `Infinity`    | Cap on simultaneously visible cards; overflow evicts the oldest first. |
| `to`             | `string \| HTMLElement`                                                             | `'body'`      | Teleport target for the stack container.                               |
| `containerStyle` | `string \| CSSProperties`                                                           | `undefined`   | Extra inline style merged onto the stack container.                    |
| `scrollable`     | `boolean`                                                                           | `false`       | Let the stack scroll internally when it outgrows the viewport.         |

### `useNotification()` → `NotificationApi`

| Method       | Signature                                                | Description                                          |
| ------------ | -------------------------------------------------------- | ---------------------------------------------------- |
| `create`     | `(options: NotificationOptions) => NotificationReactive` | Push a notification with an explicit/omitted `type`. |
| `info`       | `(options) => NotificationReactive`                      | `create()` with `type: 'info'` forced.               |
| `success`    | `(options) => NotificationReactive`                      | `create()` with `type: 'success'` forced.            |
| `warning`    | `(options) => NotificationReactive`                      | `create()` with `type: 'warning'` forced.            |
| `error`      | `(options) => NotificationReactive`                      | `create()` with `type: 'error'` forced.              |
| `destroyAll` | `() => void`                                             | Remove every card on screen.                         |

`NotificationReactive = { destroy(): void }`.

### `NotificationOptions`

| Name               | Type                                                       | Default     | Description                                                                                         |
| ------------------ | ---------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------- |
| `type`             | `'default' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'default'` | Drives the built-in icon + colour.                                                                  |
| `title`            | `string`                                                   | `undefined` | Heading line.                                                                                       |
| `content`          | `string`                                                   | `undefined` | Primary body text.                                                                                  |
| `description`      | `string`                                                   | `undefined` | Secondary body text under `content`.                                                                |
| `meta`             | `string`                                                   | `undefined` | Small caption line (e.g. timestamp).                                                                |
| `avatar`           | `() => VNodeChild`                                         | `undefined` | Leading avatar render function.                                                                     |
| `footer`           | `() => VNodeChild`                                         | `undefined` | Footer render function.                                                                             |
| `duration`         | `number`                                                   | `3000`      | Auto-destroy delay in ms; `<= 0` keeps the card until closed.                                       |
| `closable`         | `boolean`                                                  | `true`      | Render the close button.                                                                            |
| `keepAliveOnHover` | `boolean`                                                  | `true`      | Pause the countdown while hovered.                                                                  |
| `onClose`          | `() => void`                                               | `undefined` | Fired on every destroy path (close button, countdown, `destroy()`, `destroyAll()`, `max` eviction). |
| `onAfterEnter`     | `() => void`                                               | `undefined` | Enter transition finished.                                                                          |
| `onAfterLeave`     | `() => void`                                               | `undefined` | Leave transition finished.                                                                          |

### `SnNotification` card slots (advanced / custom host usage)

| Name      | Description                            |
| --------- | -------------------------------------- |
| `default` | Body content — replaces `content`.     |
| `header`  | Heading — replaces `title`.            |
| `icon`    | Replaces the built-in per-type glyph.  |
| `footer`  | Replaces the `footer` render function. |
| `avatar`  | Replaces the `avatar` render function. |

## Provider / composable wiring

- `notificationApiInjectionKey` (in `use-notification.ts`) is the provide/
  inject contract; the provider `provide`s it in setup, `useNotification()`
  injects it.
- Missing provider → `console.warn` with structured code
  **`PROVIDER_MISSING`** (message string + `{ code, component, composable }`
  payload) and a no-op API. Never throws.

## Divergences from the reference library (§112.2a)

1. No-provider behaviour: the reference throws; this implementation warns
   `PROVIDER_MISSING` and returns a no-op API (AGENTS.md §83).
2. `onClose` also fires on `destroyAll()` and on `max` eviction (the
   reference only documents close-driven callbacks). Every destroy path is
   observable.
3. The container element is always rendered (even with zero cards) with
   `pointer-events: none`, instead of being lazily mounted on first push.
4. Theming reads `--sn-web-*` tokens in CSS instead of the reference's JS
   theme object (§34). Component-specific sizes use
   `var(--sn-web-notification-*, <fallback>)` hooks.
5. Config-provider-level defaults for `placement` / `max` are not modelled
   (SnConfigProvider does not cover the notification stack yet).
6. `update()`-style mutation of an existing notification is not implemented
   (not in the reference public API either); create-then-destroy is the
   supported flow.
7. Icons: lucide `Info` / `CircleCheck` / `TriangleAlert` (the reference's
   AlertTriangle glyph) / `CircleAlert` / `X` via SnIcon, instead of the
   reference's bundled SVG set.

## Tokens Consumed (end: web)

| Token                                                           | Purpose                                                                   |
| --------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `--sn-web-color-background-elevated`                            | Card surface                                                              |
| `--sn-web-color-text-primary` / `-secondary` / `-tertiary`      | Title/body, description, meta + close glyph                               |
| `--sn-web-color-feedback-info`                                  | Info icon colour (and success, mirroring the reference icon colour table) |
| `--sn-web-color-feedback-warning`                               | Warning icon colour                                                       |
| `--sn-web-color-feedback-danger`                                | Error icon colour                                                         |
| `--sn-web-color-border-subtle`                                  | Card border                                                               |
| `--sn-web-color-background-subtle`                              | Close-button hover fill                                                   |
| `--sn-web-card-radius` / `--sn-web-card-shadow`                 | Card rounding + elevation                                                 |
| `--sn-web-icon-size-small` / `-medium`                          | Close glyph / type icon size                                              |
| `--sn-web-button-radius`                                        | Close-button rounding                                                     |
| `--sn-web-focus-ring`                                           | Close-button `:focus-visible` ring                                        |
| `--sn-web-notification-width` (fallback `330px`)                | Card width                                                                |
| `--sn-web-notification-padding` (fallback `14px 16px`)          | Card padding                                                              |
| `--sn-web-notification-gap` (fallback `8px`)                    | Stack gap                                                                 |
| `--sn-web-notification-offset` (fallback `24px`)                | Distance from the screen edge                                             |
| `--sn-web-notification-z-index` (fallback `6000`)               | Stack z-index                                                             |
| `--sn-web-notification-icon-color-{info,success,warning,error}` | Per-type icon colour overrides                                            |

## Accessibility

- Container: `role="region"` + `aria-label="Notifications"`.
- Card: `role="alert"` for `warning` / `error`, `role="status"` otherwise.
- Type icon column: `aria-hidden="true"`.
- Close button: real `<button type="button">` with `aria-label="关闭"` and a
  `:focus-visible` ring.

## Versioning

`@snui/vue-web` — initial release. Part of AUI-WEB-FB-012 (feedback Web
components).
