<script setup lang="ts">
/** Demo: sn-date-strip — 基础用法：单选，点选即写 v-model。 */
import { ref } from 'vue';
import SnDateStrip from '@snui/uni-src/components/sn-date-strip/sn-date-strip.vue';

const start = new Date(2024, 5, 26).getTime();
const date = ref<number | number[] | null>(new Date(2024, 5, 28).getTime());
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnDateStrip v-model="date" :start-date="start" :count="7" />
    <text class="sn-demo__meta">已选时间戳：{{ date }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
