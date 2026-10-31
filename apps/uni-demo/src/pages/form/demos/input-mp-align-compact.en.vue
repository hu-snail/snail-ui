<script setup lang="ts">
/** Demo: sn-input — alignRight / compact / inputmode (uni-end). */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const amount = ref('12500.00');
const phone = ref('');
const search = ref('');
const inline = ref('');
</script>

<template>
  <view class="sn-input-demo">
    <text class="sn-input-demo__caption">alignRight (numeric / amount fields)</text>
    <SnInput v-model="amount" align-right type="digit" placeholder="Amount" />

    <text class="sn-input-demo__caption">inputmode (soft keyboard hint)</text>
    <SnInput v-model="phone" inputmode="tel" placeholder="Phone (tel keyboard)" />
    <SnInput v-model="search" inputmode="search" placeholder="Search (search keyboard)" />

    <text class="sn-input-demo__caption">compact + border="bottom" (inline row inside Cell / FormItem)</text>
    <SnInput v-model="inline" compact border="bottom" placeholder="Inline search" />
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
