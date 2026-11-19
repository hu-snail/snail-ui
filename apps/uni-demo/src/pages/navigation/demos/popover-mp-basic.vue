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
        title="快速提示"
        content="小程序没有 hover，气泡用点击触发；点击气泡外部任意位置即可关闭，再点一次触发器也可收起。"
        :icon-data="MapPin"
        placement="bottom"
        :show-close="true"
        custom-class="sn-demo-contained"
      >
        <SnButton type="primary">显示气泡</SnButton>
      </SnPopover>
    </view>

    <view class="sn-popover-demo__space" />

    <text class="sn-demo__meta">状态：{{ open ? '已展开' : '已收起' }}</text>
    <text class="sn-demo__hint"
      >富内容卡片：图标圆底 + 标题 + 描述 + 右上角关闭；卡片定宽（--sn-popover-width）。</text
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
</style>
