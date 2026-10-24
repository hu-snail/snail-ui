<script setup lang="ts">
/**
 * Demo: sn-circle (uni-end) — speed / stroke-linecap / custom-class / custom-style.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-circle from its SFC source.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnCircle from '@snui/uni-src/components/sn-circle/sn-circle.vue'

const percent = ref(20)

function step(): void {
  percent.value = percent.value >= 100 ? 20 : Math.min(100, percent.value + 20)
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__row">
      <SnCircle :model-value="percent" :size="120" :speed="0" text="speed=0" />
      <SnCircle :model-value="percent" :size="120" :speed="200" text="speed=200" />
      <SnCircle :model-value="percent" :size="120" :speed="10" text="speed=10" />
    </view>

    <view class="sn-demo__row">
      <SnCircle :model-value="60" :size="120" stroke-linecap="butt" text="butt" />
      <SnCircle :model-value="60" :size="120" stroke-linecap="square" text="square" />
      <SnCircle :model-value="60" :size="120" stroke-linecap="round" text="round" />
    </view>

    <SnCircle
      :model-value="percent"
      :size="160"
      text="custom-class + custom-style"
      custom-class="sn-demo__ring"
      custom-style="padding: var(--sn-mp-spacing-2);"
    />

    <SnButton type="primary" block @tap="step">+20%（观察不同 speed 的过渡）</SnButton>

    <text class="sn-demo__meta">
      speed 是「每秒多少百分比」，0 关闭过渡；stroke-linecap 仅为 wot-ui 对齐声明，
      锥形扫描没有端点，因此三种取值视觉一致。
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
  align-items: center;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* custom-class 落在 sn-circle 根节点上。 */
.sn-demo :deep(.sn-demo__ring) {
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-subtle);
}
</style>
