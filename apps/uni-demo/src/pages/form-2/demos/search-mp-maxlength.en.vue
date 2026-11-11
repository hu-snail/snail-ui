<script setup lang="ts">
/** Demo: sn-search — character cap: `maxlength` limits the typeable characters (`-1` = unlimited). */
import { ref } from 'vue';
import SnSearch from '@snui/uni-src/components/sn-search/sn-search.vue';

const limited = ref('');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSearch v-model="limited" :maxlength="8" placeholder="At most 8 characters" />
    <text class="sn-demo__meta"
      >maxlength=8: extra characters are rejected ({{ limited.length }}/8)</text
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
