<script setup lang="ts">
/** Demo: sn-input-number — disabled: blocks every interaction. */
import { ref } from 'vue';
import SnInputNumber from '@snui/uni-src/components/sn-input-number/sn-input-number.vue';

const value = ref(5);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnInputNumber v-model="value" :min="0" :max="10" disabled />
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
