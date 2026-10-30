<script setup lang="ts">
/**
 * Demo: sn-calendar — 卡片形态入口（cells card 形态）。
 *
 * 三行各用 SnCell 的 card 形态独立成卡（圆角 / 描边 / 阴影走 token，行间距由
 * 外层 flex gap 统一），分别打开 date / daterange / dates 三种模式；文末一行
 * 回显三种模式已确认的值。
 */
import { computed, ref } from 'vue';
import { Calendar, Check, Filter } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCalendar from '@snui/uni-src/components/sn-calendar/sn-calendar.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';

const min = new Date(2024, 0, 1).getTime();
const max = new Date(2024, 11, 31).getTime();

const date = ref<number | number[] | null>(new Date(2024, 5, 15).getTime());
const openDate = ref(false);

const range = ref<number | number[] | null>(null);
const openRange = ref(false);

const multi = ref<number | number[] | null>(null);
const openMulti = ref(false);

function fmtStamp(stamp: number): string {
  const d = new Date(stamp);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

const dateText = computed(() => (typeof date.value === 'number' ? fmtStamp(date.value) : ''));

const rangeText = computed(() => {
  const value = range.value;
  if (!Array.isArray(value) || value.length !== 2) return '';
  const [start, end] = value;
  if (start === undefined || end === undefined) return '';
  return `${fmtStamp(start)} ~ ${fmtStamp(end)}`;
});

const multiText = computed(() => {
  const value = multi.value;
  return Array.isArray(value) && value.length > 0 ? `${value.length} 天` : '';
});
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCell
      title="单日"
      label="type=date · 卡片形态的入口行"
      :value="dateText"
      placeholder="未选择"
      :prefix-icon-data="Calendar"
      card
      is-link
      @click="openDate = true"
    />
    <SnCell
      title="日期区间"
      label="type=daterange · 确认后写回 v-model"
      :value="rangeText"
      placeholder="未选择"
      :prefix-icon-data="Filter"
      card
      is-link
      @click="openRange = true"
    />
    <SnCell
      title="多个日期"
      label="type=dates · 可多次点选"
      :value="multiText"
      placeholder="未选择"
      :prefix-icon-data="Check"
      card
      is-link
      @click="openMulti = true"
    />

    <text class="sn-demo__meta">
      单日：{{ dateText || '未选择' }}；区间：{{ rangeText || '未选择' }}；多选：{{
        multiText || '未选择'
      }}
    </text>

    <SnCalendar
      v-model="date"
      v-model:visible="openDate"
      type="date"
      title="单日"
      :min-date="min"
      :max-date="max"
    />

    <SnCalendar
      v-model="range"
      v-model:visible="openRange"
      type="daterange"
      title="日期区间"
      confirm-text="确定区间"
      :min-date="min"
      :max-date="max"
    />

    <SnCalendar
      v-model="multi"
      v-model:visible="openMulti"
      type="dates"
      title="多个日期"
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

.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
