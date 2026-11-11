<script setup lang="ts">
/**
 * Demo: sn-transition (uni-end) — 保留节点（destroy = false）。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-transition from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnTransition from '@snui/uni-src/components/sn-transition/sn-transition.vue';

const keepAlive = ref(true);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton size="small" @tap="keepAlive = !keepAlive"> destroy = false（保留节点） </SnButton>
    <SnTransition :show="keepAlive" name="zoom-in" :destroy="false">
      <view class="sn-transition-demo__box">
        <text class="sn-transition-demo__text">destroy = false</text>
      </view>
    </SnTransition>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-transition-demo__box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120rpx;
  border-radius: 16rpx;
  background-color: var(--sn-mp-color-background-soft);
}
.sn-transition-demo__text {
  font-size: 26rpx;
  color: var(--sn-mp-color-text-primary);
}
</style>
