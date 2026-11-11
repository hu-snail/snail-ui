<script setup lang="ts">
/**
 * Demo: sn-navbar — English shadow of navbar-mp-fixed.
 */
import SnNavbar from '@snui/uni-src/components/sn-navbar/sn-navbar.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnNavbar title="Fixed with placeholder" fixed placeholder bordered left-arrow />
    <text class="sn-demo__meta">
      fixed pins the bar to the top; placeholder renders an equal-height spacer in place.
    </text>
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
