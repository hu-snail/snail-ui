<script setup lang="ts">
/**
 * Demo: sn-popover — dark theme bubble (sn-config-provider theme="dark").
 *
 * Two contrast panes: inside the dark pane the bubble picks up the
 * `.sn-theme-dark` `--sn-mp-color-*` aliases (`--sn-popover-bg` = deep fill,
 * text = light); the arrow shares the bubble colour and follows the theme
 * automatically. The light pane keeps page-level values.
 *
 * Docs-preview only: `custom-class="sn-popover-contained"` anchors the bubble
 * with relative; the spacer leaves room for the bottom bubble.
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
        content="Dark theme bubble: deep fill, light text"
        placement="bottom-start"
        :show-close="true"
        custom-class="sn-popover-contained"
      >
        <SnButton type="primary" block>Show bubble</SnButton>
      </SnPopover>
      <view class="sn-popover-theme__space" />
    </SnConfigProvider>

    <SnConfigProvider theme="light" custom-class="sn-popover-theme__pane">
      <view class="sn-popover-theme__label">theme="light"</view>
      <SnPopover
        v-model="lightOpen"
        mode="normal"
        content="Light theme bubble: white fill, dark text"
        placement="bottom-start"
        :show-close="true"
        custom-class="sn-popover-contained"
      >
        <SnButton type="primary" block>Show bubble</SnButton>
      </SnPopover>
      <view class="sn-popover-theme__space" />
    </SnConfigProvider>

    <text class="sn-popover-theme__meta">
      The bubble palette is entirely token-driven (--sn-popover-*); dark mode flips through
      sn-config-provider (.sn-theme-dark).
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
