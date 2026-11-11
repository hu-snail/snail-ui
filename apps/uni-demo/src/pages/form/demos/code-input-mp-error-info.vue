<script setup lang="ts">
/** Demo: sn-code-input — 错误态（errorInfo）：覆盖 info 并把边框切成危险色。 */
import { ref } from 'vue';
import SnCodeInput from '@snui/uni-src/components/sn-code-input/sn-code-input.vue';

const wrong = ref('12');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCodeInput v-model="wrong" :length="6" error-info="密码不正确" />
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
