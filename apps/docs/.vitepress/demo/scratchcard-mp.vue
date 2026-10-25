<script setup lang="ts">
/**
 * Demo: sn-scratchcard (uni-end) — 刮刮乐：真刮擦（元素 canvas）+ 降级点按揭示。
 * 预览环境（浏览器）走元素 canvas，可真实刮擦。
 */
import { ref } from 'vue'
import SnScratchcard from '@snui/uni-src/components/sn-scratchcard/sn-scratchcard.vue'

const opened = ref(false)
const scratchRef = ref<InstanceType<typeof SnScratchcard> | null>(null)

function onOpen(): void {
  opened.value = true
}

function reset(): void {
  opened.value = false
  scratchRef.value?.reset()
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnScratchcard
      ref="scratchRef"
      title="刮一刮"
      :ratio="0.6"
      watermark-text="SNAIL"
      custom-style="width: 560rpx; height: 240rpx"
      @open="onOpen"
    >
      <view class="prize">
        <text class="prize__name">谢谢参与</text>
        <text class="prize__sub">再接再厉</text>
      </view>
    </SnScratchcard>
    <text class="sn-demo__meta">{{ opened ? '已刮开（open 已触发）' : '用手指在灰色封面刮一刮' }}</text>
    <view class="sn-demo__reset" :hover-class="'sn-demo__reset--down'" @tap="reset">
      <text class="sn-demo__reset-text">重置</text>
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
  font-size: var(--sn-mp-font-size-lg);
  font-weight: var(--sn-mp-font-weight-bold);
  color: var(--sn-mp-color-feedback-warning);
}

.prize__sub {
  margin-top: 6rpx;
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo__reset {
  align-self: center;
  padding: 14rpx 40rpx;
  border-radius: 32rpx;
  background-color: var(--sn-mp-color-background-subtle);
}

.sn-demo__reset--down {
  opacity: 0.8;
}

.sn-demo__reset-text {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-primary);
}
</style>
