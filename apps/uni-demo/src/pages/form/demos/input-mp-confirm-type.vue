<script setup lang="ts">
/** Demo: sn-input — 确认键文案（confirmType）：软键盘右下角按钮文案。 */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const text = ref('');
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="text" confirm-type="search" placeholder="search 按钮" />
    <SnInput v-model="text" confirm-type="send" placeholder="send 按钮" />
    <SnInput v-model="text" confirm-type="go" placeholder="go 按钮" />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
