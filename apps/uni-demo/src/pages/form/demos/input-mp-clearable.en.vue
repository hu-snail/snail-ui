<script setup lang="ts">
/** Demo: sn-input — clear button (clearable): shows × once a value is set. */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const clearable = ref('Click × to clear me');
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
