/**
 * useNotification — inject the notification API provided by an ancestor
 * `<SnNotificationProvider>` (AUI-WEB-FB-012).
 *
 * Reference library: naive-ui `useNotification`
 * (https://www.naiveui.com/zh-CN/light/components/notification)
 * Per AGENTS.md §112, the returned `NotificationApi` surface mirrors the
 * reference composable 1:1: `create` / `info` / `success` / `warning` /
 * `error` / `destroyAll`.
 *
 * Divergence from the reference composable (documented per §112.2a):
 *   upstream throws a runtime error when called outside a provider; here we
 *   `console.warn` a structured `PROVIDER_MISSING` code and return a no-op
 *   API instead, so a missing provider can never crash the host app
 *   (AGENTS.md §28 structured errors + §83 error recovery).
 *
 * Usage:
 *   import { SnNotificationProvider, useNotification } from '@snui/vue-web'
 *
 *   <SnNotificationProvider>
 *     <SomeDescendant />  ← calls useNotification() inside its setup()
 *   </SnNotificationProvider>
 */

import { inject } from 'vue';
import type { InjectionKey } from 'vue';
import type { NotificationApi, NotificationReactive } from './notification-types';

/**
 * Provide/inject key for the notification API. Exported so tests and custom
 * providers can interact with the same contract; normal consumers should use
 * `useNotification()` instead of injecting this key directly.
 */
export const notificationApiInjectionKey: InjectionKey<NotificationApi> =
  Symbol('sn-notification-api');

/** Shared no-op handle — `destroy()` on an API-less notification does nothing. */
const NOOP_REACTIVE: NotificationReactive = { destroy: () => {} };

/** API returned when no provider is mounted — every call is a safe no-op. */
function createNoopNotificationApi(): NotificationApi {
  const noopCreate = (_options: Parameters<NotificationApi['create']>[0]): NotificationReactive =>
    NOOP_REACTIVE;
  return {
    create: noopCreate,
    info: noopCreate,
    success: noopCreate,
    warning: noopCreate,
    error: noopCreate,
    destroyAll: () => {},
  };
}

/**
 * Inject the notification API. Must be called inside the setup of a
 * component that is a descendant of `<SnNotificationProvider>` — the provider
 * renders the stack and owns the lifecycle of every card, so an API obtained
 * outside its subtree cannot work.
 *
 * Never throws: without a provider the caller gets a no-op API plus a
 * `PROVIDER_MISSING` console warning (see divergence note above).
 */
export function useNotification(): NotificationApi {
  const api = inject(notificationApiInjectionKey);
  if (api) {
    return api;
  }
  console.warn(
    '[SNUI:PROVIDER_MISSING] useNotification() was called without a <SnNotificationProvider> ancestor — returning a no-op API. Wrap your app (or the subtree that needs notifications) in <SnNotificationProvider>.',
    {
      code: 'PROVIDER_MISSING',
      component: 'SnNotificationProvider',
      composable: 'useNotification',
    },
  );
  return createNoopNotificationApi();
}
