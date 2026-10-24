<script setup lang="ts">
/** Demo: sn-switch — custom values / beforeChange / loading / disabled. */
import { ref } from 'vue'
import SnSwitch from '@snui/uni-src/components/sn-switch/sn-switch.vue'

/** activeValue / inactiveValue: string payloads. */
const status = ref<string | number | boolean>('off')

/** beforeChange asks the user to confirm. */
const guarded = ref(false)
function confirmToggle(): boolean {
  return window.confirm('Switch this setting?')
}

const loading = ref(true)
const disabled = ref(true)
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">activeValue="on" / inactiveValue="off"</text>
    <SnSwitch v-model="status" active-value="on" inactive-value="off" />
    <text class="sn-demo__meta">Current: {{ status }}</text>

    <text class="sn-demo__title">beforeChange (returning false vetoes)</text>
    <SnSwitch v-model="guarded" :before-change="confirmToggle" />

    <text class="sn-demo__title">loading</text>
    <SnSwitch v-model="loading" loading />

    <text class="sn-demo__title">disabled</text>
    <SnSwitch v-model="disabled" disabled />
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
