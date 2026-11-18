<script setup lang="ts">
/** Demo: sn-input — 右对齐（alignRight）：金额等数字字段右对齐。 */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const amount = ref('12500.00');
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="amount" align-right type="digit" placeholder="金额" />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
