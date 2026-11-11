<script setup lang="ts">
/** Demo: sn-slide-verify — tolerance: `tolerance` widens the right-edge slack (px). */
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
    <SnSlideVerify :tolerance="24" @success="onSuccess" @fail="onFail" />
    <text class="sn-demo__meta">tolerance=24 widens the right-edge slack</text>
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
</style>
