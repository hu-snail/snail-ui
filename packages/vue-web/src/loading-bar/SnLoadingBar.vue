<script setup lang="ts">
/**
 * SnLoadingBar — the presentational loading bar rendered by
 * `<SnLoadingBarProvider>` (AUI-WEB-FB-013).
 *
 * Reference library: naive-ui `n-loading-bar`
 *   (https://www.naiveui.com/zh-CN/light/components/loading-bar)
 * Per AGENTS.md §112, this mirrors `n-loading-bar` 1:1: a fixed, full-width
 * top strip whose height defaults to 2px, filled with the primary action
 * colour (or the danger colour for the error state).
 *
 * Scope note — this is the *bar*, not the state machine: the provider owns
 * the `start` / `finish` / `error` state machine and passes the computed
 * width / opacity / transition as inline style. The bar element itself is
 * teleported to `body` by the provider and is purely decorative
 * (`aria-hidden="true"`) — progress feedback of this kind is conveyed by the
 * app's own UI, not announced twice by a second progressbar role.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 */

import type { StyleValue } from 'vue'
import type { LoadingBarStatus } from './loading-bar-types'

defineOptions({ name: 'SnLoadingBar' })

defineProps<{
  /** Inline style (width / opacity / transition) computed by the provider. */
  barStyle: StyleValue
  /** Colour state: 'default' primary colour, 'error' danger colour. */
  status?: LoadingBarStatus
}>()
</script>

<template>
  <div class="sn-loading-bar" aria-hidden="true" data-snui-component="loading-bar">
    <div
      class="sn-loading-bar__bar"
      :class="status === 'error' && 'sn-loading-bar__bar--error'"
      :style="barStyle"
    />
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`).
 * No loading-bar-specific token exists yet, so sizes read
 * `var(--sn-web-loading-bar-*, <fallback>)` — overridable, with the
 * fallback as the built-in default. */

.sn-loading-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--sn-web-loading-bar-z-index, 7000);
  /* Decorative overlay: never intercepts clicks. */
  pointer-events: none;
}

.sn-loading-bar__bar {
  height: var(--sn-web-loading-bar-height, 2px);
  background: var(--sn-web-color-action-primary, #4098fc);
  will-change: width, opacity;
}

.sn-loading-bar__bar--error {
  background: var(--sn-web-color-feedback-danger, #d03050);
}
</style>
