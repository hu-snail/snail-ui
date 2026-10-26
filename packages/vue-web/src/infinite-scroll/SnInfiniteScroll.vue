<script setup lang="ts">
/**
 * SnInfiniteScroll — web-end infinite scroll container (AUI-WEB-DD-011).
 *
 * Reference library: naive-ui `n-infinite-scroll`
 *   (https://www.naiveui.com/zh-CN/light/components/infinite-scroll)
 * Per AGENTS.md §112, props + semantics mirror n-infinite-scroll 1:1:
 *   distance (default 0) / load (`() => Promise<void> | void`, resolves to
 *   finish the cycle) / scrollbar-props. When the scroll position gets
 *   within `distance` px of the bottom, `load` fires; while it is pending
 *   no further load is triggered (re-entrancy guard, mirroring the
 *   reference `loading` flag); load rejections are swallowed.
 *
 * Documented divergences (not §112 violations):
 *   - The reference delegates scrolling to its internal `n-scrollbar`
 *     (always a self-contained scroll container). This component renders
 *     its own scroll container: `overflow: auto` on the root element, and
 *     the height / max-height is controlled by consumer styles
 *     (e.g. `style="height: 240px"`). `scrollbar-props` is spread onto the
 *     root element instead of a Scrollbar instance.
 *   - `show-loading` (default true) is an addition: while `load` is
 *     pending an inline-SVG spinner is rendered below the content. The
 *     reference has no built-in loading UI (its demos render their own).
 *   - There is no stop condition: after `load` resolves, loading re-arms
 *     and fires again on the next scroll / wheel event, matching the
 *     reference (consumers stop by no longer appending content).
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnInfiniteScroll style="height: 240px" :distance="10" :load="load" />
 */

import { onBeforeUnmount, onMounted, ref } from 'vue';

defineOptions({ name: 'SnInfiniteScroll' });

const props = withDefaults(
  defineProps<{
    /** Bottom-distance threshold in px that triggers `load`. Mirrors n-infinite-scroll `distance`. */
    distance?: number;
    /** Called when the container is scrolled within `distance` of the bottom; a pending promise blocks further triggers. Mirrors n-infinite-scroll `on-load`. */
    load?: (() => Promise<void> | void) | undefined;
    /** Extra attributes for the internal scroll container (the reference applies them to its Scrollbar). Mirrors n-infinite-scroll `scrollbar-props`. */
    scrollbarProps?: Record<string, unknown> | undefined;
    /** Render an inline-SVG spinner at the bottom while `load` is pending (addition — the reference ships no loading UI). */
    showLoading?: boolean;
  }>(),
  {
    distance: 0,
    load: undefined,
    scrollbarProps: undefined,
    showLoading: true,
  },
);

const rootRef = ref<HTMLDivElement | null>(null);
const isLoading = ref(false);

async function checkBottom(): Promise<void> {
  const el = rootRef.value;
  if (el === null) return;
  const { scrollTop, clientHeight, scrollHeight } = el;
  if (scrollTop + clientHeight < scrollHeight - props.distance) return;
  isLoading.value = true;
  try {
    await props.load?.();
  } catch {
    // Load errors are swallowed, matching the reference implementation.
  }
  isLoading.value = false;
}

function handleScroll(): void {
  if (isLoading.value) return;
  void checkBottom();
}

function handleWheel(event: WheelEvent): void {
  // Mirrors the reference: only downward wheels may trigger a load.
  if (event.deltaY <= 0) return;
  if (isLoading.value) return;
  void checkBottom();
}

onMounted(() => {
  const el = rootRef.value;
  if (el === null) return;
  el.addEventListener('scroll', handleScroll);
  el.addEventListener('wheel', handleWheel);
});

onBeforeUnmount(() => {
  const el = rootRef.value;
  if (el === null) return;
  el.removeEventListener('scroll', handleScroll);
  el.removeEventListener('wheel', handleWheel);
});
</script>

<template>
  <div
    ref="rootRef"
    v-bind="scrollbarProps"
    data-snui-component="infinite-scroll"
    class="sn-infinite-scroll"
    :class="{ 'sn-infinite-scroll--loading': isLoading }"
  >
    <slot />
    <div v-if="isLoading && showLoading" class="sn-infinite-scroll__loading" aria-live="polite">
      <svg class="sn-infinite-scroll__spinner" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-dasharray="42"
          stroke-dashoffset="12"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

/* The root element is the scroll container; height / max-height come from
 * consumer styles (mirrors sizing the reference via style="height: …"). */
.sn-infinite-scroll {
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
}

.sn-infinite-scroll__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  color: var(--sn-web-color-text-tertiary);
}

.sn-infinite-scroll__spinner {
  display: block;
  width: 20px;
  height: 20px;
  animation: sn-infinite-scroll-spin 1.2s linear infinite;
}

@keyframes sn-infinite-scroll-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
