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
      content="点击气泡外部任意位置即可关闭（页面根 closeOutside 通道）；再点一次触发器也可收起。"
      placement="bottom"
      custom-class="sn-demo-contained"
    >
      <SnButton type="primary" block>点我看提示</SnButton>
    </SnTooltip>

    <view class="sn-tooltip-demo__space" />

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
/* H5 / WEB only — docs preview pins the fixed layer to the phone frame.
 * uni-app x App compiles this OUT: App-side `position: absolute` lays out in
 * the direct parent's content box (css/position) and the page class still
 * reaches the component root (style-isolation) — the rule would pin the
 * fullscreen fixed layer into the demo card and clip it (App overflow
 * defaults to hidden). */
/* #ifdef H5 || WEB */
.sn-tooltip.sn-demo-contained {
  position: relative;
}
/* #endif */
.sn-tooltip-demo__space {
  height: 180rpx;
}
</style>
