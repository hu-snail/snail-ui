<script setup lang="ts">
/**
 * SnSearchPanel — docs search results panel (dropdown under SnNavSearch).
 *
 * ## Layout
 *
 * Three rows in a flex column, so the results list can never scroll over the
 * capsule row or the key-hint footer:
 *
 *   head  — Web / uni-app x / 全部 capsule, with a sliding thumb (the active
 *           segment's pill is one element that translates + resizes, so the
 *           switch reads as motion instead of a fill swap)
 *   body  — the only scrollable region (`overflow-y: auto`)
 *   foot  — key hints (left) + pager (right)
 *
 * ## Data flow
 *
 * Build-time corpus arrives via `virtual:sn-docs-search-index` (see
 * docs-search-index-plugin.ts), prefetched once the browser goes idle (and
 * still imported on demand if a keystroke lands first), then fed to a
 * module-level DocsSearchEngine singleton (inverted index, cheap per-query).
 * Queries are scoped to the current locale, so Chinese pages never surface
 * `/en/` mirrors. Results are paginated PAGE_SIZE per page (the engine returns
 * at most 30), while `activeIndex` stays an index over the *whole* filtered
 * list: ↑/↓ walks across page boundaries and the pager follows.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useData, useRoute, useRouter } from 'vitepress';
import { SnPagination, SnTag } from '@snui/vue-web';
import {
  DocsSearchEngine,
  type DocsSearchDoc,
  type DocsSearchHit,
  type SearchLang,
} from '../utils/docs-search-engine';

const { isDark } = useData();
const route = useRoute();
const router = useRouter();

/** 当前站点的语言域：`/en/` 镜像 → 英文，其余 → 中文。 */
const lang = computed<SearchLang>(() =>
  route.path === '/en' || route.path.startsWith('/en/') ? 'en' : 'zh',
);

/**
 * Module-level singleton + lazy chunk: the corpus (~1.4MB raw JSON for 443
 * pages) ships as its own chunk, warmed by `prefetchEngine()` and otherwise
 * fetched on the first search keystroke.
 */
let enginePromise: Promise<DocsSearchEngine> | null = null;
function getEngine(): Promise<DocsSearchEngine> {
  if (!enginePromise) {
    enginePromise = import('virtual:sn-docs-search-index').then(
      (m) => new DocsSearchEngine(m.default as DocsSearchDoc[]),
    );
  }
  return enginePromise;
}

const props = defineProps<{
  query: string;
  open: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

/** Rows per page (the engine caps a query at 30 hits). */
const PAGE_SIZE = 8;

/** Hits of the current query (all pages — the pager slices them). */
const hits = ref<DocsSearchHit[]>([]);

/** 索引 chunk 是否已就绪（首输时靠它区分「检索中」与「无结果」）。 */
const engineReady = ref(false);
/** 首次检索仍在加载索引 chunk。 */
const loading = ref(false);

/**
 * 空闲预取索引：把 ~1.4MB chunk 的加载挪到用户打字之前，
 * 这样第一次输入就能立刻出结果；未就绪时仍有「正在检索…」兜底。
 */
function prefetchEngine(): void {
  if (typeof window === 'undefined') return;
  const warm = (): void => {
    void getEngine().then(() => {
      engineReady.value = true;
    });
  };
  type IdleWindow = Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  };
  const ric = (window as IdleWindow).requestIdleCallback;
  if (typeof ric === 'function') ric(warm, { timeout: 2000 });
  else window.setTimeout(warm, 1200);
}

watch([() => props.query, () => lang.value], ([q]) => {
  const trimmed = q.trim();
  if (!trimmed) {
    hits.value = [];
    loading.value = false;
    activeIndex.value = 0;
    return;
  }
  // 首输时索引 chunk 可能仍在加载：先落「正在检索…」，否则会闪一下
  // 「没有找到相关结果」。
  if (!engineReady.value) {
    loading.value = true;
    hits.value = [];
    activeIndex.value = 0;
  }
  void getEngine().then((engine) => {
    engineReady.value = true;
    loading.value = false;
    // 引擎加载期间用户可能已继续输入——过期结果丢弃。
    if (props.query.trim() !== trimmed) return;
    hits.value = engine.search(trimmed, { lang: lang.value });
    activeIndex.value = 0;
  });
});

/* ── 端胶囊（Web / uni-app x / 全部） ──────────────────────────────────── */
type EndFilter = 'all' | 'web' | 'uni';
const END_KEYS: readonly EndFilter[] = ['all', 'web', 'uni'] as const;
const LABELS: Record<EndFilter, string> = { all: '全部', web: 'Web 端', uni: 'uni-app x' };

const endFilter = ref<EndFilter>('all');
const hasComponentHits = computed(() => hits.value.some((h) => h.doc.end !== 'other'));
function countOf(key: EndFilter): number {
  if (key === 'all') return hits.value.length;
  return hits.value.filter((h) => h.doc.end === key).length;
}
const filteredHits = computed(() =>
  endFilter.value === 'all' ? hits.value : hits.value.filter((h) => h.doc.end === endFilter.value),
);

/* ── 滑动 thumb：胶囊切换动画 ─────────────────────────────────────────── */
const capTrack = ref<HTMLElement | null>(null);
const capRefs = ref<Array<HTMLButtonElement | null>>([]);
const thumb = ref({ x: 0, w: 0 });
let thumbObserver: ResizeObserver | undefined;

/** 把 thumb 移到当前段（offsetParent = track，故 offsetLeft 即轨道内坐标）。 */
function syncThumb(): void {
  const index = END_KEYS.indexOf(endFilter.value);
  const el = capRefs.value[index];
  if (!el) return;
  thumb.value = { x: el.offsetLeft, w: el.offsetWidth };
}

watch([endFilter, () => filteredHits.value.length, hasComponentHits], () => {
  void nextTick(syncThumb);
});
onMounted(() => {
  void nextTick(syncThumb);
  prefetchEngine();
  if (typeof ResizeObserver !== 'undefined') {
    thumbObserver = new ResizeObserver(() => syncThumb());
    if (capTrack.value) thumbObserver.observe(capTrack.value);
  }
});
onBeforeUnmount(() => thumbObserver?.disconnect());

/** 换查询时回到「全部」，换端时把选中项收回第一页。 */
watch(
  () => props.query,
  () => {
    endFilter.value = 'all';
    activeIndex.value = 0;
  },
);
watch(endFilter, () => {
  activeIndex.value = 0;
  scrollActiveIntoView();
});

/* ── 分页 ────────────────────────────────────────────────────────────── */
const pageCount = computed(() => Math.max(1, Math.ceil(filteredHits.value.length / PAGE_SIZE)));
/** 当前页由 activeIndex 推导：↑↓ 跨页时页码自动跟随。 */
const page = computed(() => Math.floor(activeIndex.value / PAGE_SIZE) + 1);
const pagedHits = computed(() =>
  filteredHits.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE),
);

function onPage(next: number): void {
  const clamped = Math.min(Math.max(next, 1), pageCount.value);
  activeIndex.value = (clamped - 1) * PAGE_SIZE;
  scrollActiveIntoView();
}

/* ── 键盘导航 ────────────────────────────────────────────────────────── */
const activeIndex = ref(0);
const listEl = ref<HTMLElement | null>(null);

/** 全局下标 → 当前页内下标（用于 active 样式与 mouseenter 回写）。 */
function globalIndex(localIndex: number): number {
  return (page.value - 1) * PAGE_SIZE + localIndex;
}

function scrollActiveIntoView(): void {
  void nextTick(() => {
    const el = listEl.value?.children[activeIndex.value - (page.value - 1) * PAGE_SIZE] as
      HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  });
}

/** 跨页循环移动（列表为空时不动）。 */
function move(delta: number): void {
  const total = filteredHits.value.length;
  if (total === 0) return;
  activeIndex.value = (activeIndex.value + delta + total) % total;
  scrollActiveIntoView();
}

function choose(hit: DocsSearchHit): void {
  emit('close');
  void router.go(hit.doc.url);
}

function chooseActive(): void {
  const hit = filteredHits.value[activeIndex.value];
  if (hit) choose(hit);
}

defineExpose({ move, chooseActive });

/* ── 展开动画（帧率无关弹簧，驱动 --grow） ───────────────────────────── */
const grow = ref(0);
let raf = 0;
let cur = 0;
let vel = 0;
let prevT = 0;

const stillness = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function animateGrow(target: number): void {
  // SSG：window 不存在，直接落位（面板初始就是收起态，不需要动画）。
  if (typeof window === 'undefined') {
    cur = target;
    vel = 0;
    grow.value = target;
    return;
  }
  cancelAnimationFrame(raf);
  if (stillness()) {
    cur = target;
    vel = 0;
    grow.value = target;
    return;
  }
  const k = 0.16;
  const d = 0.82;
  const tick = (t: number) => {
    const dt = prevT ? Math.min(Math.max((t - prevT) / 16.67, 0), 2.5) : 1;
    prevT = t;
    vel += (target - cur) * k * dt;
    vel *= Math.pow(d, dt);
    cur += vel * dt;
    if (Math.abs(target - cur) < 0.005 && Math.abs(vel) < 0.005) {
      cur = target;
      vel = 0;
      grow.value = target;
      raf = 0;
      return;
    }
    grow.value = cur;
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
}

watch(
  () => props.open,
  (open) => {
    animateGrow(open ? 1 : 0);
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
});

/* ── 高亮渲染：snippet + 区间 → 分段文本 ─────────────────────────────── */
interface SnippetPart {
  text: string;
  marked: boolean;
}

function partsOf(hit: DocsSearchHit): SnippetPart[] {
  if (hit.highlight.length === 0) return hit.snippet ? [{ text: hit.snippet, marked: false }] : [];
  const out: SnippetPart[] = [];
  let cursor = 0;
  for (const [start, end] of hit.highlight) {
    if (start > cursor) out.push({ text: hit.snippet.slice(cursor, start), marked: false });
    out.push({ text: hit.snippet.slice(start, end), marked: true });
    cursor = end;
  }
  if (cursor < hit.snippet.length) out.push({ text: hit.snippet.slice(cursor), marked: false });
  return out;
}
</script>

<template>
  <div
    class="sn-search-panel"
    :class="{ 'sn-search-panel--dark': isDark }"
    :style="{ '--grow': grow }"
    :data-open="open"
    role="dialog"
    aria-label="搜索结果"
  >
    <!-- head：端胶囊。thumb 是一个会平移+变宽的元素，切换因此读作「滑动」 -->
    <div
      v-if="hasComponentHits"
      ref="capTrack"
      class="sn-search-panel__head"
      role="group"
      aria-label="按端筛选"
    >
      <span
        class="sn-search-panel__thumb"
        :style="{ transform: `translateX(${thumb.x}px)`, width: `${thumb.w}px` }"
        aria-hidden="true"
      />
      <button
        v-for="(key, i) in END_KEYS"
        :key="key"
        :ref="(el) => (capRefs[i] = el as HTMLButtonElement | null)"
        type="button"
        class="sn-search-panel__cap"
        :class="{ 'sn-search-panel__cap--on': endFilter === key }"
        :aria-pressed="endFilter === key"
        :disabled="countOf(key) === 0"
        @click="endFilter = key"
      >
        {{ LABELS[key] }}
        <span v-if="countOf(key)" class="sn-search-panel__cap-n">{{ countOf(key) }}</span>
      </button>
    </div>

    <!-- body：唯一滚动区，绝不会压到胶囊或按键说明 -->
    <ul v-if="pagedHits.length" ref="listEl" class="sn-search-panel__list" role="listbox">
      <li
        v-for="(hit, i) in pagedHits"
        :key="hit.doc.url"
        class="sn-search-panel__item"
        :class="{ 'sn-search-panel__item--active': globalIndex(i) === activeIndex }"
        role="option"
        :aria-selected="globalIndex(i) === activeIndex"
        @mouseenter="activeIndex = globalIndex(i)"
        @click="choose(hit)"
      >
        <div class="sn-search-panel__row">
          <span class="sn-search-panel__title">{{ hit.doc.title }}</span>
          <span class="sn-search-panel__chips">
            <SnTag
              v-if="hit.doc.end !== 'other'"
              size="small"
              round
              :bordered="false"
              :type="hit.doc.end === 'web' ? 'primary' : 'success'"
            >
              {{ hit.doc.end === 'web' ? 'Web' : 'uni-app x' }}
            </SnTag>
            <SnTag size="small" round :bordered="false">{{ hit.doc.category }}</SnTag>
          </span>
        </div>
        <p v-if="partsOf(hit).length" class="sn-search-panel__snippet">
          <template v-for="(part, pi) in partsOf(hit)" :key="pi">
            <mark v-if="part.marked" class="sn-search-panel__mark">{{ part.text }}</mark>
            <template v-else>{{ part.text }}</template>
          </template>
        </p>
      </li>
    </ul>
    <p v-else-if="loading" class="sn-search-panel__empty">正在检索…</p>
    <p v-else-if="query.trim()" class="sn-search-panel__empty">没有找到相关结果</p>

    <!-- foot：左 = 按键说明，右 = 分页 -->
    <div v-if="filteredHits.length" class="sn-search-panel__foot">
      <p class="sn-search-panel__keys">
        <kbd>↑</kbd><kbd>↓</kbd><span>选择</span> <kbd>↵</kbd><span>打开</span> <kbd>esc</kbd
        ><span>关闭</span>
      </p>
      <SnPagination
        class="sn-search-panel__pager"
        simple
        :page="page"
        :page-count="pageCount"
        @update:page="onPage"
      />
    </div>
  </div>
</template>

<style scoped>
/* 三段式：head / body / foot。面板自身不滚动（overflow: hidden），
 * 只有 body 里的列表滚动 —— 结果永远不可能滑到胶囊或说明行上面。 */
.sn-search-panel {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  display: flex;
  flex-direction: column;
  width: 420px;
  max-width: calc(100vw - 48px);
  max-height: min(460px, 60vh);
  overflow: hidden;
  overscroll-behavior: contain;
  border-radius: 18px;
  /* 底色走站点自定义搜索变量（浅色「浅浅的」#f8f8f8 / 深色
   * --vp-c-bg-soft，见 custom.css），品牌色仍以两团径向光晕弥散在面板内；
   * 随主题换色，和输入框保持同一档淡底。 */
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 20%, rgb(255 255 255 / 0.75));
  background-color: var(--sn-docs-search-bg, color-mix(in srgb, var(--vp-c-bg) 90%, transparent));
  background-image:
    radial-gradient(
      120% 90% at 100% 0%,
      color-mix(in srgb, var(--vp-c-brand-1) 18%, transparent),
      transparent 62%
    ),
    radial-gradient(
      100% 80% at 0% 100%,
      color-mix(in srgb, var(--vp-c-brand-2) 12%, transparent),
      transparent 58%
    );
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  box-shadow:
    0 18px 48px -12px color-mix(in srgb, var(--vp-c-brand-1) 26%, transparent),
    0 8px 24px -8px rgb(15 23 42 / 0.1),
    inset 0 1px 0 0 color-mix(in srgb, var(--vp-c-bg) 70%, transparent);
  /* 弹簧驱动 --grow：透明度 / 上浮 / 缩放一次性完成，只合成 transform+opacity */
  opacity: var(--grow);
  transform: translateY(calc((1 - var(--grow)) * -6px)) scale(calc(0.98 + var(--grow) * 0.02));
  transform-origin: top left;
}

/* 深色：同构——品牌光晕提亮；底色由 --sn-docs-search-bg 的 .dark 覆盖
 * 提供（--vp-c-bg-soft），可读性优先。 */
.sn-search-panel--dark {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 26%, rgb(255 255 255 / 0.12));
  background-color: var(--sn-docs-search-bg, color-mix(in srgb, var(--vp-c-bg) 88%, transparent));
  background-image:
    radial-gradient(
      120% 90% at 100% 0%,
      color-mix(in srgb, var(--vp-c-brand-1) 26%, transparent),
      transparent 64%
    ),
    radial-gradient(
      100% 80% at 0% 100%,
      color-mix(in srgb, var(--vp-c-brand-2) 16%, transparent),
      transparent 60%
    );
  box-shadow:
    0 18px 48px -12px color-mix(in srgb, var(--vp-c-brand-1) 30%, transparent),
    0 10px 28px -8px rgb(0 0 0 / 0.5),
    inset 0 1px 0 0 rgb(255 255 255 / 0.07);
}

/* ── head：端胶囊（含滑动 thumb） ── */
.sn-search-panel__head {
  position: relative; /* thumb 的定位基准（按钮 offsetLeft 即轨道内坐标） */
  flex: 0 0 auto;
  display: flex;
  gap: 2px;
  padding: 10px 12px 8px;
  border-bottom: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
}
.sn-search-panel__thumb {
  position: absolute;
  top: 10px;
  left: 0;
  height: 26px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--vp-c-bg) 94%, transparent);
  box-shadow:
    0 1px 3px rgb(15 23 42 / 0.12),
    0 0 0 1px color-mix(in srgb, var(--vp-c-brand-1) 22%, transparent);
  pointer-events: none;
  transition:
    transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
    width 260ms cubic-bezier(0.22, 1, 0.36, 1),
    background 200ms ease;
}
.sn-search-panel--dark .sn-search-panel__thumb {
  background: color-mix(in srgb, var(--vp-c-bg) 86%, transparent);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--vp-c-brand-1) 30%, transparent),
    0 1px 3px rgb(0 0 0 / 0.4);
}
.sn-search-panel__cap {
  position: relative;
  z-index: 1;
  border: 0;
  border-radius: 999px;
  padding: 4px 10px;
  height: 26px;
  font-size: 12px;
  line-height: 1;
  background: transparent;
  color: var(--sn-web-color-text-secondary, var(--vp-c-text-2));
  cursor: pointer;
  transition: color 160ms ease;
}
.sn-search-panel__cap--on {
  color: var(--sn-web-color-text-primary, var(--vp-c-text-1));
  font-weight: 600;
}
.sn-search-panel__cap:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.sn-search-panel__cap-n {
  margin-left: 3px;
  font-size: 10.5px;
  opacity: 0.7;
}

/* ── body：结果列表（唯一滚动区） ── */
.sn-search-panel__list {
  flex: 1 1 auto;
  min-height: 0; /* flex 子项要能收缩才会交出滚动权 */
  overflow-y: auto;
  overscroll-behavior: contain;
  list-style: none;
  margin: 0;
  padding: 6px;
}

/* 列表滚动条：比全站更窄（6px 槽 / 2px 胶囊），贴着面板右侧的圆角内壁，
 * 不压住结果行标签。这里只写 WebKit 伪元素 —— 不给元素加标准属性
 * `scrollbar-width / scrollbar-color`，否则 Chrome 121+ 会忽略伪元素；
 * Firefox 靠 `*` 上的 thin 设置即可。与全站一致：胶囊默认透明，
 * 只有列表真正滚动（.sn-is-scrolling）时才显形。 */
.sn-search-panel__list::-webkit-scrollbar {
  width: 6px;
}
.sn-search-panel__list::-webkit-scrollbar-track {
  background: transparent;
}
.sn-search-panel__list::-webkit-scrollbar-thumb {
  border: 1px solid transparent;
  border-radius: 999px;
  background-color: transparent;
  background-clip: content-box;
}
.sn-search-panel__list.sn-is-scrolling::-webkit-scrollbar-thumb {
  background-color: color-mix(in srgb, var(--vp-c-text-2) 26%, transparent);
}
.sn-search-panel__list.sn-is-scrolling::-webkit-scrollbar-thumb:hover {
  background-color: color-mix(in srgb, var(--vp-c-brand-1) 50%, transparent);
}
.sn-search-panel--dark .sn-search-panel__list.sn-is-scrolling::-webkit-scrollbar-thumb {
  background-color: color-mix(in srgb, var(--vp-c-text-2) 40%, transparent);
}
.sn-search-panel__item {
  padding: 8px 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 120ms ease;
}
.sn-search-panel__item--active {
  background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
}
.sn-search-panel--dark .sn-search-panel__item--active {
  background: color-mix(in srgb, var(--vp-c-brand-1) 20%, transparent);
}
.sn-search-panel__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.sn-search-panel__title {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--sn-web-color-text-primary, var(--vp-c-text-1));
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sn-search-panel__chips {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}
.sn-search-panel__snippet {
  margin: 3px 0 0;
  font-size: 12px;
  line-height: 1.55;
  color: var(--sn-web-color-text-secondary, var(--vp-c-text-2));
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.sn-search-panel__mark {
  background: none;
  color: var(--sn-web-color-action-primary, var(--vp-c-brand-1));
  font-weight: 600;
}
.sn-search-panel__empty {
  margin: 0;
  padding: 20px 14px 24px;
  text-align: center;
  font-size: 12.5px;
  color: var(--sn-web-color-text-tertiary, var(--vp-c-text-3));
}

/* ── foot：按键说明（左）+ 分页（右） ── */
.sn-search-panel__foot {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 6px 10px;
  border-top: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
}
.sn-search-panel__keys {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin: 0;
  font-size: 11px;
  color: var(--sn-web-color-text-tertiary, var(--vp-c-text-3));
}
.sn-search-panel__keys kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 5px;
  border: 1px solid color-mix(in srgb, var(--vp-c-divider) 80%, transparent);
  background: color-mix(in srgb, var(--vp-c-bg) 60%, transparent);
  font-family: var(--vp-font-family-base);
  font-size: 10.5px;
  line-height: 1;
  color: var(--sn-web-color-text-secondary, var(--vp-c-text-2));
}
.sn-search-panel__keys span {
  margin-right: 4px;
}
/* 分页：simple 模式足够紧凑，字号随面板收一档 */
.sn-search-panel__pager {
  flex-shrink: 0;
  font-size: 12px;
}

@media (prefers-reduced-motion: reduce) {
  .sn-search-panel__thumb,
  .sn-search-panel__item {
    transition: none;
  }
}
</style>
