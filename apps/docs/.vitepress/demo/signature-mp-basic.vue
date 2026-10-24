<script setup lang="ts">
/** Demo: sn-signature — sn-signature 签名板：touchstart / touchmove 采样点，确认时通过 confirm 返回笔画几何（paths）。 */
import { ref } from 'vue'
import SnSignature from '@snui/uni-src/components/sn-signature/sn-signature.vue'

const strokes = ref(0)
const onConfirm = (result: { paths: unknown[], isEmpty: boolean }) => {
  strokes.value = result.paths.length
}
const onClear = () => {
  strokes.value = 0
}
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSignature @confirm="onConfirm" @clear="onClear" />
    <text class="sn-demo__meta">笔画数：{{ strokes }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
