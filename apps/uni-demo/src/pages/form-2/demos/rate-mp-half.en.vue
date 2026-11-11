<script setup lang="ts">
/** Demo: sn-rate — half stars: `allowHalf` lets the value land on `.5` steps. */
import { ref } from 'vue';
import SnRate from '@snui/uni-src/components/sn-rate/sn-rate.vue';

const half = ref<number | null>(2.5);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnRate v-model="half" allow-half />
    <text class="sn-demo__meta">Half score: {{ half ?? 'not rated' }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
