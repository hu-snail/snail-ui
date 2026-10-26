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
      content="点击外部无法关闭，需要再次点击触发器"
      placement="bottom"
      custom-class="sn-demo-contained"
    >
      <SnButton type="primary" block>点我看提示</SnButton>
    </SnTooltip>

    <text class="sn-tooltip-demo__meta"> 当前状态：{{ open ? '已显示' : '已关闭' }} </text>
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
/* Docs-preview only — keep the absolutely-positioned bubble inside the phone. */
.sn-tooltip.sn-demo-contained {
  position: absolute;
}
</style>
