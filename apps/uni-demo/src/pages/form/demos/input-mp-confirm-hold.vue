<script setup lang="ts">
/** Demo: sn-input — 确认键保持键盘（confirmHold）：点确认键不收起软键盘。 */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const held = ref('');
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="held" confirm-hold placeholder="点确认键保持键盘" />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
