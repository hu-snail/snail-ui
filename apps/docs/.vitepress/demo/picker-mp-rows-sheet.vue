<script setup lang="ts">
/** Demo: sn-picker — 滚筒几何与弹层：itemHeight / visibleItemCount / immediateChange / 遮罩层级 / custom*。 */
import { ref } from 'vue'
import SnPicker from '@snui/uni-src/components/sn-picker/sn-picker.vue'

const fruits = ['苹果', '香蕉', '樱桃', '西瓜', '葡萄']

const tall = ref<Array<string | number>>(['苹果'])
const openTall = ref(false)

const instant = ref<Array<string | number>>(['香蕉'])
const openInstant = ref(false)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">itemHeight / visibleItemCount（行高 52px、可见 5 行）+ customViewClass</text>
    <view class="sn-demo__button" @tap="openTall = true">大行高</view>
    <text class="sn-demo__meta">已选：{{ tall.join(' / ') }}</text>
    <SnPicker
      v-model="tall"
      v-model:visible="openTall"
      :columns="[fruits]"
      title="大行高"
      :item-height="52"
      :visible-item-count="5"
      custom-view-class="sn-demo__roller"
    />

    <text class="sn-demo__title">immediateChange + closeOnClickModal / zIndex / safeAreaInsetBottom / custom*</text>
    <view class="sn-demo__button" @tap="openInstant = true">滚动即写回</view>
    <text class="sn-demo__meta">已选：{{ instant.join(' / ') }}</text>
    <SnPicker
      v-model="instant"
      v-model:visible="openInstant"
      :columns="[fruits]"
      title="滚动即写回"
      immediate-change
      :close-on-click-modal="false"
      :safe-area-inset-bottom="false"
      :z-index="1300"
      root-portal
      custom-class="sn-demo__sheet"
      custom-style="border-radius: var(--sn-mp-radius-xl);"
    />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 72rpx;
  padding: 0 32rpx;
  border-radius: var(--sn-mp-button-radius);
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
  font-size: 28rpx;
}

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}

.sn-demo__roller {
  padding-bottom: 8rpx;
}

.sn-demo__sheet {
  background-color: var(--sn-mp-color-background-elevated);
}
</style>
