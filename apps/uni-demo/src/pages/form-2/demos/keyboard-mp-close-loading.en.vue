<script setup lang="ts">
/** Demo: sn-keyboard — close-button loading (closeButtonLoading): the close key spins and can be relabelled. */
import { ref } from 'vue';
import SnKeyboard from '@snui/uni-src/components/sn-keyboard/sn-keyboard.vue';

const busy = ref('');
const openBusy = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">closeButtonLoading (spinner in the close button)</text>
    <view class="sn-demo__button" @tap="openBusy = true">Close button busy</view>
    <SnKeyboard
      v-model="busy"
      v-model:visible="openBusy"
      :maxlength="6"
      title="Close button busy"
      close-button-loading
      close-text="Submitting"
    />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 72rpx;
  padding: 0 32rpx;
  border-radius: var(--sn-mp-button-radius);
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
  font-size: 28rpx;
}
</style>
