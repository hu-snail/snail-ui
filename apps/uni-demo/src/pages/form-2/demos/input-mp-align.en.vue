<script setup lang="ts">
/** Demo: sn-input — right alignment (alignRight) for numeric / amount fields. */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const amount = ref('12500.00');
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="amount" align-right type="digit" placeholder="Amount" />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
