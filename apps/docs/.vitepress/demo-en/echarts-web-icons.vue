<script setup lang="ts">
/**
 * Demo: SnChart (Web) — one-stop icon configuration.
 *
 * A single `icons` object covers every icon slot a chart has — legend, series
 * symbol, toolbox and title. Strings that already are `path://` / `image://` /
 * a URL pass through untouched, and only *unset* slots are filled: an icon the
 * caller wrote into `option` still wins.
 *
 * Built-in glyphs: bar / column / line / area / pie / doughnut / scatter /
 * radar / gauge / funnel / tree / map / heatmap / sankey / trend / save /
 * table …
 */
import { SnChart } from '@snui/echarts';
import type { SnChartIconsConfig, SnEChartsOption } from '@snui/echarts';

const option: SnEChartsOption = {
  title: { text: 'Channel comparison' },
  toolbox: { feature: { saveAsImage: {}, dataView: {} } },
  xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr'] },
  yAxis: { type: 'value' },
  series: [
    { type: 'line', name: 'Trend', smooth: true, data: [120, 160, 140, 200] },
    { type: 'bar', name: 'Comparison', data: [60, 90, 70, 120] },
  ],
};

const icons: SnChartIconsConfig = {
  // One glyph for every legend marker.
  legend: 'trend',
  // Per-series-type glyphs, applied automatically.
  seriesType: { line: 'trend', bar: 'column' },
  // Toolbox feature icons.
  toolbox: { saveAsImage: 'save', dataView: 'table' },
};
</script>

<template>
  <SnChart
    :option="option"
    :icons="icons"
    :height="300"
    aria-label="Channel comparison with unified icons"
  />
</template>
