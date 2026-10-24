<script setup lang="ts">
/** Demo: sn-badge (uni-end) — numeric values, max cap and types. */
import SnBadge from '@snui/uni-src/components/sn-badge/sn-badge.vue'
</script>

<template>
  <view class="sn-demo">
    <SnBadge :value="8">
      <view class="sn-demo-host">8</view>
    </SnBadge>
    <SnBadge :value="120" :max="99">
      <view class="sn-demo-host">99+</view>
    </SnBadge>
    <SnBadge :value="5" type="primary">
      <view class="sn-demo-host">Primary</view>
    </SnBadge>
    <SnBadge :value="5" type="success">
      <view class="sn-demo-host">Success</view>
    </SnBadge>
    <SnBadge :value="5" type="warning">
      <view class="sn-demo-host">Warning</view>
    </SnBadge>
    <SnBadge :value="5" type="info">
      <view class="sn-demo-host">Info</view>
    </SnBadge>
  </view>
</template>

<style scoped>
.sn-demo {
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
</style>
