<script setup lang="ts">
/** Demo: sn-calendar — sn-calendar 弹层日历：滚动只改草稿，确认才写 v-model；取消会丢弃草稿。 */
import { ref, computed } from 'vue'
import SnCalendar from '@snui/uni-src/components/sn-calendar/sn-calendar.vue'

const min = new Date(2024, 5, 1).getTime()
const max = new Date(2024, 7, 31).getTime()
const date = ref<number | number[] | null>(new Date(2024, 5, 15).getTime())
const open = ref(false)
const formatted = computed(() => {
  const value = date.value
  if (typeof value !== 'number') return '（未选择）'
  const d = new Date(value)
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
})
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__button" @tap="open = true">选择日期</view>
    <text class="sn-demo__meta">已选：{{ formatted }}</text>
    <SnCalendar v-model="date" v-model:visible="open" :min-date="min" :max-date="max" title="选择日期" />
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
