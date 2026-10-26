<script setup lang="ts">
/**
 * SnLoadingBarProvider — mounts the loading bar and provides the
 * `useLoadingBar()` API to its subtree (AUI-WEB-FB-013).
 *
 * Reference library: naive-ui `n-loading-bar-provider`
 *   (https://www.naiveui.com/zh-CN/light/components/loading-bar)
 * Per AGENTS.md §112, semantics mirror `n-loading-bar-provider` 1:1:
 * the provider exposes the same `LoadingBarApi` shape (`start` / `finish` /
 * `error`) through the context key consumed by `useLoadingBar()`, and
 * teleports the bar to `body` (`to` prop) as a fixed full-width strip at the
 * top of the viewport, above overlays (z-index 7000+).
 *
 * State machine (mirrors the reference bar's behaviour):
 *   - `start()` — show the bar and grow its width with a rAF loop that
 *     decelerates asymptotically towards 90% (fast first steps, slowing
 *     tail), so a hanging request never reaches the end on its own.
 *   - `finish()` — stop the loop, sprint to 100% with a 0.25s ease-out,
 *     then fade out and reset to 0.
 *   - `error()` — same sprint/fade, but the bar switches to the danger
 *     colour for the sprint.
 *
 * Divergence from the reference provider (documented):
 *   - Upstream throws when `useLoadingBar()` finds no provider; here the
 *     composable warns `PROVIDER_MISSING` and returns a no-op API (see
 *     use-loading-bar.ts).
 *   - Upstream drives the bar with chained `setTimeout` steps; this
 *     implementation uses `requestAnimationFrame` with a per-frame
 *     deceleration factor (per task spec), which also makes the loop stop
 *     deterministically on unmount.
 *   - `finish()` / `error()` are no-ops when no loading is in progress (the
 *     reference shows a full flash even without a prior `start()`).
 *   - Upstream reads `--n-*` vars from a JS theme object; the bar reads
 *     `--sn-web-*` tokens in CSS (AGENTS.md §34).
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnLoadingBarProvider>
 *     <SomeDescendant />  ← calls useLoadingBar() inside its setup()
 *   </SnLoadingBarProvider>
 */

import { computed, onBeforeUnmount, provide, ref } from 'vue';
import SnLoadingBar from './SnLoadingBar.vue';
import { loadingBarApiInjectionKey } from './use-loading-bar';
import type { LoadingBarApi, LoadingBarStyles } from './loading-bar-types';

defineOptions({ name: 'SnLoadingBarProvider' });

const props = withDefaults(
  defineProps<{
    /**
     * Teleport target for the bar element. Mirrors the reference `to` prop;
     * defaults to 'body'.
     */
    to?: string | HTMLElement;
    /**
     * Custom inline styles per visual state, mirroring the reference
     * `loadingBarStyle` prop.
     */
    loadingBarStyle?: LoadingBarStyles;
  }>(),
  {
    to: 'body',
  },
);

/** Bar lifecycle. `idle` is fully hidden; the rest are visible stages. */
type Phase = 'idle' | 'loading' | 'finishing' | 'fading';

const phase = ref<Phase>('idle');
const progress = ref(0);
const isError = ref(false);

/**
 * Asymptote of the loading loop: fast initial steps, a decelerating tail.
 * The bar never reaches this on its own — only finish()/error() do.
 */
const LOADING_CEILING = 90;
/** Per-frame approach factor: width += (ceiling - width) * factor. */
const LOADING_FACTOR = 0.035;
/** Finishing sprint duration; must match the CSS transition below. */
const FINISH_MS = 260;
/** Extra time the error colour stays visible before fading. */
const ERROR_HOLD_MS = 120;
/** Fade duration; must match the CSS transition below. */
const FADE_MS = 320;

let rafId: number | null = null;
let finishTimer: ReturnType<typeof setTimeout> | null = null;
let fadeTimer: ReturnType<typeof setTimeout> | null = null;

function cancelRaf(): void {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

function clearTimers(): void {
  if (finishTimer !== null) {
    clearTimeout(finishTimer);
    finishTimer = null;
  }
  if (fadeTimer !== null) {
    clearTimeout(fadeTimer);
    fadeTimer = null;
  }
}

/** One rAF step of the loading loop: decelerating approach to the ceiling. */
function step(): void {
  rafId = null;
  if (phase.value !== 'loading') {
    return;
  }
  progress.value = Math.min(
    progress.value + (LOADING_CEILING - progress.value) * LOADING_FACTOR,
    LOADING_CEILING,
  );
  rafId = requestAnimationFrame(step);
}

function start(): void {
  if (phase.value === 'loading') {
    // Already loading — keep the existing loop (mirrors the reference).
    return;
  }
  cancelRaf();
  clearTimers();
  isError.value = false;
  progress.value = 0;
  phase.value = 'loading';
  rafId = requestAnimationFrame(step);
}

function sprintTo(status: 'default' | 'error'): void {
  if (phase.value === 'idle') {
    // Finishing without a start shows nothing (documented divergence).
    return;
  }
  cancelRaf();
  clearTimers();
  isError.value = status === 'error';
  progress.value = 100;
  phase.value = 'finishing';

  // Sprint transition (FINISH_MS) plays first; the error colour is held a
  // beat longer so the failure state registers before the fade.
  const delay = FINISH_MS + (status === 'error' ? ERROR_HOLD_MS : 0);
  finishTimer = setTimeout(() => {
    finishTimer = null;
    fadeOut();
  }, delay);
}

function fadeOut(): void {
  phase.value = 'fading';
  fadeTimer = setTimeout(() => {
    fadeTimer = null;
    phase.value = 'idle';
    progress.value = 0;
  }, FADE_MS);
}

const api: LoadingBarApi = {
  start,
  finish: () => sprintTo('default'),
  error: () => sprintTo('error'),
};

provide(loadingBarApiInjectionKey, api);

onBeforeUnmount(() => {
  cancelRaf();
  clearTimers();
});

/**
 * Inline style driving the bar: width / opacity per phase, plus the
 * transition that matches the current stage of the state machine.
 */
const barStyle = computed(() => ({
  width: `${progress.value}%`,
  opacity: phase.value === 'loading' || phase.value === 'finishing' ? '1' : '0',
  transition:
    phase.value === 'loading'
      ? 'width 0.12s linear'
      : phase.value === 'finishing'
        ? 'width 0.25s cubic-bezier(0, 0, 0.2, 1)'
        : phase.value === 'fading'
          ? 'opacity 0.32s ease'
          : 'none',
}));

/** Merge the consumer's `loadingBarStyle` for the matching visual state. */
const mergedBarStyle = computed(() => {
  if (phase.value === 'idle') {
    return barStyle.value;
  }
  const custom = isError.value ? props.loadingBarStyle?.error : props.loadingBarStyle?.loading;
  return custom ? [barStyle.value, custom] : barStyle.value;
});
</script>

<template>
  <Teleport :to="to">
    <SnLoadingBar :bar-style="mergedBarStyle" :status="isError ? 'error' : 'default'" />
  </Teleport>
  <slot />
</template>

<style scoped>
/*
 * Style note: the fixed positioning / height / colours live inside
 * SnLoadingBar.vue. This component renders the Teleport + state machine
 * only, so no scoped rules are needed here.
 */
</style>
