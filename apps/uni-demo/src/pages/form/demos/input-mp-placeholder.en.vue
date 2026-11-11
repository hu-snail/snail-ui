<script setup lang="ts">
/** Demo: sn-input — placeholder styling (placeholderClass / placeholderStyle). */
import { ref } from 'vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';

const styled = ref('');
</script>

<template>
  <view class="sn-input-demo">
    <SnInput
      v-model="styled"
      placeholder-class="sn-input-demo__placeholder"
      placeholder-style="font-style: italic; color: var(--sn-mp-color-feedback-danger);"
      placeholder="Custom placeholder"
    />
  </view>
</template>

<style scoped>
.sn-input-demo {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-input-demo__placeholder {
  font-size: 26rpx;
  color: var(--sn-mp-color-feedback-warning);
}
</style>
