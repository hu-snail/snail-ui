<script setup lang="ts">
/**
 * Demo: sn-popover — `content` 插槽。
 *
 * `content` 插槽完全替换气泡正文（normal / menu 两种模式都可用）。
 *
 * 预览专用：`custom-class="sn-demo-contained"` 把气泡定位收在 demo 内。
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnPopover from '@snui/uni-src/components/sn-popover/sn-popover.vue';

const slotOpen = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnPopover v-model="slotOpen" mode="normal" placement="top" custom-class="sn-demo-contained">
      <SnButton block>normal 模式 + content 插槽</SnButton>
      <template #content>
        <view class="sn-demo__body">
          <text class="sn-demo__title">自定义气泡正文</text>
          <text class="sn-demo__text">content 插槽可放任意结构。</text>
        </view>
      </template>
    </SnPopover>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__body {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-1);
}
.sn-demo__title {
  font-size: 26rpx;
  font-weight: var(--sn-mp-font-weight-semibold);
}
.sn-demo__text {
  font-size: 22rpx;
  color: var(--sn-mp-color-text-secondary);
}
/* Docs-preview only — keep the absolutely-positioned bubble inside the demo. */
.sn-demo :deep(.sn-popover.sn-demo-contained) {
  position: relative;
  display: block;
}
</style>
