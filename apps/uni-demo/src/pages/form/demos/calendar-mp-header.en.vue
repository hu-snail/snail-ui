<script setup lang="ts">
/**
 * Demo: sn-calendar — sheet header slot (`header`, additive; AGENTS.md §112.3a).
 *
 * The slot replaces the default title row at the top of the sheet so a host can
 * drop a richer section (a cell summary row) inside the sheet; without the slot
 * the `title` text renders as before. Combined with `immediate-change` the
 * in-sheet summary follows the selection live.
 */
import { computed, ref } from 'vue';
import { Calendar } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCalendar from '@snui/uni-src/components/sn-calendar/sn-calendar.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';

const min = new Date(2024, 0, 1).getTime();
const max = new Date(2024, 11, 31).getTime();

const range = ref<number | number[] | null>(null);
const open = ref(false);

function fmtStamp(stamp: number): string {
  const d = new Date(stamp);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

const rangeText = computed(() => {
  const value = range.value;
  if (!Array.isArray(value) || value.length !== 2) return '';
  const [start, end] = value;
  if (start === undefined || end === undefined) return '';
  return `${fmtStamp(start)} ~ ${fmtStamp(end)}`;
});

const dayCount = computed(() => {
  const value = range.value;
  if (!Array.isArray(value) || value.length !== 2) return '';
  const [start, end] = value;
  if (start === undefined || end === undefined) return '';
  return `${Math.round((end - start) / 86400000) + 1} days`;
});
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup card title="Sheet header slot">
      <SnCell
        title="Date range"
        label="the header slot replaces the title row; summary follows the picks"
        :value="rangeText"
        placeholder="Not selected"
        :prefix-icon-data="Calendar"
        is-link
        @click="open = true"
      />
      <SnCell title="Days selected" :value="dayCount" placeholder="Not selected" />
    </SnCellGroup>

    <text class="sn-demo__meta">
      Selected: {{ rangeText || 'Not selected' }}{{ dayCount === '' ? '' : ` (${dayCount})` }}
    </text>

    <SnCalendar
      v-model="range"
      v-model:visible="open"
      type="daterange"
      title="Date range"
      confirm-text="Apply range"
      immediate-change
      :min-date="min"
      :max-date="max"
    >
      <template #header>
        <view class="sn-demo__sheet-head">
          <SnCell
            title="Summary row inside the sheet"
            :value="rangeText"
            placeholder="Tap two days to pick a span"
            :border="false"
          />
          <text class="sn-demo__sheet-hint">
            The header slot replaces the default title; without it the title text renders as before.
          </text>
        </view>
      </template>
    </SnCalendar>
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

/* The header slot content: fill the title row, stack the summary and hint. */
.sn-demo__sheet-head {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-1);
  width: 100%;
}

.sn-demo__sheet-hint {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
