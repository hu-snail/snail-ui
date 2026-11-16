<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — sizes × form scenes.
 *
 * Three size tiers (small / medium / large, no tiny on mobile) each shown as:
 * primary fill, plain outline, soft tint, hairline border (default type), and
 * circular icon buttons (glyph auto-fits the size: small 28 / medium 32 /
 * large 40).
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

type SizeKey = 'small' | 'medium' | 'large';
type SizeLabel = { key: SizeKey; label: string };

const sizes: SizeLabel[] = [
  { key: 'small', label: 'Small' },
  { key: 'medium', label: 'Medium' },
  { key: 'large', label: 'Large' },
];

/** Built-in icon names for the circular icon row (glyph auto-fits the size). */
const iconSizes: Array<{ key: SizeKey; icon: string }> = [
  { key: 'small', icon: 'settings' },
  { key: 'medium', icon: 'search' },
  { key: 'large', icon: 'plus' },
];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">Filled (type=primary)</text>
    <view class="sn-demo__row">
      <SnButton v-for="item in sizes" :key="item.key" type="primary" :size="item.key">
        {{ item.label }} button
      </SnButton>
    </view>

    <text class="sn-demo__label">Plain</text>
    <view class="sn-demo__row">
      <SnButton v-for="item in sizes" :key="item.key" type="primary" variant="plain" :size="item.key">
        {{ item.label }} button
      </SnButton>
    </view>

    <text class="sn-demo__label">Soft</text>
    <view class="sn-demo__row">
      <SnButton v-for="item in sizes" :key="item.key" type="primary" variant="soft" :size="item.key">
        {{ item.label }} button
      </SnButton>
    </view>

    <text class="sn-demo__label">Hairline (default type)</text>
    <view class="sn-demo__row">
      <SnButton v-for="item in sizes" :key="item.key" :size="item.key">{{ item.label }} button</SnButton>
    </view>

    <text class="sn-demo__label">Icon buttons (circle, glyph auto-fits the size)</text>
    <view class="sn-demo__row">
      <SnButton
        v-for="item in iconSizes"
        :key="item.key"
        circle
        type="primary"
        :size="item.key"
        :icon-name="item.icon"
      />
    </view>
  </view>
</template>

<style scoped>
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  align-items: center;
}
.sn-demo__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
