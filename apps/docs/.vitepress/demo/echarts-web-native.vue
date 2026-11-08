<script setup lang="ts">
/**
 * Demo: SnChart (Web) — 回退到 ECharts 原生 tooltip。
 *
 * `mode: 'native'` 关掉自绘 DOM 层，交回 ECharts 的画布 tooltip：只继承主题
 * 配色，排版归 ECharts。需要突出多个系列同轴对比时，`trigger: 'axis'` 比逐点
 * 悬浮更好用；`nativeOverrides` 是合并进 tooltip option 的逃生口。
 */
import { SnChart } from '@snui/echarts';
import type { SnChartTooltipConfig, SnEChartsOption } from '@snui/echarts';

const option: SnEChartsOption = {
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
  yAxis: { type: 'value' },
  series: [
    { type: 'line', name: '访问量', smooth: true, data: [820, 932, 901, 934, 1290, 1330, 1320] },
    { type: 'line', name: '转化数', smooth: true, data: [120, 132, 101, 134, 190, 230, 210] },
  ],
};

const tooltip: SnChartTooltipConfig = {
  mode: 'native',
  trigger: 'axis',
  // 合并进原生 tooltip option，用于本包没有建模的键。
  nativeOverrides: { axisPointer: { type: 'shadow' } },
};
</script>

<template>
  <SnChart :option="option" :tooltip="tooltip" :height="300" aria-label="访问量与转化数对比" />
</template>
