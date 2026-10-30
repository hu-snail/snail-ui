<script setup lang="ts">
/**
 * Demo: sn-calendar — cell-card entry for the sheet calendar.
 *
 * The card-form sn-cell-group carries the entry row (title + hint + selected
 * value); tapping it opens the sheet. Rolling inside only updates the draft —
 * `v-model` is written on confirm and cancel discards the draft.
 */
import { computed, ref } from 'vue';
import { Calendar } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCalendar from '@snui/uni-src/components/sn-calendar/sn-calendar.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';

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
    <SnCellGroup card title="Basic usage">
      <SnCell
        title="Pick a date"
        label="Bounds: 2024-06-01 ~ 2024-08-31"
        :value="formatted"
        placeholder="Not selected"
        :prefix-icon-data="Calendar"
        is-link
        @click="open = true"
      />
    </SnCellGroup>

    <text class="sn-demo__meta">Selected: {{ formatted || 'Not selected' }}</text>

    <SnCalendar
      v-model="date"
      v-model:visible="open"
      :min-date="min"
      :max-date="max"
      title="Pick a date"
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
