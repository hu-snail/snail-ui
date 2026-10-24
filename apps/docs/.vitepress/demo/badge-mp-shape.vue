<script setup lang="ts">
/** Demo: sn-badge (uni-end) — 圆点 / 形状 / 描边 / 偏移。 */
import SnBadge from '@snui/uni-src/components/sn-badge/sn-badge.vue'
</script>

<template>
  <view class="sn-demo">
    <SnBadge is-dot>
      <view class="sn-demo-host">点</view>
    </SnBadge>
    <SnBadge :value="12" shape="square">
      <view class="sn-demo-host">方形</view>
    </SnBadge>
    <SnBadge :value="12" shape="bubble">
      <view class="sn-demo-host">气泡</view>
    </SnBadge>
    <SnBadge :value="12" border>
      <view class="sn-demo-host">描边</view>
    </SnBadge>
    <SnBadge :value="12" :top="6" :right="6">
      <view class="sn-demo-host">偏移</view>
    </SnBadge>
    <SnBadge :value="12" bg-color="var(--sn-mp-color-purple)">
      <view class="sn-demo-host">自定义</view>
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
