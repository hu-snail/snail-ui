<script setup lang="ts">
/** Demo: sn-input — 字数统计：showWordLimit（showCount 的别名）配合 maxlength。 */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const nickname = ref('snail');
const bio = ref('短');
</script>

<template>
  <view class="sn-input-demo">
    <text class="sn-input-demo__caption">showWordLimit + maxlength（别名写法）</text>
    <SnInput v-model="nickname" :maxlength="12" show-word-limit placeholder="昵称" />

    <text class="sn-input-demo__caption">showCount + maxlength（原生写法，等价）</text>
    <SnInput v-model="bio" :maxlength="20" show-count placeholder="一句话简介" />
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
