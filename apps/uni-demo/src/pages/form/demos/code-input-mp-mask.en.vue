<script setup lang="ts">
/** Demo: sn-code-input — plain display (mask): `mask=false` shows the characters instead of dots. */
import { ref } from 'vue';
import SnCodeInput from '@snui/uni-src/components/sn-code-input/sn-code-input.vue';

const plain = ref('1234');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCodeInput v-model="plain" :length="4" :mask="false" />
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
