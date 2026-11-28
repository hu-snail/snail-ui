<script setup lang="ts">
/** Demo: sn-slide-verify — root styling: customClass / customStyle land on the root node. */
import { ref } from 'vue';
import SnSlideVerify from '@snui/uni-src/components/sn-slide-verify/sn-slide-verify.vue';

const state = ref('Not verified');
const onSuccess = (): void => {
  state.value = 'Verified';
};
const onFail = (): void => {
  state.value = 'Failed';
};
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSlideVerify
      custom-class="sn-demo__verify"
      custom-style="padding: 8rpx; border-radius: var(--sn-mp-radius-md); background-color: var(--sn-mp-color-background-soft);"
      @success="onSuccess"
      @fail="onFail"
    />
    <text class="sn-demo__meta">customClass / customStyle land on the root node</text>
    <text class="sn-demo__meta">Status: {{ state }}</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: stretch;
  width: 100%;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* custom-class lands on the sn-slide-verify root, so :deep pierces the component boundary. */
.sn-demo :deep(.sn-demo__verify) {
  border: 2rpx solid var(--sn-mp-color-border-subtle);
}
</style>
