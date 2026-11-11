<script setup lang="ts">
/**
 * Demo: sn-calendar-view — declared-only time-column props.
 *
 * `time-filter` / `time-item-height` / `time-visible-item-count` /
 * `hide-second`: this build renders no time roller, so these props exist for
 * parity only and have no visual effect; they are passed here to show they
 * are accepted. custom-class / custom-style land on the root node.
 */
import { ref } from 'vue';
import SnCalendarView from '@snui/uni-src/components/sn-calendar-view/sn-calendar-view.vue';

const min = new Date(2024, 5, 1).getTime();
const max = new Date(2024, 5, 30).getTime();

const value = ref<number | number[] | null>(null);

/** Time-column filter hook: declared, never invoked by this build. */
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
      timeFilter / timeItemHeight / timeVisibleItemCount / hideSecond exist for parity only (no time
      roller in this build); customClass / customStyle land on the root
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
/* custom-class lands on the sn-calendar-view root, so :deep pierces the component boundary. */
.sn-demo :deep(.sn-demo__calendar) {
  border: 2rpx solid var(--sn-mp-color-border-subtle);
}
</style>
