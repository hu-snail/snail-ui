<script setup lang="ts">
/** Demo: sn-datetime-picker-view — range linkage and write-back timing: boundaryMinDate / boundaryMaxDate / immediateChange / customClass / customStyle. */
import { ref } from 'vue'
import SnDatetimePickerView from '@snui/uni-src/components/sn-datetime-picker-view/sn-datetime-picker-view.vue'

const start = ref<string | number>(new Date(2024, 5, 10).getTime())
const end = ref<string | number>(new Date(2024, 5, 20).getTime())
const instant = ref<string | number>(new Date(2024, 5, 15).getTime())
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">boundaryMinDate / boundaryMaxDate (the end may not precede the start)</text>
    <SnDatetimePickerView v-model="start" type="date" :boundary-max-date="end" />
    <text class="sn-demo__meta">Start: {{ start }}</text>
    <SnDatetimePickerView v-model="end" type="date" :boundary-min-date="start" />
    <text class="sn-demo__meta">End: {{ end }}</text>

    <text class="sn-demo__title">immediateChange (emits change on every roll)</text>
    <SnDatetimePickerView
      v-model="instant"
      type="date"
      immediate-change
      custom-class="sn-demo__view"
      custom-style="border-radius: var(--sn-mp-radius-lg);"
    />
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

.sn-demo__view {
  background-color: var(--sn-mp-color-background-soft);
}
</style>
