<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — loading states in one module.
 *
 * Covers: semantic-color loading, click-to-trigger, the `loading-props`
 * object form (wot-ui `wd-button` compat: color / size, flat
 * `loading-color` / `loading-size` win), and direct `loading-color` /
 * `loading-size` customization.
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
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">Loading (loading × semantic hues)</text>
    <view class="sn-demo__row">
      <SnButton loading type="primary">Saving</SnButton>
      <SnButton loading type="success">Submitting</SnButton>
      <SnButton loading type="danger">Deleting</SnButton>
      <SnButton :loading="loading" type="primary" @click="trigger">Click to trigger loading</SnButton>
    </view>

    <text class="sn-demo__meta">loading-props with color only: the spinner takes the brand color</text>
    <view class="sn-demo__row">
      <SnButton type="primary" loading :loading-props="{ color: 'var(--sn-mp-color-feedback-success)' }">
        Brand spinner
      </SnButton>
      <SnButton type="primary" loading>Default spinner</SnButton>
    </view>

    <text class="sn-demo__meta">loading-props with color + size (size in rpx)</text>
    <view class="sn-demo__row">
      <SnButton type="success" loading :loading-props="spinnerFromProps">Large spinner</SnButton>
      <SnButton type="success" loading>Default-size spinner</SnButton>
    </view>

    <text class="sn-demo__meta">Flat props win: loading-color / loading-size override loading-props</text>
    <view class="sn-demo__row">
      <SnButton
        type="warning"
        loading
        loading-color="var(--sn-mp-color-feedback-danger)"
        :loading-props="{ color: 'var(--sn-mp-color-action-primary)', size: 64 }"
      >
        Flat props win
      </SnButton>
    </view>

    <text class="sn-demo__meta">Direct loading-color / loading-size customization</text>
    <view class="sn-demo__row">
      <SnButton loading loading-color="var(--sn-mp-color-feedback-success)" type="primary">
        Custom color
      </SnButton>
      <SnButton loading loading-size="48" type="success">Custom size</SnButton>
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
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
