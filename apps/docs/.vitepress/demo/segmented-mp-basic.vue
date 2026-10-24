<script setup lang="ts">
/** Demo: sn-segmented — 基础分段器 + v-model。 */
import { ref } from 'vue'
import SnSegmented from '@snui/uni-src/components/sn-segmented/sn-segmented.vue'

const period = ref('week')
const options = ['day', 'week', 'month']
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSegmented v-model="period" :options="options" />
    <text class="sn-demo__meta">当前值：{{ period }}</text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
