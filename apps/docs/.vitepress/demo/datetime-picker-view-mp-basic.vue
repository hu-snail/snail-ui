<script setup lang="ts">
/** Demo: sn-datetime-picker-view — sn-datetime-picker-view 滚筒本体：type 决定列集合，minDate / maxDate 限制可选范围。 */
import { ref, computed } from 'vue'
import SnDatetimePickerView from '@snui/uni-src/components/sn-datetime-picker-view/sn-datetime-picker-view.vue'

const min = new Date(2024, 0, 1).getTime()
const max = new Date(2024, 11, 31, 23, 59, 59).getTime()
const stamp = ref<string | number>(new Date(2024, 5, 15, 10, 30).getTime())
const formatted = computed(() => {
  const d = new Date(Number(stamp.value))
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
})
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnDatetimePickerView v-model="stamp" type="date" :min-date="min" :max-date="max" />
    <text class="sn-demo__meta">已选：{{ formatted }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
