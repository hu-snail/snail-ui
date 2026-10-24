<script setup lang="ts">
/**
 * Demo: sn-card (uni-end) — custom-title-class / custom-content-class / custom-footer-class / custom-class / custom-style.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-card from its SFC source.
 */
import SnCard from '@snui/uni-src/components/sn-card/sn-card.vue'

const rows = [
  { label: 'Title region', value: 'custom-title-class' },
  { label: 'Content region', value: 'custom-content-class' },
  { label: 'Footer region', value: 'custom-footer-class' },
]
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnCard
      title="Per-region custom classes"
      custom-class="sn-card-demo__root"
      custom-style="margin-bottom: 8rpx"
      custom-title-class="sn-card-demo__title"
      custom-content-class="sn-card-demo__content"
      custom-footer-class="sn-card-demo__footer"
    >
      <view v-for="row in rows" :key="row.value" class="sn-card-demo__row">
        <text class="sn-card-demo__label">{{ row.label }}</text>
        <text class="sn-card-demo__value">{{ row.value }}</text>
      </view>
      <template #footer>
        <text class="sn-card-demo__hint">The footer region matches customFooterClass</text>
      </template>
    </SnCard>
    <text class="sn-demo__meta">
      customClass lands on the root (frame / shadow) and customStyle is appended to the root inline style; the three
      region classes attach to the title / content / footer nodes and are reached through :deep().
    </text>

    <SnCard type="rectangle" custom-class="sn-card-demo__rect" custom-content-class="sn-card-demo__rect-content">
      <template #title>
        <text class="sn-card-demo__rect-title">The title slot overrides the title prop</text>
      </template>
      <text class="sn-card-demo__rect-body">rectangle type with a custom content class</text>
    </SnCard>
    <text class="sn-demo__meta">The rectangle variant honours customClass / customContentClass too.</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 24rpx;
  line-height: var(--sn-mp-font-line-height-normal);
}
.sn-demo :deep(.sn-card-demo__root) {
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-card-radius);
}
.sn-demo :deep(.sn-card-demo__title) {
  color: var(--sn-mp-color-action-primary);
  font-weight: var(--sn-mp-font-weight-semibold);
}
.sn-demo :deep(.sn-card-demo__content) {
  padding-top: var(--sn-mp-spacing-2);
}
.sn-demo :deep(.sn-card-demo__footer) {
  border-top: 2rpx solid var(--sn-mp-color-border-subtle);
  padding-top: var(--sn-mp-spacing-2);
}
.sn-card-demo__row {
  display: flex;
  justify-content: space-between;
  gap: var(--sn-mp-spacing-2);
  padding: var(--sn-mp-spacing-1) 0;
}
.sn-card-demo__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
}
.sn-card-demo__value {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-sm);
}
.sn-card-demo__hint {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
}
.sn-demo :deep(.sn-card-demo__rect) {
  background-color: var(--sn-mp-color-background-subtle);
}
.sn-demo :deep(.sn-card-demo__rect-content) {
  gap: var(--sn-mp-spacing-1);
}
.sn-card-demo__rect-title {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-semibold);
}
.sn-card-demo__rect-body {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
}
</style>
