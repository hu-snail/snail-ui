<script setup lang="ts">
/**
 * Demo: sn-skeleton (uni-end) — custom rowCol layouts.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-skeleton from its SFC source.
 */
import SnSkeleton from '@snui/uni-src/components/sn-skeleton/sn-skeleton.vue';

const cardRows = [
  [
    { type: 'circle' as const, size: 96 },
    { type: 'rect' as const, size: '40%' },
  ],
  1,
  [{ type: 'text' as const, size: '80%' }],
];

const mixedRows = [
  [{ type: 'image' as const, size: '100%', height: 200 }],
  [
    { type: 'rect' as const, size: '60%' },
    { type: 'text' as const, size: '30%' },
  ],
  2,
];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSkeleton :row-col="cardRows" />
    <SnSkeleton :row-col="mixedRows" />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}
</style>
