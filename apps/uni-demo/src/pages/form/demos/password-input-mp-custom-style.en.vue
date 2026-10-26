<script setup lang="ts">
/**
 * Demo: sn-password-input — customClass / customStyle.
 *
 * `custom-class` is appended to the root node (alongside `sn-password-input`)
 * and `custom-style` is the root inline style. The component's own `gutter`
 * writes `--sn-password-input-gap`; `custom-style` is appended after it, so
 * other properties can still be overridden.
 */
import { ref } from 'vue';
import SnPasswordInput from '@snui/uni-src/components/sn-password-input/sn-password-input.vue';

const pin = ref('123');
const framed = ref('4567');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnPasswordInput
      v-model="pin"
      :length="6"
      custom-class="sn-demo__pin"
      custom-style="padding: 16rpx; border-radius: var(--sn-mp-radius-md); background-color: var(--sn-mp-color-background-soft);"
    />
    <text class="sn-demo__meta"
      >customClass + customStyle: the root gains a border and a soft fill</text
    >

    <SnPasswordInput v-model="framed" :length="4" :gutter="12" custom-class="sn-demo__pin" />
    <text class="sn-demo__meta"
      >customClass only: coexists with the component's own gutter variable</text
    >
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: stretch;
  width: 100%;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* custom-class lands on the sn-password-input root, so :deep pierces the component boundary. */
.sn-demo :deep(.sn-demo__pin) {
  border: 2rpx solid var(--sn-mp-color-border-subtle);
}
</style>
