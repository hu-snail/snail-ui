<script setup lang="ts">
/** Demo: sn-input — word limit: showWordLimit (alias of showCount) + maxlength. */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const nickname = ref('snail');
const bio = ref('Short');
</script>

<template>
  <view class="sn-input-demo">
    <text class="sn-input-demo__caption">showWordLimit + maxlength (alias)</text>
    <SnInput v-model="nickname" :maxlength="12" show-word-limit placeholder="Nickname" />

    <text class="sn-input-demo__caption">showCount + maxlength (canonical, equivalent)</text>
    <SnInput v-model="bio" :maxlength="20" show-count placeholder="One-line bio" />
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
