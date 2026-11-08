<script setup lang="ts">
/**
 * Demo: sn-calendar — grid and range constraints, one cell card per option.
 *
 * Three cards carry the three constraints: week start, cell formatting and
 * range span. Each row shows its config and the current value; tapping opens
 * the matching sheet.
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

/** formatter: tag the 1st of every month and grey out weekends. */
const cellFormatter = (day: { date: number; text: string }) => {
  const d = new Date(day.date);
  if (d.getDate() === 1) return { topInfo: '1st' };
  if (d.getDay() === 0 || d.getDay() === 6) return { disabled: true, bottomInfo: 'Off' };
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
    <SnCellGroup card title="Grid &amp; range constraints">
      <SnCell
        title="Week start"
        label="first-day-of-week = 1 (Monday)"
        :value="mondayText"
        placeholder="Not selected"
        :prefix-icon-data="Calendar"
        is-link
        @click="openMonday = true"
      />
      <SnCell
        title="Cell formatting"
        label="formatter rewrites topInfo / bottomInfo / disabled"
        :value="formattedText"
        placeholder="Not selected"
        :prefix-icon-data="Filter"
        is-link
        @click="openFormatted = true"
      />
      <SnCell
        title="Range span"
        label="max-range = 7 · allow-same-day · default-time = 08:00:00"
        :value="rangeText"
        placeholder="Not selected"
        :prefix-icon-data="Clock"
        is-link
        @click="openRange = true"
      />
    </SnCellGroup>

    <text class="sn-demo__meta">Range: {{ rangeText || 'Not selected' }}</text>

    <SnCalendar
      v-model="mondayFirst"
      v-model:visible="openMonday"
      type="date"
      title="Monday first"
      :first-day-of-week="1"
      :min-date="min"
      :max-date="max"
    />

    <SnCalendar
      v-model="formatted"
      v-model:visible="openFormatted"
      type="date"
      title="Formatted cells"
      :min-date="min"
      :max-date="max"
      :formatter="cellFormatter"
    />

    <SnCalendar
      v-model="limitedRange"
      v-model:visible="openRange"
      type="daterange"
      title="At most 7 days"
      :min-date="min"
      :max-date="max"
      :max-range="7"
      range-prompt="You can only pick 7 days"
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
