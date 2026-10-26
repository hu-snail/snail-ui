/**
 * Public types for the notification stack (AUI-WEB-FB-012).
 *
 * Reference library: naive-ui `n-notification` / `n-notification-provider`
 * (https://www.naiveui.com/zh-CN/light/components/notification)
 * Per AGENTS.md §112, type names + member semantics mirror the reference
 * API 1:1 (`NotificationOptions` / `NotificationReactive` / `NotificationApi`
 * / `NotificationType` / `NotificationPlacement`).
 *
 * Divergences (documented per §112.2a):
 *   - Every optional member carries an explicit `| undefined` so consumers
 *     can spread option objects under `exactOptionalPropertyTypes`.
 *   - `avatar` / `footer` are render functions (`() => VNodeChild`), matching
 *     how the reference API receives them through `useNotification()`.
 */

import type { VNodeChild } from 'vue';

/**
 * Semantic type of a notification — drives the built-in icon + its colour.
 * `'default'` renders without an icon (same as the reference library).
 */
export type NotificationType = 'default' | 'info' | 'success' | 'warning' | 'error';

/** Screen corner (or edge) where the notification stack is anchored. */
export type NotificationPlacement =
  'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left';

/**
 * Options for a single notification. The same shape is accepted by
 * `useNotification().create()` and the per-type shortcuts
 * (`info()` / `success()` / `warning()` / `error()` — the shortcut forces
 * `type` and ignores a conflicting `options.type`).
 */
export interface NotificationOptions {
  /** Semantic type — drives the built-in icon + colour. */
  type?: NotificationType | undefined;
  /** Bold heading line. */
  title?: string | undefined;
  /** Primary body text. */
  content?: string | undefined;
  /** Secondary body text, rendered under `content`. */
  description?: string | undefined;
  /** Small footer-left caption (e.g. a timestamp). */
  meta?: string | undefined;
  /** Leading avatar render function. Replaced by the `avatar` slot on the card. */
  avatar?: (() => VNodeChild) | undefined;
  /** Footer render function. Replaced by the `footer` slot on the card. */
  footer?: (() => VNodeChild) | undefined;
  /**
   * Auto-destroy delay in ms. `0` (or a negative value) keeps the
   * notification until it is closed manually.
   */
  duration?: number | undefined;
  /** Render the close button. */
  closable?: boolean | undefined;
  /** Pause the `duration` countdown while the pointer hovers the card. */
  keepAliveOnHover?: boolean | undefined;
  /** Called when the notification is closed (close button, countdown, or `destroy()`). */
  onClose?: (() => void) | undefined;
  /** Called after the card's enter transition finishes. */
  onAfterEnter?: (() => void) | undefined;
  /** Called after the card's leave transition finishes. */
  onAfterLeave?: (() => void) | undefined;
}

/** Handle returned by `create()` / the per-type shortcuts. */
export interface NotificationReactive {
  /** Manually close this notification (fires `onClose`, then removes it). */
  destroy(): void;
}

/** API injected by `<SnNotificationProvider>` via `useNotification()`. */
export interface NotificationApi {
  /** Push a notification with an explicit (or omitted) `type`. */
  create(options: NotificationOptions): NotificationReactive;
  /** `create()` with `type: 'info'` forced. */
  info(options: NotificationOptions): NotificationReactive;
  /** `create()` with `type: 'success'` forced. */
  success(options: NotificationOptions): NotificationReactive;
  /** `create()` with `type: 'warning'` forced. */
  warning(options: NotificationOptions): NotificationReactive;
  /** `create()` with `type: 'error'` forced. */
  error(options: NotificationOptions): NotificationReactive;
  /** Remove every notification currently on screen. */
  destroyAll(): void;
}
