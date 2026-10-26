<script setup lang="ts">
/** Demo: sn-input — the customClass / customStyle / customInputClass mount points. */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const value = ref('Root class + inline style + inner input class');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">customClass + customStyle</text>
    <SnInput
      v-model="value"
      custom-class="sn-demo__field"
      custom-style="background-color: var(--sn-mp-color-background-soft);"
    />

    <text class="sn-demo__title">customInputClass (applies to the inner native input)</text>
    <SnInput v-model="value" custom-input-class="sn-demo__native" />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo__field {
  border-radius: var(--sn-mp-radius-lg);
}

.sn-demo__native {
  letter-spacing: 1rpx;
}
</style>
