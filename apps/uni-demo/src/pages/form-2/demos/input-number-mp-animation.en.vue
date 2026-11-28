<script setup lang="ts">
/** Demo: sn-input-number — rolling number animation (`animation`): the field text rolls up on increase and down on decrease. */
import { ref } from 'vue';
import SnInputNumber from '@snui/uni-src/components/sn-input-number/sn-input-number.vue';

const rolled = ref(10);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">animation (rolls up on increase, down on decrease)</text>
    <SnInputNumber v-model="rolled" :min="0" :max="20" animation />
    <text class="sn-demo__meta">Current value: {{ rolled }}</text>
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
