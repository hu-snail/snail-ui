<script setup lang="ts">
/**
 * Demo: sn-loadmore (uni-end) — custom texts and slots.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-loadmore from its SFC source.
 */
import SnLoadmore from '@snui/uni-src/components/sn-loadmore/sn-loadmore.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnLoadmore state="loading" loading-text="Fetching page 3…" />
    <SnLoadmore state="finished" finished-text="No more content" />
    <SnLoadmore state="error" error-text="Network hiccup — tap to retry" />

    <SnLoadmore state="loading">
      <template #loading>
        <text class="sn-loadmore-demo__custom">Custom loading slot…</text>
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
