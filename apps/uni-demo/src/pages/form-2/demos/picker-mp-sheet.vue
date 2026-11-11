<script setup lang="ts">
/**
 * Demo: sn-picker — 弹层行为：closeOnClickModal 关闭点蒙层关闭 / zIndex 层级 /
 * safeAreaInsetBottom 安全区 / rootPortal 传送 / customClass、customStyle 弹层外观。
 */
import { ref } from 'vue';
import SnPicker from '@snui/uni-src/components/sn-picker/sn-picker.vue';

const fruits = ['苹果', '香蕉', '樱桃', '西瓜', '葡萄'];

const sheet = ref<Array<string | number>>(['樱桃']);
const open = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title"
      >closeOnClickModal=false + zIndex + safeAreaInsetBottom + rootPortal + custom*</text
    >
    <view class="sn-demo__button" @tap="open = true">弹层行为</view>
    <text class="sn-demo__meta">已选：{{ sheet.join(' / ') }}</text>
    <SnPicker
      v-model="sheet"
      v-model:visible="open"
      :columns="[fruits]"
      title="弹层行为"
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

.sn-demo__sheet {
  background-color: var(--sn-mp-color-background-elevated);
}
</style>
