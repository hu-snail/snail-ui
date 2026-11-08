<script setup lang="ts">
/**
 * Demo: SnChart (Web) — 布局预设。
 *
 * 布局预设决定「图表周围那圈东西」：grid 内边距、图例位置、标题、工具箱、
 * dataZoom、坐标轴开关。切换预设只换一个 prop，`option` 不用动。
 */
import { ref } from 'vue';
import { SnButton } from '@snui/vue-web';
import { SnChart } from '@snui/echarts';
import type { SnChartLayoutPreset, SnEChartsOption } from '@snui/echarts';

const presets: SnChartLayoutPreset[] = ['default', 'compact', 'spacious', 'minimal'];
const current = ref<SnChartLayoutPreset>('default');

const option: SnEChartsOption = {
  title: { text: '季度营收', subtext: '单位：万元' },
  xAxis: { type: 'category', data: ['Q1', 'Q2', 'Q3', 'Q4'] },
  yAxis: { type: 'value' },
  series: [
    { type: 'line', name: '直营', smooth: true, data: [120, 180, 150, 240] },
    { type: 'bar', name: '渠道', data: [80, 120, 140, 160] },
  ],
};
</script>

<template>
  <div class="echarts-layout-demo">
    <div class="echarts-layout-demo__bar">
      <SnButton
        v-for="preset in presets"
        :key="preset"
        size="small"
        :type="current === preset ? 'primary' : 'default'"
        @click="current = preset"
      >
        {{ preset }}
      </SnButton>
    </div>
    <SnChart :option="option" :layout="current" :height="300" aria-label="季度营收趋势" />
  </div>
</template>

<style scoped>
.echarts-layout-demo__bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}
</style>
