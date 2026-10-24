<script setup lang="ts">
/**
 * Demo: sn-floating-panel (uni-end) — custom-style / custom-class.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-floating-panel from its SFC source.
 */
import { ref } from 'vue'
import SnFloatingPanel from '@snui/uni-src/components/sn-floating-panel/sn-floating-panel.vue'

const height = ref(160)
const items = ['附近的门店', '营业时间 09:00 - 22:00', '停车位充足']
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">
      custom-style 与组件自身的 height / duration 自定义属性合并后写在根节点上；
      custom-class 追加根节点类名（这里加了一层圆角与阴影）。
    </text>

    <SnFloatingPanel
      v-model:height="height"
      :anchors="[160, 360]"
      custom-class="sn-demo-contained sn-demo__panel"
      custom-style="border-radius: var(--sn-mp-radius-xl);"
    >
      <view class="sn-demo__body">
        <text class="sn-demo__title">拖动横条调整高度</text>
        <text v-for="item in items" :key="item" class="sn-demo__item">{{ item }}</text>
      </view>
    </SnFloatingPanel>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  min-height: 480rpx;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
.sn-demo__body {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  padding-top: 16rpx;
}
.sn-demo__title {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-sm);
}
.sn-demo__item {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
/* custom-class 落在 sn-floating-panel 根节点上（与 sn-demo-contained 同时存在）。 */
.sn-demo :deep(.sn-demo__panel) {
  box-shadow: var(--sn-mp-shadow-lg);
}
/* Docs-preview only — keep the fixed-position panel inside the phone screen. */
.sn-floating-panel.sn-demo-contained {
  position: absolute;
}
</style>
