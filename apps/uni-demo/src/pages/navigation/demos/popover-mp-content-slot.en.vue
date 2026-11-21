<script setup lang="ts">
/**
 * Demo: sn-popover — the `content` slot.
 *
 * The `content` slot fully replaces the bubble body (both modes).
 *
 * Docs-preview only: `custom-class="sn-demo-contained"` keeps the bubble
 * inside the demo.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnPopover from '@snui/uni-src/components/sn-popover/sn-popover.vue';

const slotOpen = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnPopover v-model="slotOpen" mode="normal" placement="top" custom-class="sn-demo-contained">
      <SnButton block>normal mode + content slot</SnButton>
      <template #content>
        <view class="sn-demo__body">
          <text class="sn-demo__title">Custom bubble body</text>
          <text class="sn-demo__text">The content slot accepts any structure.</text>
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

/* uni-app x 的 view 默认 overflow: hidden——本 demo 的包装类全链放开，
   弹层伸出包装盒时不被裁（App.vue 全局规则只命中页面级元素与 demo 根
   节点，够不到 demo 内部包装类，AGENTS.md §103）。 */
.sn-demo__body {
  overflow: visible;
}
.sn-demo__text {
  overflow: visible;
}
.sn-demo__title {
  overflow: visible;
}
</style>
