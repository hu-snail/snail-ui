<script setup lang="ts">
/** Demo: sn-textarea — auto height: `autoHeight` grows the box with its content. */
import { ref } from 'vue';
import SnTextarea from '@snui/uni-src/components/sn-textarea/sn-textarea.vue';

const grow = ref('This textarea grows with its content.');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">autoHeight</text>
    <SnTextarea v-model="grow" auto-height />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
</style>
