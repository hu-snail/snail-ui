<script setup lang="ts">
/** Demo: sn-gap (uni-end) — 底部安全区适配。 */
import SnGap from '@snui/uni-src/components/sn-gap/sn-gap.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo-block">列表最后一行</view>
    <SnGap :height="12" safe-area-bottom />
    <text class="sn-demo-note"
      >开启 safeAreaBottom 后，间隔在自身高度之外再叠加 env(safe-area-inset-bottom)。</text
    >
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
}
.sn-demo-block {
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 12px;
  border-radius: 8px;
  background-color: var(--sn-mp-color-background-surface);
  color: var(--sn-mp-color-text-primary);
  font-size: 13px;
}
.sn-demo-note {
  color: var(--sn-mp-color-text-secondary);
  font-size: 12px;
  line-height: 1.6;
}
</style>
