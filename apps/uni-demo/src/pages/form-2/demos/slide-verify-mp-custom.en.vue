<script setup lang="ts">
/** Demo: sn-slide-verify — `text` / `successText` override the built-in copy; `backgroundColor` / `activeBackgroundColor` override the track; `disabled` blocks dragging. */
import { ref } from 'vue';
import SnSlideVerify from '@snui/uni-src/components/sn-slide-verify/sn-slide-verify.vue';

// No extra state.
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSlideVerify
      text="Hold and drag to the right"
      success-text="Verified"
      background-color="var(--sn-mp-color-background-soft)"
      active-background-color="var(--sn-mp-color-feedback-success-soft)"
    />
    <SnSlideVerify disabled />
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
