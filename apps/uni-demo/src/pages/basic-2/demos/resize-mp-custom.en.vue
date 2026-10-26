<script setup lang="ts">
/**
 * Demo: sn-resize (uni-end) — custom-class / custom-style and the measured boundary.
 *
 * The three props split the work:
 *   - customClass          → the outer wrapper node
 *   - customStyle          → the outer wrapper's inline style
 *   - customContainerClass → the inner node that `boundingClientRect` measures
 *
 * Drawing the wrapper dashed and the inner node solid makes both boundaries
 * visible at a glance.
 */
import { ref } from 'vue';
import SnResize from '@snui/uni-src/components/sn-resize/sn-resize.vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

const rows = ref(1);
const lastBox = ref('—');

function onResize(rect: { width: number; height: number }): void {
  lastBox.value = `${rect.width} × ${rect.height}`;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnResize
      custom-class="sn-demo__wrapper"
      custom-style="padding: var(--sn-mp-spacing-2);"
      custom-container-class="sn-demo__measured"
      @resize="onResize"
    >
      <view v-for="i in rows" :key="i" class="sn-demo__row">Row {{ i }} content</view>
    </SnResize>
    <text class="sn-demo__meta">Last measurement: {{ lastBox }}</text>

    <view class="sn-demo__actions">
      <SnButton size="small" @tap="rows += 1">Add a row</SnButton>
      <SnButton size="small" plain @tap="rows = 1">Reset</SnButton>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  width: 100%;
  align-items: stretch;
}
/* custom-class lands on the outer wrapper node. */
.sn-demo :deep(.sn-demo__wrapper) {
  border: 2rpx dashed var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-md);
}
/* custom-container-class lands on the measured inner node. */
.sn-demo :deep(.sn-demo__measured) {
  padding: var(--sn-mp-spacing-2);
  border-radius: var(--sn-mp-radius-sm);
  background-color: var(--sn-mp-color-background-subtle);
}
.sn-demo__row {
  padding: var(--sn-mp-spacing-1) 0;
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-xs);
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
}
.sn-demo__actions {
  display: flex;
  gap: 12rpx;
}
</style>
