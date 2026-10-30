<script setup lang="ts">
/**
 * Demo: sn-pagination — disabled states (whole control + boundaries).
 *
 * - `disabled` freezes the whole pager: the root carries
 *   `sn-pagination--disabled`, every label and both step buttons switch to the
 *   disabled text colour, and taps stop emitting `change`
 * - Boundary disable: the previous button is inert on page 1 and the next
 *   button on the last page, each with its own disabled styling
 * - `show-icon` keeps the built-in chevrons, which dim with their label
 */
import { ref } from 'vue';
import SnPagination from '@snui/uni-src/components/sn-pagination/sn-pagination.vue';

const frozenPage = ref(3);
/** Sitting on page 1 → the previous button hits its boundary disable. */
const firstPage = ref(1);
/** Sitting on the last page → the next button hits its boundary disable. */
const lastPage = ref(8);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__group">
      <text class="sn-demo__group-title">Whole control disabled</text>
      <SnPagination v-model="frozenPage" :total-page="8" show-icon disabled />
    </view>

    <view class="sn-demo__group">
      <text class="sn-demo__group-title">Boundary disable · page 1</text>
      <SnPagination v-model="firstPage" :total-page="8" show-icon />
    </view>

    <view class="sn-demo__group">
      <text class="sn-demo__group-title">Boundary disable · page 8</text>
      <SnPagination v-model="lastPage" :total-page="8" show-icon />
    </view>

    <text class="sn-demo__meta">
      Disabled buttons use --sn-mp-color-text-disabled with a
      --sn-mp-color-background-subtle fill; out-of-range taps are blocked and
      never emit change.
    </text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  width: 100%;
}
.sn-demo__group {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  padding: var(--sn-mp-spacing-3);
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-surface);
}
.sn-demo__group-title {
  font-size: var(--sn-mp-font-size-xs);
  font-weight: var(--sn-mp-font-weight-medium);
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__meta {
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
  color: var(--sn-mp-color-text-tertiary);
}
</style>
