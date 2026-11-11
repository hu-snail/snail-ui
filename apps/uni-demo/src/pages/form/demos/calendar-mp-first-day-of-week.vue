<script setup lang="ts">
/**
 * Demo: sn-calendar — 周起始日（firstDayOfWeek）。
 *
 * 一张 cell 卡片承载入口：first-day-of-week = 1 让周一成为第一列，右侧显示
 * 已选日期，点击打开弹层。
 */
import { computed, ref } from 'vue';
import { Calendar } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCalendar from '@snui/uni-src/components/sn-calendar/sn-calendar.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';

const min = new Date(2024, 0, 1).getTime();
const max = new Date(2024, 11, 31).getTime();

const mondayFirst = ref<number | number[] | null>(new Date(2024, 5, 15).getTime());
const open = ref(false);

function fmtDate(value: number | number[] | null): string {
  if (typeof value !== 'number') return '';
  const d = new Date(value);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

const mondayText = computed(() => fmtDate(mondayFirst.value));
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup card title="周起始日">
      <SnCell
        title="周一起始"
        label="first-day-of-week = 1（周一）"
        :value="mondayText"
        placeholder="未选择"
        :prefix-icon-data="Calendar"
        is-link
        @click="open = true"
      />
    </SnCellGroup>

    <SnCalendar
      v-model="mondayFirst"
      v-model:visible="open"
      type="date"
      title="周一起始"
      :first-day-of-week="1"
      :min-date="min"
      :max-date="max"
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
</style>
