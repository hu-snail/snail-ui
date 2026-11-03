<script setup lang="ts">
/**
 * Demo: SnChart (Web) — 基础用法。
 *
 * 只传 `option`：主题色、图例位置、grid 内边距、tooltip 全部由包自动派生，
 * 折线 + 柱状两个系列自动生成图例。
 */
import { SnChart } from '@snui/echarts';
import type { SnEChartsOption } from '@snui/echarts';

const option: SnEChartsOption = {
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  },
  yAxis: { type: 'value' },
  series: [
    { type: 'line', name: '访问量', smooth: true, data: [820, 932, 901, 934, 1290, 1330, 1320] },
    { type: 'bar', name: '下单量', data: [220, 282, 291, 334, 390, 330, 320] },
  ],
};
</script>

<template>
  <SnChart :option="option" :height="280" aria-label="周访问量与下单量趋势" />
</template>
