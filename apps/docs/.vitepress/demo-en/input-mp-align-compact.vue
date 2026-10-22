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
    <text class="sn-input-demo__title">alignRight (amount field)</text>
    <SnInput v-model="amount" align-right type="digit" />

    <text class="sn-input-demo__title">inputmode — soft keyboard hint</text>
    <SnInput v-model="phone" inputmode="tel" placeholder="Phone number (tel keyboard)" />
    <SnInput v-model="search" inputmode="search" placeholder="Search (search keyboard)" />

    <text class="sn-input-demo__title">compact + border="bottom"</text>
    <SnInput v-model="search" compact border="bottom" placeholder="Inline search" />
  </view>
</template>

<style scoped>
.sn-input-demo { display: flex; flex-direction: column; gap: 16rpx; max-width: 600rpx; }
.sn-input-demo__title { margin-top: 16rpx; font-size: 26rpx; font-weight: 600; color: var(--vp-c-text-1); }
</style>