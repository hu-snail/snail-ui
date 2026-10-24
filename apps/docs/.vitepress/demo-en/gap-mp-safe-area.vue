<script setup lang="ts">
/** Demo: sn-gap (uni-end) — bottom safe-area adaptation. */
import SnGap from '@snui/uni-src/components/sn-gap/sn-gap.vue'
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo-block">Last row of the list</view>
    <SnGap :height="12" safe-area-bottom />
    <text class="sn-demo-note">
      With safeAreaBottom on, the spacer adds env(safe-area-inset-bottom) on top of its own height.
    </text>
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
