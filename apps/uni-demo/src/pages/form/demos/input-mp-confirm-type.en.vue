<script setup lang="ts">
/** Demo: sn-input — confirm-type: the soft-keyboard confirm button label. */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const text = ref('');
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="text" confirm-type="search" placeholder="search button" />
    <SnInput v-model="text" confirm-type="send" placeholder="send button" />
    <SnInput v-model="text" confirm-type="go" placeholder="go button" />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
