<script setup lang="ts">
/**
 * Demo: sn-notice-bar (uni-end) — warning / info / danger tints + close button.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-notice-bar from its SFC source.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnNoticeBar from '@snui/uni-src/components/sn-notice-bar/sn-notice-bar.vue'

const closableKey = ref(0)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnNoticeBar type="warning" text="warning：默认类型，橙色底" />
    <SnNoticeBar type="info" text="info：中性信息，灰色底" />
    <SnNoticeBar type="danger" text="danger：危险提示，红色底" />

    <SnNoticeBar
      :key="closableKey"
      type="info"
      text="closable：点右侧 × 关闭本条通知"
      closable
      @close="closableKey += 1"
    />
    <SnButton size="small" @tap="closableKey += 1">恢复已关闭的通知</SnButton>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
