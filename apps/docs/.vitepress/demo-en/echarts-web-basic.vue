<script setup lang="ts">
/**
 * Demo: SnChart (Web) — basic usage.
 *
 * Only `option` is passed: theme colours, legend placement, grid padding and
 * the tooltip are all derived by the package; the two series (line + bar)
 * produce the legend automatically.
 */
import { SnChart } from '@snui/echarts';
import type { SnEChartsOption } from '@snui/echarts';

const option: SnEChartsOption = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: { type: 'value' },
  series: [
    { type: 'line', name: 'Visits', smooth: true, data: [820, 932, 901, 934, 1290, 1330, 1320] },
    { type: 'bar', name: 'Orders', data: [220, 282, 291, 334, 390, 330, 320] },
  ],
};
</script>

<template>
  <SnChart :option="option" :height="280" aria-label="Weekly visits and orders" />
</template>
