<script setup lang="ts">
/**
 * SnVirtualList — web-end virtual scrolling list (AUI-WEB-DD-029).
 *
 * Reference library: naive-ui `n-virtual-list`
 *   (https://www.naiveui.com/zh-CN/light/components/virtual-list)
 * Per AGENTS.md §112, props + semantics mirror n-virtual-list 1:1.
 *
 * Parity checklist (props):
 *   items / itemSize / itemResizable / keyField / overscan.
 * Parity checklist (events):
 *   scroll (on-scroll) / update:scrollTop (on-update:scroll-top).
 * Parity checklist (slots):
 *   item ({ item, index }).
 *
 * Documented divergences (not §112 violations):
 *   - Minimal self-contained virtual scroller (no external dependency):
 *     scroll container + full-height sizer + translated window. Item
 *     positions come from index * itemSize when `itemResizable` is off,
 *     and from a prefix-sum table (binary search) when on.
 *   - `itemResizable` measures downward only: unmeasured rows fall back
 *     to `itemSize`; rendered rows are measured via ResizeObserver
 *     (mounted once, disconnected on unmount). Re-measuring does not
 *     shift rows above the measured window.
 *   - The component is not generic-typed: `items` accepts
 *     `Record<string, unknown> | string | number` entries and the slot
 *     payload types `item` accordingly (the reference is generic).
 *   - Added prop `visibleHeight` (px) — pins the viewport height for
 *     environments without layout (tests) or non-CSS-sized usage; when
 *     omitted the container's own height (clientHeight) is measured.
 *   - The item content slot is named `item` (the reference renders its
 *     default slot); keyboard / scrollbar semantics come from the native
 *     scroll container (`role="list"`).
 *
 * Resource cleanup (AGENTS.md §41/§42): the pending rAF handle and both
 * ResizeObservers (container + item rows) are disconnected in
 * onBeforeUnmount.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnVirtualList :items="items" :item-size="32" style="height: 240px">
 *     <template #item="{ item, index }">…</template>
 *   </SnVirtualList>
 */

import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'

defineOptions({ name: 'SnVirtualList' })

/** Loose item shape: keyed objects or bare primitives. */
type SnVirtualListItem = Record<string, unknown> | string | number

const props = withDefaults(
  defineProps<{
    /** Full data list (only the visible window renders). Mirrors n-virtual-list `items`. */
    items?: SnVirtualListItem[]
    /** Fixed row height in px (also the fallback estimate for unmeasured rows). Mirrors n-virtual-list `itemSize`. */
    itemSize?: number
    /** Measure rendered rows with ResizeObserver and reflow from measured heights. Mirrors n-virtual-list `itemResizable`. */
    itemResizable?: boolean
    /** Object field used as the render key. Mirrors n-virtual-list `keyField`. */
    keyField?: string
    /** Extra rows rendered above / below the visible window. Mirrors n-virtual-list `overscan`. */
    overscan?: number
    /** Viewport height in px; when omitted the container height is measured. */
    visibleHeight?: number | undefined
  }>(),
  {
    items: () => [],
    itemSize: 30,
    itemResizable: false,
    keyField: 'value',
    overscan: 3,
    visibleHeight: undefined,
  },
)

const emit = defineEmits<{
  /** Native scroll event of the container. Mirrors n-virtual-list `on-scroll`. */
  (e: 'scroll', event: Event): void
  /** Scroll offset committed after the rAF throttle. Mirrors n-virtual-list `on-update:scroll-top`. */
  (e: 'update:scrollTop', scrollTop: number): void
}>()

defineSlots<{
  /** Row content; receives `{ item, index }`. */
  item?(props: { item: SnVirtualListItem; index: number }): unknown
}>()

/* ─────────── Viewport ─────────── */

const containerRef = ref<HTMLElement | null>(null)
const scrollTop = ref(0)
const measuredViewportHeight = ref(0)

const viewportSize = computed(() =>
  props.visibleHeight !== undefined ? props.visibleHeight : measuredViewportHeight.value,
)

function syncViewportHeight(): void {
  const el = containerRef.value
  if (el) measuredViewportHeight.value = el.clientHeight
}

/* ─────────── Prefix sums (itemSize or measured heights) ─────────── */

/** index → measured height (itemResizable only). Reactive Map. */
const measuredHeights = ref(new Map<number, number>())

const prefixSums = computed<number[]>(() => {
  const list = props.items
  const sums = new Array<number>(list.length + 1)
  sums[0] = 0
  for (let i = 0; i < list.length; i++) {
    // noUncheckedIndexedAccess: the previous sum is always written before
    // this iteration, but the index signature stays `number | undefined`.
    const previous = sums[i] ?? 0
    const measured = props.itemResizable ? measuredHeights.value.get(i) : undefined
    sums[i + 1] = previous + (measured ?? props.itemSize)
  }
  return sums
})

const totalHeight = computed(() => prefixSums.value[props.items.length] ?? 0)

/** Largest index whose start offset is <= the given scroll offset (binary search). */
function findIndexAtOffset(offset: number): number {
  const sums = prefixSums.value
  let lo = 0
  let hi = sums.length - 1
  let found = 0
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if ((sums[mid] ?? 0) <= offset) {
      found = mid
      lo = mid + 1
    } else {
      hi = mid - 1
    }
  }
  return found
}

const startIndex = computed(() => {
  if (props.items.length === 0) return 0
  return Math.max(0, findIndexAtOffset(scrollTop.value) - props.overscan)
})

const endIndex = computed(() => {
  if (props.items.length === 0) return -1
  const viewportEnd = scrollTop.value + Math.max(viewportSize.value, 0)
  return Math.min(props.items.length - 1, findIndexAtOffset(viewportEnd) + props.overscan)
})

const startOffset = computed(() => prefixSums.value[startIndex.value] ?? 0)

const renderedEntries = computed(() => {
  const list = props.items
  const entries: Array<{ item: SnVirtualListItem; index: number }> = []
  for (let i = startIndex.value; i <= endIndex.value; i++) {
    if (i < 0 || i >= list.length) continue
    const item = list[i]
    if (item === undefined) continue
    entries.push({ item, index: i })
  }
  return entries
})

/* Reset cached heights when the list identity changes (measured offsets
 * refer to the previous list). */
watch(
  () => props.items,
  () => {
    if (measuredHeights.value.size > 0) measuredHeights.value = new Map()
  },
)

/* ─────────── Keys ─────────── */

function resolveKey(item: SnVirtualListItem, index: number): string {
  if (typeof item === 'object' && item !== null && props.keyField in item) {
    const key = (item as Record<string, unknown>)[props.keyField]
    if (key !== null && key !== undefined) return String(key)
  }
  if (typeof item === 'string' || typeof item === 'number') return String(item)
  return String(index)
}

function fallbackText(item: SnVirtualListItem): string {
  return typeof item === 'object' ? '' : String(item)
}

/* ─────────── Scroll handling (rAF throttled) ─────────── */

let rafId: number | null = null

function onScroll(event: Event): void {
  emit('scroll', event)
  if (rafId !== null) return
  rafId = requestAnimationFrame(() => {
    rafId = null
    const el = containerRef.value
    if (!el) return
    scrollTop.value = el.scrollTop
    emit('update:scrollTop', el.scrollTop)
  })
}

/* ─────────── ResizeObserver wiring ─────────── */

let containerObserver: ResizeObserver | null = null
let rowObserver: ResizeObserver | null = null
const observedRows = new WeakSet<Element>()

function handleRowResize(entries: ResizeObserverEntry[]): void {
  for (const entry of entries) {
    const element = entry.target as HTMLElement
    const index = Number(element.dataset.vlIndex)
    if (Number.isNaN(index)) continue
    const height =
      entry.contentRect.height
      ?? (Array.isArray(entry.borderBoxSize) ? entry.borderBoxSize[0]?.blockSize : undefined)
    if (typeof height === 'number' && height > 0) {
      measuredHeights.value.set(index, height)
    }
  }
}

/**
 * Template ref callback for rendered rows. Registers the row with the
 * shared ResizeObserver and records an initial height when one is
 * available without layout (real browsers re-emit via the observer).
 */
function measureRow(el: Element | ComponentPublicInstance | null, index: number): void {
  if (!props.itemResizable || el === null) return
  const element = el instanceof Element ? el : (el as ComponentPublicInstance).$el
  if (!(element instanceof Element)) return
  if (rowObserver === null && typeof ResizeObserver !== 'undefined') {
    rowObserver = new ResizeObserver(handleRowResize)
  }
  rowObserver?.observe(element)
  if (observedRows.has(element)) return
  observedRows.add(element)
  const initial = (element as HTMLElement).offsetHeight
  if (initial > 0) measuredHeights.value.set(index, initial)
}

onMounted(() => {
  syncViewportHeight()
  if (typeof ResizeObserver !== 'undefined') {
    containerObserver = new ResizeObserver(() => syncViewportHeight())
    if (containerRef.value) containerObserver.observe(containerRef.value)
  }
})

onBeforeUnmount(() => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  containerObserver?.disconnect()
  containerObserver = null
  rowObserver?.disconnect()
  rowObserver = null
})
</script>

<template>
  <div
    ref="containerRef"
    data-snui-component="virtual-list"
    class="sn-virtual-list"
    role="list"
    :style="visibleHeight !== undefined ? { height: `${visibleHeight}px` } : undefined"
    @scroll="onScroll"
  >
    <div class="sn-virtual-list__sizer" :style="{ height: `${totalHeight}px` }">
      <div
        class="sn-virtual-list__window"
        :style="{ transform: `translateY(${startOffset}px)` }"
      >
        <div
          v-for="entry in renderedEntries"
          :key="resolveKey(entry.item, entry.index)"
          :ref="(el) => measureRow(el, entry.index)"
          class="sn-virtual-list__item"
          role="listitem"
          :data-vl-index="entry.index"
        >
          <slot name="item" :item="entry.item" :index="entry.index">
            {{ fallbackText(entry.item) }}
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-virtual-list {
  overflow: auto;
  height: 100%;
  position: relative;
}

.sn-virtual-list__sizer {
  position: relative;
  width: 100%;
}

.sn-virtual-list__window {
  will-change: transform;
}

.sn-virtual-list__item {
  color: var(--sn-web-color-text-primary);
  font-size: 14px;
  line-height: 1.5;
}
</style>
