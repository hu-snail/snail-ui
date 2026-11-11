<script setup lang="ts">
/**
 * Demo: sn-calendar — range constraints (maxRange / allowSameDay / defaultTime).
 *
 * One cell card carries the entry: a daterange sheet with max-range = 7,
 * allow-same-day and default-time = 08:00:00; picks beyond the span are
 * rejected with the rangePrompt message.
 */
import { computed, ref } from 'vue';
import { Clock } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCalendar from '@snui/uni-src/components/sn-calendar/sn-calendar.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';

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
    <SnCellGroup card title="Range constraints">
      <SnCell
        title="Range span"
        label="max-range = 7 · allow-same-day · default-time = 08:00:00"
        :value="rangeText"
        placeholder="Not selected"
        :prefix-icon-data="Clock"
        is-link
        @click="open = true"
      />
    </SnCellGroup>

    <text class="sn-demo__meta">Range: {{ rangeText || 'Not selected' }}</text>

    <SnCalendar
      v-model="limitedRange"
      v-model:visible="open"
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
