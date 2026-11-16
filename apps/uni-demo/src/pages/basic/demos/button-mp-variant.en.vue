<script setup lang="ts">
/**
 * Demo: sn-button — variant matrix × semantic types (base is the default
 * filled look shown in Basic usage, so no dedicated group here).
 *
 * `variant`: 'plain' | 'dashed' | 'soft' | 'subtle' | 'text'.
 * plain / dashed keep a transparent fill with a semantic stroke (dashed adds
 * the dashed pattern), soft adds a tinted background, text keeps only the
 * semantic text color, subtle pairs a gray plate with the semantic text hue.
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

type ButtonVariant = 'plain' | 'dashed' | 'soft' | 'subtle' | 'text';
type SemanticType = 'primary' | 'success' | 'info' | 'warning' | 'danger';

/** Variant group labels (API enum value in parens). */
const variants: Array<{ key: ButtonVariant; label: string }> = [
  { key: 'plain', label: 'Plain' },
  { key: 'dashed', label: 'Dashed' },
  { key: 'soft', label: 'Soft' },
  { key: 'subtle', label: 'Subtle' },
  { key: 'text', label: 'Text' },
];

/** Semantic types shown in every group. */
const types: Array<{ key: SemanticType; label: string }> = [
  { key: 'primary', label: 'Primary button' },
  { key: 'success', label: 'Success button' },
  { key: 'info', label: 'Info button' },
  { key: 'warning', label: 'Warning button' },
  { key: 'danger', label: 'Danger button' },
];
</script>

<template>
  <view class="sn-button-demo sn-button-demo--stack">
    <view v-for="variant in variants" :key="variant.key" class="sn-button-demo__group">
      <text class="sn-button-demo__label">{{ variant.label }} ({{ variant.key }})</text>
      <view class="sn-button-demo__row">
        <SnButton
          v-for="item in types"
          :key="item.key"
          :type="item.key"
          :variant="variant.key === 'base' ? undefined : variant.key"
        >
          {{ variant.key === 'text' ? 'Button' : item.label }}
        </SnButton>
      </view>
    </view>
  </view>
</template>

<style scoped>
.sn-button-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  width: 100%;
}
.sn-button-demo__group {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.sn-button-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  align-items: center;
}
.sn-button-demo__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
