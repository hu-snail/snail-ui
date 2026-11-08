<script setup lang="ts">
/**
 * Demo: SnChart (Web) — 一体化图标配置。
 *
 * 一个 `icons` 对象覆盖图例 / 系列符号 / 工具箱 / 标题四类图标位；已经是
 * `path://` / `image://` / URL 的字符串原样透传。只填空位，`option` 里显式
 * 写过的图标仍然优先。
 *
 * 内置字形：bar / column / line / area / pie / doughnut / scatter / radar /
 * gauge / funnel / tree / map / heatmap / sankey / trend / save / table …
 */
import { SnChart } from '@snui/echarts';
import type { SnChartIconsConfig, SnEChartsOption } from '@snui/echarts';

const option: SnEChartsOption = {
  title: { text: '渠道对比' },
  toolbox: { feature: { saveAsImage: {}, dataView: {} } },
  xAxis: { type: 'category', data: ['一月', '二月', '三月', '四月'] },
  yAxis: { type: 'value' },
  series: [
    { type: 'line', name: '趋势', smooth: true, data: [120, 160, 140, 200] },
    { type: 'bar', name: '对比', data: [60, 90, 70, 120] },
  ],
};

const icons: SnChartIconsConfig = {
  // 图例标记统一用「趋势」字形。
  legend: 'trend',
  // 按系列类型自动上图标。
  seriesType: { line: 'trend', bar: 'column' },
  // 工具箱按钮图标。
  toolbox: { saveAsImage: 'save', dataView: 'table' },
};
</script>

<template>
  <SnChart :option="option" :icons="icons" :height="300" aria-label="带统一图标配置的渠道对比图" />
</template>
