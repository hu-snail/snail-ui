<script setup lang="ts">
/**
 * Demo: sn-count-down (uni-end) — start / pause / reset + millisecond mode.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-count-down from its SFC source.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnCountDown from '@snui/uni-src/components/sn-count-down/sn-count-down.vue'

const ref1 = ref<InstanceType<typeof SnCountDown> | null>(null)
const finished = ref(0)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnCountDown ref="ref1" :time="600000" format="mm:ss" @finish="finished += 1" />

    <view class="sn-count-down-demo__row">
      <SnButton size="small" @tap="ref1?.start()">Start / resume</SnButton>
      <SnButton size="small" @tap="ref1?.pause()">Pause</SnButton>
      <SnButton size="small" @tap="ref1?.reset()">Reset</SnButton>
    </view>

    <text class="sn-count-down-demo__meta">Finished {{ finished }} time(s)</text>

    <SnCountDown :time="10000" millisecond format="ss.S" />
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
  gap: 12rpx;
}
.sn-count-down-demo__meta {
  font-size: 24rpx;
  color: var(--vp-c-text-2);
}
</style>
