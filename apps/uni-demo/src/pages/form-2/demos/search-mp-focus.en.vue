<script setup lang="ts">
/** Demo: sn-search — focus: `focus` focuses the field on mount; `focusWhenClear` refocuses after the clear button. */
import { ref } from 'vue';
import SnSearch from '@snui/uni-src/components/sn-search/sn-search.vue';

const focused = ref('');
const cleared = ref('snail');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSearch v-model="focused" focus placeholder="Focused on mount" />
    <text class="sn-demo__meta">focus: focuses the inner field on mount</text>

    <SnSearch v-model="cleared" focus-when-clear placeholder="Refocus after clear" />
    <text class="sn-demo__meta"
      >focusWhenClear: refocus after the clear button (pairs with @clear)</text
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
</style>
