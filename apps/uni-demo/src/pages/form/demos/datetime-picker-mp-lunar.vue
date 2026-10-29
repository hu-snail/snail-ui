<script setup lang="ts">
/** Demo: sn-datetime-picker — 农历滚筒（additive）：年列干支 / 月列含闰月 / 日列初一三十，v-model 仍是公历时间戳。 */
import { computed, ref } from 'vue';
import SnDatetimePicker from '@snui/uni-src/components/sn-datetime-picker/sn-datetime-picker.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';
import { formatLunar } from '@snui/uni-src/utils/sn-lunar';

const lunarDate = ref<string | number | undefined>(new Date(2025, 11, 1, 10, 30).getTime());
const openDate = ref(false);

const lunarClock = ref<string | number | undefined>(new Date(2025, 11, 1, 10, 30).getTime());
const openClock = ref(false);

const lunarText = computed(() =>
  lunarDate.value === undefined ? '' : formatLunar(Number(lunarDate.value)),
);
const clockText = computed(() => {
  if (lunarClock.value === undefined) return '';
  const d = new Date(Number(lunarClock.value));
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${formatLunar(Number(lunarClock.value))} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
});
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup insert>
      <SnCell
        title="农历日期"
        label="lunar：年干支 / 月含闰月 / 日初一三十"
        placeholder="请选择"
        :value="lunarText"
        is-link
        @click="openDate = true"
      />
      <SnCell
        title="农历 + 时间"
        label="datetime + lunar：保留时分滚筒"
        placeholder="请选择"
        :value="clockText"
        is-link
        @click="openClock = true"
      />
    </SnCellGroup>

    <SnDatetimePicker
      v-model="lunarDate"
      v-model:visible="openDate"
      type="date"
      title="选择农历"
      lunar
    />
    <SnDatetimePicker
      v-model="lunarClock"
      v-model:visible="openClock"
      type="datetime"
      title="选择农历时间"
      lunar
    />
  </view>
</template>
