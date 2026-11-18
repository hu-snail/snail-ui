<script setup lang="ts">
/** Demo: sn-picker — wheel style mode: wheel pill band + vibrateShort slide haptic inside the sheet. */
import { ref } from 'vue';
import SnPicker from '@snui/uni-src/components/sn-picker/sn-picker.vue';

const slots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30'];
const picked = ref<Array<string | number>>(['09:00']);
const open = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__button" @tap="open = true"><text>Set reminder time</text></view>
    <text class="sn-demo__meta">Selected: {{ picked.join(' / ') }} (wheel band + slide haptic)</text>
    <SnPicker
      v-model="picked"
      v-model:visible="open"
      :columns="[slots]"
      title="Reminder time"
      wheel
      vibrate-short
      :visible-item-count="5"
    />
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
</style>
