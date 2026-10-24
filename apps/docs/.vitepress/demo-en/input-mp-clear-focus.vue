<script setup lang="ts">
/** Demo: sn-input — clear and focus details: clearTrigger / focusWhenClear / focus / placeholderClass / placeholderStyle. */
import { ref } from 'vue'
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue'

const always = ref('The × is always visible here')
const onFocus = ref('The × only shows while focused')
const refocus = ref('Re-focuses after clearing')
const focused = ref('')
const styled = ref('')
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">clearTrigger="always" (default)</text>
    <SnInput v-model="always" clearable clear-trigger="always" />

    <text class="sn-demo__title">clearTrigger="focus" (only while focused)</text>
    <SnInput v-model="onFocus" clearable clear-trigger="focus" placeholder="Tap in and the × appears" />

    <text class="sn-demo__title">focusWhenClear</text>
    <SnInput v-model="refocus" clearable focus-when-clear placeholder="Re-focus after clearing" />
    <SnInput v-model="refocus" clearable :focus-when-clear="false" placeholder="Do not re-focus" />

    <text class="sn-demo__title">focus (focused on mount)</text>
    <SnInput v-model="focused" focus placeholder="Focused on mount" />

    <text class="sn-demo__title">placeholderClass + placeholderStyle</text>
    <SnInput
      v-model="styled"
      placeholder-class="sn-demo__placeholder"
      placeholder-style="font-style: italic; color: var(--sn-mp-color-feedback-danger);"
      placeholder="Custom placeholder"
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
