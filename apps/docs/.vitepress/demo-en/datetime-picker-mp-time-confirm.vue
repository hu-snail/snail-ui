<script setup lang="ts">
/** Demo: sn-datetime-picker — `type="time"` writes an `HH:mm` string; a `beforeConfirm` that returns false keeps the sheet open. */
import { ref } from 'vue'
import SnDatetimePicker from '@snui/uni-src/components/sn-datetime-picker/sn-datetime-picker.vue'

const time = ref<string | number | undefined>('10:30')
const open = ref(false)
// Only times at or after 09:00 may be confirmed — demonstrates a beforeConfirm veto.
const guard = (value: string | number) => String(value) >= '09:00'
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__button" @tap="open = true">Pick a time</view>
    <text class="sn-demo__meta">Selected: {{ time || '(none)' }}</text>
    <SnDatetimePicker
      v-model="time"
      v-model:visible="open"
      type="time"
      title="Pick a time"
      confirm-button-text="Use it"
      :before-confirm="guard"
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
}

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
