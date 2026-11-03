<script setup lang="ts">
/**
 * Demo: SnChart (Web) — 主题色配置。
 *
 * `theme` 只描述意图（品牌色 / 调色板 / 字号），Token 与 ECharts theme 的映射
 * 由包完成。默认 `colorSource: 'tokens'`，颜色是 `var(--sn-web-*)` 引用，
 * 所以切换暗色或风格包时画布会跟着变，不需要重建实例。
 */
import { SnChart } from '@snui/echarts';
import type { SnChartThemeConfig, SnEChartsOption } from '@snui/echarts';

const option: SnEChartsOption = {
  xAxis: { type: 'category', data: ['一月', '二月', '三月', '四月', '五月'] },
  yAxis: { type: 'value' },
  series: [
    { type: 'bar', name: '新增', stack: 'total', data: [320, 332, 301, 334, 390] },
    { type: 'bar', name: '续费', stack: 'total', data: [120, 132, 101, 134, 190] },
    { type: 'line', name: '流失', smooth: true, data: [30, 42, 31, 34, 45] },
  ],
};

const theme: SnChartThemeConfig = {
  colorPrimary: '#7c3aed',
  palette: ['#7c3aed', '#06b6d4', '#f59e0b'],
  fontSize: 13,
  // 逃生口：合并进 ECharts theme 的任意键，递归合并、缺省键保留。
  themeOverrides: { legend: { textStyle: { fontWeight: 600 } } },
};
</script>

<template>
  <SnChart :option="option" :theme="theme" :height="280" aria-label="品牌色主题下的堆叠柱状图" />
</template>
