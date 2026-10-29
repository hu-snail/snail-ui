<script setup lang="ts">
/** Demo: sn-datetime-picker — sn-cell 行触发弹层：日期选择 / 限定一年范围的日期时间。 */
import { computed, ref } from 'vue';
import SnDatetimePicker from '@snui/uni-src/components/sn-datetime-picker/sn-datetime-picker.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';

const date = ref<string | number | undefined>(undefined);
const openDate = ref(false);

const ranged = ref<string | number | undefined>(new Date(2026, 9, 29, 10, 59).getTime());
const openRanged = ref(false);
// 限定可选范围为一年：2026-01-01 ~ 2026-12-31。
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
        title="日期选择"
        placeholder="请选择"
        :value="dateText"
        is-link
        @click="openDate = true"
      />
      <SnCell
        title="时间范围一年"
        placeholder="请选择"
        :value="rangedText"
        is-link
        @click="openRanged = true"
      />
    </SnCellGroup>

    <SnDatetimePicker v-model="date" v-model:visible="openDate" type="date" title="选择日期" />
    <SnDatetimePicker
      v-model="ranged"
      v-model:visible="openRanged"
      type="datetime"
      title="时间范围一年"
      :min-date="minDate"
      :max-date="maxDate"
    />
  </view>
</template>
