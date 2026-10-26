<script setup lang="ts">
/**
 * Demo: sn-floating-panel (uni-end) — drag the handle to resize, snap to anchors.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-floating-panel from its SFC source.
 */
import { ref } from 'vue';
import SnFloatingPanel from '@snui/uni-src/components/sn-floating-panel/sn-floating-panel.vue';

const height = ref(120);
const settled = ref(120);

function onHeightChange(payload: { height: number }): void {
  settled.value = Math.round(payload.height);
}

const items = ['附近的门店', '营业时间 09:00 - 22:00', '停车位充足', '支持线上取货'];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-floating-panel-demo__meta">
      当前高度：{{ Math.round(height) }} / 吸附后：{{ settled }}
    </text>

    <SnFloatingPanel
      v-model:height="height"
      :anchors="[120, 320]"
      custom-class="sn-demo-contained"
      @height-change="onHeightChange"
    >
      <view class="sn-floating-panel-demo__body">
        <text class="sn-floating-panel-demo__title">拖动上方横条调整面板高度</text>
        <text v-for="item in items" :key="item" class="sn-floating-panel-demo__item">
          {{ item }}
        </text>
      </view>
    </SnFloatingPanel>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  min-height: 500rpx;
}
.sn-floating-panel-demo__meta {
  font-size: 24rpx;
  color: var(--vp-c-text-2);
}
.sn-floating-panel-demo__body {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding-top: 16rpx;
}
.sn-floating-panel-demo__title {
  font-size: 28rpx;
  color: var(--sn-mp-color-text-primary);
}
.sn-floating-panel-demo__item {
  font-size: 26rpx;
  color: var(--sn-mp-color-text-secondary);
}
/* Docs-preview only — keep the fixed-position panel inside the phone screen. */
.sn-floating-panel.sn-demo-contained {
  position: absolute;
}
</style>
