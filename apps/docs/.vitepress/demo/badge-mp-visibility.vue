<script setup lang="ts">
/** Demo: sn-badge (uni-end) — 显隐规则（0 / showZero / hidden）。 */
import { ref } from 'vue'
import SnBadge from '@snui/uni-src/components/sn-badge/sn-badge.vue'

const count = ref(0)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo-row">
      <SnBadge :value="0">
        <view class="sn-demo-host">0 隐藏</view>
      </SnBadge>
      <SnBadge :value="0" show-zero>
        <view class="sn-demo-host">0 显示</view>
      </SnBadge>
      <SnBadge :value="3" hidden>
        <view class="sn-demo-host">hidden</view>
      </SnBadge>
    </view>

    <view class="sn-demo-row">
      <SnBadge :value="count">
        <view class="sn-demo-host">{{ count }}</view>
      </SnBadge>
      <view class="sn-demo-stepper" @tap="count = (count + 1) % 4">
        <text class="sn-demo-stepper__label">加一</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
}
.sn-demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: center;
}
.sn-demo-host {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background-color: var(--sn-mp-color-background-subtle);
  color: var(--sn-mp-color-text-secondary);
  font-size: 12px;
}
.sn-demo-stepper {
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding: 0 14px;
  border-radius: 16px;
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
}
.sn-demo-stepper__label {
  font-size: 13px;
}
</style>
