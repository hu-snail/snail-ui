<script setup lang="ts">
/**
 * Demo: sn-drop-menu — no scrim, scrim that does not close, panel height and custom
 * panel styling.
 *
 * - `modal=false` renders no scrim (useful on list pages that stay interactive)
 * - `close-on-click-modal=false` keeps the scrim as a visual layer only; tapping it
 *   does not close the menu
 * - `popup-height` caps the panel height (the panel defaults to at most 80vh)
 * - `custom-popup-class` / `custom-popup-style` target the option panel
 * - `disabled` disables the whole bar — taps are ignored
 * - `duration` sets the open / close animation length
 * - the default slot replaces the option list (the panel and animation are reused)
 *
 * Docs-preview only: `custom-class="sn-demo-contained"` keeps the panel's
 * positioning context inside the demo.
 */
import { ref } from 'vue';
import SnDropMenu from '@snui/uni-src/components/sn-drop-menu/sn-drop-menu.vue';

const noModal = ref('default');
const styled = ref('');
const disabledValue = ref('a');

const sortOptions = [
  { label: 'Recommended', value: 'default' },
  { label: 'Price: low to high', value: 'price-asc' },
  { label: 'Price: high to low', value: 'price-desc' },
];

const styledOptions = [
  { label: 'Beijing', value: 'bj', tip: 'Default city' },
  { label: 'Shanghai', value: 'sh' },
  { label: 'Guangzhou', value: 'gz' },
];

const customOptions = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
];
const customValue = ref('7d');
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

    <text class="sn-demo__label">close-on-click-modal=false + popup-height + custom-popup-*</text>
    <SnDropMenu
      v-model="styled"
      :options="styledOptions"
      :close-on-click-modal="false"
      popup-height="240rpx"
      custom-popup-class="sn-demo__panel"
      custom-popup-style="padding: var(--sn-mp-spacing-2);"
      custom-class="sn-demo-contained"
    />

    <text class="sn-demo__label">disabled + default slot replacing the option list</text>
    <SnDropMenu
      v-model="disabledValue"
      :options="customOptions"
      disabled
      title="Disabled"
      custom-class="sn-demo-contained"
    />

    <SnDropMenu
      v-model="customValue"
      :options="customOptions"
      title="Custom panel"
      custom-class="sn-demo-contained"
    >
      <view class="sn-demo__custom">
        <text
          v-for="option in customOptions"
          :key="option.value"
          class="sn-demo__custom-item"
          @tap="customValue = option.value"
        >
          {{ option.label }}{{ customValue === option.value ? ' ✓' : '' }}
        </text>
      </view>
    </SnDropMenu>

    <text class="sn-demo__meta"
      >Selected: {{ noModal }} / {{ styled || 'none' }} / {{ customValue }}</text
    >
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
.sn-demo__custom {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-2);
  padding: var(--sn-mp-spacing-3);
}
.sn-demo__custom-item {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-primary);
}
/* Docs-preview only — the panel is absolutely positioned inside the root. */
.sn-demo :deep(.sn-drop-menu.sn-demo-contained) {
  position: relative;
}
/* custom-popup-class lands on the option panel. */
.sn-demo :deep(.sn-demo__panel) {
  border-radius: var(--sn-mp-radius-sm);
}
</style>
