<script setup lang="ts">
/**
 * Demo: SnChart (Web) — area chart card (1:1 with the design).
 *
 * The card is split the way the design is: a header readout (label / figure /
 * delta pill) with a year select at top right, three stacked areas (each with a
 * gradient fill in its own series colour) and three stat tiles below that
 * mirror the legend — colour dot + name + total.
 *
 * The totals are *derived* from the series data (and the header figure is the
 * sum of those totals), so switching the year keeps all three places
 * consistent; hard-coded numbers would drift the moment the data changes.
 */
import { computed, ref } from 'vue';
import { graphic } from 'echarts';
import { SnSelect } from '@snui/vue-web';
import { SnChart } from '@snui/echarts';
import type { SnEChartsOption } from '@snui/echarts';

type Year = 'Last year' | 'This year';

interface Channel {
  readonly name: string;
  readonly color: string;
  readonly data: readonly number[];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** One channel dataset per year (colours and names are shared, only values change). */
const years: Record<Year, readonly Channel[]> = {
  'This year': [
    {
      name: 'Organic',
      color: '#84cc16',
      data: [4400, 3600, 3800, 4000, 4200, 4400, 4500, 4600, 4300, 4100, 4400, 4200],
    },
    {
      name: 'Referral',
      color: '#3b82f6',
      data: [2100, 2150, 2200, 2250, 2300, 2350, 2100, 2050, 2000, 2050, 2100, 2250],
    },
    {
      name: 'Paid',
      color: '#a855f7',
      data: [1500, 1520, 1550, 1500, 1480, 1500, 1520, 1550, 1560, 1540, 1530, 1550],
    },
  ],
  'Last year': [
    {
      name: 'Organic',
      color: '#84cc16',
      data: [3900, 3400, 3500, 3600, 3700, 3800, 3900, 3700, 3600, 3500, 3400, 3600],
    },
    {
      name: 'Referral',
      color: '#3b82f6',
      data: [1800, 1850, 1900, 1950, 2000, 2050, 1900, 1850, 1800, 1750, 1850, 1700],
    },
    {
      name: 'Paid',
      color: '#a855f7',
      data: [1300, 1350, 1380, 1400, 1420, 1400, 1380, 1350, 1320, 1300, 1250, 1450],
    },
  ],
};

const yearOptions = [
  { label: 'Last year', value: 'Last year' },
  { label: 'This year', value: 'This year' },
];

const year = ref<Year>('This year');
const channels = computed(() => years[year.value]);

/** Thousands-separated integer (`50500` → `50,500`), matching the design's figures. */
function formatInt(value: number): string {
  return value.toLocaleString('en-US');
}

/** Per-channel totals — derived from the series data so they cannot drift. */
const totals = computed(() => channels.value.map((item) => item.data.reduce((sum, v) => sum + v, 0)));

/** The header figure is the sum of the channel totals. */
const grandTotal = computed(() => formatInt(totals.value.reduce((sum, v) => sum + v, 0)));

/** Year-over-year change against the other dataset. */
const delta = computed(() => {
  const other: Year = year.value === 'This year' ? 'Last year' : 'This year';
  const current = totals.value.reduce((sum, v) => sum + v, 0);
  const previous = years[other].reduce((sum, item) => sum + item.data.reduce((s, v) => s + v, 0), 0);
  const ratio = ((current - previous) / previous) * 100;
  return `${ratio >= 0 ? '+' : ''}${ratio.toFixed(1)}%`;
});

/** hex → rgba, for the translucent gradient fills. */
function rgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** `0 / 2K / 4K / 6K / 8K` — the abbreviated ticks the design uses. */
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
        <span class="echarts-area-card__label">Visitors</span>
        <span class="echarts-area-card__value">{{ grandTotal }}</span>
        <span class="echarts-area-card__delta">{{ delta }}</span>
      </div>
      <div class="echarts-area-card__range">
        <SnSelect v-model="year" :options="yearOptions" size="small" aria-label="Reporting year" />
      </div>
    </div>
    <SnChart :option="option" :height="248" :not-merge="true" aria-label="Visitor composition trend" />
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
  width: 116px;
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
