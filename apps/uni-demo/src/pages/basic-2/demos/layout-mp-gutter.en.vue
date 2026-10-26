<script setup lang="ts">
/** Demo: sn-layout — gutter, offset and alignment. */
import SnLayout from '@snui/uni-src/components/sn-layout/sn-layout.vue';
import SnCol from '@snui/uni-src/components/sn-layout/sn-col.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnLayout :gutter="16">
      <SnCol :span="8"><view class="sn-demo__block">8</view></SnCol>
      <SnCol :span="8"><view class="sn-demo__block">8</view></SnCol>
      <SnCol :span="8"><view class="sn-demo__block">8</view></SnCol>
    </SnLayout>
    <SnLayout>
      <SnCol :span="8" :offset="8"><view class="sn-demo__block">offset=8</view></SnCol>
    </SnLayout>
    <SnLayout justify="space-between" align="middle">
      <SnCol :span="6"><view class="sn-demo__block">6</view></SnCol>
      <SnCol :span="6"><view class="sn-demo__block">6</view></SnCol>
    </SnLayout>
    <text class="sn-demo__meta">gutter=16; offset=8; space-between with middle alignment</text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}
.sn-demo__block {
  padding: 10px;
  border-radius: 8rpx;
  background-color: var(--sn-mp-color-action-primary-soft);
  font-size: 24rpx;
  color: var(--sn-mp-color-action-primary);
  text-align: center;
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
