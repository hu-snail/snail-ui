<script setup lang="ts">
/** Demo: sn-password-input — `shape='box'` (default) vs `shape='underline'` cell shapes. */
import { ref } from 'vue';
import SnPasswordInput from '@snui/uni-src/components/sn-password-input/sn-password-input.vue';

const box = ref('12');
const line = ref('34');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnPasswordInput v-model="box" :length="4" shape="box" info="Box (default)" />
    <SnPasswordInput v-model="line" :length="4" shape="underline" info="Underline" />
    <text class="sn-demo__meta"
      >shape='box' | 'underline' — focus / error borders follow automatically</text
    >
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
