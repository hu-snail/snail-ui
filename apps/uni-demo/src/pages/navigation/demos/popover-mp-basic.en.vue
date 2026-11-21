<script setup lang="ts">
/**
 * Demo: sn-popover (uni-end) — rich card bubble (icon plate + title + text).
 * Per AUI-DOCS-016: imports the real @snui/uni sn-popover from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnPopover from '@snui/uni-src/components/sn-popover/sn-popover.vue';
import { MapPin } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const open = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-popover-demo__center">
      <SnPopover
        v-model="open"
        title="Quick Tip"
        content="There is no hover on miniprogram — the bubble toggles on tap. Tap anywhere outside it to close, or tap the trigger again."
        :icon-data="MapPin"
        icon-bg="var(--sn-mp-color-feedback-warning-soft)"
        icon-color="var(--sn-mp-color-feedback-warning)"
        placement="bottom"
        :show-close="true"
        custom-class="sn-demo-contained"
      >
        <SnButton type="primary">Show bubble</SnButton>
      </SnPopover>
    </view>

    <view class="sn-popover-demo__space" />

    <text class="sn-demo__meta">State: {{ open ? 'expanded' : 'collapsed' }}</text>
    <text class="sn-demo__hint"
      >Rich card: icon plate + title + description + corner close; fixed card width
      (--sn-popover-width).</text
    >
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
.sn-demo__hint {
  font-size: 22rpx;
  color: var(--sn-mp-color-text-secondary);
}
.sn-popover-demo__center {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
/* Docs-preview only — the bubble stays anchored to the component root; the
 * spacer leaves room for the bottom-placed card instead of covering copy. */
.sn-demo :deep(.sn-popover.sn-demo-contained) {
  position: relative;
  display: block;
}
.sn-popover-demo__space {
  height: 320rpx;
}

/* uni-app x 的 view 默认 overflow: hidden——本 demo 的包装类全链放开，
   弹层伸出包装盒时不被裁（App.vue 全局规则只命中页面级元素与 demo 根
   节点，够不到 demo 内部包装类，AGENTS.md §103）。 */
.sn-popover-demo__center {
  overflow: visible;
}
.sn-popover-demo__space {
  overflow: visible;
}
</style>
