<script setup lang="ts">
/** Demo: sn-badge (uni-end) — dot, shapes, border and offsets. */
import SnBadge from '@snui/uni-src/components/sn-badge/sn-badge.vue';
</script>

<template>
  <view class="sn-demo">
    <SnBadge is-dot>
      <view class="sn-demo-host">Dot</view>
    </SnBadge>
    <SnBadge :value="12" shape="square">
      <view class="sn-demo-host">Square</view>
    </SnBadge>
    <SnBadge :value="12" shape="bubble">
      <view class="sn-demo-host">Bubble</view>
    </SnBadge>
    <SnBadge :value="12" border>
      <view class="sn-demo-host">Border</view>
    </SnBadge>
    <SnBadge :value="12" :top="6" :right="6">
      <view class="sn-demo-host">Offset</view>
    </SnBadge>
    <SnBadge :value="12" bg-color="var(--sn-mp-color-purple)">
      <view class="sn-demo-host">Custom</view>
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
