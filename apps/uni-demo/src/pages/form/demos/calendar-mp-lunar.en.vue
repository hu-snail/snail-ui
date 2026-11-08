<script setup lang="ts">
/**
 * Demo: sn-calendar — lunar captions (`show-lunar`, additive): a lunar day name
 * under each cell, the month name on 初一. The entry row uses the cell card
 * form and echoes the Gregorian + lunar pair of the confirmed value.
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
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} (${formatLunar(value)})`;
});
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup card title="Lunar captions">
      <SnCell
        title="Lunar calendar"
        label="show-lunar: caption under each day, month name on 初一"
        :value="text"
        placeholder="Not selected"
        :prefix-icon-data="Calendar"
        is-link
        @click="open = true"
      />
    </SnCellGroup>

    <text class="sn-demo__meta">Selected: {{ text || 'Not selected' }}</text>

    <SnCalendar
      v-model="date"
      v-model:visible="open"
      :min-date="min"
      :max-date="max"
      title="Pick a date"
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
