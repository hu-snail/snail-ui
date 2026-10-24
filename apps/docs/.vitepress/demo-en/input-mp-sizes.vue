<script setup lang="ts">
/** Demo: sn-input — all 3 size presets (uni-end). */
import { reactive } from 'vue'
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue'

const form = reactive({ small: 'Small', medium: 'Medium', large: 'Large' })
</script>

<template>
  <view class="sn-demo">
    <SnInput v-model="form.small" size="small" placeholder="Small" />
    <SnInput v-model="form.medium" size="medium" placeholder="Medium" />
    <SnInput v-model="form.large" size="large" placeholder="Large" />
  </view>
</template>

<style scoped>
.sn-demo { display: flex; flex-direction: column; gap: 16rpx; max-width: 480rpx; }
</style>