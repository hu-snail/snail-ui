<script setup lang="ts">
/** Demo: sn-input-number — 长按连加（longPress）：按住按钮连续加减。 */
import { ref } from 'vue';
import SnInputNumber from '@snui/uni-src/components/sn-input-number/sn-input-number.vue';

const value = ref(0);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnInputNumber v-model="value" :min="0" :max="100" long-press />
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: stretch;
}
</style>
