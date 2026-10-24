<script setup lang="ts">
/** Demo: sn-layout — basic 24-column grid. */
import SnLayout from '@snui/uni-src/components/sn-layout/sn-layout.vue'
import SnCol from '@snui/uni-src/components/sn-layout/sn-col.vue'
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnLayout>
      <SnCol :span="24"><view class="sn-demo__block">span=24</view></SnCol>
    </SnLayout>
    <SnLayout>
      <SnCol :span="12"><view class="sn-demo__block">span=12</view></SnCol>
      <SnCol :span="12"><view class="sn-demo__block">span=12</view></SnCol>
    </SnLayout>
    <SnLayout>
      <SnCol :span="8"><view class="sn-demo__block">8</view></SnCol>
      <SnCol :span="8"><view class="sn-demo__block">8</view></SnCol>
      <SnCol :span="8"><view class="sn-demo__block">8</view></SnCol>
    </SnLayout>
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
</style>
