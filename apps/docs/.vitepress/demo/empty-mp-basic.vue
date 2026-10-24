<script setup lang="ts">
/**
 * Demo: sn-empty (uni-end) — default glyph + tip.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-empty from its SFC source.
 */
import SnEmpty from '@snui/uni-src/components/sn-empty/sn-empty.vue'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnEmpty />
    <SnEmpty tip="暂无数据" />
    <SnEmpty tip="没有更多内容了，稍后再来看看" />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
</style>
