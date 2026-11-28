<script setup lang="ts">
/** Demo: sn-input — character count (showCount): maxlength + count badge. */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const counter = ref('hel');
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="counter" :maxlength="10" show-count placeholder="maxlength + count" />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
