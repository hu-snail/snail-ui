<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — sizes × form scenes.
 * Spacing note: uni-app x has no flex `gap` support — inline `custom-style`
 * margins + explicit `flex-direction: row`.
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

type SizeKey = 'small' | 'medium' | 'large';

const sizes: Array<{ key: SizeKey; label: string }> = [
  { key: 'small', label: 'Small' },
  { key: 'medium', label: 'Medium' },
  { key: 'large', label: 'Large' },
];

const iconSizes: Array<{ key: SizeKey; icon: string }> = [
  { key: 'small', icon: 'settings' },
  { key: 'medium', icon: 'search' },
  { key: 'large', icon: 'plus' },
];

/** In-row spacing fallback (uni-app x lacks gap). */
const rowGap = { margin: '0 16rpx 16rpx 0' };
</script>

<template>
  <view class="sn-mp-btn-stack">
    <text class="sn-mp-btn-label">Filled (type=primary)</text>
    <view class="sn-mp-btn-row">
      <SnButton
        v-for="item in sizes"
        :key="item.key"
        :custom-style="rowGap"
        type="primary"
        :size="item.key"
      >
        {{ item.label }} button
      </SnButton>
    </view>

    <text class="sn-mp-btn-label">Plain</text>
    <view class="sn-mp-btn-row">
      <SnButton
        v-for="item in sizes"
        :key="item.key"
        :custom-style="rowGap"
        type="primary"
        variant="plain"
        :size="item.key"
      >
        {{ item.label }} button
      </SnButton>
    </view>

    <text class="sn-mp-btn-label">Soft</text>
    <view class="sn-mp-btn-row">
      <SnButton
        v-for="item in sizes"
        :key="item.key"
        :custom-style="rowGap"
        type="primary"
        variant="soft"
        :size="item.key"
      >
        {{ item.label }} button
      </SnButton>
    </view>

    <text class="sn-mp-btn-label">Hairline (default type)</text>
    <view class="sn-mp-btn-row">
      <SnButton v-for="item in sizes" :key="item.key" :custom-style="rowGap" :size="item.key">
        {{ item.label }} button
      </SnButton>
    </view>

    <text class="sn-mp-btn-label">Icon buttons (circle, glyph auto-fits the size)</text>
    <view class="sn-mp-btn-row">
      <SnButton
        v-for="item in iconSizes"
        :key="item.key"
        :custom-style="rowGap"
        circle
        type="primary"
        :size="item.key"
        :icon-name="item.icon"
      />
    </view>
  </view>
</template>

<style scoped>
.sn-mp-btn-stack {
  display: flex;
  flex-direction: column;
}
.sn-mp-btn-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}
.sn-mp-btn-label {
  margin-bottom: 12rpx;
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
