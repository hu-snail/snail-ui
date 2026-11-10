<script setup lang="ts">
/** Demo: sn-keyboard — key labels (deleteText / closeText): custom delete / close labels. */
import { ref } from 'vue';
import SnKeyboard from '@snui/uni-src/components/sn-keyboard/sn-keyboard.vue';

const custom = ref('');
const openCustom = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">deleteText + closeText (custom delete / close labels)</text>
    <view class="sn-demo__button" @tap="openCustom = true">Custom labels</view>
    <text class="sn-demo__meta">Value: {{ custom || '(empty)' }}</text>
    <SnKeyboard
      v-model="custom"
      v-model:visible="openCustom"
      :maxlength="6"
      title="Custom labels"
      delete-text="Back"
      close-text="Done"
      :z-index="1050"
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
</style>
