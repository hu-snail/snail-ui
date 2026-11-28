<script setup lang="ts">
/** Demo: sn-textarea — placeholder styling: `placeholderStyle` (inline declarations) + `placeholderClass` (a class) affect only the placeholder text. */
import { ref } from 'vue';
import SnTextarea from '@snui/uni-src/components/sn-textarea/sn-textarea.vue';

const styled = ref('');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">placeholderStyle + placeholderClass</text>
    <SnTextarea
      v-model="styled"
      placeholder-style="font-style: italic; color: var(--sn-mp-color-feedback-danger);"
      placeholder-class="sn-demo__placeholder"
      placeholder="Italic placeholder + a custom placeholder class"
    />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo__placeholder {
  font-size: 26rpx;
  color: var(--sn-mp-color-feedback-warning);
}
</style>
