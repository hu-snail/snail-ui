<script setup lang="ts">
/**
 * Demo: sn-collapse — title-icon sources, size tiers and colours.
 *
 * Icon sources (precedence: object > image > name):
 *   - `titleIconData`: a built-in set object imported from sn-icon-set
 *   - `titleIcon`: the name chain (catalogue kebab names / registerSnIcons)
 *   - `titleIconUrl`: an image URL rendered as `<image>`
 *
 * Size: `iconSize` tiers map to `--sn-mp-icon-size-*` (set on the container,
 * overridable per panel). Colour: `iconColor` takes a `var(--sn-mp-color-*)`
 * token only.
 */
import { ref } from 'vue';
import { registerSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry';
import type { IconData } from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { Bell, Gift, MapPin, Star } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCollapse from '@snui/uni-src/components/sn-collapse/sn-collapse.vue';
import SnCollapseItem from '@snui/uni-src/components/sn-collapse/sn-collapse-item.vue';

// IconData sample (lucide path data, ISC).
const MoonIcon: IconData = {
  viewBox: '0 0 24 24',
  paths: ['M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'],
};

// Registry track: once registered the name resolves like any built-in.
registerSnIcons({ 'collapse-moon': MoonIcon });

const byData = ref(['a']);
const byName = ref(['a']);
const byUrl = ref([]);
const tiers = ref(['a']);
const colored = ref([]);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__label">Built-in set objects (titleIconData, highest priority)</text>
    <SnCollapse v-model="byData">
      <SnCollapseItem name="a" title="Favourites" :title-icon-data="Star">
        <text class="sn-demo__body">Star is imported by name and passed as data — no setup.</text>
      </SnCollapseItem>
      <SnCollapseItem name="b" title="Nearby stores" :title-icon-data="MapPin">
        <text class="sn-demo__body">The built-in set covers the common business meanings.</text>
      </SnCollapseItem>
    </SnCollapse>

    <text class="sn-demo__label">Name chain (catalogue names / registered names)</text>
    <SnCollapse v-model="byName">
      <SnCollapseItem name="a" title="Notifications" title-icon="bell">
        <text class="sn-demo__body">A kebab-case catalogue name resolves with no setup.</text>
      </SnCollapseItem>
      <SnCollapseItem name="b" title="Night mode" title-icon="collapse-moon">
        <text class="sn-demo__body">A name registered through registerSnIcons works too.</text>
      </SnCollapseItem>
    </SnCollapse>

    <text class="sn-demo__label">Image icon (titleIconUrl, rendered as image)</text>
    <SnCollapse v-model="byUrl">
      <SnCollapseItem
        name="a"
        title="Brand avatar"
        title-icon-url="https://picsum.photos/seed/snui-collapse/96"
      >
        <text class="sn-demo__body">Image icons share the same size box as the SVG ones.</text>
      </SnCollapseItem>
    </SnCollapse>

    <text class="sn-demo__label">Size tiers (container iconSize, overridable per panel)</text>
    <SnCollapse v-model="tiers" icon-size="medium">
      <SnCollapseItem name="a" title="tiny" :title-icon-data="Bell" icon-size="tiny">
        <text class="sn-demo__body">Chevron and title icon scale together.</text>
      </SnCollapseItem>
      <SnCollapseItem name="b" title="small" :title-icon-data="Bell" icon-size="small">
        <text class="sn-demo__body">Tier names map to --sn-mp-icon-size-* tokens.</text>
      </SnCollapseItem>
      <SnCollapseItem name="c" title="large" :title-icon-data="Bell" icon-size="large">
        <text class="sn-demo__body">Still scales proportionally on another viewport.</text>
      </SnCollapseItem>
      <SnCollapseItem name="d" title="custom 44rpx" :title-icon-data="Bell" icon-size="44rpx">
        <text class="sn-demo__body">Numbers and any length string pass through verbatim.</text>
      </SnCollapseItem>
    </SnCollapse>

    <text class="sn-demo__label">Colour (iconColor takes a --sn-mp-color-* token)</text>
    <SnCollapse v-model="colored" icon-color="var(--sn-mp-color-action-primary)">
      <SnCollapseItem name="a" title="Brand-coloured icon" :title-icon-data="Gift">
        <text class="sn-demo__body">Container-level colour persists once the panel opens.</text>
      </SnCollapseItem>
    </SnCollapse>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-4);
  width: 100%;
}
.sn-demo__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
.sn-demo__body {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
}
</style>
