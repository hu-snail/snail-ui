<script setup lang="ts">
/**
 * Demo: sn-calendar — 区间约束（maxRange / allowSameDay / defaultTime）。
 *
 * 一行 sn-cell 承载入口（无分组卡片，模块标题由页面外层承担）：daterange 类型叠加 max-range=7、allow-same-day 与
 * default-time=08:00:00，超跨度的选择会被 rangePrompt 提示拦下。
 */
import { computed, ref } from 'vue';
import { Clock } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCalendar from '@snui/uni-src/components/sn-calendar/sn-calendar.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';

const min = new Date(2024, 0, 1).getTime();
const max = new Date(2024, 11, 31).getTime();

const limitedRange = ref<number | number[] | null>(null);
const open = ref(false);

function fmtDate(value: number | number[] | null): string {
  if (typeof value !== 'number') return '';
  const d = new Date(value);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

const rangeText = computed(() => {
  const value = limitedRange.value;
  if (!Array.isArray(value) || value.length !== 2) return '';
  const [start, end] = value;
  if (start === undefined || end === undefined) return '';
  return `${fmtDate(start).slice(5)} - ${fmtDate(end).slice(5)}`;
});
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCell
      title="区间跨度"
      :value="rangeText"
      placeholder="未选择"
      :prefix-icon-data="Clock"
      is-link
      @click="open = true"
    />

    <text class="sn-demo__meta">区间：{{ rangeText || '未选择' }}</text>

    <SnCalendar
      v-model="limitedRange"
      v-model:visible="open"
      type="daterange"
      title="最多 7 天"
      :min-date="min"
      :max-date="max"
      :max-range="7"
      range-prompt="最多只能选 7 天"
      allow-same-day
      default-time="08:00:00"
      :show-footer="false"
      confirm-on-select
    />
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  width: 100%;
}

.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
