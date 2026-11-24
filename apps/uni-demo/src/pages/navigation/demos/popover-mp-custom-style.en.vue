<script setup lang="ts">
/**
 * Demo: sn-popover — node classes & offset: custom-arrow / custom-pop /
 * offset / custom-style.
 *
 * - `custom-arrow` / `custom-pop` append classes to the arrow / bubble nodes
 * - `offset` and `custom-style` both land on the root (`offset` via CSS vars)
 * - `custom-style` can override the component tokens: the fixed card width
 *   `--sn-popover-width` and the glyph plate `--sn-popover-icon-bg` /
 *   `--sn-popover-icon-color`
 *
 * Docs-preview only: `custom-class="sn-demo-contained"` keeps the bubble
 * inside the demo.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnPopover from '@snui/uni-src/components/sn-popover/sn-popover.vue';

const styledOpen = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnPopover
      v-model="styledOpen"
      mode="normal"
      title="Custom look"
      content="Outlined arrow, accent border, and an enlarged card / glyph plate through the component tokens."
      icon="star"
      placement="bottom-start"
      :offset="{ x: 0, y: 4 }"
      custom-arrow="sn-demo__arrow"
      custom-pop="sn-demo__pop"
      custom-class="sn-demo-contained"
      custom-style="display: block; --sn-popover-width: 600rpx; --sn-popover-icon-bg: var(--sn-mp-color-feedback-warning-soft); --sn-popover-icon-color: var(--sn-mp-color-feedback-warning);"
    >
      <SnButton block>custom-arrow / custom-pop / offset</SnButton>
    </SnPopover>

    <view class="sn-popover-demo__space" />

    <text class="sn-demo__hint"
      >--sn-popover-width / --sn-popover-icon-bg / --sn-popover-icon-color are all overridable
      through custom-style.</text
    >
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__hint {
  font-size: 22rpx;
  color: var(--sn-mp-color-text-secondary);
}
.sn-popover-demo__space {
  height: 360rpx;
}
/* Docs-preview only — keep the absolutely-positioned bubble inside the demo. */
.sn-demo :deep(.sn-popover.sn-demo-contained) {
  position: relative;
  display: block;
}
/* custom-pop / custom-arrow land on the bubble and arrow nodes. */
.sn-demo :deep(.sn-demo__pop) {
  /* The base card is borderless — the custom class draws its own outline. */
  border: 2rpx solid var(--sn-mp-color-action-primary);
}
.sn-demo :deep(.sn-demo__arrow) {
  /* Outline token: the diamond fill stays card-colored (covering the
   * junction so interiors connect) while the slant edges pick up the
   * accent — the outlined custom arrow. */
  --sn-popover-arrow-border: var(--sn-mp-color-action-primary);
}

/* uni-app x 的 view 默认 overflow: hidden——本 demo 的包装类全链放开，
   弹层伸出包装盒时不被裁（App.vue 全局规则只命中页面级元素与 demo 根
   节点，够不到 demo 内部包装类，AGENTS.md §103）。 */
.sn-popover-demo__space {
  overflow: visible;
}
</style>
