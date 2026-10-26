<script setup lang="ts">
/**
 * Demo: sn-scratchcard (uni-end) — 基础用法：刮开达阈值触发 open，reset()
 * 重绘封面可再刮。
 */
import { ref } from 'vue';
import SnScratchcard from '@snui/uni-src/components/sn-scratchcard/sn-scratchcard.vue';

const scratchRef = ref<InstanceType<typeof SnScratchcard> | null>(null);
const opened = ref(false);

function onOpen(): void {
  opened.value = true;
}

function reset(): void {
  opened.value = false;
  scratchRef.value?.reset();
}
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnScratchcard
      ref="scratchRef"
      title="刮一刮"
      :ratio="0.6"
      watermark-text="SNAIL"
      custom-style="width: 100%; height: 240rpx"
      @open="onOpen"
    >
      <view class="prize">
        <text class="prize__name">谢谢参与</text>
        <text class="prize__sub">再接再厉</text>
      </view>
    </SnScratchcard>
    <text class="sn-demo__meta">
      {{ opened ? '已刮开（open 已触发）' : '在封面上刮一刮，刮开面积达到 60% 揭示' }}
    </text>
    <view class="scratch-actions">
      <view class="scratch-actions__btn" hover-class="scratch-actions__btn--down" @tap="reset">
        <text class="scratch-actions__btn-text">重置</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.prize {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.prize__name {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-lg);
  font-weight: var(--sn-mp-font-weight-bold);
}

.prize__sub {
  margin-top: 6rpx;
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
}

.scratch-actions {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.scratch-actions__btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 14rpx 48rpx;
  border-radius: 32rpx;
  background-color: var(--sn-mp-color-background-subtle);
}

.scratch-actions__btn--down {
  opacity: 0.8;
}

.scratch-actions__btn-text {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-sm);
}

.sn-demo__meta {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-tertiary);
}
</style>
