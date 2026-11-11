<script setup lang="ts">
/**
 * Demo: sn-drop-menu — 面板高度与样式：popup-height / custom-popup-class / custom-popup-style。
 *
 * - `popup-height` 限制面板高度（面板默认最多 80vh）
 * - `custom-popup-class` / `custom-popup-style` 作用于选项面板
 *
 * 预览专用：`custom-class="sn-demo-contained"` 让面板的定位上下文收在 demo 内。
 */
import { ref } from 'vue';
import SnDropMenu from '@snui/uni-src/components/sn-drop-menu/sn-drop-menu.vue';

const styled = ref('');

const styledOptions = [
  { label: '北京', value: 'bj', tip: '默认城市' },
  { label: '上海', value: 'sh' },
  { label: '广州', value: 'gz' },
];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnDropMenu
      v-model="styled"
      :options="styledOptions"
      popup-height="240rpx"
      custom-popup-class="sn-demo__panel"
      custom-popup-style="padding: var(--sn-mp-spacing-2);"
      title="城市"
      custom-class="sn-demo-contained"
    />

    <text class="sn-demo__meta">选中：{{ styled || '未选' }}</text>
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
/* custom-popup-class lands on the option panel. */
.sn-demo :deep(.sn-demo__panel) {
  border-radius: var(--sn-mp-radius-sm);
}
</style>
