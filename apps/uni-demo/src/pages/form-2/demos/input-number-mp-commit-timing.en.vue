<script setup lang="ts">
/** Demo: sn-input-number — commit timing and input attrs: immediateChange=false / updateOnInit / inputType="number" / adjustPosition=false. */
import { ref } from 'vue';
import SnInputNumber from '@snui/uni-src/components/sn-input-number/sn-input-number.vue';

const deferred = ref(5);
const corrected = ref(0);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">immediateChange=false (commits on blur / button only)</text>
    <SnInputNumber v-model="deferred" :min="0" :max="20" :immediate-change="false" />

    <text class="sn-demo__title"
      >updateOnInit (corrects an out-of-range value on mount) + inputType="number" +
      adjustPosition=false</text
    >
    <SnInputNumber
      v-model="corrected"
      :min="0"
      :max="10"
      :step="5"
      update-on-init
      input-type="number"
      :adjust-position="false"
    />
    <text class="sn-demo__meta">Corrected to {{ corrected }} on mount</text>
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
