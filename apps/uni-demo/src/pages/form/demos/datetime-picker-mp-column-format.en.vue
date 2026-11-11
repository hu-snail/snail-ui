<script setup lang="ts">
/** Demo: sn-datetime-picker — column copy and filtering (formatter / filter): unit suffixes on the labels; even months only. */
import { computed, ref } from 'vue';
import SnDatetimePicker from '@snui/uni-src/components/sn-datetime-picker/sn-datetime-picker.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';
import { Filter } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const min = new Date(2024, 0, 1).getTime();
const max = new Date(2024, 11, 31).getTime();

const formatted = ref<string | number | undefined>(new Date(2024, 5, 15).getTime());
const openFormatted = ref(false);

/** formatter: suffix every column label with its unit. */
const withUnit = (type: string, value: number) => {
  const unit = type === 'year' ? 'Y' : type === 'month' ? 'M' : type === 'date' ? 'D' : '';
  return unit ? `${value} ${unit}` : String(value);
};
/** filter: keep only even months. */
const evenMonths = (type: string, values: number[]) =>
  type === 'month' ? values.filter((v) => v % 2 === 0) : values;

const pad = (n: number) => String(n).padStart(2, '0');
const formattedText = computed(() => {
  if (formatted.value === undefined) return '';
  const d = new Date(Number(formatted.value));
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
});
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup insert>
      <SnCell
        title="Formatted + filtered"
        label="unit suffixes on the labels; even months only"
        :prefix-icon-data="Filter"
        :value="formattedText"
        is-link
        @click="openFormatted = true"
      />
    </SnCellGroup>

    <SnDatetimePicker
      v-model="formatted"
      v-model:visible="openFormatted"
      type="date"
      title="Formatted + filtered"
      :min-date="min"
      :max-date="max"
      :formatter="withUnit"
      :filter="evenMonths"
    />
  </view>
</template>
