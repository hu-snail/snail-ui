<script setup lang="ts">
/** Demo: sn-textarea — clearTrigger 控制 × 显示时机，focusWhenClear 控制清空后是否回焦。 */
import { ref } from 'vue';
import SnTextarea from '@snui/uni-src/components/sn-textarea/sn-textarea.vue';

const always = ref('始终显示 × 的文本');
const onFocus = ref('聚焦时才显示 × 的文本');
const keepFocus = ref('清空后自动回到聚焦状态');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">clearTrigger="always"（默认）</text>
    <SnTextarea v-model="always" clearable clear-trigger="always" />

    <text class="sn-demo__title">clearTrigger="focus"（仅聚焦时显示）</text>
    <SnTextarea v-model="onFocus" clearable clear-trigger="focus" placeholder="点进来才会出现 ×" />

    <text class="sn-demo__title">focusWhenClear</text>
    <SnTextarea v-model="keepFocus" clearable focus-when-clear placeholder="清空后尝试回焦" />
    <SnTextarea
      v-model="keepFocus"
      clearable
      :focus-when-clear="false"
      placeholder="清空后不回焦"
    />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
</style>
