<script setup lang="ts">
/**
 * Demo: SnChart (Web) — falling back to ECharts' native tooltip.
 *
 * `mode: 'native'` turns the DOM layer off and hands the tooltip back to
 * ECharts' canvas implementation: it inherits the theme colours, the layout
 * stays ECharts'. `trigger: 'axis'` reads better than per-point hovering when
 * several series share an axis, and `nativeOverrides` is the escape hatch
 * merged into the tooltip option.
 */
import { SnChart } from '@snui/echarts';
import type { SnChartTooltipConfig, SnEChartsOption } from '@snui/echarts';

const option: SnEChartsOption = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: { type: 'value' },
  series: [
    { type: 'line', name: 'Visits', smooth: true, data: [820, 932, 901, 934, 1290, 1330, 1320] },
    { type: 'line', name: 'Conversions', smooth: true, data: [120, 132, 101, 134, 190, 230, 210] },
  ],
};

const tooltip: SnChartTooltipConfig = {
  mode: 'native',
  trigger: 'axis',
  // Merged into the native tooltip option, for keys this package does not model.
  nativeOverrides: { axisPointer: { type: 'shadow' } },
};
</script>

<template>
  <SnChart
    :option="option"
    :tooltip="tooltip"
    :height="300"
    aria-label="Visits versus conversions"
  />
</template>
