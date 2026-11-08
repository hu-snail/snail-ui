<script setup lang="ts">
/** Demo: sn-datetime-picker — 滚筒几何与列取值：itemHeight / visibleItemCount / 时分秒边界 / formatter / filter，sn-cell 行触发。 */
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

/** formatter：给列文案加单位。 */
const withUnit = (type: string, value: number) => {
  const unit = type === 'year' ? ' 年' : type === 'month' ? ' 月' : type === 'date' ? ' 日' : '';
  return `${value}${unit}`;
};
/** filter：月份只留偶数月。 */
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
        title="大行高滚筒"
        label="itemHeight 44 / 可见 6 行，范围 2024 全年"
        :prefix-icon-data="Calendar"
        :value="dateText"
        is-link
        @click="openBig = true"
      />
      <SnCell
        title="限定时段"
        label="minHour 08 / maxHour 18，minMinute 15 / maxMinute 45"
        :prefix-icon-data="Clock"
        :value="hoursText"
        is-link
        @click="openHours = true"
      />
      <SnCell
        title="精确到秒"
        label="useSecond + maxSecond 30"
        :prefix-icon-data="Clock"
        :value="String(withSeconds)"
        is-link
        @click="openSeconds = true"
      />
      <SnCell
        title="格式化与过滤"
        label="列文案加单位；月份只留偶数月"
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
      title="大行高滚筒"
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
      title="限定时段"
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
      title="精确到秒"
      use-second
      :min-second="0"
      :max-second="30"
    />
    <SnDatetimePicker
      v-model="formatted"
      v-model:visible="openFormatted"
      type="date"
      title="格式化与过滤"
      :min-date="min"
      :max-date="max"
      :formatter="withUnit"
      :filter="evenMonths"
    />
  </view>
</template>
