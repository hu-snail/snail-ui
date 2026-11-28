<script setup lang="ts">
/** Demo: sn-input — 键盘保持与页面上推（holdKeyboard / adjustPosition / always-embed）。 */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const held = ref('');
</script>

<template>
  <view class="sn-input-demo">
    <SnInput v-model="held" hold-keyboard adjust-position placeholder="失焦保留键盘 + 自动滚动" />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
