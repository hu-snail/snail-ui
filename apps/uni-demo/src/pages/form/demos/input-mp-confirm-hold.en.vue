<script setup lang="ts">
/** Demo: sn-input — keyboard stays up on confirm (confirmHold): the confirm key does not dismiss the keyboard. */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const held = ref('');
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="held" confirm-hold placeholder="Keyboard stays up on confirm" />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
