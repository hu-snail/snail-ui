<script setup lang="ts">
/** Demo: sn-input — 清空按钮细节（clearTrigger / focusWhenClear）。 */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const always = ref('始终显示 ×');
const onFocus = ref('');
const refocus = ref('清空后回焦 / 不回焦');
</script>

<template>
  <view class="sn-input-demo">
    <text class="sn-input-demo__caption">clearTrigger="always"（默认，有值即显示 ×）</text>
    <SnInput v-model="always" clearable clear-trigger="always" />

    <text class="sn-input-demo__caption">clearTrigger="focus"（仅聚焦时显示 ×）</text>
    <SnInput v-model="onFocus" clearable clear-trigger="focus" placeholder="点进来才会出现 ×" />

    <text class="sn-input-demo__caption">focusWhenClear（清空后是否回焦）</text>
    <SnInput v-model="refocus" clearable focus-when-clear placeholder="清空后回焦" />
    <SnInput v-model="refocus" clearable :focus-when-clear="false" placeholder="清空后不回焦" />
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
</style>
