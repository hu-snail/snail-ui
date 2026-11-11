<script setup lang="ts">
/**
 * Demo: sn-calendar — 单元格格式化（formatter）。
 *
 * 一张 cell 卡片承载入口：formatter 改写 topInfo / bottomInfo / disabled，
 * 把每月 1 号标成「月首」、周末置灰为「休息」，点击打开弹层。
 */
import { computed, ref } from 'vue';
import { Filter } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCalendar from '@snui/uni-src/components/sn-calendar/sn-calendar.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';

const min = new Date(2024, 0, 1).getTime();
const max = new Date(2024, 11, 31).getTime();

const formatted = ref<number | number[] | null>(new Date(2024, 5, 15).getTime());
const open = ref(false);

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

const formattedText = computed(() => fmtDate(formatted.value));
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup card title="单元格格式化">
      <SnCell
        title="formatter 钩子"
        label="formatter 改写 topInfo / bottomInfo / disabled"
        :value="formattedText"
        placeholder="未选择"
        :prefix-icon-data="Filter"
        is-link
        @click="open = true"
      />
    </SnCellGroup>

    <SnCalendar
      v-model="formatted"
      v-model:visible="open"
      type="date"
      title="格式化单元格"
      :min-date="min"
      :max-date="max"
      :formatter="cellFormatter"
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
