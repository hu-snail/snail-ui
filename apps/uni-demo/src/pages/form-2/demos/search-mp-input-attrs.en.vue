<script setup lang="ts">
/**
 * Demo: sn-search — maxlength / focus / focusWhenClear / customInputClass.
 *
 * `maxlength` caps the character count (`-1` = unlimited); `focus` focuses the
 * field on mount; `focus-when-clear` keeps the refocus-after-clear switch;
 * `custom-input-class` appends a class to the inner native input, not the root.
 */
import { ref } from 'vue';
import SnSearch from '@snui/uni-src/components/sn-search/sn-search.vue';

const limited = ref('');
const focused = ref('');
const cleared = ref('snail');
const inputClass = ref('snail');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSearch v-model="limited" :maxlength="8" placeholder="At most 8 characters" />
    <text class="sn-demo__meta"
      >maxlength=8: extra characters are rejected ({{ limited.length }}/8)</text
    >

    <SnSearch v-model="focused" focus placeholder="Focused on mount" />
    <text class="sn-demo__meta">focus: focuses the inner field on mount</text>

    <SnSearch v-model="cleared" focus-when-clear placeholder="Refocus after clear" />
    <text class="sn-demo__meta"
      >focusWhenClear: refocus after the clear button (pairs with @clear)</text
    >

    <SnSearch
      v-model="inputClass"
      custom-input-class="sn-demo__input"
      placeholder="customInputClass"
    />
    <text class="sn-demo__meta"
      >customInputClass lands on the inner input node, widening letter spacing</text
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
/* custom-input-class sits on the inner <input>, so :deep pierces the component boundary. */
.sn-demo :deep(.sn-demo__input) {
  letter-spacing: 2rpx;
  color: var(--sn-mp-color-action-primary);
  font-weight: var(--sn-mp-font-weight-medium);
}
</style>
