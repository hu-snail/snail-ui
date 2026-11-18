<script setup lang="ts">
/** Demo: sn-wheel-picker — sheet assembly: sn-popup + custom header + wheel roller + block confirm button (reminder-time scene). */
import { ref } from 'vue';
import SnPopup from '@snui/uni-src/components/sn-popup/sn-popup.vue';
import SnWheelPicker from '@snui/uni-src/components/sn-wheel-picker/sn-wheel-picker.vue';

const times = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30'];
const draft = ref<Array<string | number>>(['09:00']);
const saved = ref<Array<string | number>>(['09:00']);
const open = ref(false);

const saveReminder = (): void => {
  saved.value = draft.value.slice();
  open.value = false;
};
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__button" @tap="open = true"><text>Set reminder time</text></view>
    <text class="sn-demo__meta">Saved: {{ saved[0] }} (wheel roller in the sheet + slide haptic)</text>
    <SnPopup v-model="open" position="bottom" round>
      <view class="sheet">
        <view class="sheet__head">
          <text class="sheet__title">Set reminder time</text>
          <view class="sheet__close" role="button" aria-label="Close" @tap="open = false">
            <text class="sheet__close-x">✕</text>
          </view>
        </view>
        <SnWheelPicker v-model="draft" :columns="[times]" :visible-item-count="5" />
        <view class="sheet__save" role="button" aria-label="Save reminder" @tap="saveReminder">
          <text class="sheet__save-text">Save reminder</text>
        </view>
      </view>
    </SnPopup>
  </view>
</template>

<style scoped>
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
  flex-direction: row;
}

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}

.sheet {
  padding: 32rpx 32rpx calc(32rpx + env(safe-area-inset-bottom));
}

.sheet__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
}

.sheet__title {
  font-size: 32rpx;
  font-weight: var(--sn-mp-font-weight-semibold);
  color: var(--sn-mp-color-text-primary);
}

.sheet__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56rpx;
  height: 56rpx;
  border-radius: 28rpx;
  background-color: var(--sn-mp-color-background-subtle);
}

.sheet__close-x {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}

.sheet__save {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 96rpx;
  margin-top: 24rpx;
  border-radius: 48rpx;
  background-color: var(--sn-mp-color-action-primary);
}

.sheet__save-text {
  font-size: 30rpx;
  font-weight: var(--sn-mp-font-weight-semibold);
  color: var(--sn-mp-color-text-on-primary);
}
</style>
