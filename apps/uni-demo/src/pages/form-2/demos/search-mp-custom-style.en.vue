<script setup lang="ts">
/**
 * Demo: sn-search — inner-input & root styling.
 *
 * `custom-input-class` appends a class to the inner native input, not the root;
 * `custom-class` / `custom-style` land on the root wrapper and restyle the
 * outer frame.
 */
import { ref } from 'vue';
import SnSearch from '@snui/uni-src/components/sn-search/sn-search.vue';

const inputClass = ref('snail');
const wrapper = ref('snail');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSearch
      v-model="inputClass"
      custom-input-class="sn-demo__input"
      placeholder="customInputClass"
    />
    <text class="sn-demo__meta"
      >customInputClass lands on the inner input node, widening letter spacing</text
    >

    <SnSearch
      v-model="wrapper"
      custom-class="sn-demo__search"
      custom-style="border-radius: var(--sn-mp-radius-full); background-color: var(--sn-mp-color-background-soft);"
      placeholder="customClass + customStyle"
    />
    <text class="sn-demo__meta">customClass / customStyle restyle the root frame and fill</text>
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
/* custom-input-class sits on the inner <input>, so :deep pierces the component boundary. */
.sn-demo :deep(.sn-demo__input) {
  letter-spacing: 2rpx;
  color: var(--sn-mp-color-action-primary);
  font-weight: var(--sn-mp-font-weight-medium);
}
/* custom-class lands on the sn-search root, so :deep pierces the component boundary. */
.sn-demo :deep(.sn-demo__search) {
  border: 2rpx solid var(--sn-mp-color-border-default);
}
</style>
