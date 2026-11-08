<script setup lang="ts">
/** Demo: sn-datetime-picker — sn-cell rows open the sheet: a plain date and a datetime bounded to one year. */
import { computed, ref } from 'vue';
import SnDatetimePicker from '@snui/uni-src/components/sn-datetime-picker/sn-datetime-picker.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';
import { Calendar, Clock } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const date = ref<string | number | undefined>(undefined);
const openDate = ref(false);

const ranged = ref<string | number | undefined>(new Date(2026, 9, 29, 10, 59).getTime());
const openRanged = ref(false);
// Bound the selectable range to one year: 2026-01-01 ~ 2026-12-31.
const minDate = new Date(2026, 0, 1).getTime();
const maxDate = new Date(2026, 11, 31, 23, 59, 59).getTime();

const pad = (n: number) => String(n).padStart(2, '0');
const dateText = computed(() => {
  if (date.value === undefined) return '';
  const d = new Date(Number(date.value));
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
});
const rangedText = computed(() => {
  if (ranged.value === undefined) return '';
  const d = new Date(Number(ranged.value));
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
});
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup insert>
      <SnCell
        title="Date"
        :prefix-icon-data="Calendar"
        placeholder="Select"
        :value="dateText"
        is-link
        @click="openDate = true"
      />
      <SnCell
        title="One-year datetime"
        :prefix-icon-data="Clock"
        placeholder="Select"
        :value="rangedText"
        is-link
        @click="openRanged = true"
      />
    </SnCellGroup>

    <SnDatetimePicker v-model="date" v-model:visible="openDate" type="date" title="Pick a date" />
    <SnDatetimePicker
      v-model="ranged"
      v-model:visible="openRanged"
      type="datetime"
      title="One-year datetime"
      :min-date="minDate"
      :max-date="maxDate"
    />
  </view>
</template>
