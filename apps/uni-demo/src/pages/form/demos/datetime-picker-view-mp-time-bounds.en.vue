<script setup lang="ts">
/** Demo: sn-datetime-picker-view — time column bounds and the seconds column: minMinute / maxMinute / useSecond / minSecond / maxSecond. */
import { ref } from 'vue';
import SnDatetimePickerView from '@snui/uni-src/components/sn-datetime-picker-view/sn-datetime-picker-view.vue';

const quarter = ref<string | number>('10:30');
const withSeconds = ref<string | number>('10:30:15');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">minMinute=0 / maxMinute=30 (minutes stop at half past)</text>
    <SnDatetimePickerView
      v-model="quarter"
      type="time"
      :min-hour="8"
      :max-hour="18"
      :min-minute="0"
      :max-minute="30"
    />
    <text class="sn-demo__meta">Selected: {{ quarter }}</text>

    <text class="sn-demo__title">useSecond + minSecond=0 / maxSecond=45</text>
    <SnDatetimePickerView
      v-model="withSeconds"
      type="time"
      use-second
      :min-second="0"
      :max-second="45"
    />
    <text class="sn-demo__meta">Selected: {{ withSeconds }}</text>
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
