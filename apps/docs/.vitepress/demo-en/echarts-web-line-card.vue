<script setup lang="ts">
/**
 * Demo: SnChart (Web) — line metric card (1:1 with the design).
 *
 * The card is split the way the design is: a header readout (label / figure /
 * delta pill) with a granularity segmented control at top right (weekly /
 * monthly / yearly — switching really swaps the dataset), then a `$` value
 * axis, a month axis, a smooth line and a gradient fill via `areaStyle.color`,
 * with a dashed axis pointer on hover.
 *
 * The gradient (a runtime object) and the axis-label formatter (a function)
 * cannot live in the registry's copyable pure-JSON cases, hence a full demo.
 */
import { computed, ref } from 'vue';
import { graphic } from 'echarts';
import { SnChart } from '@snui/echarts';
import type { SnEChartsOption } from '@snui/echarts';

type Period = 'Weekly' | 'Monthly' | 'Yearly';

const LIME = '#a3e635';

/** One granularity: axis categories + values + the header readout. */
interface PeriodDataset {
  readonly categories: readonly string[];
  readonly data: readonly number[];
  readonly total: string;
  readonly delta: string;
}

const datasets: Record<Period, PeriodDataset> = {
  Weekly: {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [420, 510, 380, 640, 720, 810, 800],
    total: '$4,280',
    delta: '+3.1%',
  },
  Monthly: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [1400, 1750, 2400, 2150, 3200, 2900, 2550, 3400, 4600, 4250, 3550, 5400],
    total: '$18,240',
    delta: '+9.4%',
  },
  Yearly: {
    categories: ['2019', '2018', '2017', '2016', '2015'],
    data: [3600, 3100, 2750, 2300, 1980],
    total: '$21,600',
    delta: '+12.8%',
  },
};

const periods: readonly Period[] = ['Weekly', 'Monthly', 'Yearly'];
const period = ref<Period>('Monthly');
const active = computed(() => datasets[period.value]);

/** `$0 / $2K / $4K / $6K` — the abbreviated ticks the design uses. */
function currencyAxisLabel(value: number): string {
  return value === 0 ? '$0' : `$${value / 1000}K`;
}

const option = computed<SnEChartsOption>(() => ({
  grid: { left: 8, right: 12, top: 18, bottom: 4, containLabel: true },
  xAxis: {
    type: 'category',
    data: [...active.value.categories],
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#a3a3a3', fontSize: 11 },
  },
  yAxis: {
    type: 'value',
    max: 6000,
    interval: 2000,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#a3a3a3', fontSize: 11, formatter: currencyAxisLabel },
    splitLine: { lineStyle: { color: '#f2f2f2' } },
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'line', lineStyle: { type: 'dashed', color: '#a3a3a3' } },
  },
  series: [
    {
      type: 'line',
      name: 'Revenue',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      showSymbol: false,
      lineStyle: { width: 2, color: LIME },
      itemStyle: { color: LIME },
      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(163, 230, 53, 0.38)' },
          { offset: 1, color: 'rgba(163, 230, 53, 0.02)' },
        ]),
      },
      data: [...active.value.data],
    },
  ],
}));
</script>

<template>
  <div class="echarts-line-card">
    <div class="echarts-line-card__head">
      <div class="echarts-line-card__metric">
        <span class="echarts-line-card__label">Revenue</span>
        <span class="echarts-line-card__value">{{ active.total }}</span>
        <span class="echarts-line-card__delta">{{ active.delta }}</span>
      </div>
      <div class="echarts-line-card__periods" role="tablist" aria-label="Granularity">
        <button
          v-for="item in periods"
          :key="item"
          type="button"
          role="tab"
          class="echarts-line-card__period"
          :class="{ 'is-active': period === item }"
          :aria-selected="period === item"
          @click="period = item"
        >
          {{ item }}
        </button>
      </div>
    </div>
    <SnChart :option="option" :height="248" :not-merge="true" aria-label="Revenue trend" />
  </div>
</template>

<style scoped>
.echarts-line-card {
  padding: 20px 20px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg);
}

.echarts-line-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
}

.echarts-line-card__metric {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  column-gap: 8px;
}

.echarts-line-card__label {
  flex: 0 0 100%;
  font-size: 13px;
  color: var(--vp-c-text-3);
}

.echarts-line-card__value {
  font-size: 26px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.echarts-line-card__delta {
  padding: 1px 7px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #3f6212;
  background: #ecfccb;
}

.dark .echarts-line-card__delta {
  color: #ecfccb;
  background: rgba(163, 230, 53, 0.22);
}

.echarts-line-card__periods {
  display: inline-flex;
  flex: none;
  gap: 2px;
  padding: 3px;
  border-radius: 9px;
  background: var(--vp-c-bg-soft);
}

.echarts-line-card__period {
  padding: 3px 12px;
  border: none;
  border-radius: 7px;
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  background: transparent;
  cursor: pointer;
}

.echarts-line-card__period.is-active {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}
</style>
