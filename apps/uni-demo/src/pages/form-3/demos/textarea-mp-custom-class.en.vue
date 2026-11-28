<script setup lang="ts">
/** Demo: sn-textarea — the customClass / customStyle / customTextareaClass mount points. */
import { ref } from 'vue';
import SnTextarea from '@snui/uni-src/components/sn-textarea/sn-textarea.vue';

const value = ref('Root class + inline style + inner textarea class');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">customClass + customStyle</text>
    <SnTextarea
      v-model="value"
      custom-class="sn-demo__textarea"
      custom-style="background-color: var(--sn-mp-color-background-soft);"
    />

    <text class="sn-demo__title">customTextareaClass (applies to the inner native textarea)</text>
    <SnTextarea v-model="value" custom-textarea-class="sn-demo__native" />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo__textarea {
  border-radius: var(--sn-mp-radius-lg);
}

.sn-demo__native {
  letter-spacing: 1rpx;
}
</style>
