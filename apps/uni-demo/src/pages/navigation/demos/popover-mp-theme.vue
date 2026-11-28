<script setup lang="ts">
/**
 * Demo: sn-popover — 暗黑主题气泡（sn-config-provider theme="dark"）。
 *
 * 两块对照 pane：暗黑 pane 内的气泡走 `.sn-theme-dark` 的 `--sn-mp-color-*`
 * 暗色别名（`--sn-popover-bg` = 深底、文字 = 浅字），
 * 箭头与气泡同色、自动跟随，无需单独配色；浅色 pane 保持页面级值。
 *
 * 预览专用：`custom-class="sn-popover-contained"` 用 relative 锚定气泡，
 * spacer 给 bottom 气泡留出展开空间。
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnConfigProvider from '@snui/uni-src/components/sn-config-provider/sn-config-provider.vue';
import SnPopover from '@snui/uni-src/components/sn-popover/sn-popover.vue';

const darkOpen = ref(false);
const lightOpen = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnConfigProvider theme="dark" custom-class="sn-popover-theme__pane">
      <view class="sn-popover-theme__label">theme="dark"</view>
      <SnPopover
        v-model="darkOpen"
        mode="normal"
        content="暗黑主题气泡：深底浅字"
        placement="bottom-start"
        :show-close="true"
        custom-class="sn-popover-contained"
      >
        <SnButton type="primary" block>显示气泡</SnButton>
      </SnPopover>
      <view class="sn-popover-theme__space" />
    </SnConfigProvider>

    <SnConfigProvider theme="light" custom-class="sn-popover-theme__pane">
      <view class="sn-popover-theme__label">theme="light"</view>
      <SnPopover
        v-model="lightOpen"
        mode="normal"
        content="浅色主题气泡：白底深字"
        placement="bottom-start"
        :show-close="true"
        custom-class="sn-popover-contained"
      >
        <SnButton type="primary" block>显示气泡</SnButton>
      </SnPopover>
      <view class="sn-popover-theme__space" />
    </SnConfigProvider>

    <text class="sn-popover-theme__meta">
      气泡配色全部走 --sn-popover-* token，暗黑由 sn-config-provider（.sn-theme-dark）统一翻转。
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-popover-theme__pane {
  display: block;
  padding: 24rpx;
  border: 1px solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-md);
}
.sn-popover-theme__label {
  margin-bottom: 16rpx;
  font-size: var(--sn-mp-font-size-xs);
  color: var(--sn-mp-color-text-secondary);
}
.sn-popover-theme__space {
  height: 200rpx;
}
.sn-popover-theme__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
/* Docs-preview only — relative keeps the demo flow intact while the bubble
 * stays anchored to the component root. */
.sn-popover.sn-popover-contained {
  position: relative;
}

/* uni-app x 的 view 默认 overflow: hidden——本 demo 的包装类全链放开，
   弹层伸出包装盒时不被裁（App.vue 全局规则只命中页面级元素与 demo 根
   节点，够不到 demo 内部包装类，AGENTS.md §103）。 */
.sn-popover-theme__label {
  overflow: visible;
}
.sn-popover-theme__meta {
  overflow: visible;
}
.sn-popover-theme__pane {
  overflow: visible;
}
.sn-popover-theme__space {
  overflow: visible;
}
</style>
