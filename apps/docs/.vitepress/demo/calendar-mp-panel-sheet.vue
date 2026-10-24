<script setup lang="ts">
/** Demo: sn-calendar — 面板与弹层：panelHeight / showPanelTitle / switchMode / duration / immediateChange / showConfirm / 遮罩与层级。 */
import { ref } from 'vue'
import SnCalendar from '@snui/uni-src/components/sn-calendar/sn-calendar.vue'

const min = new Date(2024, 0, 1).getTime()
const max = new Date(2024, 11, 31).getTime()

const monthSwitch = ref<number | number[] | null>(new Date(2024, 5, 15).getTime())
const openMonthSwitch = ref(false)

const instant = ref<number | number[] | null>(new Date(2024, 5, 15).getTime())
const openInstant = ref(false)

const noConfirm = ref<number | number[] | null>(new Date(2024, 5, 15).getTime())
const openNoConfirm = ref(false)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">panelHeight / showPanelTitle / switchMode / duration</text>
    <view class="sn-demo__button" @tap="openMonthSwitch = true">月 / 年切换</view>
    <SnCalendar
      v-model="monthSwitch"
      v-model:visible="openMonthSwitch"
      type="date"
      title="月 / 年切换"
      :min-date="min"
      :max-date="max"
      :panel-height="420"
      :show-panel-title="false"
      switch-mode="year-month"
      :duration="320"
      custom-view-class="sn-demo__panel"
    />

    <text class="sn-demo__title">immediateChange（点格子即写 v-model）</text>
    <view class="sn-demo__button" @tap="openInstant = true">即时写回</view>
    <text class="sn-demo__meta">已选：{{ instant }}</text>
    <SnCalendar
      v-model="instant"
      v-model:visible="openInstant"
      type="date"
      title="即时写回"
      :min-date="min"
      :max-date="max"
      immediate-change
    />

    <text class="sn-demo__title">showConfirm=false + closeOnClickModal + zIndex + safeAreaInsetBottom</text>
    <view class="sn-demo__button" @tap="openNoConfirm = true">无确认按钮</view>
    <SnCalendar
      v-model="noConfirm"
      v-model:visible="openNoConfirm"
      type="date"
      title="无确认按钮"
      :min-date="min"
      :max-date="max"
      :show-confirm="false"
      :close-on-click-modal="false"
      :safe-area-inset-bottom="false"
      :z-index="1100"
      root-portal
      custom-class="sn-demo__sheet"
      custom-style="border-radius: var(--sn-mp-radius-xl);"
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

.sn-demo__panel {
  border-top: 1rpx solid var(--sn-mp-color-border-subtle);
}

.sn-demo__sheet {
  background-color: var(--sn-mp-color-background-elevated);
}
</style>
