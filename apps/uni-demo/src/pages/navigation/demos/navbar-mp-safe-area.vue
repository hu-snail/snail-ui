<script setup lang="ts">
/**
 * Demo: sn-navbar — 安全区与层级（safe-area-inset-top / z-index）。
 *
 * - `safe-area-inset-top` 把状态栏高度补成 padding-top
 * - `z-index` 只在 `fixed` 时生效
 */
import SnNavbar from '@snui/uni-src/components/sn-navbar/sn-navbar.vue';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnNavbar title="安全区 + 层级" safe-area-inset-top :z-index="30" bordered />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
