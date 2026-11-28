<script setup lang="ts">
/** Demo: sn-input — basic v-model binding (uni-end). */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const value = ref('hello');
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="value" placeholder="Type something" clearable />
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
