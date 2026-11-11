<script setup lang="ts">
/**
 * SnDocsHome — 首页（heroui 式改版）。
 *
 * 结构（Hero → 场景 → 布局 → 图表）：
 *   1. Hero —— 极光画布上的大标题 + 副标题 + 双 CTA，新增
 *      「风格切换」胶囊（官方 Style Pack：Default / iOS / Doodle / Dark），
 *      点选即整站换肤（注入 snCssVars + body 皮肤类，机制与 StyleSwitcher
 *      一致）；同时清掉主题编辑器的试验样式，让胶囊成为当前权威。
 *   2. 场景案例 —— 端切换胶囊 + 中性预览卡瀑布流 / uni 模板。
 *   3. 中后台布局 —— admin-layout 真壳案例，**切换胶囊**（side / top /
 *      mix / dual）只换当前渲染的那一个壳（LayoutShowcase）。
 *   4. 图表画廊 —— 各类型一张卡（折线 / 面积 / 柱状 / 堆叠 / 环形 /
 *      仪表盘），与 /echarts 文档共用 registry 管线，主题自动跟随。
 */
import { computed, ref } from 'vue';
import { useData, useRouter } from 'vitepress';
import { ArrowRight } from 'lucide-vue-next';
import { SnButton, SnConfigProvider, SnIcon, SnSegment, SnWaterfall } from '@snui/vue-web';
import { snCssVars } from '@snui/tokens';
import { allPacks, getPack } from '@snui/style-packs';
import {
  caseIndexLabels,
  caseText as caseTextOf,
  HOME_CASE_GROUPS,
  homeCases,
  type HomeCaseFilter,
  type HomeCaseId,
} from '../utils/home-cases';
import { uniTemplates } from '../utils/home-uni-templates';
import SnHomeCaseCard from './SnHomeCaseCard.vue';
import SnHomeCaseDemo from './SnHomeCaseDemo.vue';
import SnHomeUniTemplate from './SnHomeUniTemplate.vue';
import LayoutShowcase from './LayoutShowcase.vue';
import HomeChartCard from './HomeChartCard.vue';

/** Hero / 区块文案双语 —— 跟随站点语言（root=zh / /en/=en）。 */
const { lang, isDark } = useData();
const isEn = computed(() => lang.value === 'en-US');
const homeLocale = computed(() => (isEn.value ? 'en' : 'zh') as 'en' | 'zh');
const t = computed(() =>
  isEn.value
    ? {
        subtitle: 'The cross-end UI component library & design-system foundation for AI-Native.',
        tablistLabel: 'Choose an end',
        ctaStart: 'Get Started',
        ctaComponents: 'Browse Components',
        showcaseTitle: 'Scenario Showcases',
        showcaseKicker: 'Composed with live components · interactive · frosted cards',
        showcaseHint:
          'AI reasoning, prompt orchestration, image generation, forms & data, media & interaction',
        layoutTitle: 'Admin layouts, real shells',
        layoutHint: 'Pick a shape — the shell below is the live admin-layout package.',
        chartsTitle: 'Charts for every question',
        chartsHint: 'Line, area, bar, pie, gauge — themed by your tokens, dark-mode aware.',
        chartsMore: 'All chart types',
        styleLabel: 'Theme style',
      }
    : {
        subtitle: '面向 AI-Native 的跨端 UI 组件库与设计系统基础',
        tablistLabel: '选择端',
        ctaStart: '开始使用',
        ctaComponents: '查看组件',
        showcaseTitle: '场景案例',
        showcaseKicker: '真实组件组合 · 可交互 · 磨砂悬浮卡',
        showcaseHint: 'AI 对话推理 / Prompt 编排 / 图像生成、核心表单与数据、媒体与交互',
        layoutTitle: '中后台布局 · 真壳案例',
        layoutHint: '选一个形态 —— 下面就是 @snui/admin-layout 的活体壳。',
        chartsTitle: '回答每种问题的图表',
        chartsHint: '折线 / 面积 / 柱状 / 饼图 / 仪表盘 —— 跟随你的 Token，自动适配暗色。',
        chartsMore: '全部图表类型',
        styleLabel: '主题风格',
      },
);

const router = useRouter();

/** Hero 端切换：Web / Uni。决定双 CTA 的落点（uni 面向移动端文档）。 */
type HomeEnd = 'web' | 'uni';
const activeEnd = ref<HomeEnd>('web');
/** 胶囊选项：内容即端名（中英文案一致）。 */
const endOptions = [
  { value: 'web' as const, label: 'Web' },
  { value: 'uni' as const, label: 'Uni' },
];
/**
 * 场景案例筛选 —— 4 个胶囊（全部 / AI 原生 / 核心表单与数据 / 媒体与交互）。
 * 只过滤不重排：卡头编号由注册表派生（home-cases.ts `caseIndexLabels`），
 * 因此切换筛选时每张卡的编号保持稳定。
 */
const activeCaseFilter = ref<HomeCaseFilter>('all');

/** 各分组的卡数（胶囊角标）。 */
const caseGroupCounts = computed(() => {
  const counts = { all: homeCases.length } as Record<HomeCaseFilter, number>;
  for (const g of HOME_CASE_GROUPS) {
    counts[g] = homeCases.filter((c) => c.group === g).length;
  }
  return counts;
});

/** 当前筛选下渲染的卡。 */
const visibleCases = computed(() =>
  activeCaseFilter.value === 'all'
    ? homeCases
    : homeCases.filter((c) => c.group === activeCaseFilter.value),
);

/** 胶囊清单（文案双语；角标取分组卡数）。 */
const caseFilters = computed((): { key: HomeCaseFilter; label: string }[] =>
  isEn.value
    ? [
        { key: 'all', label: 'All scenarios' },
        { key: 'ai', label: 'AI-native' },
        { key: 'core', label: 'Forms & data' },
        { key: 'media', label: 'Media & interaction' },
      ]
    : [
        { key: 'all', label: '全部场景' },
        { key: 'ai', label: 'AI 原生场景' },
        { key: 'core', label: '核心表单与数据' },
        { key: 'media', label: '媒体与交互' },
      ],
);

/** 站点语言前缀：en locale 的文档在 /en/** 下。 */
const localePrefix = computed(() => (isEn.value ? '/en' : ''));

const startHref = computed(() =>
  activeEnd.value === 'web'
    ? `${localePrefix.value}/guide/web/intro`
    : `${localePrefix.value}/guide/uni/quick-start`,
);
const componentsHref = computed(() =>
  activeEnd.value === 'web'
    ? `${localePrefix.value}/components/web/button`
    : `${localePrefix.value}/components/uni/button`,
);

/** CTA —— VitePress SPA 导航（SnButton 无 href prop，路由在此统一接管）。 */
function navTo(url: string): void {
  router.go(url);
}

// ─── 风格切换胶囊（官方 Style Pack，整站生效） ────────────────────────────
//
// 与 StyleSwitcher 同一条管线：snCssVars 写 `#snui-docs-pack`，
// `snui-skin-*` 挂 body。若用户在主题编辑器里留下过试验样式
// （#snui-theme-editor-css），这里把它移除 —— 胶囊选择成为当前权威，
// 否则两份 CSS 的先后顺序取决于访问路径，表现不可预测。

const PACKS = allPacks.map((p) => ({
  name: p.name,
  label: p.label,
  color: p.theme?.semantic?.action?.primary ?? '#1677ff',
}));
const activePack = ref<string>('default');

function applyPack(name: string): void {
  activePack.value = name;
  const pack = getPack(name);
  if (!pack) return;

  document.getElementById('snui-theme-editor-css')?.remove();

  let styleEl = document.getElementById('snui-docs-pack') as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'snui-docs-pack';
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = snCssVars({
    theme: pack.theme,
    style: pack.style,
    density: pack.density,
  });

  document.body.classList.forEach((c) => {
    if (c.startsWith('snui-skin-')) document.body.classList.remove(c);
  });
  if (name !== 'default') document.body.classList.add(`snui-skin-${name}`);
}

/** 中后台布局胶囊（admin-layout 四形态，标准壳）。 */
const layoutStyles = [
  {
    key: 'side',
    name: 'pro-layout-web-side',
    label: 'side',
    blurb: isEn.value ? 'Classic sidebar' : '经典侧栏',
  },
  {
    key: 'top',
    name: 'pro-layout-web-top',
    label: 'top',
    blurb: isEn.value ? 'Top nav' : '顶部菜单',
  },
  {
    key: 'mix',
    name: 'pro-layout-web-mix',
    label: 'mix',
    blurb: isEn.value ? 'Top + side' : '顶部 + 侧栏',
  },
  {
    key: 'dual',
    name: 'pro-layout-web-dual',
    label: 'dual',
    blurb: isEn.value ? 'Icon rail + submenu' : '图标栏 + 二级列',
  },
];

/** 图表画廊：各类型一张卡（与 /echarts 共用 registry）。 */
const chartIds = [
  'line-basic',
  'area-soft',
  'bar-group',
  'bar-stack',
  'pie-ring',
  'gauge-basic',
] as const;
const chartsHref = computed(() => `${localePrefix.value}/echarts/overview`);
const layoutHref = computed(() => `${localePrefix.value}/ecosystem/plugins/admin-layout`);
</script>

<template>
  <SnConfigProvider>
    <div class="sn-home" :class="{ 'sn-home--dark': isDark }">
      <div class="sn-home__inner">
        <!-- ─────────── Hero ─────────── -->
        <section class="sn-home__hero">
          <!-- 中文主标题 + 英文手写体：Aidian 只有拉丁字形（无中文），所以中西文
               必须是两个元素、各自绑定字体，不能让一个 family 兜底。 -->
          <h1 class="sn-home__title">
            <span class="sn-home__title-zh">把设计系统写进 AI 时代</span>
            <span class="sn-home__title-en">The Foundation for your AI-Native Design System</span>
          </h1>

          <p class="sn-home__subtitle">{{ t.subtitle }}</p>

          <!-- 端切换胶囊（设计稿：Web / Uni）—— 胶囊本体 = 组件库 SnSegment -->
          <div class="sn-home__tabs" :aria-label="t.tablistLabel">
            <SnSegment v-model="activeEnd" :options="endOptions" size="lg" />
          </div>

          <div class="sn-home__actions">
            <SnButton variant="default" size="large" @click="navTo(startHref)">
              {{ t.ctaStart }}
              <SnIcon class="sn-home__cta-icon" :icon="ArrowRight" />
            </SnButton>
            <SnButton variant="tertiary" size="large" @click="navTo(componentsHref)">
              {{ t.ctaComponents }}
            </SnButton>
          </div>

          <!-- 风格切换胶囊：官方 Style Pack，点选整站换肤 -->
          <div class="sn-home__styles" role="group" :aria-label="t.styleLabel">
            <span class="sn-home__styles-label">{{ t.styleLabel }}</span>
            <button
              v-for="pack in PACKS"
              :key="pack.name"
              type="button"
              class="sn-home__style-chip"
              :class="{ 'sn-home__style-chip--active': activePack === pack.name }"
              :aria-pressed="activePack === pack.name"
              @click="applyPack(pack.name)"
            >
              <span class="sn-home__style-dot" :style="{ background: pack.color }" />
              {{ pack.label }}
            </button>
          </div>
        </section>

        <!-- ─────────── 场景案例：一面响应式瀑布流 ─────────── -->
        <section class="sn-home__section" aria-labelledby="sn-home-showcase-title">
          <header class="sn-home__section-head">
            <span class="sn-home__kicker">
              <span class="sn-home__kicker-dot" aria-hidden="true" />
              {{ t.showcaseKicker }}
            </span>
            <h2 id="sn-home-showcase-title" class="sn-home__section-title">
              {{ t.showcaseTitle }}
            </h2>
            <p class="sn-home__section-hint">{{ t.showcaseHint }}</p>

            <!-- 筛选胶囊（仅 Web 端；uni 模板是另一套注册表，不做筛选） -->
            <div
              v-if="activeEnd === 'web'"
              class="sn-home__filters"
              role="tablist"
              :aria-label="t.showcaseTitle"
            >
              <button
                v-for="f in caseFilters"
                :key="f.key"
                type="button"
                role="tab"
                class="sn-home__filter"
                :class="{ 'sn-home__filter--active': activeCaseFilter === f.key }"
                :aria-selected="activeCaseFilter === f.key"
                @click="activeCaseFilter = f.key"
              >
                <span>{{ f.label }}</span>
                <span class="sn-home__filter-count">{{ caseGroupCounts[f.key] }}</span>
              </button>
            </div>
          </header>

          <!-- Web 端：磨砂悬浮案例卡 —— 3 列平衡瀑布流 -->
          <SnWaterfall
            v-if="activeEnd === 'web'"
            :min-column-width="340"
            :columns="3"
            :column-gap="22"
            :row-gap="22"
          >
            <SnHomeCaseCard
              v-for="c in visibleCases"
              :key="c.id"
              :size="c.size"
              :title="caseTextOf(c.id, homeLocale).title"
              :desc="caseTextOf(c.id, homeLocale).desc"
              :badge="c.badge"
              :index="caseIndexLabels[c.id]"
              :accent="c.accent"
              :api="c.api"
              :status="c.status"
              :featured="c.group === 'ai'"
            >
              <SnHomeCaseDemo :id="c.id as HomeCaseId" />
            </SnHomeCaseCard>
          </SnWaterfall>

          <!-- uni 端：uni-templates —— 真实模板的手机模拟器瀑布流 -->
          <SnWaterfall v-else :min-column-width="264" :columns="3" :column-gap="20" :row-gap="26">
            <SnHomeUniTemplate
              v-for="tpl in uniTemplates"
              :key="tpl.id"
              :id="tpl.id"
              :route="tpl.route"
              :height="tpl.h"
              :locale="homeLocale"
            />
          </SnWaterfall>
        </section>

        <!-- ─────────── 中后台布局（切换胶囊） ─────────── -->
        <section class="sn-home__section" aria-labelledby="sn-home-layout-title">
          <header class="sn-home__section-head">
            <h2 id="sn-home-layout-title" class="sn-home__section-title">{{ t.layoutTitle }}</h2>
            <p class="sn-home__section-hint">{{ t.layoutHint }}</p>
          </header>
          <div class="sn-home__panel">
            <LayoutShowcase :styles="layoutStyles" initial="side" />
            <a class="sn-home__panel-more" :href="layoutHref" @click.prevent="navTo(layoutHref)">
              {{ isEn ? 'admin-layout docs' : 'admin-layout 文档' }} →
            </a>
          </div>
        </section>

        <!-- ─────────── 图表画廊（各类型卡片） ─────────── -->
        <section class="sn-home__section" aria-labelledby="sn-home-charts-title">
          <header class="sn-home__section-head">
            <h2 id="sn-home-charts-title" class="sn-home__section-title">{{ t.chartsTitle }}</h2>
            <p class="sn-home__section-hint">{{ t.chartsHint }}</p>
          </header>
          <div class="sn-home__charts">
            <HomeChartCard v-for="id in chartIds" :key="id" :id="id" />
          </div>
          <a class="sn-home__panel-more" :href="chartsHref" @click.prevent="navTo(chartsHref)">
            {{ t.chartsMore }} →
          </a>
        </section>
      </div>
    </div>
  </SnConfigProvider>
</template>

<style scoped>
/* ─────────── 画布 ───────────
 * 全幅 landing 画布，跟随站点深浅（isDark → `sn-home--dark`）：
 * 浅色 = 近白底 + 柔和极光；深色 = 深蓝底 + 亮极光（设计稿）。
 * 不参与 Style Pack 换肤（文档站 token 无 landing 变体）；
 * 导航栏（custom.css §15）压在本画布上形成一体。 */
.sn-home {
  --sn-home-card-shadow: 0 10px 30px rgb(2 6 16 / 0.08);
  --sn-home-card-shadow-hover: 0 18px 44px rgb(2 6 16 / 0.12);
  /* 首页中文统一使用自托管 MiSans 字体库（--vp-font-family-base），
   * 让 hero / 区块标题 / 卡片文案与全站中文保持同一套字形。 */
  font-family: var(--vp-font-family-base);
  width: 100%;
  background:
    radial-gradient(1200px 480px at 16% -8%, rgb(76 110 245 / 0.16), transparent 62%),
    radial-gradient(1000px 440px at 86% -6%, rgb(168 85 247 / 0.14), transparent 64%),
    radial-gradient(900px 420px at 68% 18%, rgb(236 72 153 / 0.1), transparent 66%), #f7f8fb;
  color: #101828;
}
.sn-home--dark {
  --sn-home-card-shadow: 0 10px 30px rgb(2 6 16 / 0.35);
  --sn-home-card-shadow-hover: 0 18px 44px rgb(2 6 16 / 0.45);
  background:
    radial-gradient(1200px 480px at 16% -8%, rgb(64 90 255 / 0.34), transparent 62%),
    radial-gradient(1000px 440px at 86% -6%, rgb(168 85 247 / 0.3), transparent 64%),
    radial-gradient(900px 420px at 68% 18%, rgb(236 72 153 / 0.18), transparent 66%), #0a0f1e;
  color: #f2f5fb;
}
/* 胶囊 / CTA 都是 <button>，UA 默认字体不继承 body —— 不显式指回字体库，
 * 这些中文会退回系统字库，和正文的 MiSans 字形不一致。英文手写体标题
 * 仍由 .sn-home__title-en 单独指定 Aidian Script（只有拉丁字形）。 */
.sn-home button {
  font-family: var(--vp-font-family-base);
}
/* 全屏宽度：不设最大宽度，仅留两侧呼吸边距 */
.sn-home__inner {
  padding: 0 40px 64px;
}

/* ─────────── Hero ─────────── */
.sn-home__hero {
  text-align: center;
  padding: 132px 0 72px;
}

/* Title —— 展示级标题（设计稿两行） */
/* Hero headline: two lines, two faces. The Chinese line carries the meaning in
 * MiSans (no script cut exists for CJK); the English line is the hand-written
 * Aidian accent, which only has Latin glyphs — so it must never contain CJK and
 * needs the larger size / looser tracking to stay readable at 46px+.
 * font-weight: 400 on the h1 — the Aidian face has a single weight and would
 * otherwise be synthesised bold. */
.sn-home__title {
  font-weight: 400;
  margin: 0 0 16px;
  color: #101828;
}
.sn-home__title-zh {
  display: block;
  font-family: var(--vp-font-family-base);
  font-size: 46px;
  font-weight: 600;
  line-height: 1.16;
  letter-spacing: -0.02em;
}
.sn-home__title-en {
  display: block;
  margin-top: 6px;
  font-family: 'Aidian Script', var(--vp-font-family-base);
  font-size: 52px;
  font-weight: 400;
  line-height: 1.22;
  letter-spacing: 0.005em;
}
.sn-home--dark .sn-home__title {
  color: #f5f7fc;
}

/* Subtitle */
.sn-home__subtitle {
  font-size: 16px;
  line-height: 1.7;
  max-width: 640px;
  margin: 0 auto 28px;
  color: #475467;
}
.sn-home--dark .sn-home__subtitle {
  color: rgb(226 232 244 / 0.72);
}

/* ── 端切换胶囊：外壳/滑块/交互由 SnSegment 承载，这里只管排版间距 ── */
.sn-home__tabs {
  display: inline-flex;
  margin-bottom: 28px;
}

/* ── Actions ── */
.sn-home__actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}
/* 主 CTA 读作品牌填充；次 CTA 读作描边按钮（深浅各一套描边色） */
.sn-home__actions :deep(.sn-button--tertiary) {
  background: transparent;
  border-color: rgb(15 23 42 / 0.2);
  color: #101828;
}
.sn-home__actions
  :deep(.sn-button--tertiary:hover:not(.sn-button--disabled):not(.sn-button--loading)) {
  background: rgb(15 23 42 / 0.05);
  border-color: rgb(15 23 42 / 0.34);
  color: #101828;
}
.sn-home--dark .sn-home__actions :deep(.sn-button--tertiary) {
  background: rgb(255 255 255 / 0.04);
  border-color: rgb(255 255 255 / 0.24);
  color: #f2f5fb;
}
.sn-home--dark
  .sn-home__actions
  :deep(.sn-button--tertiary:hover:not(.sn-button--disabled):not(.sn-button--loading)) {
  background: rgb(255 255 255 / 0.1);
  border-color: rgb(255 255 255 / 0.34);
  color: #ffffff;
}
.sn-home__cta-icon {
  width: var(--sn-web-icon-size-small);
  height: var(--sn-web-icon-size-small);
  margin-left: 2px;
}
.sn-home__cta-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

/* ── 风格切换胶囊 ── */
.sn-home__styles {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: fit-content;
  margin: 22px auto 0;
  padding: 6px;
  border: 1px solid rgb(16 24 40 / 0.1);
  border-radius: 999px;
  background: rgb(255 255 255 / 0.6);
  backdrop-filter: blur(8px);
}
.sn-home--dark .sn-home__styles {
  border-color: rgb(255 255 255 / 0.12);
  background: rgb(255 255 255 / 0.06);
}
.sn-home__styles-label {
  padding: 0 6px 0 10px;
  font-size: 12px;
  font-weight: 600;
  color: rgb(16 24 40 / 0.55);
}
.sn-home--dark .sn-home__styles-label {
  color: rgb(242 245 251 / 0.6);
}
.sn-home__style-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 12px;
  border: 1px solid transparent;
  border-radius: 999px;
  background: transparent;
  color: rgb(16 24 40 / 0.72);
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s,
    border-color 0.15s;
}
.sn-home__style-chip:hover {
  background: rgb(16 24 40 / 0.06);
  color: rgb(16 24 40 / 0.9);
}
.sn-home__style-chip--active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}
.sn-home--dark .sn-home__style-chip {
  color: rgb(242 245 251 / 0.75);
}
.sn-home--dark .sn-home__style-chip:hover {
  background: rgb(255 255 255 / 0.08);
  color: #fff;
}
.sn-home--dark .sn-home__style-chip--active {
  color: var(--vp-c-brand-1);
}
.sn-home__style-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid rgb(16 24 40 / 0.15);
}

/* ─────────── 通用区块 ─────────── */
.sn-home__section {
  margin-top: 56px;
}
.sn-home__section-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-bottom: 18px;
  text-align: center;
}
.sn-home__section-title {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.015em;
  color: #101828;
}
.sn-home--dark .sn-home__section-title {
  color: #f2f5fb;
}
.sn-home__section-hint {
  margin: 0;
  font-size: 14px;
  color: rgb(16 24 40 / 0.6);
}
.sn-home--dark .sn-home__section-hint {
  color: rgb(242 245 251 / 0.62);
}
/* ─── 场景案例：眉标（kicker）+ 筛选胶囊 ─── */
.sn-home__kicker {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  margin-bottom: 6px;
  border: 1px solid rgb(37 99 235 / 0.14);
  border-radius: 999px;
  background: rgb(37 99 235 / 0.07);
  font-size: 12px;
  font-weight: 600;
  color: #1d4ed8;
}
.sn-home__kicker-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2563eb;
  animation: sn-home-pulse 2.4s ease-in-out infinite;
}
@keyframes sn-home-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}
@media (prefers-reduced-motion: reduce) {
  .sn-home__kicker-dot {
    animation: none;
  }
}
.sn-home--dark .sn-home__kicker {
  border-color: rgb(147 197 253 / 0.22);
  background: rgb(147 197 253 / 0.1);
  color: #bfdbfe;
}
.sn-home__filters {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 5px;
  margin-top: 14px;
  border: 1px solid rgb(255 255 255 / 0.9);
  border-radius: 999px;
  background: rgb(255 255 255 / 0.6);
  backdrop-filter: blur(16px);
  box-shadow:
    0 2px 8px -1px rgb(15 23 42 / 0.04),
    inset 0 1px 1px 0 rgb(255 255 255 / 0.9);
}
.sn-home__filter {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 15px;
  border: none;
  border-radius: 999px;
  background: none;
  font-size: 12.5px;
  font-weight: 500;
  color: rgb(16 24 40 / 0.66);
  cursor: pointer;
  transition:
    background-color 0.2s,
    color 0.2s,
    box-shadow 0.2s;
}
.sn-home__filter:hover {
  color: #101828;
  background: rgb(255 255 255 / 0.7);
}
.sn-home__filter--active {
  font-weight: 700;
  color: #101828;
  background: #fff;
  box-shadow: 0 2px 8px -2px rgb(15 23 42 / 0.18);
}
.sn-home__filter-count {
  padding: 1px 7px;
  border-radius: 999px;
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  font-size: 10.5px;
  font-weight: 600;
  color: rgb(16 24 40 / 0.55);
  background: rgb(16 24 40 / 0.06);
}
.sn-home__filter--active .sn-home__filter-count {
  color: #1d4ed8;
  background: rgb(37 99 235 / 0.12);
}
.sn-home--dark .sn-home__filters {
  border-color: rgb(255 255 255 / 0.08);
  background: rgb(255 255 255 / 0.05);
  box-shadow: inset 0 1px 1px 0 rgb(255 255 255 / 0.06);
}
.sn-home--dark .sn-home__filter {
  color: rgb(242 245 251 / 0.66);
}
.sn-home--dark .sn-home__filter:hover {
  color: #f2f5fb;
  background: rgb(255 255 255 / 0.07);
}
.sn-home--dark .sn-home__filter--active {
  color: #f2f5fb;
  background: rgb(255 255 255 / 0.12);
}
.sn-home--dark .sn-home__filter-count {
  color: rgb(242 245 251 / 0.6);
  background: rgb(255 255 255 / 0.1);
}
.sn-home--dark .sn-home__filter--active .sn-home__filter-count {
  color: #bfdbfe;
  background: rgb(147 197 253 / 0.16);
}

/* 面板（布局 / 图表共用外壳） */
.sn-home__panel {
  padding: 16px;
  border: 1px solid rgb(16 24 40 / 0.08);
  border-radius: 16px;
  background: rgb(255 255 255 / 0.86);
  backdrop-filter: blur(8px);
}
.sn-home--dark .sn-home__panel {
  border-color: rgb(255 255 255 / 0.1);
  background: rgb(255 255 255 / 0.04);
}
.sn-home__panel-more {
  display: flex;
  width: fit-content;
  margin: 12px auto 0;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}
.sn-home__panel-more:hover {
  text-decoration: underline;
}

/* 图表画廊 */
.sn-home__charts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}
@media (max-width: 960px) {
  .sn-home__charts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 620px) {
  .sn-home__charts {
    grid-template-columns: minmax(0, 1fr);
  }
}

/* ─────────── Mobile adaptations ─────────── */
@media (max-width: 960px) {
  .sn-home__inner {
    padding: 0 20px 48px;
  }
  .sn-home__hero {
    padding: 96px 0 48px;
  }
  .sn-home__title-zh {
    font-size: 32px;
  }
  .sn-home__title-en {
    margin-top: 4px;
    font-size: 34px;
  }
  .sn-home__subtitle {
    margin: 0 auto 24px;
  }
  .sn-home__actions {
    gap: 10px;
  }
}

@media (max-width: 640px) {
  .sn-home__title-zh {
    font-size: 26px;
  }
  .sn-home__title-en {
    font-size: 27px;
  }
  .sn-home__actions {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    max-width: 280px;
    margin: 0 auto;
    gap: 8px;
  }
  .sn-home__actions :deep(.sn-button) {
    width: 100%;
  }
}
</style>
