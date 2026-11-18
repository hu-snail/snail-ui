<script setup lang="ts">
/** Demo: sn-input — keyboard hold and page push (holdKeyboard / adjustPosition / always-embed). */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const held = ref('');
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="held" hold-keyboard adjust-position placeholder="Keyboard up + auto scroll" />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
