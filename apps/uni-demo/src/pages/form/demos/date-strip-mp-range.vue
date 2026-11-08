<script setup lang="ts">
/** Demo: sn-date-strip — 自定义日期范围：type=range，首点定起点、再点定终点，越界自动交换。 */
import { ref } from 'vue';
import SnDateStrip from '@snui/uni-src/components/sn-date-strip/sn-date-strip.vue';

const start = new Date(2024, 5, 26).getTime();
const range = ref<number | number[] | null>([new Date(2024, 5, 27).getTime()]);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnDateStrip v-model="range" type="range" :start-date="start" :count="7" />
    <text class="sn-demo__meta">区间值：{{ JSON.stringify(range) }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
