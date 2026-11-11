<script setup lang="ts">
/**
 * Demo: sn-circle (uni-end) — English shadow of circle-mp-custom-style.
 */
import { ref } from 'vue';
import SnCircle from '@snui/uni-src/components/sn-circle/sn-circle.vue';

const percent = ref(60);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnCircle
      :model-value="percent"
      :size="160"
      text="custom-class + custom-style"
      custom-class="sn-demo__ring"
      custom-style="padding: var(--sn-mp-spacing-2);"
    />

    <text class="sn-demo__meta">
      custom-class and custom-style both land on the sn-circle root node.
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  align-items: center;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* custom-class lands on the sn-circle root node. */
.sn-demo :deep(.sn-demo__ring) {
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-subtle);
}
</style>
