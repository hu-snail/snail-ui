<script setup lang="ts">
/** Demo: sn-textarea — word limit: `showWordLimit` + `maxlength` render the counter. */
import { ref } from 'vue';
import SnTextarea from '@snui/uni-src/components/sn-textarea/sn-textarea.vue';

const limited = ref('A multi-line note from snail-aui');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">showWordLimit + maxlength</text>
    <SnTextarea v-model="limited" :maxlength="60" show-word-limit />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
</style>
