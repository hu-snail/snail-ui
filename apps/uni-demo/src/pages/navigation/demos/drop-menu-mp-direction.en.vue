<script setup lang="ts">
/**
 * Demo: sn-drop-menu — up vs. down expansion direction.
 *
 * - `direction="down"` (default): the panel opens from the bar's bottom edge; the
 *   arrow rests pointing down and flips up while open
 * - `direction="up"`: the panel opens from the bar's top edge; the arrow rests
 *   pointing up and flips down while open
 * - in both directions the scrim is anchored opposite the panel: below the bar for
 *   `down`, above it for `up`
 *
 * Option icons are built-in set objects (named import from sn-icon-set) — zero
 * registration.
 *
 * Docs-preview only: `custom-class="sn-demo-contained"` keeps the panel's
 * positioning context inside the demo.
 */
import { ref } from 'vue';
import { ArrowDown, Clock, Star } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnDropMenu from '@snui/uni-src/components/sn-drop-menu/sn-drop-menu.vue';

const downValue = ref('default');
const upValue = ref('default');

const options = [
  { label: 'Recommended', value: 'default', tip: 'Default order', iconData: Star },
  { label: 'Price: low to high', value: 'price-asc', iconData: ArrowDown },
  { label: 'Newest first', value: 'newest', iconData: Clock },
];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">Down — direction="down" (default)</text>
    <SnDropMenu v-model="downValue" :options="options" custom-class="sn-demo-contained" />

    <text class="sn-demo__label">Up — direction="up"</text>
    <SnDropMenu
      v-model="upValue"
      :options="options"
      direction="up"
      custom-class="sn-demo-contained"
    />

    <text class="sn-demo__meta">Down: {{ downValue }} / Up: {{ upValue }}</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
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
