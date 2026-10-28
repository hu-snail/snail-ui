<script setup lang="ts">
/**
 * SnDocsHome — 首页（按设计稿重构版）。
 *
 * 结构（对应设计稿从上到下）：
 *   1. Hero —— 极光画布上的居中大标题 + 副标题 + Web/Uni 端切换胶囊
 *      + 双 CTA（开始使用 / 查看组件）。CTA 目标跟随所选端。
 *   2. 场景案例 —— 一面 SnWaterfall 瀑布流（min-column-width 响应式列数，
 *      铺满视口宽度，无跑马灯）：白色玻璃卡是真实 @snui/vue-web 组件拼装
 *      的迷你业务场景（表单 / 列表 / 图表 / 对话 / 二维码 / 表格 / 日历
 *      等），内容渲染在 SnHomeCaseDemo。
 *
 * 画布说明：首页跟随站点深浅（isDark → `sn-home--dark`），浅色 = 近白底
 * 柔和极光，深色 = 深蓝底亮极光（设计稿）。landing 画布不参与 Style Pack
 * 换肤；导航栏通过 SnDocsNav inverted（仅深色）+ custom.css §15 融入画布。
 * 案例卡是淡色渐变弥散玻璃（色相由 caseHue 确定性派生），深浅两套配方见
 * SnHomeCaseCard。
 */
import { computed, ref } from 'vue';
import { useData, useRouter } from 'vitepress';
import { ArrowRight } from 'lucide-vue-next';
import { SnButton, SnConfigProvider, SnIcon, SnWaterfall } from '@snui/vue-web';
import { caseHue, caseText as caseTextOf, homeCases, type HomeCaseId } from '../utils/home-cases';
import { uniTemplates } from '../utils/home-uni-templates';
import SnHomeCaseCard from './SnHomeCaseCard.vue';
import SnHomeCaseDemo from './SnHomeCaseDemo.vue';
import SnHomeUniTemplate from './SnHomeUniTemplate.vue';

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
        showcaseHint: 'Composed with live components · interactive · adaptive glass cards',
      }
    : {
        subtitle: '面向 AI-Native 的跨端 UI 组件库与设计系统基础',
        tablistLabel: '选择端',
        ctaStart: '开始使用',
        ctaComponents: '查看组件',
        showcaseTitle: '场景案例',
        showcaseHint: '真实组件组合 · 可交互 · 弥散玻璃卡片',
      },
);

const router = useRouter();

/** Hero 端切换：Web / Uni。决定双 CTA 的落点（uni 面向移动端文档）。 */
type HomeEnd = 'web' | 'uni';
const activeEnd = ref<HomeEnd>('web');

/** 站点语言前缀：en locale 的文档在 /en/** 下。 */
const localePrefix = computed(() => (isEn.value ? '/en' : ''));

const startHref = computed(() =>
  activeEnd.value === 'web' ? `${localePrefix.value}/guide/web/intro` : `${localePrefix.value}/guide/uni/quick-start`,
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
</script>

<template>
  <SnConfigProvider>
    <div class="sn-home" :class="{ 'sn-home--dark': isDark }">
      <div class="sn-home__inner">
        <!-- ─────────── Hero ─────────── -->
        <section class="sn-home__hero">
          <h1 class="sn-home__title">
            The Foundation for<br />
            your AI-Native Design System
          </h1>

          <p class="sn-home__subtitle">{{ t.subtitle }}</p>

          <!-- 端切换胶囊（设计稿：Web / Uni） -->
          <div class="sn-home__tabs" role="tablist" :aria-label="t.tablistLabel">
            <button
              type="button"
              role="tab"
              class="sn-home__tab"
              :class="{ 'sn-home__tab--active': activeEnd === 'web' }"
              :aria-selected="activeEnd === 'web'"
              @click="activeEnd = 'web'"
            >
              Web
            </button>
            <span class="sn-home__tab-divider" aria-hidden="true">/</span>
            <button
              type="button"
              role="tab"
              class="sn-home__tab"
              :class="{ 'sn-home__tab--active': activeEnd === 'uni' }"
              :aria-selected="activeEnd === 'uni'"
              @click="activeEnd = 'uni'"
            >
              Uni
            </button>
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
        </section>

        <!-- ─────────── 场景案例：一面响应式瀑布流 ─────────── -->
        <section class="sn-home__showcase" aria-labelledby="sn-home-showcase-title">
          <header class="sn-home__showcase-head">
            <h2 id="sn-home-showcase-title" class="sn-home__showcase-title">
              {{ t.showcaseTitle }}
            </h2>
            <p class="sn-home__showcase-hint">{{ t.showcaseHint }}</p>
          </header>

          <!-- Web 端：玻璃卡场景瀑布流 -->
          <SnWaterfall v-if="activeEnd === 'web'" :min-column-width="340" :columns="4" :column-gap="16" :row-gap="16">
            <SnHomeCaseCard
              v-for="c in homeCases"
              :key="c.id"
              :size="c.size"
              :hue="caseHue(c.id)"
              :title="caseTextOf(c.id, homeLocale).title"
              :desc="caseTextOf(c.id, homeLocale).desc"
            >
              <SnHomeCaseDemo :id="c.id as HomeCaseId" />
            </SnHomeCaseCard>
          </SnWaterfall>

          <!-- uni 端：uni-templates —— 真实模板的手机模拟器瀑布流
             （窄列恢复手机长宽比；iframe 实时加载 uni-templates H5；
             二维码挂在机身下方「微信小程序」标签，悬停弹出） -->
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
  width: 100%;
  background:
    radial-gradient(1200px 480px at 16% -8%, rgb(76 110 245 / 0.16), transparent 62%),
    radial-gradient(1000px 440px at 86% -6%, rgb(168 85 247 / 0.14), transparent 64%),
    radial-gradient(900px 420px at 68% 18%, rgb(236 72 153 / 0.1), transparent 66%),
    #f7f8fb;
  color: #101828;
}
.sn-home--dark {
  --sn-home-card-shadow: 0 10px 30px rgb(2 6 16 / 0.35);
  --sn-home-card-shadow-hover: 0 18px 44px rgb(2 6 16 / 0.45);
  background:
    radial-gradient(1200px 480px at 16% -8%, rgb(64 90 255 / 0.34), transparent 62%),
    radial-gradient(1000px 440px at 86% -6%, rgb(168 85 247 / 0.3), transparent 64%),
    radial-gradient(900px 420px at 68% 18%, rgb(236 72 153 / 0.18), transparent 66%),
    #0a0f1e;
  color: #f2f5fb;
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
.sn-home__title {
  font-size: 46px;
  font-weight: 700;
  margin: 0 0 16px;
  line-height: 1.16;
  letter-spacing: -0.02em;
  color: #101828;
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

/* ── 端切换胶囊 ── */
.sn-home__tabs {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  margin-bottom: 28px;
  border: 1px solid rgb(15 23 42 / 0.12);
  border-radius: 999px;
  background: rgb(15 23 42 / 0.04);
}
.sn-home--dark .sn-home__tabs {
  border-color: rgb(255 255 255 / 0.14);
  background: rgb(255 255 255 / 0.06);
}
.sn-home__tab {
  appearance: none;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 6px 20px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  cursor: pointer;
  background: transparent;
  color: #475467;
  transition:
    background-color 0.2s,
    color 0.2s,
    border-color 0.2s;
}
.sn-home__tab:hover {
  color: #101828;
}
.sn-home__tab--active {
  background: #101828;
  border-color: #101828;
  color: #ffffff;
}
.sn-home--dark .sn-home__tab {
  color: rgb(226 232 244 / 0.62);
}
.sn-home--dark .sn-home__tab:hover {
  color: #f2f5fb;
}
.sn-home--dark .sn-home__tab--active {
  background: rgb(9 14 28 / 0.92);
  border-color: rgb(255 255 255 / 0.2);
  color: #ffffff;
}
.sn-home__tab:focus-visible {
  outline: 2px solid var(--sn-web-color-action-primary);
  outline-offset: 1px;
}
.sn-home__tab-divider {
  color: rgb(16 24 40 / 0.3);
  user-select: none;
}
.sn-home--dark .sn-home__tab-divider {
  color: rgb(226 232 244 / 0.4);
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

/* ─────────── 场景案例 ─────────── */
.sn-home__showcase {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.sn-home__showcase-head {
  display: flex;
  align-items: baseline;
  gap: 14px;
  padding: 0 4px;
  flex-wrap: wrap;
}
.sn-home__showcase-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #101828;
}
.sn-home--dark .sn-home__showcase-title {
  color: #f5f7fc;
}
.sn-home__showcase-hint {
  margin: 0;
  font-size: 13px;
  color: #667085;
}
.sn-home--dark .sn-home__showcase-hint {
  color: rgb(226 232 244 / 0.5);
}

/* ─────────── Mobile adaptations ─────────── */
@media (max-width: 960px) {
  .sn-home__inner {
    padding: 0 20px 48px;
  }
  .sn-home__hero {
    padding: 96px 0 48px;
  }
  .sn-home__title {
    font-size: 32px;
  }
  .sn-home__subtitle {
    margin: 0 auto 24px;
  }
  .sn-home__actions {
    gap: 10px;
  }
}

@media (max-width: 640px) {
  .sn-home__title {
    font-size: 26px;
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
