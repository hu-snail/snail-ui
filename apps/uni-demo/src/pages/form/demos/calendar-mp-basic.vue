<script setup lang="ts">
/**
 * Demo: sn-calendar — 弹层日历的 cell 入口行。
 *
 * 入口行直接用 sn-cell（无分组卡片，模块标题由页面外层承担），
 * 点击打开弹层；点选即写回并关闭（confirm-on-select，无底栏）。
 */
import { computed, ref } from 'vue';
import { Calendar } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCalendar from '@snui/uni-src/components/sn-calendar/sn-calendar.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';

const min = new Date(2024, 5, 1).getTime();
const max = new Date(2024, 7, 31).getTime();
const date = ref<number | number[] | null>(new Date(2024, 5, 15).getTime());
const open = ref(false);

const formatted = computed(() => {
  const value = date.value;
  if (typeof value !== 'number') return '';
  const d = new Date(value);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
});
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCell
      title="选择日期"
      :value="formatted"
      placeholder="未选择"
      :prefix-icon-data="Calendar"
      is-link
      @click="open = true"
    />

    <text class="sn-demo__meta">已选：{{ formatted || '未选择' }}</text>

    <SnCalendar
      v-model="date"
      v-model:visible="open"
      :min-date="min"
      :max-date="max"
      title="选择日期"
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
