<script setup lang="ts">
/**
 * Demo: sn-calendar — 网格与区间约束（cell 卡片承载每项配置）。
 *
 * 三种约束各占一张 cell 卡片：周起始日、单元格格式化、区间跨度；每行显示当前
 * 配置与已选值，点击打开对应弹层。
 */
import { computed, ref } from 'vue';
import { Calendar, Clock, Filter } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCalendar from '@snui/uni-src/components/sn-calendar/sn-calendar.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';

const min = new Date(2024, 0, 1).getTime();
const max = new Date(2024, 11, 31).getTime();

const mondayFirst = ref<number | number[] | null>(new Date(2024, 5, 15).getTime());
const openMonday = ref(false);

const formatted = ref<number | number[] | null>(new Date(2024, 5, 15).getTime());
const openFormatted = ref(false);

const limitedRange = ref<number | number[] | null>(null);
const openRange = ref(false);

/** formatter：把每月的 1 号标成「月首」，周末置灰。 */
const cellFormatter = (day: { date: number; text: string }) => {
  const d = new Date(day.date);
  if (d.getDate() === 1) return { topInfo: '月首' };
  if (d.getDay() === 0 || d.getDay() === 6) return { disabled: true, bottomInfo: '休息' };
  return undefined;
};

function fmtDate(value: number | number[] | null): string {
  if (typeof value !== 'number') return '';
  const d = new Date(value);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

const mondayText = computed(() => fmtDate(mondayFirst.value));
const formattedText = computed(() => fmtDate(formatted.value));

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
    <SnCellGroup card title="网格与区间约束">
      <SnCell
        title="周起始日"
        label="first-day-of-week = 1（周一）"
        :value="mondayText"
        placeholder="未选择"
        :prefix-icon-data="Calendar"
        is-link
        @click="openMonday = true"
      />
      <SnCell
        title="单元格格式化"
        label="formatter 改写 topInfo / bottomInfo / disabled"
        :value="formattedText"
        placeholder="未选择"
        :prefix-icon-data="Filter"
        is-link
        @click="openFormatted = true"
      />
      <SnCell
        title="区间跨度"
        label="max-range = 7 · allow-same-day · default-time = 08:00:00"
        :value="rangeText"
        placeholder="未选择"
        :prefix-icon-data="Clock"
        is-link
        @click="openRange = true"
      />
    </SnCellGroup>

    <text class="sn-demo__meta">区间：{{ rangeText || '未选择' }}</text>

    <SnCalendar
      v-model="mondayFirst"
      v-model:visible="openMonday"
      type="date"
      title="周一起始"
      :first-day-of-week="1"
      :min-date="min"
      :max-date="max"
    />

    <SnCalendar
      v-model="formatted"
      v-model:visible="openFormatted"
      type="date"
      title="格式化单元格"
      :min-date="min"
      :max-date="max"
      :formatter="cellFormatter"
    />

    <SnCalendar
      v-model="limitedRange"
      v-model:visible="openRange"
      type="daterange"
      title="最多 7 天"
      :min-date="min"
      :max-date="max"
      :max-range="7"
      range-prompt="最多只能选 7 天"
      allow-same-day
      default-time="08:00:00"
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
