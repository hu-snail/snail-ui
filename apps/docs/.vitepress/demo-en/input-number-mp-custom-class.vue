<script setup lang="ts">
/** Demo: sn-input-number — the customClass / customStyle mount points. */
import { ref } from 'vue'
import SnInputNumber from '@snui/uni-src/components/sn-input-number/sn-input-number.vue'

const a = ref(2)
const b = ref(4)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">customClass</text>
    <SnInputNumber v-model="a" :min="0" :max="10" custom-class="sn-demo__stepper" />

    <text class="sn-demo__title">customStyle</text>
    <SnInputNumber
      v-model="b"
      :min="0"
      :max="10"
      custom-style="padding: 8rpx; border-radius: var(--sn-mp-radius-lg); background-color: var(--sn-mp-color-background-soft);"
    />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo__stepper {
  border: 1rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-md);
}
</style>
