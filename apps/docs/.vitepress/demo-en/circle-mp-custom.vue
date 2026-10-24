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

    <SnButton type="primary" block @tap="step">+20% (watch the speed difference)</SnButton>

    <text class="sn-demo__meta">
      speed is "percent per second" and 0 disables the transition; stroke-linecap is declared
      for wot-ui parity only — a conic sweep has no caps, so all three values look identical.
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
/* custom-class lands on the sn-circle root node. */
.sn-demo :deep(.sn-demo__ring) {
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-subtle);
}
</style>
