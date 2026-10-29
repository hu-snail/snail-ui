<script setup lang="ts">
/** Demo: sn-backtop — circle / square × size × content form. */
import { ref } from 'vue';
import SnBacktop from '@snui/uni-src/components/sn-backtop/sn-backtop.vue';

/** Always visible: past the default 300 threshold. */
const scrollTop = ref(500);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__stage">
      <SnBacktop
        :scroll-top="scrollTop"
        size="small"
        :bottom="104"
        :right="16"
        custom-class="sn-demo-pinned"
      />
      <SnBacktop
        :scroll-top="scrollTop"
        text="Top"
        :bottom="104"
        :right="72"
        custom-class="sn-demo-pinned"
      />
      <SnBacktop
        :scroll-top="scrollTop"
        shape="square"
        size="small"
        :bottom="24"
        :right="16"
        custom-class="sn-demo-pinned"
      />
      <SnBacktop
        :scroll-top="scrollTop"
        shape="square"
        size="large"
        text="Back to top"
        :bottom="24"
        :right="72"
        custom-class="sn-demo-pinned"
      />
    </view>
    <text class="sn-demo__meta">
      Circles on the top row, squares on the bottom; icon-only on the small tier,
      icon + label on the right (the box grows with the content and long labels ellipsize).
    </text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  width: 100%;
}
.sn-demo__stage {
  position: relative;
  height: 440rpx;
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-subtle);
  overflow: hidden;
}
.sn-demo__meta {
  font-size: var(--sn-mp-font-size-xs);
  color: var(--sn-mp-color-text-tertiary);
}
/* Docs-preview only — pin the fixed buttons inside the stage. */
.sn-demo__stage :deep(.sn-backtop.sn-demo-pinned) {
  position: absolute;
}
</style>
