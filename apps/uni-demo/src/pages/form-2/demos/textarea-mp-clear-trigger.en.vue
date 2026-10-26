<script setup lang="ts">
/** Demo: sn-textarea — clearTrigger controls when × shows; focusWhenClear controls re-focus after clear. */
import { ref } from 'vue';
import SnTextarea from '@snui/uni-src/components/sn-textarea/sn-textarea.vue';

const always = ref('The × is always visible here');
const onFocus = ref('The × only appears while focused');
const keepFocus = ref('The field re-focuses after clearing');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">clearTrigger="always" (default)</text>
    <SnTextarea v-model="always" clearable clear-trigger="always" />

    <text class="sn-demo__title">clearTrigger="focus" (only while focused)</text>
    <SnTextarea
      v-model="onFocus"
      clearable
      clear-trigger="focus"
      placeholder="Tap in and the × appears"
    />

    <text class="sn-demo__title">focusWhenClear</text>
    <SnTextarea
      v-model="keepFocus"
      clearable
      focus-when-clear
      placeholder="Tries to re-focus after clearing"
    />
    <SnTextarea
      v-model="keepFocus"
      clearable
      :focus-when-clear="false"
      placeholder="Does not re-focus after clearing"
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
