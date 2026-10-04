<script setup lang="ts">
/** Demo: sn-input — showPassword toggles type=password. */
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue'
import { ref } from 'vue'

const secret = ref('initial-secret-123')
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="secret" type="password" show-password placeholder="Password with toggle" />
    <text class="sn-input-demo__hint">点击 👁 切换密码显示</text>
  </view>
</template>

<style scoped>
.sn-input-demo { display: flex; flex-direction: column; gap: 16rpx; max-width: 600rpx; }
.sn-input-demo__hint { font-size: 24rpx; color: var(--vp-c-text-2); }
</style>