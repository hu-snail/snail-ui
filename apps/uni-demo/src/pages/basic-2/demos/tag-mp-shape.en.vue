<script setup lang="ts">
/**
 * Demo: sn-tag (uni-end) — special shapes: one cell per `shape` value.
 *
 * square plain (baseline) / round pill / skew parallelogram (inner parts are
 * counter-skewed so glyphs stay level) / ribbon right flag / fold top-right
 * corner (darker flap) / ticket side notches. The `round` prop equals
 * `shape="round"`; when both are given, `shape` wins.
 */
import SnTag from '@snui/uni-src/components/sn-tag/sn-tag.vue';

/** Six shapes with labels that fit each form. */
const shapes = [
  { shape: 'square', type: 'default', label: 'Pinned', name: 'square' },
  { shape: 'round', type: 'primary', label: 'NEW', name: 'round' },
  { shape: 'skew', type: 'danger', label: 'Sale', name: 'skew' },
  { shape: 'ribbon', type: 'volcano', label: 'Hot', name: 'ribbon' },
  { shape: 'fold', type: 'cyan', label: 'Limited', name: 'fold' },
  { shape: 'ticket', type: 'warning', label: 'Coupon', name: 'ticket' },
] as const;
</script>

<template>
  <view class="sn-demo">
    <view v-for="item in shapes" :key="item.shape" class="shape-cell">
      <SnTag :type="item.type" :shape="item.shape">{{ item.label }}</SnTag>
      <text class="shape-cell__name">{{ item.name }}</text>
    </view>
  </view>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sn-mp-spacing-6) var(--sn-mp-spacing-5);
}

.shape-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sn-mp-spacing-2);
  width: 200rpx;
}

.shape-cell__name {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
