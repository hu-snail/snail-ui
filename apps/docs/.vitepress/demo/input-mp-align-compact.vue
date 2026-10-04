<script setup lang="ts">
/** Demo: sn-input — alignRight / compact / inputmode. */
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue'
import { ref } from 'vue'

const amount = ref('12500.00')
const phone = ref('')
const search = ref('')
</script>

<template>
  <view class="sn-input-demo">
    <text class="sn-input-demo__title">alignRight (金额字段)</text>
    <SnInput v-model="amount" align-right type="digit" />

    <text class="sn-input-demo__title">inputmode — 软键盘提示</text>
    <SnInput v-model="phone" inputmode="tel" placeholder="手机号 (tel 键盘)" />
    <SnInput v-model="search" inputmode="search" placeholder="搜索 (search 键盘)" />

    <text class="sn-input-demo__title">compact + border="bottom"</text>
    <SnInput v-model="search" compact border="bottom" placeholder="行内搜索" />
  </view>
</template>

<style scoped>
.sn-input-demo { display: flex; flex-direction: column; gap: 16rpx; max-width: 600rpx; }
.sn-input-demo__title { margin-top: 16rpx; font-size: 26rpx; font-weight: 600; color: var(--vp-c-text-1); }
</style>