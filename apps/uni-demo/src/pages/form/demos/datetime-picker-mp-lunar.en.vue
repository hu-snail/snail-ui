<script setup lang="ts">
/** Demo: sn-datetime-picker — lunar roller (AUI-added): stem-branch year / months with leap month / days 初一…三十, while `v-model` stays a solar timestamp. */
import { computed, ref } from 'vue';
import SnDatetimePicker from '@snui/uni-src/components/sn-datetime-picker/sn-datetime-picker.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';
import { formatLunar } from '@snui/uni-src/utils/sn-lunar';
import { Calendar, Clock } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const lunarDate = ref<string | number | undefined>(new Date(2025, 11, 1, 10, 30).getTime());
const openDate = ref(false);

const lunarClock = ref<string | number | undefined>(new Date(2025, 11, 1, 10, 30).getTime());
const openClock = ref(false);

// The lunar labels themselves are Chinese (stem-branch year 甲辰年, month 正月,
// day 初一) — the roller is a Chinese calendar, so the shadow keeps them as-is.
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
        title="Lunar date"
        label="lunar: stem-branch year / months with leap month / days 初一…三十"
        :prefix-icon-data="Calendar"
        placeholder="Select"
        :value="lunarText"
        is-link
        @click="openDate = true"
      />
      <SnCell
        title="Lunar + time"
        label="datetime + lunar: keeps the clock rollers"
        :prefix-icon-data="Clock"
        placeholder="Select"
        :value="clockText"
        is-link
        @click="openClock = true"
      />
    </SnCellGroup>

    <SnDatetimePicker
      v-model="lunarDate"
      v-model:visible="openDate"
      type="date"
      title="Pick a lunar date"
      lunar
    />
    <SnDatetimePicker
      v-model="lunarClock"
      v-model:visible="openClock"
      type="datetime"
      title="Pick a lunar datetime"
      lunar
    />
  </view>
</template>
