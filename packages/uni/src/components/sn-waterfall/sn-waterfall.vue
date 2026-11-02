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
 * 拿盒子高度的跨端 API。组件在挂载后、子项数量变化后各跑一轮批量测量
 * （一次请求量全部 item，不是逐项请求），高度写进非响应式 Map——测量
 * 回填绝不触发渲染（AGENTS.md §80）。随后：
 *   - 第一轮测量 → packOnce：完整重排一次（layoutVersion + 1）
 *   - 之后只有「新增 key」会触发增量放置（append 到当前最短列）
 *   - 高度变化本身不再重排——已放置的项不挪列
 * 无 selector query 环境（happy-dom / SSR / 宿主残缺）→ 静默 round-robin，
 * 得到一个静态均衡布局而不是崩溃或单列长龙（AGENTS.md §85）。
 *
 * ## Dispose（AGENTS.md §41）
 *
 * 无 timer、无 listener、无 observer：测量是一次性 selector query，卸载无需
 * 清理；高度 Map 随组件实例一起回收。
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

/** Functional fragment: renders a captured array of slot vnodes. */
const VNodes = (renderProps: { nodes: VNodeChild[] }): VNodeChild => renderProps.nodes;

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

/* ── 测量（uni.createSelectorQuery 批量一轮） ──────────────────────────── */

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
 * One selector-query round: measure every `.sn-waterfall__item` at once.
 *
 * Height→key attribution: `selectAll` returns rects in DOM order, which is
 * column-major (column 1 top-to-bottom, then column 2 …) — the same order the
 * template renders — so the caller zips it against the flattened allocation.
 * Resolves to an empty array when no uni host / no instance exists: the
 * round-robin fallback then keeps the layout balanced (AGENTS.md §85).
 */
function measureItems(): Promise<number[]> {
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
        .selectAll('.sn-waterfall__item')
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

/* ── 放置（append-only） ──────────────────────────────────────────────── */

/** Bumped to force a re-placement (the first measured pack). */
const layoutVersion = ref(0);
/**
 * Whether the wall has stopped re-packing: after the first measured pack,
 * placement is append-only, because moving items that are already on screen
 * is exactly what makes a waterfall feel janky.
 */
let placementFrozen = false;
/** Allocation rendered last time — the diff base for the next placement. */
let previousColumns: string[][] | null = null;
/** Signature of the last placement; height changes deliberately excluded. */
let allocationSignature = '';
/** Rendered allocation: columns of entries (keys + slot vnodes). */
let allocation: WaterfallEntry[][] = [];

/**
 * Place the entries and return the per-column slices to render.
 *
 * Memoised on (column count, row gap, layout version, item keys): a
 * re-render caused by anything else (a measured height, a reactive prop, the
 * parent) reuses the previous allocation object, so Vue's diff has nothing
 * to do. `layoutVersion` is only bumped by the one-shot first measured pack.
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

/** Keys in DOM order (column-major) — the zip base for measured heights. */
function flattenedAllocationKeys(): string[] {
  return allocation.flatMap((column) => column.map((entry) => entry.key));
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

/**
 * One measurement round: batch-measure every item, back-fill the height map,
 * then pack once (first round only). Height writes go to a plain Map — no
 * reactive state, no render (AGENTS.md §80 / §82).
 */
async function remeasure(): Promise<void> {
  await nextTick();
  const heights = await measureItems();
  if (heights.length === 0) return;
  const keys = flattenedAllocationKeys();
  let touched = false;
  heights.forEach((height, index) => {
    const key = keys[index];
    if (key === undefined) return;
    itemHeights.set(key, height);
    if (height > 0) touched = true;
  });
  if (!touched) return;
  packOnceWithMeasurements();
}

onMounted(() => {
  probeViewport();
  measureContainer();
  void remeasure();
});

/*
 * Items can arrive after mount (async feeds): re-measure the fresh batch.
 *
 * A `watch` cannot observe slot membership here: calling `slots.default()`
 * outside the render function both loses dependency tracking and warns.
 * `resolveColumns` runs inside every render and writes `allocationSignature`,
 * so `onUpdated` + a signature guard observes placement changes without ever
 * touching the slot outside a render.
 */
let lastMeasuredSignature = '';
onUpdated(() => {
  if (allocationSignature === lastMeasuredSignature) return;
  if (allocationSignature === '') return;
  lastMeasuredSignature = allocationSignature;
  void remeasure();
});

watch(
  () => props.minColumnWidth,
  () => {
    probeViewport();
    measureContainer();
  },
);

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
      <view v-for="entry in column" :key="entry.key" class="sn-waterfall__item">
        <VNodes :nodes="[entry.node]" />
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
