<script setup lang="ts">
/**
 * Demo: SnChart (Web) — layout presets.
 *
 * A preset decides everything *around* the plot: grid padding, legend
 * placement, title, toolbox, dataZoom and the axis switches. Switching a
 * preset is one prop; `option` stays untouched.
 */
import { ref } from 'vue';
import { SnButton } from '@snui/vue-web';
import { SnChart } from '@snui/echarts';
import type { SnChartLayoutPreset, SnEChartsOption } from '@snui/echarts';

const presets: SnChartLayoutPreset[] = ['default', 'compact', 'spacious', 'minimal'];
const current = ref<SnChartLayoutPreset>('default');

const option: SnEChartsOption = {
  title: { text: 'Quarterly revenue', subtext: 'in thousands' },
  xAxis: { type: 'category', data: ['Q1', 'Q2', 'Q3', 'Q4'] },
  yAxis: { type: 'value' },
  series: [
    { type: 'line', name: 'Direct', smooth: true, data: [120, 180, 150, 240] },
    { type: 'bar', name: 'Channel', data: [80, 120, 140, 160] },
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
    <SnChart
      :option="option"
      :layout="current"
      :height="300"
      aria-label="Quarterly revenue trend"
    />
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
