<script setup lang="ts">
/** Demo: sn-input-number — rounded (round): a pill-shaped primary stepper. */
import { ref } from 'vue';
import SnInputNumber from '@snui/uni-src/components/sn-input-number/sn-input-number.vue';

const rounded = ref(4);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnInputNumber v-model="rounded" theme="primary" round />
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: stretch;
}
</style>
