<script setup lang="ts">
/**
 * Demo: sn-tag (uni-end) — three icon tracks: built-in catalog names /
 * IconData objects / the iconUrl bitmap.
 *
 * Built-in catalog names (kebab-case) resolve without registration; an
 * `IconData` object is imported from sn-icon-set and passed straight in
 * (tree-shaking friendly); `iconUrl` renders an `<image>` sized by the
 * icon-size tiers. Precedence: slot > iconUrl > object / catalog name >
 * cssIcon font glyph.
 */
import SnTag from '@snui/uni-src/components/sn-tag/sn-tag.vue';
import { Gift, Truck } from '@snui/uni-src/components/sn-icon/sn-icon-set';

/** Bitmap icons share the same size tiers as vector icons. */
const brandLogo = 'https://picsum.photos/seed/snui-tag-brand/48/48';
const badgeShot = 'https://picsum.photos/seed/snui-tag-shot/48/48';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">Built-in catalog names, no registration needed</text>
    <view class="sn-demo__row">
      <SnTag type="success" variant="light" icon="check">Verified</SnTag>
      <SnTag type="warning" variant="light" icon="clock">Pending</SnTag>
      <SnTag type="default" variant="light" icon="bell">Reminders</SnTag>
    </view>

    <text class="sn-demo__meta">IconData objects, imported by name</text>
    <view class="sn-demo__row">
      <SnTag type="pink" variant="light" :icon="Gift">Gift card</SnTag>
      <SnTag type="primary" variant="light" :icon="Truck">Next-day</SnTag>
    </view>

    <text class="sn-demo__meta">iconUrl bitmap icons (sized by the icon tiers)</text>
    <view class="sn-demo__row">
      <SnTag :icon-url="brandLogo">Brand partner</SnTag>
      <SnTag size="small" :icon-url="badgeShot">Badge</SnTag>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  align-items: flex-start;
}

.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sn-mp-spacing-4) var(--sn-mp-spacing-5);
  align-items: center;
}

.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
