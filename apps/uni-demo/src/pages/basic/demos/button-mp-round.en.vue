<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — round capsules × variant scenes.
 * Spacing note: uni-app x has no flex `gap` support — inline `custom-style`
 * margins + explicit `flex-direction: row`.
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

type ButtonVariant = 'base' | 'plain' | 'dashed' | 'soft';
type SemanticType = 'primary' | 'success' | 'info' | 'warning' | 'danger';

const variants: Array<{ key: ButtonVariant; label: string }> = [
  { key: 'base', label: 'Filled' },
  { key: 'plain', label: 'Plain' },
  { key: 'dashed', label: 'Dashed' },
  { key: 'soft', label: 'Soft' },
];

const types: Array<{ key: SemanticType; label: string }> = [
  { key: 'primary', label: 'Primary button' },
  { key: 'success', label: 'Success button' },
  { key: 'info', label: 'Info button' },
  { key: 'warning', label: 'Warning button' },
  { key: 'danger', label: 'Danger button' },
];

/** In-row spacing fallback (uni-app x lacks gap). */
const rowGap = { margin: '0 16rpx 16rpx 0' };
</script>

<template>
  <view class="sn-mp-btn-stack">
    <view v-for="variant in variants" :key="variant.key" class="sn-mp-btn-group">
      <text class="sn-mp-btn-label">{{ variant.label }} ({{ variant.key }})</text>
      <view class="sn-mp-btn-row">
        <SnButton
          v-for="item in types"
          :key="item.key"
          :custom-style="rowGap"
          round
          :type="item.key"
          :variant="variant.key === 'base' ? undefined : variant.key"
        >
          {{ item.label }}
        </SnButton>
      </view>
    </view>
  </view>
</template>

<style scoped>
.sn-mp-btn-stack {
  display: flex;
  flex-direction: column;
}
.sn-mp-btn-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 20rpx;
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
