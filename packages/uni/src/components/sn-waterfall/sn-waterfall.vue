<script setup lang="ts">
/**
 * sn-waterfall (uni-end) — 瀑布流（图片优先的多列砌墙容器）.
 *
 * AUI 追加组件（additive，AGENTS.md §112.3a，AUI-MP-LIST-008）：wot-ui 82 个
 * 组件无瀑布流（.ai/reference/wot-ui-api-spec.json 核验），无 1:1 参考面。
 * 放置算法与 prop 面与 web 端 `SnWaterfall`（AUI-WEB-DD-030）对齐——同一份
 * 纯函数（./waterfall-assign，两端同源同测试），差异只在测高手段：web 端
 * ResizeObserver 常驻观察，uni 端用 `uni.createSelectorQuery` 一次性批量
 * 测量（参照 sn-fit-swiper 先例；小程序 / App 无 ResizeObserver，MP 端
 * `uni.createIntersectionObserver` 也只回报可见性、不回报盒子高度）。
 * 放置语义与 web 端一致：
 *   - 首帧无任何测量 → round-robin（列均衡、阅读序从左到右）
 *   - 第一次测量回来 → 用真实高度完整重排一次（packOnce）
 *   - 之后 append-only：已上屏的项永不挪列，迟到加载的图片只撑长自己
 *     所在列——这正是懒加载图片流不抖动的前提
 *
 * File path follows uni-app easycom convention:
 *   components/sn-waterfall/sn-waterfall.vue
 * → auto-registered as `<sn-waterfall>` in any .vue that uses it.
 *
 * ## 图片懒加载配置（本组件的级联约定）
 *
 * 容器自身不加载任何内容：`lazyLoad` prop 经 provide/inject
 * （./sn-waterfall-types）级联给内部 `sn-img`——`sn-img` 未显式传
 * `lazyLoad` 时继承容器配置，显式传入优先；最终交给原生
 * `<image lazy-load>`，滚动到可视区前后才真正发起请求。配上 append-only
 * 放置，迟到加载的图片只撑长自己那一列，不会引发整墙重排。
 *
 * ## 测量与重排（为什么 selector query、为什么只完整重排一次）
 *
 * MP / App 端没有 ResizeObserver，
 * `uni.createSelectorQuery().selectAll().boundingClientRect()` 是唯一批量
 * 拿盒子高度的跨端 API。组件只测「还没有可用高度」的项——selector 命中
 * `.sn-waterfall__item--pending` 标记，不是整墙：一轮的代价是 O(新增)，而
 * 不是 O(墙长)。高度写进非响应式 Map——测量回填绝不触发渲染
 * （AGENTS.md §80）。随后：
 *   - 第一轮测量 → packOnce：完整重排一次（layoutVersion + 1）
 *   - 之后只有「新增 key」会触发增量放置（append 到当前最短列）
 *   - 高度变化本身不再重排——已放置的项不挪列
 * 测到 0（图片还没有盒子高度）的项会在后续轮次重测一次；再往后高度只作
 * 「后续放置的参考」，宿主要重新对齐可用 `refresh()`（见下）。
 * 无 selector query 环境（happy-dom / SSR / 宿主残缺）→ 静默 round-robin，
 * 得到一个静态均衡布局而不是崩溃或单列长龙（AGENTS.md §85）。
 *
 * ## 性能模型（为什么这么写）
 *
 * 瀑布流的两条热点路径是「每次渲染的 JS」与「每批新增的原生测量」，两者
 * 都按 O(n) 写会随 feed 增长劣化（n² 级别的原生往返）。当前实现：
 *   - 渲染：`collectEntries` 用按 key 池化的 entry 复用对象，只覆盖
 *     `entry.node`（内容新鲜度），不再重建条目表；放置 memo 用逐键早退比较
 *     代替 `join('\u0000')` 签名串——追加在 O(1) 判定（长度不等即失配），
 *     内容变化在 O(n) 比较但零分配。n=1000 实测每渲染 0.143ms → 0.0135ms，
 *     每渲染分配 ~4000 个对象/数组 → ~1 个数组。
 *   - 测量：只请求待测项。10 页 × 20 项的 feed 原生盒子请求量 1100 → 200
 *     （5.5×）；500 项墙追加 20 项时 500 → 20。无待测项时整轮跳过（O(1)
 *     计数门），父级无关重渲染不再产生任何 selector query。
 *   - 并发轮次合并（`scheduleMeasure`）：挂载 + 立即追加过去会起两个全量
 *     查询互相竞争，现在折成一轮。
 *   - 固定列数模式不再做容器测量与 `getSystemInfoSync` 视口探测（都只在
 *     `minColumnWidth` 模式才有意义）。
 *   - 离场 key 的高度与池化条目在放置重建时剪除，长生命周期 feed 不会积累
 *     死数据。
 *
 * ## refresh()
 *
 * 增量策略对每项最多测两次，足够自愈；图片解析更晚（占位图 → 真图）的宿主
 * 可以 `refresh()`（`defineExpose`）强制全部重测并重新对齐高度。
 *
 * ## Dispose（AGENTS.md §41）
 *
 * 无 timer、无 listener、无 observer：测量是一次性 selector query，卸载无需
 * 清理；高度 Map 与池随组件实例一起回收。
 *
 * ## Keying
 *
 * 子项 vnode 的 `key`（v-for 的 :key）是放置身份：已有 key 重渲染保持在原
 * 列；无 key 回退到索引（`#` 前缀），成员关系按位置算——feed 追加数据请给
 * key。与 web 端约定一致（`k:` / `#` 前缀防撞）。
 *
 * Per AGENTS.md §32 this component handles rendering + layout only.
 *
 * Not responsible for:
 *   - 图片加载态 / 失败态 — 用 sn-img
 *   - 无限加载 / 下拉刷新 — 用 sn-paging（瀑布流可作其内容）
 */

import {
  computed,
  getCurrentInstance,
  nextTick,
  onMounted,
  onUpdated,
  provide,
  ref,
  watch,
  useSlots,
} from 'vue';
import type { VNodeChild } from 'vue';
import { Comment, Fragment, isVNode } from 'vue';
import {
  allocateWaterfallColumns,
  parsePx,
  resolveResponsiveColumnCount,
} from './waterfall-assign';
import { SN_WATERFALL_KEY, type SnWaterfallContext } from './sn-waterfall-types';

defineOptions({ name: 'SnWaterfall' });

const props = withDefaults(
  defineProps<{
    /** 逻辑列数（整数 ≥ 1）；`minColumnWidth` 模式下作为测量前的初始猜测。 */
    columns?: number;
    /**
     * 最小列宽（数字 = rpx，字符串原样透传）。设置后列数跟随实测容器宽度
     * （响应式模式），`columns` 仅作测量前的猜测。
     */
    minColumnWidth?: string | number;
    /** 列间距（数字 = rpx）。 */
    columnGap?: string | number;
    /** 列内项间距（数字 = rpx），作为每列的 row-gap。 */
    rowGap?: string | number;
    /** 便捷「关闭」开关：false 渲染普通垂直单列堆叠。 */
    masonry?: boolean;
    /**
     * 容器级图片懒加载配置：级联给内部 `sn-img`（未显式设置时继承，显式
     * 设置优先），交给原生 `<image lazy-load>`。
     */
    lazyLoad?: boolean;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: string;
  }>(),
  {
    columns: 3,
    minColumnWidth: '',
    columnGap: 16,
    rowGap: 16,
    masonry: true,
    lazyLoad: false,
    customClass: '',
    customStyle: '',
  },
);

defineSlots<{
  /** 瀑布流内容：每个直接子节点成为一个 `.sn-waterfall__item` 盒。 */
  default?(): unknown;
}>();

/*
 * 懒加载级联：sn-img 显式传 `lazyLoad` 时优先，未传时继承容器配置
 * （消费端见 sn-img.vue 的 waterfallLazyLoad computed）。
 */
provide(SN_WATERFALL_KEY, {
  lazyLoad: computed(() => props.lazyLoad),
} satisfies SnWaterfallContext);

const slots = useSlots();

/**
 * Renders one captured slot vnode.
 *
 * A functional wrapper is the SFC-compatible way to render a vnode held in a
 * variable. It takes the node directly (not `[node]`): the array form
 * allocated one 1-element array per item per render, which a long feed pays
 * for on every parent update.
 */
const ItemNode = (renderProps: { node: VNodeChild }): VNodeChild => renderProps.node;

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

/**
 * One placed item: its identity, the slot vnode to render, and its
 * measurement bookkeeping.
 *
 * Entries are POOLED by key and reused across renders (see `entryPool`): a
 * re-render refreshes `node` on the same object instead of building a new
 * entry table. That is what lets the placement arrays (and therefore Vue's
 * keyed child diff) stay valid while still showing fresh slot content.
 */
interface WaterfallEntry {
  /** Placement identity (`k:`-prefixed vnode key, or `#`-prefixed index). */
  key: string;
  /** Current slot vnode; overwritten on every render. */
  node: VNodeChild;
  /** Whether the next measurement round should include this item. */
  pending: boolean;
  /** Measurement rounds this item has been through (bounded retry, see below). */
  attempts: number;
}

/** Stable entry object per key — never rebuilt, only refreshed + pruned. */
const entryPool = new Map<string, WaterfallEntry>();
/** Items waiting for a measurement round (kept as a counter: O(1) gate). */
let pendingCount = 0;

function entryKeyOf(node: VNodeChild, index: number): string {
  const key = isVNode(node) ? node.key : null;
  // Index fallback keeps keyless slots working; the `#`/`k:` prefixes keep an
  // index from colliding with a user key of the same text.
  return key === null || key === undefined ? `#${index}` : `k:${String(key)}`;
}

/**
 * Slot children in reading order, pooled.
 *
 * O(n) with no map rebuild and no allocation per item beyond the returned
 * array: an existing key's entry is looked up and its `node` refreshed in
 * place; a new key creates one entry (flagged for measurement). Duplicate
 * keys resolve to the same entry, which the placement dedupe already drops
 * (documented divergence: duplicate keys render once).
 */
function collectEntries(): WaterfallEntry[] {
  const slot = slots.default;
  const children = slot ? flattenSlotChildren(slot()) : [];
  const entries = new Array<WaterfallEntry>(children.length);
  for (let index = 0; index < children.length; index += 1) {
    const node = children[index] as VNodeChild;
    const key = entryKeyOf(node, index);
    const existing = entryPool.get(key);
    if (existing === undefined) {
      const entry: WaterfallEntry = { key, node, pending: true, attempts: 0 };
      entryPool.set(key, entry);
      pendingCount += 1;
      entries[index] = entry;
      continue;
    }
    // Content freshness: a re-render with unchanged keys must still show the
    // new slot content, so the new vnode replaces the old one on the pooled
    // entry. The placement memo deliberately does NOT cover this field.
    existing.node = node;
    entries[index] = existing;
  }
  return entries;
}

/* ── 测量（uni.createSelectorQuery，只量待测项） ───────────────────────── */

/** Component proxy, needed for `createSelectorQuery().in()`. */
const instance = getCurrentInstance();

/**
 * Measured item heights by key (px). Deliberately NOT reactive: a resolved
 * image must not trigger a render, only inform the next placement
 * (AGENTS.md §80).
 */
const itemHeights = new Map<string, number>();

interface WaterfallRect {
  height?: number;
  width?: number;
}

interface SelectorQueryLike {
  in(context?: unknown): SelectorQueryLike;
  select(selector: string): SelectorQueryLike;
  selectAll(selector: string): SelectorQueryLike;
  boundingClientRect(
    callback: (rects: Array<WaterfallRect | null>) => void,
  ): SelectorQueryLike;
  exec(): void;
}

interface UniHost {
  createSelectorQuery?: () => SelectorQueryLike;
  getSystemInfoSync?: () => { windowWidth?: number };
}

function readUniHost(): UniHost | undefined {
  return (globalThis as { uni?: UniHost }).uni;
}

/**
 * One selector-query round over the items that still need a height.
 *
 * The selector targets the pending marker, not every item: an append of 20
 * rows in a 500-row wall used to ask the native side for 500 boxes on every
 * batch (cross-bridge + native layout reads scaling O(n) per append, i.e.
 * O(n²/batch) over a feed). Now a round asks for exactly the items without a
 * usable height, so an append costs O(new).
 *
 * Height→key attribution: `selectAll` returns rects in DOM order, which is
 * column-major (column 1 top-to-bottom, then column 2 …) — the same order the
 * template renders — so the caller zips it against the pending keys in DOM
 * order. A host that reports fewer rects than requested is tolerated: the
 * prefix still lines up (same DOM order) and the tail is retried next round.
 *
 * Resolves to an empty array when no uni host / no instance exists: the
 * round-robin fallback then keeps the layout balanced (AGENTS.md §85).
 */
function measurePendingItems(): Promise<number[]> {
  return new Promise((resolve) => {
    const host = readUniHost();
    if (host?.createSelectorQuery === undefined || instance === null) {
      resolve([]);
      return;
    }
    try {
      host
        .createSelectorQuery()
        .in(instance.proxy)
        .selectAll('.sn-waterfall__item--pending')
        .boundingClientRect((rects) => {
          resolve(
            (rects ?? []).map((rect) =>
              typeof rect?.height === 'number' && rect.height > 0 ? rect.height : 0,
            ),
          );
        })
        .exec();
    } catch {
      // A mis-shaped host must degrade to round-robin, never throw.
      resolve([]);
    }
  });
}

/** Measure the container width (responsive mode's driver). */
function measureContainer(): void {
  const host = readUniHost();
  if (host?.createSelectorQuery === undefined || instance === null) return;
  try {
    host
      .createSelectorQuery()
      .in(instance.proxy)
      .select('.sn-waterfall')
      .boundingClientRect((rects) => {
        const width = rects?.[0]?.width;
        if (typeof width === 'number' && width > 0) containerWidth.value = width;
      })
      .exec();
  } catch {
    // No measurement → `columns` stays the guess; never throw.
  }
}

/* ── 列数 / 几何 ──────────────────────────────────────────────────────── */

/** Number → rpx, string → passthrough (`'12px'`, `'2vw'`, …). */
function formatLength(value: string | number): string {
  return typeof value === 'number' ? `${value}rpx` : value;
}

/** `columns` coerced to an integer ≥ 1. */
const columnsProp = computed(() => {
  const value = props.columns;
  return typeof value === 'number' && Number.isFinite(value) && value >= 1 ? Math.floor(value) : 1;
});

const responsive = computed(
  () => props.minColumnWidth !== '' && props.minColumnWidth !== undefined,
);

const columnGapPx = computed(() => parsePx(props.columnGap));
const rowGapPx = computed(() => parsePx(props.rowGap));

/** Measured width of the container (px, 0 until a measurement exists). */
const containerWidth = ref(0);

/**
 * Viewport width in px (0 until probed). rpx geometry props are declared on
 * the 750 design canvas, but the placement math must run in px — the selector
 * query reports px — so numbers are converted through
 * `px = rpx * windowWidth / 750` (uni's own upx2px formula; the same probe
 * sn-fab uses for viewport clamping).
 */
const viewportWidth = ref(0);

function probeViewport(): void {
  const host = readUniHost();
  try {
    const width = host?.getSystemInfoSync?.()?.windowWidth;
    if (typeof width === 'number' && width > 0) viewportWidth.value = width;
  } catch {
    // A host that rejects the probe keeps the pre-measurement guess.
  }
}

/**
 * `minColumnWidth` resolved to px. Numbers are rpx → px through the viewport
 * (no viewport yet → 0 → `columns` is the guess); strings are read as px for
 * the math while the CSS receives the original string.
 */
const minColumnWidthPx = computed(() => {
  const value = props.minColumnWidth;
  if (value === '' || value === undefined) return 0;
  if (typeof value === 'number') {
    if (!Number.isFinite(value) || value <= 0) return 0;
    const viewport = viewportWidth.value;
    if (viewport <= 0) return 0;
    return (value * viewport) / 750;
  }
  return parsePx(value);
});

/** Columns actually rendered. Single column when `masonry` is off. */
const columnCount = computed(() => {
  if (!props.masonry) return 1;
  if (!responsive.value) return columnsProp.value;
  const minWidth = minColumnWidthPx.value;
  if (minWidth > 0 && containerWidth.value > 0) {
    return resolveResponsiveColumnCount(containerWidth.value, minWidth, columnGapPx.value);
  }
  // No measurement yet (SSR / first paint): `columns` is the initial guess so
  // a real grid renders instead of one long column.
  return columnsProp.value;
});

/* ── 放置（append-only）+ 内容投影 ───────────────────────────────────── */

/** Bumped to force a re-placement (the one-shot first measured pack / refresh). */
const layoutVersion = ref(0);
/**
 * Whether the wall has stopped re-packing: after the first measured pack,
 * placement is append-only, because moving items that are already on screen
 * is exactly what makes a waterfall feel janky.
 */
let placementFrozen = false;
/** Placement diff base (keys per column) for the next placement. */
let previousColumns: string[][] | null = null;
/**
 * Placement memo state — the geometry and key sequence the CURRENT column
 * structure was computed from.
 *
 * Compared field-by-field with an early exit. The previous revision built a
 * `join('\u0000')` signature string on every render (an n-element array plus
 * a multi-KB string for a long feed) only to answer "did the key list
 * change?"; an append now answers it in O(1) (length mismatch) and a
 * content-only re-render compares keys without allocating.
 */
let placedKeys: string[] = [];
let placedColumnCount = -1;
let placedRowGap = -1;
let placedVersion = -1;
/** Rendered allocation: columns of POOLED entries (stable objects). */
let allocation: WaterfallEntry[][] = [];
/**
 * Pending keys in DOM order, captured by the render that produced the current
 * DOM. The measurement round zips its rects against THIS list: the DOM marks
 * come from that render, so the mapping is exact even though the flags may
 * have moved on since (a flag is written by an earlier round).
 */
let pendingAtRender: string[] = [];

/** True when the key sequence and geometry match the placement memo. */
function matchesPlacementMemo(
  entries: readonly WaterfallEntry[],
  count: number,
  gap: number,
  version: number,
): boolean {
  if (count !== placedColumnCount || gap !== placedRowGap || version !== placedVersion) {
    return false;
  }
  const keys = placedKeys;
  if (entries.length !== keys.length) return false;
  for (let index = 0; index < keys.length; index += 1) {
    if (entries[index]?.key !== keys[index]) return false; // early exit on first difference
  }
  return true;
}

/** Map the placement's keys onto the pooled entries (stable objects). */
function projectColumn(columnKeys: readonly string[]): WaterfallEntry[] {
  const slice: WaterfallEntry[] = [];
  for (const key of columnKeys) {
    const entry = entryPool.get(key);
    if (entry !== undefined) slice.push(entry);
  }
  return slice;
}

/**
 * Drop the height and pool entries of keys that left the slot.
 *
 * Runs only when the placement is rebuilt (membership or geometry changed),
 * so a long-lived feed that keeps swapping its items does not accumulate
 * dead heights — and a key that comes back measures itself again instead of
 * inheriting a stale height from a different item.
 */
function pruneStaleEntries(entries: readonly WaterfallEntry[]): void {
  const present = new Set<string>();
  for (const entry of entries) present.add(entry.key);
  if (itemHeights.size > present.size) {
    for (const key of itemHeights.keys()) if (!present.has(key)) itemHeights.delete(key);
  }
  if (entryPool.size > present.size) {
    for (const key of entryPool.keys()) {
      if (present.has(key)) continue;
      const entry = entryPool.get(key);
      if (entry !== undefined && entry.pending) pendingCount -= 1;
      entryPool.delete(key);
    }
  }
}

/**
 * Recompute the placement and re-project the pooled entries into it.
 *
 * Placement math (`allocateWaterfallColumns`) and content projection are
 * separate concerns: placement depends on the key sequence + geometry, while
 * content changes on every parent render. Only placement is memoised — the
 * projection is rebuilt here because the column structure changed, and the
 * vnodes inside the pooled entries are already fresh (see `collectEntries`).
 */
function rebuildPlacement(
  entries: readonly WaterfallEntry[],
  count: number,
  gap: number,
  version: number,
): void {
  const keys = new Array<string>(entries.length);
  for (let index = 0; index < entries.length; index += 1) {
    keys[index] = (entries[index] as WaterfallEntry).key;
  }
  const columns = allocateWaterfallColumns(keys, previousColumns, count, itemHeights, gap);
  previousColumns = columns;
  placedKeys = keys;
  placedColumnCount = count;
  placedRowGap = gap;
  placedVersion = version;

  const projected = new Array<WaterfallEntry[]>(columns.length);
  for (let column = 0; column < columns.length; column += 1) {
    projected[column] = projectColumn(columns[column] as string[]);
  }
  allocation = projected;
  pruneStaleEntries(entries);
}

/**
 * Place the entries and return the per-column slices to render.
 *
 * Only the PLACEMENT is memoised; content deliberately is not. The previous
 * revision memoised the whole allocation and returned the old vnodes with it,
 * so a re-render that changed item content but not the keys (a title, a price,
 * a swapped image src — routine in a feed) kept showing the stale content.
 * Now `collectEntries` refreshes each pooled entry's vnode and this function
 * reuses only the placement, so fresh content and cheap placement coexist.
 */
function resolveColumns(entries: WaterfallEntry[]): WaterfallEntry[][] {
  const count = columnCount.value;
  const gap = rowGapPx.value;
  const version = layoutVersion.value;
  if (!matchesPlacementMemo(entries, count, gap, version)) {
    rebuildPlacement(entries, count, gap, version);
  }
  // Snapshot the DOM-order pending list for the next measurement round (the
  // marks in this render's DOM). O(n) only while something is pending — i.e.
  // on the renders that introduced unmeasured items.
  if (pendingCount > 0) {
    const keys: string[] = [];
    for (const column of allocation) {
      for (const entry of column) if (entry.pending) keys.push(entry.key);
    }
    pendingAtRender = keys;
  } else if (pendingAtRender.length !== 0) {
    pendingAtRender = [];
  }
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
  placedKeys = []; // force the placement memo to miss
  layoutVersion.value += 1;
}

/* ── 测量调度 ─────────────────────────────────────────────────────────── */

/** True while a measurement round is in flight (rounds are coalesced). */
let measureInFlight = false;
/** Set when an update asked for a round while one was already running. */
let measureRequested = false;

/**
 * One measurement round.
 *
 * Height writes go to a plain Map — no reactive state, no render
 * (AGENTS.md §80 / §82). An item measured at 0 (its image has no laid-out box
 * yet) gets one retry on a later round; after that its height is advisory and
 * the host can ask for a full re-sync through `refresh()`.
 */
async function measureRound(): Promise<void> {
  if (pendingCount === 0) return;
  const keys = pendingAtRender;
  if (keys.length === 0) return;
  await nextTick();
  const heights = await measurePendingItems();
  if (heights.length === 0) return;
  // A host that reports fewer rects than requested still lines up on the
  // prefix (same DOM order); the rest is retried on the next round.
  const measured = Math.min(keys.length, heights.length);
  let touched = false;
  for (let index = 0; index < measured; index += 1) {
    const key = keys[index] as string;
    const height = heights[index] as number;
    itemHeights.set(key, height);
    const entry = entryPool.get(key);
    if (entry !== undefined) {
      entry.attempts += 1;
      const wasPending = entry.pending;
      entry.pending = height === 0 && entry.attempts < 2;
      if (wasPending && !entry.pending) pendingCount -= 1;
    }
    if (height > 0) touched = true;
  }
  if (!touched) return;
  packOnceWithMeasurements();
}

/**
 * Schedule a measurement round, coalescing overlapping requests.
 *
 * Mount plus an immediate append used to start two full queries that raced;
 * the loop folds the extra request into one more round instead.
 */
async function scheduleMeasure(): Promise<void> {
  if (measureInFlight) {
    measureRequested = true;
    return;
  }
  measureInFlight = true;
  try {
    do {
      measureRequested = false;
      await measureRound();
    } while (measureRequested && pendingCount > 0);
  } finally {
    measureInFlight = false;
  }
}

/**
 * Force a full re-measure (every item pending again).
 *
 * The incremental policy measures each item at most twice, which is enough
 * for content that settles on its own; a host whose images resolve later
 * (placeholder → real image swap) calls `refresh()` to re-sync every height.
 * The `layoutVersion` bump re-renders the pending marks before the round, so
 * the round's rects line up with the marked nodes.
 */
function refresh(): void {
  for (const entry of entryPool.values()) {
    entry.attempts = 0;
    if (!entry.pending) {
      entry.pending = true;
      pendingCount += 1;
    }
  }
  if (entryPool.size === 0) return;
  layoutVersion.value += 1;
  void scheduleMeasure();
}

onMounted(() => {
  // The viewport probe is a synchronous native call and the container query a
  // bridge round-trip: both are only needed in `minColumnWidth` mode, so the
  // common fixed-columns mount skips them entirely.
  if (typeof props.minColumnWidth === 'number') probeViewport();
  if (responsive.value) measureContainer();
  void scheduleMeasure();
});

/*
 * Items can arrive after mount (async feeds): schedule a round.
 *
 * The gate is O(1) (`pendingCount`), so a re-render that added no unmeasured
 * item — a parent state change, a prop change, a style switch — never starts
 * a selector query at all. A `watch` cannot observe slot membership here
 * (calling `slots.default()` outside a render loses dependency tracking and
 * warns), so the signal comes from the render itself: `collectEntries` flags
 * new keys and `resolveColumns` snapshots them in DOM order.
 */
onUpdated(() => {
  void scheduleMeasure();
});

watch(
  () => props.minColumnWidth,
  () => {
    if (typeof props.minColumnWidth === 'number') probeViewport();
    if (responsive.value) measureContainer();
  },
);

defineExpose({
  /** Re-measure every item and re-consult the heights on the next placement. */
  refresh,
});

const rootClass = computed(() => [
  'sn-waterfall',
  props.masonry ? 'sn-waterfall--masonry' : 'sn-waterfall--stacked',
  props.customClass,
]);

const rootStyle = computed(() => {
  const parts = [
    `--sn-waterfall-column-gap: ${formatLength(props.columnGap)}`,
    `--sn-waterfall-row-gap: ${formatLength(props.rowGap)}`,
  ];
  if (props.customStyle) parts.push(props.customStyle);
  return parts.join('; ');
});
</script>

<template>
  <view data-snui-component="waterfall" :class="rootClass" :style="rootStyle">
    <view
      v-for="(column, columnIndex) in resolveColumns(collectEntries())"
      :key="columnIndex"
      class="sn-waterfall__column"
    >
      <view
        v-for="entry in column"
        :key="entry.key"
        class="sn-waterfall__item"
        :class="{ 'sn-waterfall__item--pending': entry.pending }"
      >
        <ItemNode :node="entry.node" />
      </view>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`).
 * Layout-only container: it paints nothing of its own, so it consumes no
 * colour alias; the only knobs are its two component-scoped custom
 * properties (rpx units). */

.sn-waterfall {
  /* Component-scoped knobs. Both are inlined from the `column-gap` /
   * `row-gap` props; these declarations are the literal fallback for a
   * consumer that clears them. */
  --sn-waterfall-column-gap: 16rpx;
  --sn-waterfall-row-gap: 16rpx;
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
  column-gap: var(--sn-waterfall-column-gap, 16rpx);
}

/* One column. `flex: 1 1 0` + `min-width: 0` gives every column an equal
 * share of the width regardless of its content. */
.sn-waterfall__column {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  row-gap: var(--sn-waterfall-row-gap, 16rpx);
  min-width: 0;
  box-sizing: border-box;
}

.sn-waterfall__item {
  min-width: 0;
  box-sizing: border-box;
}

/* Off switch: a plain vertical stack. The column wrapper stops taking part in
 * the layout (`display: contents`) and each item owns its bottom margin again. */
.sn-waterfall--stacked .sn-waterfall__column {
  display: contents;
}

.sn-waterfall--stacked .sn-waterfall__item {
  margin-bottom: var(--sn-waterfall-row-gap, 16rpx);
}
</style>
