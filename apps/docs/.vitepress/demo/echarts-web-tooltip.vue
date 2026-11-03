<script setup lang="ts">
/**
 * Demo: SnChart (Web) — 自定义 tooltip（配置驱动）。
 *
 * 默认的 tooltip 是本包自绘的 DOM 层（Token 配色、跟随宿主主题、可放富文本），
 * 不是 ECharts 的画布 tooltip。这里只配置内容开关。
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
        { value: 1048, name: '搜索引擎' },
        { value: 735, name: '直接访问' },
        { value: 580, name: '邮件营销' },
        { value: 484, name: '联盟广告' },
        { value: 300, name: '视频广告' },
      ],
    },
  ],
};

const tooltip: SnChartTooltipConfig = {
  showPercent: true,
  precision: 1,
  footer: '数据来源：mock 数据集',
  extraRows: [{ label: '统计周期', value: '近 30 天' }],
};
</script>

<template>
  <SnChart :option="option" :tooltip="tooltip" :height="320" aria-label="流量来源占比" />
</template>
