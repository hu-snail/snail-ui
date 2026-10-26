/**
 * useLoadingBar — inject the loading bar API provided by an ancestor
 * `<SnLoadingBarProvider>` (AUI-WEB-FB-013).
 *
 * Reference library: naive-ui `useLoadingBar`
 *   (https://www.naiveui.com/zh-CN/light/components/loading-bar)
 * Per AGENTS.md §112, the returned `LoadingBarApi` surface mirrors the
 * reference composable 1:1: `start` / `finish` / `error`.
 *
 * Divergence from the reference composable (documented per §112.2a):
 *   upstream throws a runtime error when called outside a provider; here we
 *   `console.warn` a structured `PROVIDER_MISSING` code and return a no-op
 *   API instead, so a missing provider can never crash the host app
 *   (AGENTS.md §28 structured errors + §83 error recovery).
 *
 * Usage:
 *   import { SnLoadingBarProvider, useLoadingBar } from '@snui/vue-web'
 *
 *   <SnLoadingBarProvider>
 *     <SomeDescendant />  ← calls useLoadingBar() inside its setup()
 *   </SnLoadingBarProvider>
 */

import { inject } from 'vue';
import type { InjectionKey } from 'vue';
import type { LoadingBarApi } from './loading-bar-types';

/**
 * Provide/inject key for the loading bar API. Exported so tests and custom
 * providers can interact with the same contract; normal consumers should use
 * `useLoadingBar()` instead of injecting this key directly.
 */
export const loadingBarApiInjectionKey: InjectionKey<LoadingBarApi> = Symbol('sn-loading-bar-api');

/** API returned when no provider is mounted — every call is a safe no-op. */
function createNoopLoadingBarApi(): LoadingBarApi {
  return {
    start: () => {},
    finish: () => {},
    error: () => {},
  };
}

/**
 * Inject the loading bar API. Must be called inside the setup of a
 * component that is a descendant of `<SnLoadingBarProvider>` — the provider
 * owns the bar element and its animation state.
 *
 * Never throws: without a provider the caller gets a no-op API plus a
 * `PROVIDER_MISSING` console warning (see divergence note above).
 */
export function useLoadingBar(): LoadingBarApi {
  const api = inject(loadingBarApiInjectionKey);
  if (api) {
    return api;
  }
  console.warn(
    '[SNUI:PROVIDER_MISSING] useLoadingBar() was called without a <SnLoadingBarProvider> ancestor — returning a no-op API. Wrap your app (or the subtree that needs the loading bar) in <SnLoadingBarProvider>.',
    {
      code: 'PROVIDER_MISSING',
      component: 'SnLoadingBarProvider',
      composable: 'useLoadingBar',
    },
  );
  return createNoopLoadingBarApi();
}
