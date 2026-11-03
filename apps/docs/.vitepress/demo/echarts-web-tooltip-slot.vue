<script setup lang="ts">
/**
 * Demo: SnChart (Web) — `#tooltip` 插槽完全接管内容。
 *
 * 插槽收到 `model`（标题 / 系列行 / 额外行 / 开关）与 `items` 两个 prop，
 * 你可以只用它的数据、完全丢掉默认排版。定位、显隐动画、跟随指针仍由组件
 * 负责，所以自绘内容不需要关心坐标。
 */
import { SnChart } from '@snui/echarts';
import type { SnEChartsOption } from '@snui/echarts';

const option: SnEChartsOption = {
  xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五'] },
  yAxis: { type: 'value' },
  series: [
    { type: 'line', name: 'PC 端', smooth: true, data: [320, 332, 301, 334, 390] },
    { type: 'line', name: '移动端', smooth: true, data: [220, 182, 191, 234, 290] },
  ],
};
</script>

<template>
  <SnChart :option="option" :height="300" aria-label="多端访问趋势">
    <template #tooltip="{ model }">
      <div class="echarts-tip">
        <div class="echarts-tip__head">{{ model.label || '全部渠道' }}</div>
        <div v-for="item in model.items" :key="item.seriesIndex" class="echarts-tip__row">
          <i class="echarts-tip__dot" :style="{ background: item.color }" />
          <span class="echarts-tip__name">{{ item.seriesName }}</span>
          <b class="echarts-tip__value">{{ item.value }}</b>
        </div>
        <div class="echarts-tip__foot">↑ 该日总访问量</div>
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
