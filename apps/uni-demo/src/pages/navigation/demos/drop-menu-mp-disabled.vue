<script setup lang="ts">
/**
 * Demo: sn-drop-menu — disabled 禁用整条菜单栏。
 *
 * `disabled` 禁用整条菜单栏，点击无反应。
 *
 * 预览专用：`custom-class="sn-demo-contained"` 让面板的定位上下文收在 demo 内。
 */
import { ref } from 'vue';
import SnDropMenu from '@snui/uni-src/components/sn-drop-menu/sn-drop-menu.vue';

const disabledValue = ref('a');

const options = [
  { label: '最近 7 天', value: '7d' },
  { label: '最近 30 天', value: '30d' },
];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnDropMenu
      v-model="disabledValue"
      :options="options"
      disabled
      title="已禁用"
      custom-class="sn-demo-contained"
    />

    <text class="sn-demo__meta">点击菜单栏无反应，选中值保持 {{ disabledValue }}。</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
/* Docs-preview only — the panel is absolutely positioned inside the root. */
.sn-demo :deep(.sn-drop-menu.sn-demo-contained) {
  position: relative;
}
</style>
