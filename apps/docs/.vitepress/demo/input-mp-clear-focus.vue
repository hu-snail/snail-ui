<script setup lang="ts">
/** Demo: sn-input — 清空与聚焦细节：clearTrigger / focusWhenClear / focus / placeholderClass / placeholderStyle。 */
import { ref } from 'vue'
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue'

const always = ref('始终显示 × 的输入')
const onFocus = ref('聚焦时才显示 × 的输入')
const refocus = ref('清空后自动回焦')
const focused = ref('')
const styled = ref('')
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">clearTrigger="always"（默认）</text>
    <SnInput v-model="always" clearable clear-trigger="always" />

    <text class="sn-demo__title">clearTrigger="focus"（仅聚焦时显示 ×）</text>
    <SnInput v-model="onFocus" clearable clear-trigger="focus" placeholder="点进来才会出现 ×" />

    <text class="sn-demo__title">focusWhenClear</text>
    <SnInput v-model="refocus" clearable focus-when-clear placeholder="清空后回焦" />
    <SnInput v-model="refocus" clearable :focus-when-clear="false" placeholder="清空后不回焦" />

    <text class="sn-demo__title">focus（挂载即聚焦）</text>
    <SnInput v-model="focused" focus placeholder="挂载即聚焦" />

    <text class="sn-demo__title">placeholderClass + placeholderStyle</text>
    <SnInput
      v-model="styled"
      placeholder-class="sn-demo__placeholder"
      placeholder-style="font-style: italic; color: var(--sn-mp-color-feedback-danger);"
      placeholder="自定义占位符"
    />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo__placeholder {
  font-size: 26rpx;
  color: var(--sn-mp-color-feedback-warning);
}
</style>
