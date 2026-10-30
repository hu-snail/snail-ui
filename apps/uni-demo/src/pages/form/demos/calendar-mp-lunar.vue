<script setup lang="ts">
/**
 * Demo: sn-calendar — 农历角标（`show-lunar`，additive）：格子下方显示农历日名，
 * 初一显示月名。入口行用 cell 卡片形态，右侧回显公历 + 农历对照。
 */
import { computed, ref } from 'vue';
import { Calendar } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCalendar from '@snui/uni-src/components/sn-calendar/sn-calendar.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';
import { formatLunar } from '@snui/uni-src/utils/sn-lunar';

const min = new Date(2025, 0, 1).getTime();
const max = new Date(2025, 11, 31).getTime();

const date = ref<number | number[] | null>(new Date(2025, 0, 29).getTime());
const open = ref(false);

const text = computed(() => {
  const value = date.value;
  if (typeof value !== 'number') return '';
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}（${formatLunar(value)}）`;
});
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup card title="农历角标">
      <SnCell
        title="农历日历"
        label="show-lunar：格下角标，初一显示月名"
        :value="text"
        placeholder="未选择"
        :prefix-icon-data="Calendar"
        is-link
        @click="open = true"
      />
    </SnCellGroup>

    <text class="sn-demo__meta">已选：{{ text || '未选择' }}</text>

    <SnCalendar
      v-model="date"
      v-model:visible="open"
      :min-date="min"
      :max-date="max"
      title="选择日期"
      show-lunar
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
