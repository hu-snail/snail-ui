<script setup lang="ts">
/**
 * SnSearchPanel — docs search results panel (inline dropdown below SnNavSearch).
 *
 * ## Data flow
 *
 * Build-time corpus arrives via `virtual:sn-docs-search-index` (see
 * docs-search-index-plugin.ts). The raw doc list feeds a lazily-constructed
 * DocsSearchEngine module singleton — one index for the app's lifetime, cheap
 * per-keystroke queries (inverted index, no per-query scan of the corpus).
 *
 * ## Capsule filter (Web / uni)
 *
 * Component pages carry an `end` bucket ('web' | 'uni' | 'other'). The
 * capsule shows Web / uni-app / 全部 only when the current result set
 * contains component pages; picking Web or uni-app narrows to that end.
 *
 * ## Animation
 *
 * Panel expand/collapse uses the same frame-rate-independent spring as
 * SnNavSearch (dt-normalized, settle = stop), driving a CSS custom property
 * `--grow` (0→1) that scales opacity + translateY + clip. prefers-reduced-
 * motion snaps. List rendering caps at 12 hits — the engine returns ≤30.
 */
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useData, useRouter } from 'vitepress';
import {
  DocsSearchEngine,
  type DocsSearchDoc,
  type DocsSearchHit,
} from '../utils/docs-search-engine';

const { isDark } = useData();
const router = useRouter();

/**
 * Module-level singleton + lazy chunk.
 *
 * The corpus (~1.4MB raw JSON for 443 pages) ships as its own chunk via a
 * dynamic `import()` of the virtual module — the theme bundle pays nothing
 * until the first search keystroke, and the engine is built once per session
 * (subsequent queries hit the warm inverted index).
 */
let enginePromise: Promise<DocsSearchEngine> | null = null;
function getEngine(): Promise<DocsSearchEngine> {
  if (!enginePromise) {
    enginePromise = import('virtual:sn-docs-search-index').then((m) =>
      new DocsSearchEngine(m.default as DocsSearchDoc[]),
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

/* ── 查询 → 结果（每次 keystroke；倒排索引查询廉价） ─────────────────── */
const hits = ref<DocsSearchHit[]>([]);
watch(
  () => props.query,
  (q) => {
    const trimmed = q.trim();
    if (!trimmed) {
      hits.value = [];
      return;
    }
    void getEngine().then((engine) => {
      // 引擎加载期间用户可能已继续输入——过期结果丢弃。
      if (props.query.trim() !== trimmed) return;
      hits.value = engine.search(trimmed).slice(0, 12);
      if (activeIndex.value >= hits.value.length) activeIndex.value = 0;
    });
  },
);

/* ── 端胶囊（Web / uni-app / 全部） ──────────────────────────────────── */
type EndFilter = 'all' | 'web' | 'uni';
const endFilter = ref<EndFilter>('all');
const hasComponentHits = computed(() => hits.value.some((h) => h.doc.end !== 'other'));
const webCount = computed(() => hits.value.filter((h) => h.doc.end === 'web').length);
const uniCount = computed(() => hits.value.filter((h) => h.doc.end === 'uni').length);
const filteredHits = computed(() =>
  endFilter.value === 'all' ? hits.value : hits.value.filter((h) => h.doc.end === endFilter.value),
);
watch(() => props.query, () => {
  endFilter.value = 'all';
});

const LABELS = {
  all: '全部',
  web: 'Web 端',
  uni: 'uni-app',
} as const;

/* ── 键盘导航 ────────────────────────────────────────────────────────── */
const activeIndex = ref(0);
watch(filteredHits, () => {
  activeIndex.value = 0;
});

function move(delta: number): void {
  const n = filteredHits.value.length;
  if (n === 0) return;
  activeIndex.value = (activeIndex.value + delta + n) % n;
}

function choose(hit: DocsSearchHit): void {
  emit('close');
  void router.go(hit.doc.url);
}

defineExpose({ move, chooseActive });

function chooseActive(): void {
  const hit = filteredHits.value[activeIndex.value];
  if (hit) choose(hit);
}

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
    role="listbox"
    aria-label="搜索结果"
  >
    <!-- 胶囊切换：仅组件结果存在时出现 -->
    <div v-if="hasComponentHits" class="sn-search-panel__capsule" role="group" aria-label="按端筛选">
      <button
        v-for="key in (['all', 'web', 'uni'] as const)"
        :key="key"
        type="button"
        class="sn-search-panel__cap"
        :class="{ 'sn-search-panel__cap--on': endFilter === key }"
        :aria-pressed="endFilter === key"
        :disabled="key !== 'all' && (key === 'web' ? webCount : uniCount) === 0"
        @click="endFilter = key"
      >
        {{ LABELS[key] }}
        <span v-if="key === 'web' && webCount" class="sn-search-panel__cap-n">{{ webCount }}</span>
        <span v-else-if="key === 'uni' && uniCount" class="sn-search-panel__cap-n">{{ uniCount }}</span>
      </button>
    </div>

    <ul v-if="filteredHits.length" class="sn-search-panel__list">
      <li
        v-for="(hit, i) in filteredHits"
        :key="hit.doc.url"
        class="sn-search-panel__item"
        :class="{ 'sn-search-panel__item--active': i === activeIndex }"
        role="option"
        :aria-selected="i === activeIndex"
        @mouseenter="activeIndex = i"
        @click="choose(hit)"
      >
        <div class="sn-search-panel__row">
          <span class="sn-search-panel__title">{{ hit.doc.title }}</span>
          <span class="sn-search-panel__chips">
            <span
              v-if="hit.doc.end !== 'other'"
              class="sn-search-panel__end"
              :data-end="hit.doc.end"
            >{{ hit.doc.end === 'web' ? 'Web' : 'uni' }}</span>
            <span class="sn-search-panel__cat">{{ hit.doc.category }}</span>
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
    <p v-else-if="query.trim()" class="sn-search-panel__empty">没有找到相关结果</p>
  </div>
</template>

<style scoped>
.sn-search-panel {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 420px;
  max-width: calc(100vw - 48px);
  max-height: min(480px, 60vh);
  overflow-y: auto;
  overscroll-behavior: contain;
  border-radius: 14px;
  border: 1px solid var(--sn-web-color-border-default, var(--vp-c-divider));
  background: var(--sn-web-color-background, var(--vp-c-bg));
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.14);
  /* 弹簧驱动 --grow：透明度 / 上浮 / 缩放一次性完成，只合成 transform+opacity */
  opacity: var(--grow);
  transform: translateY(calc((1 - var(--grow)) * -6px)) scale(calc(0.98 + var(--grow) * 0.02));
  transform-origin: top left;
  /* 关闭时的指针屏蔽由外层 .sn-seek__panel-anchor 承担 */
}

/* ── 端胶囊 ── */
.sn-search-panel__capsule {
  position: sticky;
  top: 0;
  z-index: 1;
  display: inline-flex;
  gap: 2px;
  margin: 8px 10px 4px;
  padding: 2px;
  border-radius: 999px;
  background: var(--sn-web-color-background-subtle, var(--vp-c-bg-soft));
}
.sn-search-panel__cap {
  border: 0;
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 12px;
  line-height: 1.4;
  background: transparent;
  color: var(--sn-web-color-text-secondary, var(--vp-c-text-2));
  cursor: pointer;
  transition:
    background 160ms ease,
    color 160ms ease;
}
.sn-search-panel__cap--on {
  background: var(--sn-web-color-background, var(--vp-c-bg));
  color: var(--sn-web-color-text-primary, var(--vp-c-text-1));
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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

/* ── 结果列表 ── */
.sn-search-panel__list {
  list-style: none;
  margin: 0;
  padding: 4px 6px 8px;
}
.sn-search-panel__item {
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 120ms ease;
}
.sn-search-panel__item--active {
  background: var(--sn-web-color-background-subtle, var(--vp-c-bg-soft));
}
.sn-search-panel__row {
  display: flex;
  align-items: baseline;
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
.sn-search-panel__end {
  font-size: 10px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 999px;
}
.sn-search-panel__end[data-end='web'] {
  color: var(--sn-web-color-action-primary, var(--vp-c-brand-1));
  background: var(--vp-c-brand-soft);
}
.sn-search-panel__end[data-end='uni'] {
  color: #0a8f4c;
  background: rgba(16, 185, 129, 0.14);
}
.sn-search-panel--dark .sn-search-panel__end[data-end='uni'] {
  color: #4ade80;
}
.sn-search-panel__cat {
  font-size: 11px;
  color: var(--sn-web-color-text-tertiary, var(--vp-c-text-3));
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
  padding: 18px 14px 20px;
  text-align: center;
  font-size: 12.5px;
  color: var(--sn-web-color-text-tertiary, var(--vp-c-text-3));
}

@media (prefers-reduced-motion: reduce) {
  .sn-search-panel {
    transition: none;
  }
}
</style>
