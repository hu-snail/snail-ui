<script setup lang="ts">
/** Demo: sn-datetime-picker-view — `type="time"` renders hour / minute only and writes an `HH:mm` string; `formatter` rewrites labels and `filter` trims the values. */
import { ref } from 'vue'
import SnDatetimePickerView from '@snui/uni-src/components/sn-datetime-picker-view/sn-datetime-picker-view.vue'

const min = new Date(2020, 0, 1).getTime()
const max = new Date(2030, 11, 31).getTime()
const time = ref<string | number>('10:30')
const year = ref<string | number>(new Date(2024, 5, 15).getTime())
const yearLabel = (_type: string, value: number) => `${value}`
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnDatetimePickerView v-model="time" type="time" :min-hour="8" :max-hour="18" />
    <text class="sn-demo__meta">Selected: {{ time }}</text>
    <SnDatetimePickerView v-model="year" type="year" :min-date="min" :max-date="max" :formatter="yearLabel" />
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
