<script setup lang="ts">
/** Demo: sn-input — cursor spacing (cursorSpacing): keeps the caret a fixed distance above the keyboard. */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const spaced = ref('');
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="spaced" :cursor-spacing="24" placeholder="24px cursor spacing" />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
