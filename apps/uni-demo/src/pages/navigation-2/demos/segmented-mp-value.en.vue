<script setup lang="ts">
/**
 * Demo: sn-segmented — the wot-ui `value` alias.
 *
 * `wd-segmented` names the selected value `value`; this component names it
 * `modelValue`. So a component migrated from wot-ui keeps working unchanged, both
 * props are accepted, and `value` wins when they are passed together.
 *
 * The event name stays this component's `update:modelValue` (wot-ui writes
 * `@update:value`); the pair below — `:value` + `@update:model-value` — is the
 * expanded form of `v-model`.
 *
 * The demo also exercises `vibrate-short`: switching calls `uni.vibrateShort`, and
 * H5 / hosts without a vibration motor skip it silently without breaking the tap.
 */
import { ref } from 'vue';
import SnSegmented from '@snui/uni-src/components/sn-segmented/sn-segmented.vue';

const size = ref('md');
const sizeOptions = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
];

const layout = ref('grid');
const layoutOptions = ['grid', 'list'];

function onSizeUpdate(next: string | number): void {
  size.value = String(next);
}

function onLayoutUpdate(next: string | number): void {
  layout.value = String(next);
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">`:value` alias + `@update:model-value`</text>
    <SnSegmented
      :value="size"
      :options="sizeOptions"
      vibrate-short
      @update:model-value="onSizeUpdate"
    />
    <text class="sn-demo__meta">Current size: {{ size }}</text>

    <text class="sn-demo__label">`value` beats `model-value` when both are passed</text>
    <SnSegmented
      :model-value="'list'"
      :value="layout"
      :options="layoutOptions"
      @update:model-value="onLayoutUpdate"
    />
    <text class="sn-demo__meta">Current layout: {{ layout }}</text>
  </view>
</template>

<style scoped>
.sn-demo__label {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
