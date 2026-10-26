<script setup lang="ts">
/**
 * Demo: sn-count-down (uni-end) — auto-start=false with a manual start + custom-class / custom-style.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-count-down from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnCountDown from '@snui/uni-src/components/sn-count-down/sn-count-down.vue';

const manual = ref<InstanceType<typeof SnCountDown> | null>(null);
const started = ref(0);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-count-down-demo__row">
      <text class="sn-count-down-demo__label">Default autoStart:</text>
      <SnCountDown :time="120000" format="mm:ss" />
    </view>

    <view class="sn-count-down-demo__row">
      <text class="sn-count-down-demo__label">auto-start=false:</text>
      <SnCountDown
        ref="manual"
        :time="120000"
        format="mm:ss"
        :auto-start="false"
        custom-class="sn-count-down-demo__custom"
        custom-style="letter-spacing: 2rpx"
      />
    </view>

    <view class="sn-count-down-demo__row">
      <SnButton
        size="small"
        @tap="
          manual?.start();
          started += 1;
        "
        >Start</SnButton
      >
      <SnButton size="small" @tap="manual?.reset()">Reset (stays idle)</SnButton>
    </view>

    <text class="sn-demo__meta"
      >Started manually {{ started }} times; customClass / customStyle land on the root node.</text
    >
    <text class="sn-demo__meta">
      With auto-start=false the countdown does not run on mount and reset() does not restart it —
      only an explicit start() begins timing.
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-count-down-demo__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8rpx;
}
.sn-count-down-demo__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: 26rpx;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 24rpx;
  line-height: var(--sn-mp-font-line-height-normal);
}
.sn-demo :deep(.sn-count-down-demo__custom) {
  padding: 2rpx var(--sn-mp-spacing-2);
  border-radius: var(--sn-mp-radius-sm);
  background-color: var(--sn-mp-color-action-primary-soft);
  color: var(--sn-mp-color-action-primary);
}
</style>
