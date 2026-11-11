<script setup lang="ts">
/**
 * Demo: sn-navbar — 固定定位（fixed / placeholder）。
 *
 * `fixed` 固定到顶部；`placeholder` 在原位置生成等高占位元素，内容不被遮挡。
 */
import SnNavbar from '@snui/uni-src/components/sn-navbar/sn-navbar.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnNavbar title="固定 + 占位" fixed placeholder bordered left-arrow />
    <text class="sn-demo__meta">fixed 后导航栏吸顶；placeholder 在原位置生成等高占位。</text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
