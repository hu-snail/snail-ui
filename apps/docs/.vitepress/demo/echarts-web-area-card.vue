<script setup lang="ts">
/**
 * Demo: SnChart (Web) — 面积图卡（1:1 还原设计稿）。
 *
 * 结构照设计稿拆：卡片头部是「标签 / 大字读数 / 涨幅胶囊」，右上角是年份下拉；
 * 图表区是 3 条堆叠面积（各自系列色的线性渐变填充）；底部三个统计块与图例
 * 同源 —— 色点 + 名称 + 合计。
 *
 * 合计不是写死的：`totals` 从 series 数据现算，头部大字再对合计求和，所以
 * 换年份时三处数字始终自洽（写死数字换数据集就会对不上）。
 */
import { computed, ref } from 'vue';
import { graphic } from 'echarts';
import { SnSelect } from '@snui/vue-web';
import { SnChart } from '@snui/echarts';
import type { SnEChartsOption } from '@snui/echarts';

type Year = '去年' | '今年';

interface Channel {
  readonly name: string;
  readonly color: string;
  readonly data: readonly number[];
}

const MONTHS = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月',
];

/** 每个年份一套渠道数据（颜色与渠道名共享，只有数值换）。 */
const years: Record<Year, readonly Channel[]> = {
  今年: [
    {
      name: '有机',
      color: '#84cc16',
      data: [4400, 3600, 3800, 4000, 4200, 4400, 4500, 4600, 4300, 4100, 4400, 4200],
    },
    {
      name: '推荐',
      color: '#3b82f6',
      data: [2100, 2150, 2200, 2250, 2300, 2350, 2100, 2050, 2000, 2050, 2100, 2250],
    },
    {
      name: '付费',
      color: '#a855f7',
      data: [1500, 1520, 1550, 1500, 1480, 1500, 1520, 1550, 1560, 1540, 1530, 1550],
    },
  ],
  去年: [
    {
      name: '有机',
      color: '#84cc16',
      data: [4150, 3620, 3720, 3830, 3930, 4040, 4150, 3930, 3830, 3720, 3620, 3840],
    },
    {
      name: '推荐',
      color: '#3b82f6',
      data: [1910, 1970, 2020, 2070, 2130, 2180, 2020, 1970, 1910, 1860, 1970, 1810],
    },
    {
      name: '付费',
      color: '#a855f7',
      data: [1380, 1440, 1470, 1490, 1510, 1490, 1470, 1440, 1400, 1380, 1330, 1540],
    },
  ],
};

const yearOptions = [
  { label: '去年', value: '去年' },
  { label: '今年', value: '今年' },
];

const year = ref<Year>('今年');
const channels = computed(() => years[year.value]);

/** 千分位整数（`50500` → `50,500`），与设计稿的读数格式一致。 */
function formatInt(value: number): string {
  return value.toLocaleString('en-US');
}

/** 每个渠道的合计 —— 由 series 数据现算，保证与图表自洽。 */
const totals = computed(() =>
  channels.value.map((item) => item.data.reduce((sum, v) => sum + v, 0)),
);

/** 头部大字 = 三个渠道合计之和。 */
const grandTotal = computed(() => formatInt(totals.value.reduce((sum, v) => sum + v, 0)));

/** 同比：与另一年份的合计比。 */
const delta = computed(() => {
  const other: Year = year.value === '今年' ? '去年' : '今年';
  const current = totals.value.reduce((sum, v) => sum + v, 0);
  const previous = years[other].reduce(
    (sum, item) => sum + item.data.reduce((s, v) => s + v, 0),
    0,
  );
  const ratio = ((current - previous) / previous) * 100;
  return `${ratio >= 0 ? '+' : ''}${ratio.toFixed(1)}%`;
});

/** hex → rgba，做半透明渐变填充用。 */
function rgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** `0 / 2K / 4K / 6K / 8K` —— 与设计稿的刻度缩写一致。 */
function visitAxisLabel(value: number): string {
  return value === 0 ? '0' : `${value / 1000}K`;
}

const option = computed<SnEChartsOption>(() => ({
  grid: { left: 8, right: 12, top: 18, bottom: 4, containLabel: true },
  xAxis: {
    type: 'category',
    data: [...MONTHS],
    boundaryGap: false,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#a3a3a3', fontSize: 11 },
  },
  yAxis: {
    type: 'value',
    max: 8000,
    interval: 2000,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#a3a3a3', fontSize: 11, formatter: visitAxisLabel },
    splitLine: { lineStyle: { color: '#f2f2f2' } },
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'line', lineStyle: { type: 'dashed', color: '#a3a3a3' } },
  },
  series: channels.value.map((item) => ({
    type: 'line',
    name: item.name,
    stack: 'total',
    smooth: true,
    symbol: 'circle',
    showSymbol: false,
    lineStyle: { width: 1.5, color: item.color },
    itemStyle: { color: item.color },
    areaStyle: {
      color: new graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: rgba(item.color, 0.45) },
        { offset: 1, color: rgba(item.color, 0.08) },
      ]),
    },
    data: [...item.data],
  })),
}));
</script>

<template>
  <div class="echarts-area-card">
    <div class="echarts-area-card__head">
      <div class="echarts-area-card__metric">
        <span class="echarts-area-card__label">访客</span>
        <span class="echarts-area-card__value">{{ grandTotal }}</span>
        <span class="echarts-area-card__delta">{{ delta }}</span>
      </div>
      <div class="echarts-area-card__range">
        <SnSelect v-model="year" :options="yearOptions" size="small" aria-label="统计年份" />
      </div>
    </div>
    <SnChart :option="option" :height="248" :not-merge="true" aria-label="访客构成趋势" />
    <div class="echarts-area-card__stats">
      <div v-for="(item, index) in channels" :key="item.name" class="echarts-area-card__stat">
        <span class="echarts-area-card__dot" :style="{ background: item.color }" />
        <span class="echarts-area-card__name">{{ item.name }}</span>
        <span class="echarts-area-card__total">{{ formatInt(totals[index] ?? 0) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.echarts-area-card {
  padding: 20px 20px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg);
}

.echarts-area-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
}

.echarts-area-card__metric {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  column-gap: 8px;
}

.echarts-area-card__label {
  flex: 0 0 100%;
  font-size: 13px;
  color: var(--vp-c-text-3);
}

.echarts-area-card__value {
  font-size: 26px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.echarts-area-card__delta {
  padding: 1px 7px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #3f6212;
  background: #ecfccb;
}

.dark .echarts-area-card__delta {
  color: #ecfccb;
  background: rgba(163, 230, 53, 0.22);
}

.echarts-area-card__range {
  flex: none;
  width: 104px;
}

.echarts-area-card__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.echarts-area-card__stat {
  display: flex;
  flex: 1 1 120px;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}

.echarts-area-card__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.echarts-area-card__name {
  font-size: 12.5px;
  color: var(--vp-c-text-3);
}

.echarts-area-card__total {
  margin-left: auto;
  font-size: 14px;
  font-weight: 600;
}
</style>
