<script setup lang="ts">
/** Demo: sn-input — v-model 双向绑定 (uni-end)。 */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const value = ref('hello');
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="value" placeholder="请输入内容" clearable />
    <text class="sn-input-demo__caption">v-model = {{ value }}</text>
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
