<script setup lang="ts">
/**
 * Demo: sn-drop-menu — the three option-icon sources, precedence and selection.
 *
 * Icon sources (precedence: data object > image URL > name):
 *   - `option.iconData`: a built-in set object (named import from sn-icon-set) —
 *     zero registration
 *   - `option.iconUrl`: an image URL, rendered as `<image>`
 *   - `option.icon`: the name chain (built-in catalogue kebab name needs no
 *     registration; a `registerSnIcons` name also works)
 *
 * The selected-row glyph is a built-in icon too; `icon-name` swaps it (default
 * `check`, shown here as `circle-check`). Glyph scale travels through `icon-size`:
 * a tier name maps to `--sn-mp-icon-size-*`, a number / any length passes through.
 *
 * Docs-preview only: `custom-class="sn-demo-contained"` keeps the panel's
 * positioning context inside the demo.
 */
import { ref } from 'vue';
import { registerSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry';
import type { IconData } from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { Star, Truck } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnDropMenu from '@snui/uni-src/components/sn-drop-menu/sn-drop-menu.vue';

// Inline IconData sample (lucide path data, ISC).
const FlameIcon: IconData = {
  viewBox: '0 0 24 24',
  paths: [
    'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z',
  ],
};

// Registry track: registering makes the glyph addressable by name (idempotent).
registerSnIcons({ 'drop-menu-flame': FlameIcon });

const byData = ref('hot');
const byName = ref('rate');
const byUrl = ref('brand');
const large = ref('hot');
const precedence = ref('all');

const dataOptions = [
  { label: 'Trending', value: 'hot', tip: 'By sales', iconData: FlameIcon },
  { label: 'Featured', value: 'star', tip: 'Editor pick', iconData: Star },
  { label: 'Same-day delivery', value: 'city', tip: 'Within 30 min', iconData: Truck },
];

const nameOptions = [
  { label: 'Top rated', value: 'rate', icon: 'star' },
  { label: 'Newest first', value: 'new', icon: 'clock' },
  { label: 'Popular', value: 'hot', icon: 'drop-menu-flame' },
];

const urlOptions = [
  {
    label: 'Brand zone',
    value: 'brand',
    iconUrl: 'https://picsum.photos/seed/snui-drop-menu/96',
  },
  { label: 'Plain text row', value: 'plain' },
];

// All three sources on one row → iconData wins (object > image URL > name).
const precedenceOptions = [
  {
    label: 'Object wins',
    value: 'all',
    iconData: Star,
    iconUrl: 'https://picsum.photos/seed/snui-drop-menu-priority/96',
    icon: 'clock',
  },
];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">Source 1: built-in set object (iconData, highest precedence)</text>
    <SnDropMenu v-model="byData" :options="dataOptions" custom-class="sn-demo-contained" />

    <text class="sn-demo__label">Source 2: name chain (catalogue name / registry name)</text>
    <SnDropMenu v-model="byName" :options="nameOptions" custom-class="sn-demo-contained" />

    <text class="sn-demo__label">Source 3: image URL (iconUrl, rendered as image)</text>
    <SnDropMenu v-model="byUrl" :options="urlOptions" custom-class="sn-demo-contained" />

    <text class="sn-demo__label">
      Glyph scale and check glyph (icon-size="large" + icon-name="circle-check")
    </text>
    <SnDropMenu
      v-model="large"
      :options="dataOptions"
      icon-size="large"
      icon-name="circle-check"
      custom-class="sn-demo-contained"
    />

    <text class="sn-demo__label">Precedence: with all three sources, iconData wins</text>
    <SnDropMenu
      v-model="precedence"
      :options="precedenceOptions"
      custom-class="sn-demo-contained"
    />

    <text class="sn-demo__meta">Object: {{ byData }} / Name: {{ byName }} / Image: {{ byUrl }}</text>
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
