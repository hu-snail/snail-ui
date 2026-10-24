<script setup lang="ts">
/** Demo: sn-datetime-picker — roller geometry and column values: itemHeight / visibleItemCount / h-m-s bounds / formatter / filter. */
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

/** formatter: suffix every column label with its unit. */
const withUnit = (type: string, value: number) => {
  const unit = type === 'year' ? 'Y' : type === 'month' ? 'M' : type === 'date' ? 'D' : ''
  return unit ? `${value} ${unit}` : String(value)
}
/** filter: keep only even months. */
const evenMonths = (type: string, values: number[]) =>
  type === 'month' ? values.filter(v => v % 2 === 0) : values

const bigText = computed(() => {
  if (bigRows.value === undefined) return '(not selected)'
  const d = new Date(Number(bigRows.value))
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
})
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">itemHeight + visibleItemCount (44px rows, 6 visible)</text>
    <view class="sn-demo__button" @tap="openBig = true">Tall rows</view>
    <text class="sn-demo__meta">Selected: {{ bigText }}</text>
    <SnDatetimePicker
      v-model="bigRows"
      v-model:visible="openBig"
      type="date"
      title="Date"
      :item-height="44"
      :visible-item-count="6"
      :min-date="min"
      :max-date="max"
      value-key="value"
      label-key="label"
    />

    <text class="sn-demo__title">minHour / maxHour / minMinute / maxMinute (08:15 - 18:45)</text>
    <view class="sn-demo__button" @tap="openHours = true">Restricted hours</view>
    <SnDatetimePicker
      v-model="hours"
      v-model:visible="openHours"
      type="datetime"
      title="Restricted hours"
      :min-date="min"
      :max-date="max"
      :min-hour="8"
      :max-hour="18"
      :min-minute="15"
      :max-minute="45"
    />

    <text class="sn-demo__title">useSecond + minSecond / maxSecond (seconds capped at 30)</text>
    <view class="sn-demo__button" @tap="openSeconds = true">With seconds</view>
    <text class="sn-demo__meta">Selected: {{ withSeconds || '(not selected)' }}</text>
    <SnDatetimePicker
      v-model="withSeconds"
      v-model:visible="openSeconds"
      type="time"
      title="With seconds"
      use-second
      :min-second="0"
      :max-second="30"
    />

    <text class="sn-demo__title">formatter + filter (unit suffixes; even months only)</text>
    <view class="sn-demo__button" @tap="openFormatted = true">Formatted &amp; filtered</view>
    <SnDatetimePicker
      v-model="formatted"
      v-model:visible="openFormatted"
      type="date"
      title="Formatted &amp; filtered"
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
