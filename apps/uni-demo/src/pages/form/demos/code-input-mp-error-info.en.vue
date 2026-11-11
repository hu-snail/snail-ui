<script setup lang="ts">
/** Demo: sn-code-input — error state (errorInfo): overrides info and paints the borders danger. */
import { ref } from 'vue';
import SnCodeInput from '@snui/uni-src/components/sn-code-input/sn-code-input.vue';

const wrong = ref('12');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCodeInput v-model="wrong" :length="6" error-info="Wrong password" />
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
