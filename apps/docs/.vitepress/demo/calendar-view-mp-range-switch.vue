<script setup lang="ts">
/** Demo: sn-calendar-view — type="daterange" 选区间；maxRange 限制跨度并显示提示；switchMode="month" 改为单月 + 上下月按钮。 */
import { ref, computed } from 'vue'
import SnCalendarView from '@snui/uni-src/components/sn-calendar-view/sn-calendar-view.vue'

const min = new Date(2024, 5, 1).getTime()
const max = new Date(2024, 7, 31).getTime()
const range = ref<number | number[] | null>([
  new Date(2024, 5, 5).getTime(),
  new Date(2024, 5, 9).getTime(),
])
const single = ref<number | number[] | null>(null)
const rangeText = computed(() => {
  const value = range.value
  if (!Array.isArray(value)) return '（未选择）'
  return value.map(v => {
    const d = new Date(v)
    return `${d.getMonth() + 1}/${d.getDate()}`
  }).join(' - ')
})
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCalendarView v-model="range" type="daterange" :min-date="min" :max-date="max" :max-range="7" range-prompt="最多选 7 天" />
    <text class="sn-demo__meta">区间：{{ rangeText }}</text>
    <SnCalendarView v-model="single" :min-date="min" :max-date="max" switch-mode="month" :panel-height="220" />
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
