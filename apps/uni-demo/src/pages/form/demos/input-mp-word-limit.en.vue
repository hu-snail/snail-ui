<script setup lang="ts">
/** Demo: sn-input — word counting: showWordLimit (the wot-ui alias of showCount) with maxlength. */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const nickname = ref('snail');
const bio = ref('Short');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">showWordLimit + maxlength (the wot-ui alias)</text>
    <SnInput v-model="nickname" :maxlength="12" show-word-limit placeholder="Nickname" />

    <text class="sn-demo__title">showCount + maxlength (the native spelling, equivalent)</text>
    <SnInput v-model="bio" :maxlength="20" show-count placeholder="One-line bio" />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
</style>
