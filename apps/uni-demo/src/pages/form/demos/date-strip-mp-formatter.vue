<script setup lang="ts">
/** Demo: sn-date-strip — 自定义日期文案：formatter 在日号下方注入价格文案。 */
import { ref } from 'vue';
import SnDateStrip from '@snui/uni-src/components/sn-date-strip/sn-date-strip.vue';
import type { DateStripDayItem } from '@snui/uni-src/components/sn-date-strip/sn-date-strip-types';

const start = new Date(2024, 5, 26).getTime();
const date = ref<number | number[] | null>(new Date(2024, 5, 30).getTime());

/** 按日号写价格（演示用固定数据）。 */
const prices: Record<number, string> = { 26: '¥60', 27: '¥60', 28: '¥60', 29: '¥60', 30: '¥88' };
const withPrice = (item: DateStripDayItem): DateStripDayItem => ({
  ...item,
  bottomInfo: prices[item.day] ?? '',
});
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnDateStrip v-model="date" :start-date="start" :count="7" :formatter="withPrice" />
  </view>
</template>
