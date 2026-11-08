<script setup lang="ts">
/**
 * HomeChartCard — 首页图表卡片（heroui 式画廊单元）。
 *
 * 与 `/echarts/<category>` 页的 `ChartCase` 共用**同一份注册表**
 * （`.vitepress/echarts/registry.ts`）：同一 `buildCaseOption` 管线、同一套
 * 主题取色（跟随 UI 库 token 主色）。区别只在呈现 —— 首页卡不带配置面板，
 * 只保留标题 / 一句话说明 / 活图表 / 文档链接，让一屏能放下六个类型。
 *
 * 主题模式走 `auto`：跟随站点 `.dark`，暗黑下自动切 ECharts 暗色。
 */
import { computed } from 'vue';
import { useData } from 'vitepress';
import { ArrowUpRight } from 'lucide-vue-next';
import { SnChart } from '@snui/echarts';
import {
  buildCaseOption,
  createDefaultConfig,
  getChartCase,
  resolveCasePalette,
} from '../echarts/registry';

interface Props {
  /** Chart case id in the registry (`line-basic`, `pie-ring`, …). */
  id: string;
}
const props = defineProps<Props>();

const def = getChartCase(props.id);
const cfg = createDefaultConfig(def);

const { lang } = useData();
const isEn = computed(() => lang.value === 'en-US');
const title = computed(() => (isEn.value ? def.title.en : def.title.zh));
const blurb = computed(() => (isEn.value ? def.blurb.en : def.blurb.zh));
const labels = computed(() => (isEn.value ? def.labels.en : def.labels.zh));

const option = computed(() => buildCaseOption(def, cfg, labels.value));
const theme = computed(() => {
  const palette = resolveCasePalette(def, cfg);
  return palette ? { palette } : {};
});

/** Docs page for this chart type (`/echarts/<category>`). */
const docsHref = computed(() => `${isEn.value ? '/en' : ''}/echarts/${def.category}`);
</script>

<template>
  <a class="sn-home-chart" :href="docsHref" :aria-label="title">
    <header class="sn-home-chart__head">
      <div>
        <h3 class="sn-home-chart__title">{{ title }}</h3>
        <p class="sn-home-chart__blurb">{{ blurb }}</p>
      </div>
      <span class="sn-home-chart__go" aria-hidden="true">
        <ArrowUpRight :size="14" />
      </span>
    </header>

    <ClientOnly>
      <SnChart
        :option="option"
        :theme="theme"
        theme-mode="auto"
        :height="220"
        :not-merge="true"
        :aria-label="title"
      />
      <template #fallback>
        <div class="sn-home-chart__loading" />
      </template>
    </ClientOnly>
  </a>
</template>

<style scoped>
.sn-home-chart {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px 16px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;
}
.sn-home-chart:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 10px 30px -14px rgba(15, 23, 42, 0.18);
  transform: translateY(-2px);
}

.sn-home-chart__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}
.sn-home-chart__title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.sn-home-chart__blurb {
  margin: 3px 0 0;
  font-size: 12px;
  line-height: 1.55;
  color: var(--vp-c-text-2);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.sn-home-chart__go {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex: 0 0 auto;
  border-radius: 50%;
  color: var(--vp-c-text-3);
  transition:
    color 0.15s,
    background 0.15s;
}
.sn-home-chart:hover .sn-home-chart__go {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.sn-home-chart__loading {
  height: 220px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}
</style>
