<script setup lang="ts">
/** Demo: sn-datetime-picker — roller geometry and column values: itemHeight / visibleItemCount / h-m-s bounds / formatter / filter, opened from sn-cell rows. */
import { computed, ref } from 'vue';
import SnDatetimePicker from '@snui/uni-src/components/sn-datetime-picker/sn-datetime-picker.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';
import { Calendar, Clock, Filter } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const min = new Date(2024, 0, 1).getTime();
const max = new Date(2024, 11, 31).getTime();

const bigRows = ref<string | number | undefined>(new Date(2024, 5, 15).getTime());
const openBig = ref(false);

const hours = ref<string | number | undefined>(new Date(2024, 5, 15, 12).getTime());
const openHours = ref(false);

const withSeconds = ref<string | number | undefined>('10:30:00');
const openSeconds = ref(false);

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
const dateText = computed(() => {
  if (bigRows.value === undefined) return '';
  const d = new Date(Number(bigRows.value));
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
});
const hoursText = computed(() => {
  if (hours.value === undefined) return '';
  const d = new Date(Number(hours.value));
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
});
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
        title="Tall rows"
        label="itemHeight 44 / 6 visible rows, range limited to 2024"
        :prefix-icon-data="Calendar"
        :value="dateText"
        is-link
        @click="openBig = true"
      />
      <SnCell
        title="Restricted hours"
        label="minHour 08 / maxHour 18, minMinute 15 / maxMinute 45"
        :prefix-icon-data="Clock"
        :value="hoursText"
        is-link
        @click="openHours = true"
      />
      <SnCell
        title="With seconds"
        label="useSecond + maxSecond 30"
        :prefix-icon-data="Clock"
        :value="String(withSeconds)"
        is-link
        @click="openSeconds = true"
      />
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
      v-model="bigRows"
      v-model:visible="openBig"
      type="date"
      title="Tall rows"
      :item-height="44"
      :visible-item-count="6"
      :min-date="min"
      :max-date="max"
      value-key="value"
      label-key="label"
    />
    <SnDatetimePicker
      v-model="hours"
      v-model:visible="openHours"
      type="datetime"
      title="Restricted hours"
      :min-date="min"
      :max-date="max"
      :min-hour="8"
      :max-hour="18"
      :min-minute="15"
      :max-minute="45"
    />
    <SnDatetimePicker
      v-model="withSeconds"
      v-model:visible="openSeconds"
      type="time"
      title="With seconds"
      use-second
      :min-second="0"
      :max-second="30"
    />
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
