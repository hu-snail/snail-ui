<script setup lang="ts">
/** Demo: sn-keyboard — scrim and stacking: modal / hideOnClickOutside / lockScroll / closeButtonLoading / safeAreaInsetBottom / rootPortal / custom*. */
import { ref } from 'vue'
import SnKeyboard from '@snui/uni-src/components/sn-keyboard/sn-keyboard.vue'

const modalValue = ref('')
const openModal = ref(false)

const sticky = ref('')
const openSticky = ref(false)

const busy = ref('')
const openBusy = ref(false)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">modal (opaque scrim) + safeAreaInsetBottom + custom*</text>
    <view class="sn-demo__button" @tap="openModal = true">Opaque scrim</view>
    <SnKeyboard
      v-model="modalValue"
      v-model:visible="openModal"
      :maxlength="6"
      title="Opaque scrim"
      modal
      :safe-area-inset-bottom="false"
      custom-class="sn-demo__panel"
      custom-style="border-radius: var(--sn-mp-radius-xl) var(--sn-mp-radius-xl) 0 0;"
    />

    <text class="sn-demo__title">hideOnClickOutside=false + lockScroll=false</text>
    <view class="sn-demo__button" @tap="openSticky = true">Tap outside keeps it open</view>
    <SnKeyboard
      v-model="sticky"
      v-model:visible="openSticky"
      :maxlength="6"
      title="Tap outside keeps it open"
      :hide-on-click-outside="false"
      :lock-scroll="false"
    />

    <text class="sn-demo__title">closeButtonLoading (spinner in the close button) + rootPortal</text>
    <view class="sn-demo__button" @tap="openBusy = true">Close button busy</view>
    <SnKeyboard
      v-model="busy"
      v-model:visible="openBusy"
      :maxlength="6"
      title="Close button busy"
      close-button-loading
      close-text="Submitting"
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
