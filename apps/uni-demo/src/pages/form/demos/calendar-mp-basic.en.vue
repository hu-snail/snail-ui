<script setup lang="ts">
/**
 * Demo: sn-calendar — cell entry row for the sheet calendar.
 *
 * The entry row uses sn-cell directly (no group card; the module title is
 * carried by the page outside); tapping it opens the sheet. A pick writes `v-model`
 * and closes right away (confirm-on-select, no footer).
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
      title="Pick a date"
      :value="formatted"
      placeholder="Not selected"
      :prefix-icon-data="Calendar"
      is-link
      @click="open = true"
    />

    <text class="sn-demo__meta">Selected: {{ formatted || 'Not selected' }}</text>

    <SnCalendar
      v-model="date"
      v-model:visible="open"
      :min-date="min"
      :max-date="max"
      title="Pick a date"
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
