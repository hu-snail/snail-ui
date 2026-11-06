<script setup lang="ts">
/**
 * SnNavSearch — Seek 式动画搜索框（导航条内联，非独立卡片）。
 *
 * 「一个对象，不是两个」：盒子宽度即状态。关闭态是 32px 圆（透镜居中），
 * 点击后弹簧展开成 220px 输入框；透镜相对盒子永远不动 —— 圆态时它恰好
 * 居中，展开后它就是输入框的左 padding，位移感来自盒子在静止标记周围
 * 生长，而非两件东西的交叉淡入。
 *
 * 行为映射 Bencho Seek 原件：
 *   - 帧率无关弹簧（dt 以 1/60s 计，阻尼取幂；settle 即停车）；
 *   - 点击先压缩（90ms「被按下」的节拍）再展开并聚焦；
 *   - 有值时失焦不收起（值是字段存在的理由）；
 *   - prefers-reduced-motion 直接落位；
 *   - Esc 清空并收起。
 *
 * 有值时失焦不收起（值是字段存在的理由）；
 *   - prefers-reduced-motion 直接落位；
 *   - Esc 清空并收起。
 *
 * 输入 → SnSearchPanel 本地检索（构建期索引 + 倒排 TF-IDF 引擎，见
 * utils/docs-search-engine.ts）。↑↓ 选择、Enter 跳转、Esc 清空收起。
 * 导航条空间有限，常量按 band 高度缩放（SHUT=32 / LENS=15 / field=220）。
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useData } from 'vitepress';

// 主题暗色态：模板里 sn-seek--dark / placeholder 文案都要用它。
// 之前只 import 未调用 —— isDark 在渲染期 undefined（Vue warn）。
const { isDark } = useData();
import SnSearchPanel from './SnSearchPanel.vue';

/* ── 几何常量（band 版） ─────────────────────────────────────────────── */
const SHUT = 32;
const LENS = 15;
const INSET = (SHUT - LENS) / 2;
const FIELD = 220;

/* ── 帧率无关弹簧 ────────────────────────────────────────────────────── */
const springOf = (tune: number) => ({
  k: 0.08 + (tune / 100) * 0.16,
  d: 0.62 + (tune / 100) * 0.2,
});

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const stillness = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export interface SeekExposed {
  close: () => void;
}

const open = ref(false);
const press = ref(false);
const value = ref('');
const width = ref(SHUT);

let raf = 0;
let cur = SHUT;
let vel = 0;
let beat = 0;

function animateTo(target: number): void {
  cancelAnimationFrame(raf);
  if (stillness()) {
    cur = target;
    vel = 0;
    width.value = target;
    return;
  }
  const { k, d } = springOf(50);
  let prev = 0;
  const tick = (t: number) => {
    const dt = prev ? clamp((t - prev) / 16.67, 0, 2.5) : 1;
    prev = t;
    vel += (target - cur) * k * dt;
    vel *= Math.pow(d, dt);
    cur += vel * dt;
    if (Math.abs(target - cur) < 0.02 && Math.abs(vel) < 0.02) {
      cur = target;
      vel = 0;
      width.value = target;
      raf = 0;
      return;
    }
    width.value = cur;
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
}

const progress = computed(() => clamp((width.value - SHUT) / Math.max(1, FIELD - SHUT), 0, 1));
/* 占位文字与光标在展开的最后三分之一到位 */
const say = computed(() => clamp((progress.value - 0.55) / 0.45, 0, 1));

const field = ref<HTMLInputElement | null>(null);

function start(): void {
  if (open.value) return;
  press.value = true;
  clearTimeout(beat);
  beat = window.setTimeout(
    () => {
      press.value = false;
      open.value = true;
      animateTo(FIELD);
      field.value?.focus();
    },
    stillness() ? 0 : 90,
  );
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    value.value = '';
    panelOpen.value = false;
    open.value = false;
    animateTo(SHUT);
    field.value?.blur();
    return;
  }
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    panel.value?.move(1);
    return;
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    panel.value?.move(-1);
    return;
  }
  if (event.key === 'Enter') {
    panel.value?.chooseActive();
  }
}

/* ── 结果面板联动：有输入即展开面板；清空 / 收起字段时一起收起 ─────────── */
const panel = ref<InstanceType<typeof SnSearchPanel> | null>(null);
const panelOpen = ref(false);
watch(
  () => value.value,
  (v) => {
    panelOpen.value = open.value && v.trim().length > 0;
  },
);
watch(open, (o) => {
  if (!o) panelOpen.value = false;
});

/** 面板选中跳转后：清空查询并收起整个搜索框。 */
function onPanelClose(): void {
  value.value = '';
  panelOpen.value = false;
  open.value = false;
  animateTo(SHUT);
}

/** 点击字段外收起（面板点击会先 blur，由 panelOpen 延迟避免误收起）。 */
function away(): void {
  // 有查询时保持展开（结果面板需要停留在屏幕上供选择）。
  if (value.value.trim()) return;
  open.value = false;
  animateTo(SHUT);
}

/* ── 点击外部：关闭结果面板，并把搜索框收回圆态（保留查询） ─────────── */
const root = ref<HTMLElement | null>(null);
function onDocPointerDown(event: PointerEvent): void {
  const target = event.target as Node | null;
  if (!root.value || (target && root.value.contains(target))) return;
  // 1) 结果面板立刻消失，2) 字段一并收回（宽度弹簧回到 32px 圆态）。
  panelOpen.value = false;
  open.value = false;
  animateTo(SHUT);
  // 输入框此刻可能仍持有焦点（capture 阶段早于浏览器换焦点），显式失焦，
  // 避免「已收起却仍在输入态」的中间态；away() 在非空查询下不会重复收起。
  field.value?.blur();
}
function onFieldFocus(): void {
  // 重新聚焦且已有查询 → 结果面板回来（不用再敲一次字）。
  if (value.value.trim()) panelOpen.value = true;
}

onMounted(() => {
  // 捕获阶段：任何位置的按下都先判定是否在搜索框之外。
  document.addEventListener('pointerdown', onDocPointerDown, true);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  clearTimeout(beat);
  document.removeEventListener('pointerdown', onDocPointerDown, true);
});
</script>

<template>
  <div ref="root" class="sn-seek" :class="{ 'sn-seek--dark': isDark }" :style="{ width: `${width}px` }">
    <div class="sn-seek__skin" :data-open="open" :data-press="press">
      <!-- 透镜：固定在左 inset，圆态居中 / 展开态即字段 padding -->
      <svg class="sn-seek__lens" viewBox="0 0 18 18" aria-hidden="true">
        <circle cx="7.6" cy="7.6" r="5.4" />
        <path d="M11.6 11.6 L15.4 15.4" />
      </svg>
      <input
        ref="field"
        class="sn-seek__field"
        type="text"
        :value="value"
        :placeholder="isDark ? '搜索' : '搜索文档'"
        aria-label="搜索文档"
        role="combobox"
        :aria-expanded="panelOpen"
        aria-controls="sn-search-panel"
        :tabindex="open ? 0 : -1"
        @input="value = ($event.target as HTMLInputElement).value"
        @blur="away"
        @focus="onFieldFocus"
        @keydown="onKeydown"
      />
      <!-- 展开前唯一的点击入口；展开后由字段自身接管 -->
      <button
        v-if="!open"
        type="button"
        class="sn-seek__hit"
        aria-label="搜索文档"
        @click="start"
      />
    </div>
    <!-- 检索结果面板：锚定在搜索框下，随输入弹簧展开 -->
    <div :class="{ 'sn-seek__panel-anchor--open': panelOpen }" class="sn-seek__panel-anchor">
      <SnSearchPanel
        id="sn-search-panel"
        ref="panel"
        :query="value"
        :open="panelOpen"
        @close="onPanelClose"
      />
    </div>
  </div>
</template>

<style scoped>
.sn-seek {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 32px;
  flex-shrink: 0;
  transition: width 0.06s linear; /* 弹簧每帧写 width，CSS 过渡只做帧间平滑 */
}

.sn-seek__skin {
  position: relative;
  width: 100%;
  height: 32px;
  border-radius: 999px;
  /* 透明底：搜索框坐在悬浮导航岛的磨砂玻璃上，自己再铺一层实色就成了「贴片」。
   * 只留一圈极淡的描边；悬停 / 展开时才升一点浅底，焦点状态依然可辨。 */
  background: transparent;
  border: 1px solid color-mix(in srgb, var(--sn-web-color-border-default, var(--vp-c-divider)) 65%, transparent);
  overflow: hidden;
  transform: scale(var(--sk, 1)) translateY(var(--ly, 0));
  transition:
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
    background 220ms ease,
    border-color 220ms ease;
  cursor: pointer;
}
.sn-seek__skin:hover,
.sn-seek__skin[data-open='true'] {
  background: color-mix(in srgb, var(--vp-c-bg) 45%, transparent);
  border-color: color-mix(in srgb, var(--sn-web-color-action-primary, var(--vp-c-brand-1)) 45%, transparent);
}
.sn-seek__skin[data-open='true'] {
  cursor: text;
}

/* hover 微升起；按下先压缩（「被按下」的节拍） */
.sn-seek:not([data-open='true']) .sn-seek__skin:hover {
  --sk: 1.05;
}
.sn-seek:not([data-open='true']) .sn-seek__skin:active,
.sn-seek[data-press='true'] .sn-seek__skin {
  --sk: 0.92;
  transition: transform 160ms cubic-bezier(0.22, 1, 0.36, 1);
}

/* ── 透镜 ── */
.sn-seek__lens {
  position: absolute;
  left: 8.5px;
  top: 50%;
  width: 15px;
  height: 15px;
  margin-top: -7.5px;
  fill: none;
  stroke: var(--sn-web-color-text-secondary, var(--vp-c-text-2));
  stroke-width: 1.5;
  stroke-linecap: round;
  pointer-events: none;
  transition:
    stroke 220ms ease,
    stroke-width 220ms ease;
}
.sn-seek__skin:hover .sn-seek__lens {
  stroke: var(--sn-web-color-text-primary, var(--vp-c-text-1));
}
.sn-seek__skin[data-open='true'] .sn-seek__lens {
  stroke: var(--sn-web-color-action-primary, var(--vp-c-brand-1));
}

/* ── 字段：一直存在，由 --say（宽度进度）揭示 ── */
.sn-seek__field {
  position: absolute;
  left: calc(8.5px + 15px + 9px);
  right: 13px;
  top: 0;
  height: 100%;
  border: 0;
  background: none;
  font-size: 13px;
  color: var(--sn-web-color-text-primary, var(--vp-c-text-1));
  outline: none;
  opacity: calc(v-bind(say) * 1);
  transform: translateX(calc((1 - v-bind(say)) * -6px));
  pointer-events: none;
}
.sn-seek__skin[data-open='true'] .sn-seek__field {
  pointer-events: auto;
}
.sn-seek__field::placeholder {
  color: var(--sn-web-color-text-placeholder, var(--vp-c-text-3));
}

.sn-seek__panel-anchor {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 70;
  /* 面板关闭时不拦截点击（弹簧收起动画期间仍挡住指针，直到 --grow < 0.6） */
  pointer-events: none;
}
.sn-seek__panel-anchor--open {
  pointer-events: auto;
}

/* 展开前的命中层 */
.sn-seek__hit {
  position: absolute;
  inset: 0;
  border: 0;
  border-radius: inherit;
  background: none;
  cursor: pointer;
}
.sn-seek__hit:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px var(--vp-c-bg),
    0 0 0 4px var(--sn-doc-accent-soft, rgba(22, 119, 255, 0.35));
}
</style>
