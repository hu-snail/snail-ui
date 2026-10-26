<script setup lang="ts">
/** Demo: sn-keyboard — 遮罩与层级：modal / hideOnClickOutside / lockScroll / closeButtonLoading / safeAreaInsetBottom / rootPortal / custom*。 */
import { ref } from 'vue';
import SnKeyboard from '@snui/uni-src/components/sn-keyboard/sn-keyboard.vue';

const modalValue = ref('');
const openModal = ref(false);

const sticky = ref('');
const openSticky = ref(false);

const busy = ref('');
const openBusy = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">modal（渲染不透明遮罩）+ safeAreaInsetBottom + custom*</text>
    <view class="sn-demo__button" @tap="openModal = true">不透明遮罩</view>
    <SnKeyboard
      v-model="modalValue"
      v-model:visible="openModal"
      :maxlength="6"
      title="不透明遮罩"
      modal
      :safe-area-inset-bottom="false"
      custom-class="sn-demo__panel"
      custom-style="border-radius: var(--sn-mp-radius-xl) var(--sn-mp-radius-xl) 0 0;"
    />

    <text class="sn-demo__title">hideOnClickOutside=false + lockScroll=false</text>
    <view class="sn-demo__button" @tap="openSticky = true">点外部不关闭</view>
    <SnKeyboard
      v-model="sticky"
      v-model:visible="openSticky"
      :maxlength="6"
      title="点外部不关闭"
      :hide-on-click-outside="false"
      :lock-scroll="false"
    />

    <text class="sn-demo__title">closeButtonLoading（关闭键显示 spinner）+ rootPortal</text>
    <view class="sn-demo__button" @tap="openBusy = true">关闭键加载中</view>
    <SnKeyboard
      v-model="busy"
      v-model:visible="openBusy"
      :maxlength="6"
      title="关闭键加载中"
      close-button-loading
      close-text="提交中"
      root-portal
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

.sn-demo__panel {
  background-color: var(--sn-mp-color-background-elevated);
}
</style>
