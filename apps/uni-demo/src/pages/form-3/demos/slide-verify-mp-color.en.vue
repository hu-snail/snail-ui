<script setup lang="ts">
/** Demo: sn-slide-verify — track colors: `backgroundColor` / `activeBackgroundColor` override the track fill and the dragged-over tint. */
import SnSlideVerify from '@snui/uni-src/components/sn-slide-verify/sn-slide-verify.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSlideVerify
      background-color="var(--sn-mp-color-background-soft)"
      active-background-color="var(--sn-mp-color-feedback-success-soft)"
    />
  </view>
</template>
