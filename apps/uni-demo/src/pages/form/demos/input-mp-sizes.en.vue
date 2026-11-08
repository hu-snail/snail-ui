<script setup lang="ts">
/** Demo: sn-input — all 3 size presets (uni-end). */
import { reactive } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const form = reactive({ small: '', medium: '', large: '' });
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="form.small" size="small" placeholder="Small (56rpx)" />
    <SnInput v-model="form.medium" size="medium" placeholder="Medium (72rpx, default)" />
    <SnInput v-model="form.large" size="large" placeholder="Large (88rpx)" />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
