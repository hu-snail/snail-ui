<script setup lang="ts">
/**
 * Demo: sn-popover — 节点类名与偏移：custom-arrow / custom-pop / offset / custom-style。
 *
 * - `custom-arrow` / `custom-pop` 给箭头节点与气泡节点追加类名
 * - `offset` 与 `custom-style` 同时作用在根节点（`offset` 走 CSS 变量）
 *
 * 预览专用：`custom-class="sn-demo-contained"` 把气泡定位收在 demo 内。
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
      content="带描边箭头与气泡的气泡"
      placement="bottom-start"
      :offset="{ x: 0, y: 4 }"
      custom-arrow="sn-demo__arrow"
      custom-pop="sn-demo__pop"
      custom-class="sn-demo-contained"
      custom-style="display: block;"
    >
      <SnButton block>custom-arrow / custom-pop / offset</SnButton>
    </SnPopover>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
/* Docs-preview only — keep the absolutely-positioned bubble inside the demo. */
.sn-demo :deep(.sn-popover.sn-demo-contained) {
  position: relative;
  display: block;
}
/* custom-pop / custom-arrow land on the bubble and arrow nodes. */
.sn-demo :deep(.sn-demo__pop) {
  border-color: var(--sn-mp-color-action-primary);
}
.sn-demo :deep(.sn-demo__arrow) {
  border-color: var(--sn-mp-color-action-primary);
}
</style>
