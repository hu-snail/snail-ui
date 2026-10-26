<script setup lang="ts">
/**
 * sn-resize (uni-end) — observe a wrapped element's size changes.
 *
 * Reference library: wot-ui `wd-resize`
 *   (https://wot-ui.cn/component/resize.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-resize 1:1
 * (`custom-style` / `custom-class` / `custom-container-class`).
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-resize/sn-resize.vue
 * → auto-registered as `<sn-resize>` in any .vue that uses it.
 *
 * ## Why there is no ResizeObserver here
 *
 * The browser has `ResizeObserver`, and wd-resize uses it on H5. Mini programs
 * and native App targets do not, so the uni end has to poll — and polling is
 * the only mechanism that works identically on every target:
 *
 *   `uni.createSelectorQuery().boundingClientRect()`  (guarded, H5 + MP + App)
 *
 * A `setInterval` keeps the cost predictable and, more importantly, is the one
 * resource this component owns — so §41's dispose obligation is a single
 * `clearInterval` in `onBeforeUnmount`. An observer plus a timer would mean two
 * code paths and two cleanup paths for the same result.
 *
 * The interval only emits when the measured box actually changed, so a parent
 * listening to `resize` does not re-render on every tick.
 *
 * Per AGENTS.md §32 this component handles rendering + measurement only.
 *
 * Not responsible for:
 *   - 布局计算 — 由宿主根据 `resize` 事件自行处理
 *   - 滚动位置 — 用 `sn-sticky` / `sn-backtop`
 */

import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref } from 'vue';

defineOptions({ name: 'SnResize' });

/** Box reported by the `resize` event. Mirrors wd-resize's payload. */
interface SnResizeRect {
  /** Width in px. */
  width: number;
  /** Height in px. */
  height: number;
  /** Distance from the viewport top (px). */
  top: number;
  /** Distance from the viewport left (px). */
  left: number;
  /** Distance from the viewport bottom (px). */
  bottom: number;
  /** Distance from the viewport right (px). */
  right: number;
}

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-resize` 1:1 surface ─────────────────────────────────── */

    /** 根节点自定义样式。 */
    customStyle?: string;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 内层容器自定义类名（实际被测量的节点）。 */
    customContainerClass?: string;
  }>(),
  {
    customStyle: '',
    customClass: '',
    customContainerClass: '',
  },
);

const emit = defineEmits<{
  (e: 'resize', rect: SnResizeRect): void;
}>();

defineSlots<{
  /** 需要监听尺寸的内容。 */
  default?(): unknown;
}>();

/**
 * Poll interval in ms.
 *
 * 100ms is the same order as wd-resize's own throttle and is fast enough that
 * a layout shift is visible before the next paint settles, while staying cheap:
 * `boundingClientRect` is a native call, not a layout thrash.
 */
const POLL_INTERVAL_MS = 100;

const instance = getCurrentInstance();
const containerId = computed(() => `sn-resize-${instance?.uid ?? 0}`);

/** Last reported box — used to suppress no-op emissions. */
let last: SnResizeRect | null = null;
let timer: ReturnType<typeof setInterval> | null = null;

/** `uni.createSelectorQuery` only exists on a uni runtime (H5 / MP / App). */
function getUni(): Record<string, unknown> | null {
  const g = globalThis as { uni?: Record<string, unknown> };
  return g.uni ?? null;
}

function sameRect(a: SnResizeRect, b: SnResizeRect): boolean {
  return a.width === b.width && a.height === b.height && a.top === b.top && a.left === b.left;
}

/**
 * Measure once and emit on change.
 *
 * The selector is scoped to this component's instance so two `sn-resize`
 * wrappers on one page never measure each other.
 */
function measure(): void {
  const uni = getUni();
  if (uni === null) return;
  const createSelectorQuery = uni.createSelectorQuery as
    | (() => {
        in: (component: unknown) => unknown;
        select: (selector: string) => {
          boundingClientRect: (cb: (rect: unknown) => void) => { exec: () => void };
        };
      })
    | undefined;
  if (typeof createSelectorQuery !== 'function') return;

  const query = createSelectorQuery();
  // `.in(instance)` pins the query to this component; without it a page-level
  // `#id` lookup would be ambiguous when several instances exist.
  const scoped = typeof query.in === 'function' ? (query.in(instance) as typeof query) : query;
  scoped
    .select(`#${containerId.value}`)
    .boundingClientRect((rect) => {
      if (rect === null || rect === undefined) return;
      const r = rect as Partial<SnResizeRect>;
      const next: SnResizeRect = {
        width: Math.round(r.width ?? 0),
        height: Math.round(r.height ?? 0),
        top: Math.round(r.top ?? 0),
        left: Math.round(r.left ?? 0),
        bottom: Math.round(r.bottom ?? 0),
        right: Math.round(r.right ?? 0),
      };
      if (last !== null && sameRect(last, next)) return;
      last = next;
      emit('resize', next);
    })
    .exec();
}

onMounted(() => {
  // First measurement is deferred one tick: on MP the node may not be laid out
  // yet when `onMounted` runs.
  setTimeout(measure, 0);
  timer = setInterval(measure, POLL_INTERVAL_MS);
});

onBeforeUnmount(() => {
  // §41: the poll is the only resource this component owns.
  if (timer !== null) clearInterval(timer);
  timer = null;
  last = null;
});

const rootStyle = computed(() => props.customStyle || undefined);
</script>

<template>
  <view :class="['sn-resize', customClass]" :style="rootStyle" data-snui-component="resize">
    <view :id="containerId" :class="['sn-resize__container', customContainerClass]">
      <slot />
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). */
.sn-resize {
  display: block;
  width: 100%;
}

/*
 * The measured node. `display: block` matters: an inline box reports a
 * fractional line-box height, which would emit a spurious resize on every
 * poll. `min-width: 0` lets it shrink inside a flex parent.
 */
.sn-resize__container {
  display: block;
  width: 100%;
  min-width: 0;
}
</style>
