<script setup lang="ts">
/**
 * Demo: sn-calendar — card-form entries (cells card pattern).
 *
 * Three rows each render as an independent card through SnCell's card form
 * (radius / border / shadow from tokens, row spacing owned by the outer flex
 * gap); they open the date / daterange / dates modes. The last line echoes the
 * confirmed value of all three.
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
  return Array.isArray(value) && value.length > 0 ? `${value.length} days` : '';
});
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCell
      title="Single date"
      label="type=date · card-form entry row"
      :value="dateText"
      placeholder="Not selected"
      :prefix-icon-data="Calendar"
      card
      is-link
      @click="openDate = true"
    />
    <SnCell
      title="Date range"
      label="type=daterange · writes v-model on confirm"
      :value="rangeText"
      placeholder="Not selected"
      :prefix-icon-data="Filter"
      card
      is-link
      @click="openRange = true"
    />
    <SnCell
      title="Multiple dates"
      label="type=dates · tap as many days as you need"
      :value="multiText"
      placeholder="Not selected"
      :prefix-icon-data="Check"
      card
      is-link
      @click="openMulti = true"
    />

    <text class="sn-demo__meta">
      Single: {{ dateText || 'Not selected' }} · Range: {{ rangeText || 'Not selected' }} ·
      Multiple:
      {{ multiText || 'Not selected' }}
    </text>

    <SnCalendar
      v-model="date"
      v-model:visible="openDate"
      type="date"
      title="Single date"
      :min-date="min"
      :max-date="max"
    />

    <SnCalendar
      v-model="range"
      v-model:visible="openRange"
      type="daterange"
      title="Date range"
      confirm-text="Apply range"
      :min-date="min"
      :max-date="max"
    />

    <SnCalendar
      v-model="multi"
      v-model:visible="openMulti"
      type="dates"
      title="Multiple dates"
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
