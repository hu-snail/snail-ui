<script setup lang="ts">
/** Demo: sn-input — 输入合成（ignoreCompositionEvent）：ignoreCompositionEvent=false 时合成期间也触发 input。 */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const composing = ref('');
</script>

<template>
  <view class="sn-input-demo">
    <SnInput
      v-model="composing"
      :ignore-composition-event="false"
      placeholder="中文输入时逐字同步"
    />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
