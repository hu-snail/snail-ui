<script setup lang="ts">
/** Demo: sn-textarea — clearable: a × on the right clears the value in one tap. */
import { ref } from 'vue';
import SnTextarea from '@snui/uni-src/components/sn-textarea/sn-textarea.vue';

const clearable = ref('Tap the × on the right to clear this text');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">clearable</text>
    <SnTextarea v-model="clearable" clearable />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
</style>
