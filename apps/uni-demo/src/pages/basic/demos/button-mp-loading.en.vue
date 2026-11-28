<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — loading states in one module.
 * Spacing note: uni-app x has no flex `gap` support — inline `custom-style`
 * margins + explicit `flex-direction: row`.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

const loading = ref(false);
function trigger(): void {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
}

/** loading-props with both color + size (size in rpx). */
const spinnerFromProps = { color: 'var(--sn-mp-color-action-primary)', size: 48 };

/** In-row spacing fallback (uni-app x lacks gap). */
const rowGap = { margin: '0 16rpx 16rpx 0' };
</script>

<template>
  <view class="sn-mp-btn-stack">
    <text class="sn-mp-btn-label">Loading (loading × semantic hues)</text>
    <view class="sn-mp-btn-row">
      <SnButton :custom-style="rowGap" loading type="primary">Saving</SnButton>
      <SnButton :custom-style="rowGap" loading type="success">Submitting</SnButton>
      <SnButton :custom-style="rowGap" loading type="danger">Deleting</SnButton>
      <SnButton :custom-style="rowGap" :loading="loading" type="primary" @click="trigger">
        Click to trigger loading
      </SnButton>
    </view>

    <text class="sn-mp-btn-meta">loading-props with color only: the spinner takes the brand color</text>
    <view class="sn-mp-btn-row">
      <SnButton
        :custom-style="rowGap"
        type="primary"
        loading
        :loading-props="{ color: 'var(--sn-mp-color-feedback-success)' }"
      >
        Brand spinner
      </SnButton>
      <SnButton :custom-style="rowGap" type="primary" loading>Default spinner</SnButton>
    </view>

    <text class="sn-mp-btn-meta">loading-props with color + size (size in rpx)</text>
    <view class="sn-mp-btn-row">
      <SnButton :custom-style="rowGap" type="success" loading :loading-props="spinnerFromProps">
        Large spinner
      </SnButton>
      <SnButton :custom-style="rowGap" type="success" loading>Default-size spinner</SnButton>
    </view>

    <text class="sn-mp-btn-meta">Flat props win: loading-color / loading-size override loading-props</text>
    <view class="sn-mp-btn-row">
      <SnButton
        :custom-style="rowGap"
        type="warning"
        loading
        loading-color="var(--sn-mp-color-feedback-danger)"
        :loading-props="{ color: 'var(--sn-mp-color-action-primary)', size: 64 }"
      >
        Flat props win
      </SnButton>
    </view>

    <text class="sn-mp-btn-meta">Direct loading-color / loading-size customization</text>
    <view class="sn-mp-btn-row">
      <SnButton
        :custom-style="rowGap"
        loading
        loading-color="var(--sn-mp-color-feedback-success)"
        type="primary"
      >
        Custom color
      </SnButton>
      <SnButton :custom-style="rowGap" loading loading-size="48" type="success">Custom size</SnButton>
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
.sn-mp-btn-meta {
  margin-bottom: 12rpx;
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
