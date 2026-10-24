<script setup lang="ts">
/** Demo: sn-switch — 自定义值 / beforeChange / loading / disabled。 */
import { ref } from 'vue'
import SnSwitch from '@snui/uni-src/components/sn-switch/sn-switch.vue'

/** activeValue / inactiveValue：字符串载荷。 */
const status = ref<string | number | boolean>('off')

/** beforeChange 需要用户确认。 */
const guarded = ref(false)
function confirmToggle(): boolean {
  return window.confirm('确定要切换吗？')
}

const loading = ref(true)
const disabled = ref(true)
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">activeValue="on" / inactiveValue="off"</text>
    <SnSwitch v-model="status" active-value="on" inactive-value="off" />
    <text class="sn-demo__meta">当前：{{ status }}</text>

    <text class="sn-demo__title">beforeChange（返回 false 则拦截）</text>
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
