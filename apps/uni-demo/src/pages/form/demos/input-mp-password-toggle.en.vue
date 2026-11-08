<script setup lang="ts">
/** Demo: sn-input — showPassword toggles type=password. */
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
import { ref } from 'vue';

const secret = ref('initial-secret-123');
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="secret" type="password" show-password placeholder="Password" />
    <text class="sn-input-demo__caption">Tap the eye icon to toggle visibility</text>
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
