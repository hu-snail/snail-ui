<script setup lang="ts">
/** Demo: sn-picker — roller geometry and sheet: itemHeight / visibleItemCount / immediateChange / scrim and stacking / custom*. */
import { ref } from 'vue'
import SnPicker from '@snui/uni-src/components/sn-picker/sn-picker.vue'

const fruits = ['Apple', 'Banana', 'Cherry', 'Watermelon', 'Grape']

const tall = ref<Array<string | number>>(['Apple'])
const openTall = ref(false)

const instant = ref<Array<string | number>>(['Banana'])
const openInstant = ref(false)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">itemHeight / visibleItemCount (52px rows, 5 visible) + customViewClass</text>
    <view class="sn-demo__button" @tap="openTall = true">Tall rows</view>
    <text class="sn-demo__meta">Selected: {{ tall.join(' / ') }}</text>
    <SnPicker
      v-model="tall"
      v-model:visible="openTall"
      :columns="[fruits]"
      title="Tall rows"
      :item-height="52"
      :visible-item-count="5"
      custom-view-class="sn-demo__roller"
    />

    <text class="sn-demo__title">immediateChange + closeOnClickModal / zIndex / safeAreaInsetBottom / custom*</text>
    <view class="sn-demo__button" @tap="openInstant = true">Write on every roll</view>
    <text class="sn-demo__meta">Selected: {{ instant.join(' / ') }}</text>
    <SnPicker
      v-model="instant"
      v-model:visible="openInstant"
      :columns="[fruits]"
      title="Write on every roll"
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
