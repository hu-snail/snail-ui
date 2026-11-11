<script setup lang="ts">
/**
 * Demo: sn-drop-menu — English shadow of drop-menu-mp-modal.
 *
 * - `modal=false` renders no scrim (useful on list pages that stay interactive)
 * - `close-on-click-modal=false` keeps the scrim as a visual layer only; tapping it
 *   does not close the menu
 * - `duration` sets the open / close animation length
 *
 * Docs-preview only: `custom-class="sn-demo-contained"` keeps the panel's
 * positioning context inside the demo.
 */
import { ref } from 'vue';
import SnDropMenu from '@snui/uni-src/components/sn-drop-menu/sn-drop-menu.vue';

const noModal = ref('default');
const noCloseOnTap = ref('');

const sortOptions = [
  { label: 'Recommended', value: 'default' },
  { label: 'Price: low to high', value: 'price-asc' },
  { label: 'Price: high to low', value: 'price-desc' },
];

const cityOptions = [
  { label: 'Beijing', value: 'bj' },
  { label: 'Shanghai', value: 'sh' },
  { label: 'Guangzhou', value: 'gz' },
];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">modal=false + duration=400</text>
    <SnDropMenu
      v-model="noModal"
      :options="sortOptions"
      :modal="false"
      :duration="400"
      title="Sort"
      custom-class="sn-demo-contained"
    />

    <text class="sn-demo__label">close-on-click-modal=false (scrim taps do not close)</text>
    <SnDropMenu
      v-model="noCloseOnTap"
      :options="cityOptions"
      :close-on-click-modal="false"
      title="City"
      custom-class="sn-demo-contained"
    />

    <text class="sn-demo__meta">Selected: {{ noModal }} / {{ noCloseOnTap || 'none' }}</text>
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
/* Docs-preview only — the panel is absolutely positioned inside the root. */
.sn-demo :deep(.sn-drop-menu.sn-demo-contained) {
  position: relative;
}
</style>
