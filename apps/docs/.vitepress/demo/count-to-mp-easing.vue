<script setup lang="ts">
/**
 * Demo: sn-count-to (uni-end) — use-easing 缓动曲线对比 + custom-class / custom-style。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-count-to from its SFC source.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnCountTo from '@snui/uni-src/components/sn-count-to/sn-count-to.vue'

const round = ref(0)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-count-to-demo__row">
      <text class="sn-count-to-demo__label">use-easing（默认，三次 ease-out）</text>
      <SnCountTo :key="`ease-${round}`" :end-val="10000" :duration="2400" />
    </view>

    <view class="sn-count-to-demo__row">
      <text class="sn-count-to-demo__label">use-easing=false（线性）</text>
      <SnCountTo :key="`linear-${round}`" :end-val="10000" :duration="2400" :use-easing="false" />
    </view>

    <SnCountTo
      :key="`custom-${round}`"
      :start-val="0"
      :end-val="8888"
      :duration="2000"
      prefix="¥"
      custom-class="sn-count-to-demo__custom"
      custom-style="letter-spacing: 1rpx"
    />
    <text class="sn-demo__meta">customClass 挂在根节点、customStyle 追加到 inline style（上方带底色的数字）。</text>

    <SnButton size="small" @tap="round += 1">重新播放两组</SnButton>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-count-to-demo__row {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}
.sn-count-to-demo__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: 24rpx;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 24rpx;
  line-height: var(--sn-mp-font-line-height-normal);
}
.sn-demo :deep(.sn-count-to-demo__custom) {
  padding: 4rpx var(--sn-mp-spacing-2);
  border-radius: var(--sn-mp-radius-sm);
  background-color: var(--sn-mp-color-background-subtle);
}
</style>
