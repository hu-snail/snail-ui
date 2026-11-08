<script setup lang="ts">
/** Demo: sn-input — status / error / warning (uni-end). */
import { reactive } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const form = reactive({ def: 'Default', error: 'Invalid input', warning: 'Heads up' });
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="form.def" status="default" placeholder="default" />
    <SnInput v-model="form.error" status="error" placeholder="error" />
    <SnInput v-model="form.warning" status="warning" placeholder="warning" />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
