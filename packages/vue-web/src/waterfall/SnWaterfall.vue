<script setup lang="ts">
/**
 * SnWaterfall — image-first masonry container (瀑布流) (AUI-WEB-DD-030).
 *
 * Reference library: **none**. naive-ui has NO masonry / waterfall
 * component (no `n-waterfall` in its `src/components.ts` export list, and
 * `n-grid` only lays out uniform rows). Per AGENTS.md §112 that is a
 * deliberate, documented divergence: there is no upstream API to mirror
 * 1:1, so this component defines the surface itself instead of bending a
 * row/grid component into a masonry one.
 *
 * Layout technique: N flex columns + shortest-column placement computed in
 * JS (see `./waterfall-assign`). The previous revision used CSS
 * multi-column, which filled column-major (column 1 to the bottom, then
 * column 2, …) and re-flowed *every* column whenever a late image changed a
 * height — exactly the failure mode an image feed hits: order looks wrong and
 * scrolling stutters while thumbnails resolve. A JS-placed masonry keeps the
 * reading order and appends items without disturbing what is already on
 * screen.
 *
 * Why it scrolls smoothly (and stays cheap):
 *   - Items are positioned by the browser's own flex layout: no per-frame JS
 *     writes, no absolute positioning, no transform bookkeeping. Scrolling is
 *     pure compositing.
 *   - Placement is append-only: an item never moves to another column once
 *     placed, so a late-loading image only ever reflows its own column.
 *   - One `ResizeObserver` measures every item. Its callback only writes into
 *     a `Map` — no DOM reads, no DOM writes, no re-render — so a resolving
 *     image cannot cause layout thrash mid-scroll (AGENTS.md §80 / §82).
 *   - The measured heights feed the *next* placement decision only.
 *
 * Lazy loading: pair with `SnImage lazy` (native `loading="lazy"`, or
 * IntersectionObserver through `intersection-observer-options`). The container
 * itself loads nothing: off-screen items are simply appended and images that
 * resolve later grow their own column. This is the whole reason the placement
 * is append-only.
 *
 * Explicit, predictable fallbacks (AGENTS.md §85):
 *   - No `ResizeObserver` (SSR, older browsers, happy-dom): items are
 *     distributed round-robin, so the columns stay balanced and the reading
 *     order runs left-to-right — a static balanced layout instead of a crash
 *     or a single long column.
 *   - `minColumnWidth` needs a measured container width to compute the column
 *     count. Until one exists the `columns` prop is used as the initial guess,
 *     so SSR still renders a sensible grid.
 *   - A string `minColumnWidth` / gap cannot be resolved to px before a layout
 *     exists; for the placement math it is parsed with `parseFloat` (px
 *     semantics), while the CSS always receives the original string. See
 *     `parsePx` in `./waterfall-assign`.
 *
 * Slot handling: every direct child of `default` is wrapped in one
 * `.sn-waterfall__item` box and the boxes are distributed into the columns.
 * Fragment children (`<template v-for>` over a data list) are flattened
 * recursively with the same `flattenSlotChildren` shape `SnDescriptions`
 * uses, so v-for-driven item lists work. Comment placeholders (what a
 * `v-if="false"` in the slot leaves behind) are dropped instead of becoming
 * an empty — yet still placed — item box.
 *
 * Keying: a child's `key` (`:key` of the v-for) is its identity for
 * placement — an existing key keeps its column across re-renders. Children
 * without a key fall back to their index, which makes membership positional:
 * key your items when you append/prepend into a feed.
 *
 * Documented divergences:
 *   - No naive-ui counterpart (see above) — nothing to be 1:1 with.
 *   - `role="list"` on the root + `role="listitem"` on each item box are
 *     applied: wrapping each slot child is unavoidable, and the result is
 *     exactly the ARIA list pattern (`div[role=list]` > `div[role=listitem]`).
 *     The column wrappers are `role="presentation"` so the items stay owned by
 *     the list. A consumer that needs other semantics can override the root
 *     role through fallthrough attrs (`:role="…"`).
 *   - The trailing `row-gap` is not kept in masonry mode: the columns are flex
 *     containers with `row-gap`, so the gap only exists *between* items and
 *     the container height stays flush at the bottom (what an infinite scroll
 *     wants). `masonry=false` keeps the old stacked behaviour, margin
 *     included.
 *   - `minColumnWidth` switches the container to JS responsive mode: the
 *     column count is derived from the measured width (`columns` is ignored
 *     once a width exists, and acts as the pre-measure guess before that).
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web. It is a
 * pure layout container that paints nothing of its own, so it consumes no
 * `--sn-web-*` alias; the only knobs are its two component-scoped custom
 * properties (px units only).
 *
 * Usage:
 *   <SnWaterfall :columns="3" :row-gap="12">
 *     <SnImage v-for="item in items" :key="item.id" :src="item.src" lazy />
 *   </SnWaterfall>
 *
 *   <!-- responsive: as many ~200px columns as fit -->
 *   <SnWaterfall :min-column-width="200">…</SnWaterfall>
 */

import type { VNodeChild } from 'vue';
import {
  Comment,
  Fragment,
  computed,
  isVNode,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  useSlots,
  watch,
} from 'vue';
import {
  allocateWaterfallColumns,
  hasMeasurement,
  parsePx,
  resolveResponsiveColumnCount,
} from './waterfall-assign';

defineOptions({ name: 'SnWaterfall' });

const props = withDefaults(
  defineProps<{
    /** Logical column count (integer ≥ 1). Used as-is, or as the initial
     *  guess in `minColumnWidth` (responsive) mode, and ignored when
     *  `masonry` is off. */
    columns?: number;
    /** Minimum column width. When set the column count follows the measured
     *  container width (responsive mode) and `columns` only serves as the
     *  pre-measurement guess. */
    minColumnWidth?: number | string;
    /** Gap between columns (number → px). */
    columnGap?: number | string;
    /** Gap between items (number → px); applied as the columns' `row-gap`. */
    rowGap?: number | string;
    /** Convenience "off" switch: `false` renders a plain vertical stack
     *  (single column, no multi-column layout). */
    masonry?: boolean;
  }>(),
  {
    columns: 3,
    columnGap: 16,
    rowGap: 16,
    masonry: true,
  },
);

defineSlots<{
  /** Items — each direct child becomes one `.sn-waterfall__item` box. */
  default?(): unknown;
}>();

const slots = useSlots();

/** Functional fragment: renders a captured array of slot vnodes. */
const VNodes = (props: { nodes: VNodeChild[] }): VNodeChild => props.nodes;

/** Number → px, string → passthrough (`'12rem'`, `'2vw'`, …). */
function formatLength(value: string | number): string {
  return typeof value === 'number' ? `${value}px` : value;
}

function flattenSlotChildren(children: unknown): VNodeChild[] {
  const out: VNodeChild[] = [];
  const walk = (input: unknown): void => {
    if (Array.isArray(input)) {
      input.forEach(walk);
      return;
    }
    if (input === null || input === undefined || typeof input === 'boolean') {
      return;
    }
    // `<template v-for>` compiles to a Fragment vnode holding the repeated
    // items; recurse so data-driven item lists work.
    if (isVNode(input) && input.type === Fragment) {
      walk(input.children);
      return;
    }
    // A `v-if="false"` inside the slot leaves a Comment placeholder behind;
    // it must not become an item box (each box is placed into a column).
    if (isVNode(input) && input.type === Comment) {
      return;
    }
    out.push(input as VNodeChild);
  };
  walk(children);
  return out;
}

/** One placed item: its identity plus the slot vnode to render. */
interface WaterfallEntry {
  key: string;
  node: VNodeChild;
}

function entryKeyOf(node: VNodeChild, index: number): string {
  const key = isVNode(node) ? node.key : null;
  // Index fallback keeps keyless slots working; the `#`/`k:` prefixes keep an
  // index from colliding with a user key of the same text.
  return key === null || key === undefined ? `#${index}` : `k:${String(key)}`;
}

/** Slot children in reading order, keyed. */
function collectEntries(): WaterfallEntry[] {
  const slot = slots.default;
  const children = slot ? flattenSlotChildren(slot()) : [];
  return children.map((node, index) => ({ key: entryKeyOf(node, index), node }));
}

/* ── Measurement ────────────────────────────────────────────────────────── */

/** Measured item heights by key. Deliberately NOT reactive: a resolved image
 *  must not trigger a render, only inform the next placement. */
const itemHeights = new Map<string, number>();
/** Which item each observed element belongs to. */
const elementKeys = new WeakMap<Element, string>();
/** Live item elements by key (kept in sync by the `:ref` callbacks). */
const itemElements = new Map<string, Element>();

const rootRef = ref<HTMLElement | null>(null);
/** Measured width of the container (0 until a measurement exists). */
const containerWidth = shallowRef(0);
/** `minColumnWidth` resolved to px (0 when unset / not measurable yet). */
const minColumnWidthPx = shallowRef(0);
let observer: ResizeObserver | null = null;

/* ── Column count ───────────────────────────────────────────────────────── */

/** `columns` coerced to an integer ≥ 1 (`column-count` must be ≥ 1). */
const columnsProp = computed(() => {
  const value = props.columns;
  return typeof value === 'number' && Number.isFinite(value) && value >= 1 ? Math.floor(value) : 1;
});

const responsive = computed(
  () => props.minColumnWidth !== undefined && props.minColumnWidth !== '',
);

const columnGapPx = computed(() => parsePx(props.columnGap));
const rowGapPx = computed(() => parsePx(props.rowGap));

/** Columns actually rendered. Single column when `masonry` is off. */
const columnCount = computed(() => {
  if (!props.masonry) return 1;
  if (!responsive.value) return columnsProp.value;
  if (minColumnWidthPx.value > 0 && containerWidth.value > 0) {
    return resolveResponsiveColumnCount(
      containerWidth.value,
      minColumnWidthPx.value,
      columnGapPx.value,
    );
  }
  // No measurement yet (SSR / hydration): `columns` is the initial guess so a
  // real grid renders instead of one long column.
  return columnsProp.value;
});

/** Bumped to force a re-placement (the first measured pack). */
/** Bumped to force a re-placement (the first measured pack). */
const layoutVersion = shallowRef(0);
/**
 * Whether the wall has stopped re-packing.
 *
 * The first render has no heights at all, so it can only distribute
 * round-robin. The first time the `ResizeObserver` reports real heights the
 * wall is re-packed **once** into the proper shortest-column layout; from then
 * on placement is append-only, because moving items that are already on screen
 * is exactly what makes a waterfall feel janky.
 */
let placementFrozen = false;
/** True once any item height has been reported. */
let measuredHeights = false;
/** Allocation rendered last time — the diff base for the next placement. */
let previousColumns: string[][] | null = null;
/** Signature of the last placement; height changes deliberately excluded. */
let allocationSignature = '';
let allocation: WaterfallEntry[][] = [];
/**
 * Place the entries and return the per-column slices to render.
 *
 * Memoised on (column count, row gap, layout version, item keys): a re-render
 * caused by anything else (a measured height, a reactive prop, the parent)
 * reuses the previous allocation object, so Vue's diff has nothing to do.
 *
 * `layoutVersion` is only bumped by the one-shot first measured pack.
 */
function resolveColumns(entries: WaterfallEntry[]): WaterfallEntry[][] {
  const count = columnCount.value;
  const gap = rowGapPx.value;
  const signature = `${count}|${gap}|${layoutVersion.value}|${entries
    .map((entry) => entry.key)
    .join('\u0000')}`;
  if (signature === allocationSignature) return allocation;

  const byKey = new Map(entries.map((entry) => [entry.key, entry]));
  const columns = allocateWaterfallColumns(
    entries.map((entry) => entry.key),
    previousColumns,
    count,
    itemHeights,
    gap,
  );
  previousColumns = columns;
  allocationSignature = signature;
  allocation = columns.map((column) =>
    column.flatMap((key) => {
      const entry = byKey.get(key);
      return entry ? [entry] : [];
    }),
  );
  return allocation;
}
/**
 * Re-pack the wall from scratch with the heights that are now known.
 *
 * Runs at most once: after the first measured pack, placement is append-only.
 */
function packOnceWithMeasurements(): void {
  if (placementFrozen || previousColumns === null) return;
  placementFrozen = true;
  previousColumns = null; // full redistribution
  allocationSignature = '';
  layoutVersion.value += 1;
}

/* ── ResizeObserver wiring ──────────────────────────────────────────────── */

function asElement(value: unknown): Element | null {
  return typeof value === 'object' && value !== null && 'nodeType' in value
    ? (value as Element)
    : null;
}

/** `:ref` callback for one item box — keeps the observation set in sync. */
function setItemRef(key: string, value: unknown): void {
  const element = asElement(value);
  const previous = itemElements.get(key);
  if (previous && previous !== element) {
    observer?.unobserve(previous);
    elementKeys.delete(previous);
    itemElements.delete(key);
  }
  if (!element) return;
  itemElements.set(key, element);
  elementKeys.set(element, key);
  observer?.observe(element);
}

function handleResize(entries: ResizeObserverEntry[]): void {
  for (const entry of entries) {
    if (entry.target === rootRef.value) {
      // Feeds `columnCount` only; when the derived count changes, the reactive
      // value re-renders and the next placement redistributes.
      containerWidth.value = entry.contentRect.width;
      continue;
    }
    const key = elementKeys.get(entry.target);
    if (key === undefined) continue;
    // Measurement only — no DOM write, no render (AGENTS.md §80 / §82).
    itemHeights.set(key, entry.contentRect.height);
    measuredHeights = true;
  }
  // The first measurement is the only time the wall re-packs itself; afterwards
  // heights only inform *future* placements (append-only).
  if (measuredHeights) packOnceWithMeasurements();
}

/** Observe the container; it is the only element guaranteed to exist. */
function observeRoot(): void {
  if (observer && rootRef.value) observer.observe(rootRef.value);
}

function teardownObserver(): void {
  observer?.disconnect();
  observer = null;
  itemElements.clear();
}

/* ── Lifecycle ──────────────────────────────────────────────────────────── */

/** `minColumnWidth` as px: numbers are already px, strings need a layout. */
function measureLength(value: string): number {
  const root = rootRef.value;
  if (!root || typeof document === 'undefined') return 0;
  const probe = document.createElement('div');
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  probe.style.pointerEvents = 'none';
  probe.style.width = value;
  root.appendChild(probe);
  const width = probe.getBoundingClientRect().width || probe.offsetWidth;
  probe.remove();
  return Number.isFinite(width) && width > 0 ? width : 0;
}

function resolveMinColumnWidthPx(): void {
  const value = props.minColumnWidth;
  if (value === undefined || value === '') {
    minColumnWidthPx.value = 0;
    return;
  }
  minColumnWidthPx.value = typeof value === 'number' ? value : measureLength(value);
}

onMounted(() => {
  resolveMinColumnWidthPx();
  if (typeof ResizeObserver === 'undefined') return; // round-robin fallback
  observer = new ResizeObserver(handleResize);
  observeRoot();
  // Items already rendered: the `:ref` callbacks ran before this observer
  // existed, so observe them now.
  itemElements.forEach((element) => observer?.observe(element));
});

watch(() => props.minColumnWidth, resolveMinColumnWidthPx);

onBeforeUnmount(teardownObserver);

/** The gaps are always exposed; the column geometry is JS-driven. */
function rootStyle(): Record<string, string> {
  return {
    '--sn-waterfall-column-gap': formatLength(props.columnGap),
    '--sn-waterfall-row-gap': formatLength(props.rowGap),
  };
}
</script>

<template>
  <div
    ref="rootRef"
    data-snui-component="waterfall"
    class="sn-waterfall"
    :class="masonry ? 'sn-waterfall--masonry' : 'sn-waterfall--stacked'"
    role="list"
    :style="rootStyle()"
  >
    <div
      v-for="(column, columnIndex) in resolveColumns(collectEntries())"
      :key="columnIndex"
      class="sn-waterfall__column"
      role="presentation"
    >
      <div
        v-for="entry in column"
        :key="entry.key"
        :ref="(element) => setItemRef(entry.key, element)"
        class="sn-waterfall__item"
        role="listitem"
      >
        <VNodes :nodes="[entry.node]" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Web side: layout only — no color alias is consumed, so there is nothing
 * that can leak a wrong-end alias
 * (`pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-waterfall {
  /* Component-scoped knobs. Both are inlined from the `column-gap` /
   * `row-gap` props; these declarations are the literal fallback for a
   * consumer that clears them. */
  --sn-waterfall-column-gap: 16px;
  --sn-waterfall-row-gap: 16px;
  display: block;
  width: 100%;
  box-sizing: border-box;
}

/* Masonry mode: a flex row of columns. Items keep their order inside a column
 * and columns only grow at the bottom, so a late image reflows its own column
 * and nothing else. */
.sn-waterfall--masonry {
  display: flex;
  align-items: flex-start;
  column-gap: var(--sn-waterfall-column-gap, 16px);
}

/* One column. `flex: 1 1 0` + `min-width: 0` gives every column an equal
 * share of the width regardless of its content. */
.sn-waterfall__column {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  row-gap: var(--sn-waterfall-row-gap, 16px);
  min-width: 0;
  box-sizing: border-box;
}

.sn-waterfall__item {
  min-width: 0;
  box-sizing: border-box;
}

/* Off switch: a plain vertical stack. The column wrapper stops taking part in
 * the layout (`display: contents`) and each item owns its bottom margin again,
 * which keeps the previous stacked look — trailing margin included. */
.sn-waterfall--stacked .sn-waterfall__column {
  display: contents;
}

.sn-waterfall--stacked .sn-waterfall__item {
  margin-bottom: var(--sn-waterfall-row-gap, 16px);
}
</style>
