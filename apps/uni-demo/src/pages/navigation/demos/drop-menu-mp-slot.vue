<script setup lang="ts">
/**
 * Demo: sn-drop-menu — default 插槽替换选项列表。
 *
 * `default` 插槽替换选项列表（仍复用面板与动画）。
 *
 * 预览专用：`custom-class="sn-demo-contained"` 让面板的定位上下文收在 demo 内。
 */
import { ref } from 'vue';
import SnDropMenu from '@snui/uni-src/components/sn-drop-menu/sn-drop-menu.vue';

const customValue = ref('7d');

const customOptions = [
  { label: '最近 7 天', value: '7d' },
  { label: '最近 30 天', value: '30d' },
];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnDropMenu
      v-model="customValue"
      :options="customOptions"
      title="自定义面板"
      custom-class="sn-demo-contained"
    >
      <view class="sn-demo__custom">
        <text
          v-for="option in customOptions"
          :key="option.value"
          class="sn-demo__custom-item"
          @tap="customValue = option.value"
        >
          {{ option.label }}{{ customValue === option.value ? ' ✓' : '' }}
        </text>
      </view>
    </SnDropMenu>

    <text class="sn-demo__meta">选中：{{ customValue }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
.sn-demo__custom {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-2);
  padding: var(--sn-mp-spacing-3);
}
.sn-demo__custom-item {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-primary);
}
/* Docs-preview only — the panel is absolutely positioned inside the root. */
.sn-demo :deep(.sn-drop-menu.sn-demo-contained) {
  position: relative;
}
</style>
