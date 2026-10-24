<script setup lang="ts">
/** Demo: sn-signature — Signature pad: touchstart / touchmove sample the points and `confirm` reports the stroke geometry (`paths`). */
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
    <text class="sn-demo__meta">Strokes: {{ strokes }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
