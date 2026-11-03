<script setup lang="ts">
/**
 * Demo: SnChart (Web) — the `#tooltip` slot takes over the content.
 *
 * The slot receives `model` (heading / series rows / extra rows / switches)
 * and `items`; you can take the data and drop the default layout entirely.
 * Positioning, show/hide transitions and pointer following stay with the
 * component, so custom content never deals with coordinates.
 */
import { SnChart } from '@snui/echarts';
import type { SnEChartsOption } from '@snui/echarts';

const option: SnEChartsOption = {
  xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  yAxis: { type: 'value' },
  series: [
    { type: 'line', name: 'Desktop', smooth: true, data: [320, 332, 301, 334, 390] },
    { type: 'line', name: 'Mobile', smooth: true, data: [220, 182, 191, 234, 290] },
  ],
};
</script>

<template>
  <SnChart :option="option" :height="300" aria-label="Traffic by platform">
    <template #tooltip="{ model }">
      <div class="echarts-tip">
        <div class="echarts-tip__head">{{ model.label || 'All channels' }}</div>
        <div v-for="item in model.items" :key="item.seriesIndex" class="echarts-tip__row">
          <i class="echarts-tip__dot" :style="{ background: item.color }" />
          <span class="echarts-tip__name">{{ item.seriesName }}</span>
          <b class="echarts-tip__value">{{ item.value }}</b>
        </div>
        <div class="echarts-tip__foot">↑ total visits that day</div>
      </div>
    </template>
  </SnChart>
</template>

<style scoped>
.echarts-tip {
  min-width: 140px;
  font-size: 12px;
}
.echarts-tip__head {
  margin-bottom: 6px;
  font-weight: 600;
}
.echarts-tip__row {
  display: flex;
  align-items: center;
  gap: 6px;
  line-height: 1.9;
}
.echarts-tip__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex: none;
}
.echarts-tip__name {
  flex: 1;
}
.echarts-tip__foot {
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-3);
}
</style>
