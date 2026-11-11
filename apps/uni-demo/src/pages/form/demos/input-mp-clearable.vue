<script setup lang="ts">
/** Demo: sn-input — 清空按钮（clearable）：有值即显示 × 一键清空。 */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const clearable = ref('点右侧 × 清空我');
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="clearable" clearable placeholder="clearable" />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
