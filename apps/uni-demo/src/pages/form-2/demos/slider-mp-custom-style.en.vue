<script setup lang="ts">
/** Demo: sn-slider — root styling: customClass / customStyle land on the root node. */
import { ref } from 'vue';
import SnSlider from '@snui/uni-src/components/sn-slider/sn-slider.vue';

const styled = ref(45);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSlider
      v-model="styled"
      custom-class="sn-demo__slider"
      custom-style="padding: 8rpx 16rpx; border-radius: var(--sn-mp-radius-md); background-color: var(--sn-mp-color-background-soft);"
    />
    <text class="sn-demo__meta"
      >customClass / customStyle land on the root (border from the class, fill from the inline
      style)</text
    >
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  align-items: stretch;
  width: 100%;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* custom-class lands on the sn-slider root, so :deep pierces the component boundary. */
.sn-demo :deep(.sn-demo__slider) {
  border: 2rpx solid var(--sn-mp-color-border-subtle);
}
</style>
