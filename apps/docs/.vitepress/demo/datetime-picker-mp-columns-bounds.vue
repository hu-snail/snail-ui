<script setup lang="ts">
/** Demo: sn-datetime-picker — 滚筒几何与列取值：itemHeight / visibleItemCount / 时分秒边界 / formatter / filter。 */
import { computed, ref } from 'vue'
import SnDatetimePicker from '@snui/uni-src/components/sn-datetime-picker/sn-datetime-picker.vue'

const min = new Date(2024, 0, 1).getTime()
const max = new Date(2024, 11, 31).getTime()

const bigRows = ref<string | number | undefined>(new Date(2024, 5, 15).getTime())
const openBig = ref(false)

const hours = ref<string | number | undefined>(new Date(2024, 5, 15).getTime())
const openHours = ref(false)

const withSeconds = ref<string | number | undefined>('10:30:00')
const openSeconds = ref(false)

const formatted = ref<string | number | undefined>(new Date(2024, 5, 15).getTime())
const openFormatted = ref(false)

/** formatter：给列文案加单位。 */
const withUnit = (type: string, value: number) => {
  const unit = type === 'year' ? ' 年' : type === 'month' ? ' 月' : type === 'date' ? ' 日' : ''
  return `${value}${unit}`
}
/** filter：月份只留偶数月。 */
const evenMonths = (type: string, values: number[]) =>
  type === 'month' ? values.filter(v => v % 2 === 0) : values

const bigText = computed(() => {
  if (bigRows.value === undefined) return '（未选择）'
  const d = new Date(Number(bigRows.value))
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
})
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">itemHeight + visibleItemCount（行高 44px、可见 6 行）</text>
    <view class="sn-demo__button" @tap="openBig = true">大行高选择器</view>
    <text class="sn-demo__meta">已选：{{ bigText }}</text>
    <SnDatetimePicker
      v-model="bigRows"
      v-model:visible="openBig"
      type="date"
      title="日期"
      :item-height="44"
      :visible-item-count="6"
      :min-date="min"
      :max-date="max"
      value-key="value"
      label-key="label"
    />

    <text class="sn-demo__title">minHour / maxHour / minMinute / maxMinute（08:15 - 18:45）</text>
    <view class="sn-demo__button" @tap="openHours = true">限定时段</view>
    <SnDatetimePicker
      v-model="hours"
      v-model:visible="openHours"
      type="datetime"
      title="限定时段"
      :min-date="min"
      :max-date="max"
      :min-hour="8"
      :max-hour="18"
      :min-minute="15"
      :max-minute="45"
    />

    <text class="sn-demo__title">useSecond + minSecond / maxSecond（秒只到 30）</text>
    <view class="sn-demo__button" @tap="openSeconds = true">精确到秒</view>
    <text class="sn-demo__meta">已选：{{ withSeconds || '（未选择）' }}</text>
    <SnDatetimePicker
      v-model="withSeconds"
      v-model:visible="openSeconds"
      type="time"
      title="精确到秒"
      use-second
      :min-second="0"
      :max-second="30"
    />

    <text class="sn-demo__title">formatter + filter（列文案加单位；月份只留偶数月）</text>
    <view class="sn-demo__button" @tap="openFormatted = true">格式化与过滤</view>
    <SnDatetimePicker
      v-model="formatted"
      v-model:visible="openFormatted"
      type="date"
      title="格式化与过滤"
      :min-date="min"
      :max-date="max"
      :formatter="withUnit"
      :filter="evenMonths"
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
