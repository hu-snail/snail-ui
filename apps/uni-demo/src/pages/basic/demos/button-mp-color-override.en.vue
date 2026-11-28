<script setup lang="ts">
/**
 * Demo: sn-button — `bgColor` / `color` inline colour overrides.
 * Spacing note: uni-app x has no flex `gap` support — inline `custom-style`
 * margins + explicit `flex-direction: row`.
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

/** In-row spacing fallback (uni-app x lacks gap). */
const rowGap = { margin: '0 16rpx 16rpx 0' };
</script>

<template>
  <view class="sn-mp-btn-stack">
    <text class="sn-mp-btn-meta">bgColor + color: inline override of the semantic colors</text>
    <view class="sn-mp-btn-row">
      <SnButton
        :custom-style="rowGap"
        bg-color="var(--sn-mp-color-action-primary)"
        color="var(--sn-mp-color-text-on-primary)"
      >
        Custom bg + text color
      </SnButton>
      <SnButton :custom-style="rowGap" color="var(--sn-mp-color-action-info)" variant="plain">
        Custom text color (outlined)
      </SnButton>
    </view>

    <text class="sn-mp-btn-meta">customClass appends a class / customStyle is an inline override</text>
    <view class="sn-mp-btn-row">
      <SnButton :custom-style="rowGap" custom-class="my-mp-cta" type="primary">Custom class</SnButton>
      <SnButton
        :custom-style="{ ...rowGap, 'border-radius': '999rpx', padding: '0 40rpx' }"
        type="warning"
      >
        Custom style
      </SnButton>
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
.sn-mp-btn-meta {
  margin-bottom: 12rpx;
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
:deep(.my-mp-cta) {
  letter-spacing: 4rpx;
}
</style>
