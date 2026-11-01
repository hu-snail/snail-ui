<script setup lang="ts">
/** Demo: sn-code-input — `border='none'` strips every cell border (the underline rule included) for background-only cells; pairs naturally with `background`. */
import { ref } from 'vue';
import SnCodeInput from '@snui/uni-src/components/sn-code-input/sn-code-input.vue';

const bg = ref('12');
const bare = ref('34');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCodeInput
      v-model="bg"
      :length="4"
      border="none"
      background="var(--sn-mp-color-background-sunken)"
      info="No border + background"
    />
    <SnCodeInput
      v-model="bare"
      :length="4"
      border="none"
      shape="underline"
      info="No-border underline"
    />
    <text class="sn-demo__meta">border='none' applies to both the box and underline shapes</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
