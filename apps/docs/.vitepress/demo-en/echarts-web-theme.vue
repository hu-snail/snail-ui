<script setup lang="ts">
/**
 * Demo: SnChart (Web) — theme colours.
 *
 * `theme` only states the intent (brand colour / palette / font size); the
 * mapping onto tokens and the ECharts theme object is the package's job. The
 * default `colorSource: 'tokens'` keeps colours as `var(--sn-web-*)`
 * references, so flipping dark mode or a Style Pack repaints the canvas
 * without rebuilding the instance.
 */
import { SnChart } from '@snui/echarts';
import type { SnChartThemeConfig, SnEChartsOption } from '@snui/echarts';

const option: SnEChartsOption = {
  xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May'] },
  yAxis: { type: 'value' },
  series: [
    { type: 'bar', name: 'New', stack: 'total', data: [320, 332, 301, 334, 390] },
    { type: 'bar', name: 'Renewal', stack: 'total', data: [120, 132, 101, 134, 190] },
    { type: 'line', name: 'Churn', smooth: true, data: [30, 42, 31, 34, 45] },
  ],
};

const theme: SnChartThemeConfig = {
  colorPrimary: '#7c3aed',
  palette: ['#7c3aed', '#06b6d4', '#f59e0b'],
  fontSize: 13,
  // Escape hatch: any key merged into the ECharts theme, recursively, with
  // untouched siblings preserved.
  themeOverrides: { legend: { textStyle: { fontWeight: 600 } } },
};
</script>

<template>
  <SnChart
    :option="option"
    :theme="theme"
    :height="280"
    aria-label="Stacked bars under a brand-coloured theme"
  />
</template>
