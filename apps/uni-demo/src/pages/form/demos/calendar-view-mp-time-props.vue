<script setup lang="ts">
/**
 * Demo: sn-calendar-view — 时间列声明参数。
 *
 * `time-filter` / `time-item-height` / `time-visible-item-count` / `hide-second`：
 * 本构建面板内没有时间滚筒，这些 prop 只按参考实现声明，不会产生渲染效果，
 * 这里一并传入以证明它们不会报错；custom-class / custom-style 落在根节点上。
 */
import { ref } from 'vue';
import SnCalendarView from '@snui/uni-src/components/sn-calendar-view/sn-calendar-view.vue';

const min = new Date(2024, 5, 1).getTime();
const max = new Date(2024, 5, 30).getTime();

const value = ref<number | number[] | null>(null);

/** 时间列过滤钩子：声明在案，本构建不会调用。 */
function timeFilter(type: 'hour' | 'minute' | 'second', values: number[]): number[] {
  void type;
  return values;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnCalendarView
      v-model="value"
      :min-date="min"
      :max-date="max"
      :time-filter="timeFilter"
      :time-item-height="40"
      :time-visible-item-count="5"
      hide-second
      :panel-height="200"
      custom-class="sn-demo__calendar"
      custom-style="padding: 8rpx; border-radius: var(--sn-mp-radius-md); background-color: var(--sn-mp-color-background-soft);"
    />
    <text class="sn-demo__meta">
      timeFilter / timeItemHeight / timeVisibleItemCount / hideSecond
      只做声明对齐（面板内无时间滚筒）；customClass / customStyle 落在根节点
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: stretch;
  width: 100%;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* custom-class 落在 sn-calendar-view 根节点上，需要 :deep 穿透组件边界。 */
.sn-demo :deep(.sn-demo__calendar) {
  border: 2rpx solid var(--sn-mp-color-border-subtle);
}
</style>
