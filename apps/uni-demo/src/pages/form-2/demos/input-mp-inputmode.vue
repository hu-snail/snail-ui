<script setup lang="ts">
/** Demo: sn-input — 软键盘提示（inputmode）：inputmode 唤起对应软键盘。 */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const phone = ref('');
const search = ref('');
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="phone" inputmode="tel" placeholder="手机号（tel 键盘）" />
    <SnInput v-model="search" inputmode="search" placeholder="搜索（search 键盘）" />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
