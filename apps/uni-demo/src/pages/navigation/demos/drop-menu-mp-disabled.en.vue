<script setup lang="ts">
/**
 * Demo: sn-drop-menu — English shadow of drop-menu-mp-disabled.
 *
 * `disabled` disables the whole bar — taps are ignored.
 *
 * Docs-preview only: `custom-class="sn-demo-contained"` keeps the panel's
 * positioning context inside the demo.
 */
import { ref } from 'vue';
import SnDropMenu from '@snui/uni-src/components/sn-drop-menu/sn-drop-menu.vue';

const disabledValue = ref('a');

const options = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnDropMenu
      v-model="disabledValue"
      :options="options"
      disabled
      title="Disabled"
      custom-class="sn-demo-contained"
    />

    <text class="sn-demo__meta">Taps are ignored and the value stays {{ disabledValue }}.</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
/* Docs-preview only — the panel is absolutely positioned inside the root. */
.sn-demo :deep(.sn-drop-menu.sn-demo-contained) {
  position: relative;
}
</style>
