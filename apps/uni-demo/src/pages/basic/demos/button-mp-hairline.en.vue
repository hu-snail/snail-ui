<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — `hairline`.
 *
 * `hairline` only applies to `type="default"` (the semantic types already carry
 * a coloured border). It defaults to true; false makes the border transparent.
 * It stacks with the loading state.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

const busy = ref(false);

function toggleBusy(): void {
  busy.value = !busy.value;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta"
      >hairline: on a default button true draws a thin border, false drops it</text
    >
    <view class="sn-demo__row">
      <SnButton>hairline (default)</SnButton>
      <SnButton :hairline="false">hairline=false</SnButton>
      <SnButton hairline :disabled="true">hairline + disabled</SnButton>
    </view>

    <text class="sn-demo__meta">loading plus hairline: the loading state of a bordered button</text>
    <view class="sn-demo__row">
      <SnButton loading :loading-props="{ size: 40 }">Loading (hairline)</SnButton>
      <SnButton :hairline="false" loading>Loading (no border)</SnButton>
      <SnButton type="primary" :loading="busy" @tap="toggleBusy">
        {{ busy ? 'Requesting…' : 'Tap to toggle loading' }}
      </SnButton>
    </view>
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
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  align-items: center;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
