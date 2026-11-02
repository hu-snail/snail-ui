<script setup lang="ts">
/**
 * Demo: sn-popover — dark-theme bubble via sn-config-provider theme="dark".
 *
 * Two side-by-side panes: the dark one carries `.sn-theme-dark`, so the
 * bubble resolves the dark `--sn-mp-color-*` aliases (dark fill, light text,
 * dark border) — arrow and border follow the theme with no extra styling;
 * the light pane keeps the page-level values.
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
        content="Dark-theme bubble: dark fill, light text; the border and arrow flip with the theme, no extra styling needed."
        placement="bottom"
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
        content="Light-theme bubble: white fill, dark text — a direct contrast with the dark pane."
        placement="bottom"
        :show-close="true"
        custom-class="sn-popover-contained"
      >
        <SnButton type="primary" block>Show bubble</SnButton>
      </SnPopover>
      <view class="sn-popover-theme__space" />
    </SnConfigProvider>

    <text class="sn-popover-theme__meta">
      Every bubble color rides the --sn-popover-* tokens; the dark values flip through
      sn-config-provider (.sn-theme-dark) as one unit.
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
</style>
