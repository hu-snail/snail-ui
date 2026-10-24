<script setup lang="ts">
/**
 * Demo: sn-loadmore (uni-end) — custom texts and slots.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-loadmore from its SFC source.
 */
import SnLoadmore from '@snui/uni-src/components/sn-loadmore/sn-loadmore.vue'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnLoadmore state="loading" loading-text="正在获取第 3 页…" />
    <SnLoadmore state="finished" finished-text="没有更多内容了" />
    <SnLoadmore state="error" error-text="网络开小差了，点击重试" />

    <SnLoadmore state="loading">
      <template #loading>
        <text class="sn-loadmore-demo__custom">自定义加载中插槽…</text>
      </template>
    </SnLoadmore>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.sn-loadmore-demo__custom {
  font-size: 26rpx;
  color: var(--sn-mp-color-action-primary);
}
</style>
