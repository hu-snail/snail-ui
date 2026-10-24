<script setup lang="ts">
/** Demo: sn-datetime-picker — 弹层外观与行为：cancelButtonText / closeOnClickModal / safeAreaInsetBottom / zIndex / immediateChange / rootPortal / custom*。 */
import { ref } from 'vue'
import SnDatetimePicker from '@snui/uni-src/components/sn-datetime-picker/sn-datetime-picker.vue'

const immediate = ref<string | number | undefined>(new Date(2024, 5, 15).getTime())
const openImmediate = ref(false)

const chrome = ref<string | number | undefined>(new Date(2024, 5, 15).getTime())
const openChrome = ref(false)

/** 声明但未实现：单值模式没有区间 tab，钩子永远不会被调用。 */
const tabLabel = (tab: 'start' | 'end') => (tab === 'start' ? '开始' : '结束')
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">immediateChange（滚动即写 v-model，不必确认）</text>
    <view class="sn-demo__button" @tap="openImmediate = true">即时写回</view>
    <text class="sn-demo__meta">已选：{{ immediate }}</text>
    <SnDatetimePicker
      v-model="immediate"
      v-model:visible="openImmediate"
      type="date"
      title="即时写回"
      immediate-change
    />

    <text class="sn-demo__title">cancelButtonText / closeOnClickModal / safeAreaInsetBottom / zIndex</text>
    <view class="sn-demo__button" @tap="openChrome = true">弹层外观</view>
    <SnDatetimePicker
      v-model="chrome"
      v-model:visible="openChrome"
      type="date"
      title="弹层外观"
      cancel-button-text="不要了"
      confirm-button-text="就用这天"
      :close-on-click-modal="false"
      :safe-area-inset-bottom="false"
      :z-index="1200"
      root-portal
      custom-class="sn-demo__sheet"
      custom-style="border-radius: var(--sn-mp-radius-xl);"
      custom-view-class="sn-demo__roller"
      :display-format-tab-label="tabLabel"
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

.sn-demo__sheet {
  background-color: var(--sn-mp-color-background-elevated);
}

.sn-demo__roller {
  padding-bottom: 8rpx;
}
</style>
