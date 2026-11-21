<script setup lang="ts">
/**
 * Demo: sn-tooltip (uni-end) — tap-triggered hint with a toggle.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-tooltip from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnTooltip from '@snui/uni-src/components/sn-tooltip/sn-tooltip.vue';

const open = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnTooltip
      v-model="open"
      content="Tapping outside does not close it — tap the trigger again"
      placement="bottom"
      custom-class="sn-demo-contained"
    >
      <SnButton type="primary" block>Tap for the hint</SnButton>
    </SnTooltip>

    <view class="sn-tooltip-demo__space" />

    <text class="sn-tooltip-demo__meta"> State: {{ open ? 'shown' : 'closed' }} </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-tooltip-demo__meta {
  font-size: 24rpx;
  color: var(--vp-c-text-2);
}
/* Docs preview only — pin the fixed layer to the phone frame. The uni-demo-x
 * generated copy strips this rule in gen-x.mjs (vapor ignores style-level
 * conditional compilation, so the App side must not ship it). */
.sn-tooltip.sn-demo-contained {
  position: relative;
}
.sn-tooltip-demo__space {
  height: 180rpx;
}

/* uni-app x 的 view 默认 overflow: hidden——本 demo 的包装类全链放开，
   锚定弹层（tooltip / popover / drop-menu）伸出包装盒时不被裁
   （App.vue 全局规则只命中页面级元素与 demo 根节点，AGENTS.md §103）。 */
.sn-tooltip-demo__meta {
  overflow: visible;
}
.sn-tooltip-demo__space {
  overflow: visible;
}
</style>
