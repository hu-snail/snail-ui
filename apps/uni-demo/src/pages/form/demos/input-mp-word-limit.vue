<script setup lang="ts">
/** Demo: sn-input — 字数统计：showWordLimit（showCount 的 wot-ui 别名）配合 maxlength。 */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const nickname = ref('snail');
const bio = ref('短');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">showWordLimit + maxlength（wot-ui 别名）</text>
    <SnInput v-model="nickname" :maxlength="12" show-word-limit placeholder="昵称" />

    <text class="sn-demo__title">showCount + maxlength（原生写法，等价）</text>
    <SnInput v-model="bio" :maxlength="20" show-count placeholder="一句话简介" />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
</style>
