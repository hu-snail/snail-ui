<script setup lang="ts">
/** Demo: sn-datetime-picker — sheet chrome and behaviour: cancelButtonText / closeOnClickModal / safeAreaInsetBottom / zIndex / immediateChange / rootPortal / custom*. */
import { ref } from 'vue'
import SnDatetimePicker from '@snui/uni-src/components/sn-datetime-picker/sn-datetime-picker.vue'

const immediate = ref<string | number | undefined>(new Date(2024, 5, 15).getTime())
const openImmediate = ref(false)

const chrome = ref<string | number | undefined>(new Date(2024, 5, 15).getTime())
const openChrome = ref(false)

/** Declared but unimplemented: single-value mode has no range tabs, so the hook never runs. */
const tabLabel = (tab: 'start' | 'end') => (tab === 'start' ? 'Start' : 'End')
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">immediateChange (write v-model on every roll, no confirm)</text>
    <view class="sn-demo__button" @tap="openImmediate = true">Immediate write-back</view>
    <text class="sn-demo__meta">Selected: {{ immediate }}</text>
    <SnDatetimePicker
      v-model="immediate"
      v-model:visible="openImmediate"
      type="date"
      title="Immediate write-back"
      immediate-change
    />

    <text class="sn-demo__title">cancelButtonText / closeOnClickModal / safeAreaInsetBottom / zIndex</text>
    <view class="sn-demo__button" @tap="openChrome = true">Sheet chrome</view>
    <SnDatetimePicker
      v-model="chrome"
      v-model:visible="openChrome"
      type="date"
      title="Sheet chrome"
      cancel-button-text="Never mind"
      confirm-button-text="Use this day"
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
