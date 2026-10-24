<script setup lang="ts">
/** Demo: sn-datetime-picker-view — type="time" 只出时分列并写回 "HH:mm" 字符串；formatter 改文案，filter 过滤列取值。 */
import { ref } from 'vue'
import SnDatetimePickerView from '@snui/uni-src/components/sn-datetime-picker-view/sn-datetime-picker-view.vue'

const min = new Date(2020, 0, 1).getTime()
const max = new Date(2030, 11, 31).getTime()
const time = ref<string | number>('10:30')
const year = ref<string | number>(new Date(2024, 5, 15).getTime())
const yearLabel = (_type: string, value: number) => `${value} 年`
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnDatetimePickerView v-model="time" type="time" :min-hour="8" :max-hour="18" />
    <text class="sn-demo__meta">已选：{{ time }}</text>
    <SnDatetimePickerView v-model="year" type="year" :min-date="min" :max-date="max" :formatter="yearLabel" />
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
