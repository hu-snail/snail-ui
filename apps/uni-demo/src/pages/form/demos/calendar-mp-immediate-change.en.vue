<script setup lang="ts">
/**
 * Demo: sn-calendar — immediate write-back (immediateChange).
 *
 * One sn-cell row carries the entry (no group card; the module title is carried by the page): with immediate-change on, tapping a cell
 * writes v-model right away, no confirm button involved.
 */
import { computed, ref } from 'vue';
import { Zap } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCalendar from '@snui/uni-src/components/sn-calendar/sn-calendar.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';

const min = new Date(2024, 0, 1).getTime();
const max = new Date(2024, 11, 31).getTime();

const instant = ref<number | number[] | null>(new Date(2024, 5, 15).getTime());
const open = ref(false);

function fmtStamp(value: number | number[] | null): string {
  if (typeof value !== 'number') return '';
  const d = new Date(value);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

const instantText = computed(() => fmtStamp(instant.value));
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCell
      title="Immediate write-back"
      :value="instantText"
      placeholder="Not selected"
      :prefix-icon-data="Zap"
      is-link
      @click="open = true"
    />

    <SnCalendar
      v-model="instant"
      v-model:visible="open"
      type="date"
      title="Immediate write-back"
      :min-date="min"
      :max-date="max"
      immediate-change
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
</style>
