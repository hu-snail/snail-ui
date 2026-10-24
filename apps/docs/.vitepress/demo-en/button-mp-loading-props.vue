<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — the `loading-props` object plus `hairline`.
 *
 * `loading-props` is the wot-ui `wd-button` shape (`{ color, size, text }`). This
 * component reads `color` / `size` and ignores the rest, so a config written
 * for wd-button passes through unchanged.
 *
 * Precedence: the flat `loading-color` / `loading-size` props win; the
 * `loading-props` fields are the fallback.
 *
 * `hairline` only applies to `type="default"` (the semantic types already carry
 * a coloured border). It defaults to true; false makes the border transparent.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'

const busy = ref(false)

function toggleBusy(): void {
  busy.value = !busy.value
}

const spinnerFromProps = { color: 'var(--sn-mp-color-action-primary)', size: 48 }
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">loading-props with color only: the spinner turns brand-coloured</text>
    <view class="sn-demo__row">
      <SnButton type="primary" loading :loading-props="{ color: 'var(--sn-mp-color-feedback-success)' }">
        Brand-coloured spinner
      </SnButton>
      <SnButton type="primary" loading>Default spinner</SnButton>
    </view>

    <text class="sn-demo__meta">loading-props with color + size (size is rpx)</text>
    <view class="sn-demo__row">
      <SnButton type="success" loading :loading-props="spinnerFromProps">48rpx spinner</SnButton>
      <SnButton type="success" loading>32rpx spinner</SnButton>
    </view>

    <text class="sn-demo__meta">
      The flat props win: loading-color / loading-size override the same keys in loading-props
    </text>
    <view class="sn-demo__row">
      <SnButton
        type="warning"
        loading
        loading-color="var(--sn-mp-color-feedback-danger)"
        :loading-props="{ color: 'var(--sn-mp-color-action-primary)', size: 64 }"
      >
        loading-color wins
      </SnButton>
    </view>

    <text class="sn-demo__meta">hairline: on a default button true draws a thin border, false drops it</text>
    <view class="sn-demo__row">
      <SnButton>hairline (default)</SnButton>
      <SnButton :hairline="false">hairline=false</SnButton>
      <SnButton hairline :disabled="true">hairline + disabled</SnButton>
    </view>

    <text class="sn-demo__meta">loading plus hairline: the loading state of a bordered button</text>
    <view class="sn-demo__row">
      <SnButton loading :loading-props="{ size: 40 }">Loading (hairline)</SnButton>
      <SnButton :hairline="false" loading>Loading (no border)</SnButton>
      <SnButton type="primary" :loading="busy" @tap="toggleBusy">
        {{ busy ? 'Requesting…' : 'Tap to toggle loading' }}
      </SnButton>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: stretch;
  width: 100%;
}
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  align-items: center;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
