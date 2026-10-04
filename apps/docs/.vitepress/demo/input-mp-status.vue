<script setup lang="ts">
/** Demo: sn-input — status / error / warning (uni-end). */
import { reactive } from 'vue'
import { SnInput } from '@snui/uni'

const form = reactive({ default: 'Default', error: 'Invalid input', warning: 'Heads up' })
</script>

<template>
  <view class="sn-demo">
    <SnInput v-model="form.default" status="default" />
    <SnInput v-model="form.error" status="error" />
    <SnInput v-model="form.warning" status="warning" />
  </view>
</template>

<style scoped>
.sn-demo { display: flex; flex-direction: column; gap: 16rpx; max-width: 480rpx; }
</style>