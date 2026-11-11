<script setup lang="ts">
/** Demo: sn-rate — 半星：allowHalf 允许半星评分，v-model 出现 .5。 */
import { ref } from 'vue';
import SnRate from '@snui/uni-src/components/sn-rate/sn-rate.vue';

const half = ref<number | null>(2.5);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnRate v-model="half" allow-half />
    <text class="sn-demo__meta">半星评分：{{ half ?? '未评分' }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
