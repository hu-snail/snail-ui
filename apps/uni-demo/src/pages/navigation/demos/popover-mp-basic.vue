<script setup lang="ts">
/**
 * Demo: sn-popover (uni-end) — normal mode with plain text content.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-popover from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnPopover from '@snui/uni-src/components/sn-popover/sn-popover.vue';

const open = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnPopover
      v-model="open"
      mode="normal"
      content="今天还有 3 个待办，先处理逾期的两项。"
      placement="bottom"
      :show-close="true"
      custom-class="sn-demo-contained"
    >
      <SnButton type="primary" block>点击查看气泡</SnButton>
    </SnPopover>

    <text class="sn-demo__meta">状态：{{ open ? '已展开' : '已收起' }}</text>
    <text class="sn-demo__hint"
      >点击气泡外部任意位置即可关闭（透明遮罩接管外部点击）；再点一次触发器也可收起。</text
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
/* Docs-preview only — keep the absolutely-positioned bubble inside the phone. */
.sn-popover.sn-demo-contained {
  position: absolute;
}
</style>
