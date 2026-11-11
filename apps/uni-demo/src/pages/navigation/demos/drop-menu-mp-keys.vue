<script setup lang="ts">
/**
 * Demo: sn-drop-menu (uni-end) — label-key / value-key 字段重命名。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-drop-menu from its SFC source.
 */
import { ref } from 'vue';
import SnDropMenu from '@snui/uni-src/components/sn-drop-menu/sn-drop-menu.vue';

const value = ref('');

/** 字段重命名：label-key="name" / value-key="id"。 */
const options = [
  { name: '不限', id: 'all' },
  { name: '50 元以下', id: 'lt50' },
  { name: '50 - 200 元', id: 'mid' },
];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-drop-menu-demo__spacer" />

    <SnDropMenu
      v-model="value"
      :options="options"
      label-key="name"
      value-key="id"
      title="价格区间"
      custom-class="sn-demo-contained"
    />

    <text class="sn-drop-menu-demo__meta">当前值：{{ value || '未选择' }}（来自 id 字段）</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-drop-menu-demo__spacer {
  height: 320rpx;
}
.sn-drop-menu-demo__meta {
  font-size: 24rpx;
  color: var(--vp-c-text-2);
}
/* Docs-preview only — the panel is absolutely positioned inside the root. */
.sn-drop-menu.sn-demo-contained {
  position: relative;
}
</style>
