<script setup lang="ts">
/**
 * Demo: SnChart (Web) — custom tooltip (config-driven).
 *
 * The default tooltip is a DOM layer the package draws itself — token-styled,
 * following the host theme, happy with rich content — not ECharts' canvas
 * tooltip. This demo only configures the content switches.
 */
import { SnChart } from '@snui/echarts';
import type { SnChartTooltipConfig, SnEChartsOption } from '@snui/echarts';

const option: SnEChartsOption = {
  series: [
    {
      type: 'pie',
      radius: ['45%', '70%'],
      itemStyle: { borderWidth: 2 },
      data: [
        { value: 1048, name: 'Search' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Affiliate' },
        { value: 300, name: 'Video' },
      ],
    },
  ],
};

const tooltip: SnChartTooltipConfig = {
  showPercent: true,
  precision: 1,
  footer: 'Source: mock dataset',
  extraRows: [{ label: 'Period', value: 'Last 30 days' }],
};
</script>

<template>
  <SnChart :option="option" :tooltip="tooltip" :height="320" aria-label="Traffic source share" />
</template>
