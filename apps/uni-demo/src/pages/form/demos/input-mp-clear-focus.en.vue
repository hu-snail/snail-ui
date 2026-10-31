<script setup lang="ts">
/** Demo: sn-input — clear & focus: clearTrigger / focusWhenClear / focus / placeholder customization. */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const always = ref('Always show ×');
const onFocus = ref('');
const refocus = ref('Refocus on clear (or not)');
const focused = ref('');
const styled = ref('');
</script>

<template>
  <view class="sn-input-demo">
    <text class="sn-input-demo__caption">clearTrigger="always" (default)</text>
    <SnInput v-model="always" clearable clear-trigger="always" />

    <text class="sn-input-demo__caption">clearTrigger="focus" (only while focused)</text>
    <SnInput v-model="onFocus" clearable clear-trigger="focus" placeholder="Focus me to see ×" />

    <text class="sn-input-demo__caption">focusWhenClear</text>
    <SnInput v-model="refocus" clearable focus-when-clear placeholder="Refocus after clear" />
    <SnInput v-model="refocus" clearable :focus-when-clear="false" placeholder="No refocus" />

    <text class="sn-input-demo__caption">focus (autofocus on mount)</text>
    <SnInput v-model="focused" focus placeholder="Focused on mount" />

    <text class="sn-input-demo__caption">placeholderClass + placeholderStyle</text>
    <SnInput
      v-model="styled"
      placeholder-class="sn-input-demo__placeholder"
      placeholder-style="font-style: italic; color: var(--sn-mp-color-feedback-danger);"
      placeholder="Custom placeholder"
    />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-input-demo__caption {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
.sn-input-demo__placeholder {
  font-size: 26rpx;
  color: var(--sn-mp-color-feedback-warning);
}
</style>
