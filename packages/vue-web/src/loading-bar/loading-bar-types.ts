/**
 * Public types for the loading bar (AUI-WEB-FB-013).
 *
 * Reference library: naive-ui `n-loading-bar` / `n-loading-bar-provider` /
 * `useLoadingBar`
 * (https://www.naiveui.com/zh-CN/light/components/loading-bar)
 * Per AGENTS.md §112, the API surface mirrors the reference 1:1:
 * `LoadingBarApi` exposes `start` / `finish` / `error` and
 * `LoadingBarStyles` mirrors the reference provider's `loadingBarStyle`
 * prop shape.
 */

import type { StyleValue } from 'vue'

/**
 * Visual state of the bar. `'default'` is the primary action colour;
 * `'error'` switches the bar to the danger colour for the finishing sprint.
 */
export type LoadingBarStatus = 'default' | 'error'

/** API injected by `<SnLoadingBarProvider>` via `useLoadingBar()`. */
export interface LoadingBarApi {
  /**
   * Start loading: the bar appears and its width grows asymptotically
   * towards (but never reaches) 100% until `finish()` / `error()`.
   * Calling `start()` again while already loading is a no-op.
   */
  start(): void
  /**
   * Sprint to 100% with the default colour, then fade out and reset.
   * No-op when no loading is in progress.
   */
  finish(): void
  /**
   * Sprint to 100% with the danger colour, then fade out and reset.
   * No-op when no loading is in progress.
   */
  error(): void
}

/**
 * Custom inline styles for the bar, mirroring the reference provider's
 * `loadingBarStyle` prop: `loading` applies while the bar is moving in the
 * default colour, `error` applies to the error sprint.
 */
export interface LoadingBarStyles {
  loading?: StyleValue | undefined
  error?: StyleValue | undefined
}
