<script setup lang="ts">
/**
 * Demo: sn-skeleton (uni-end) — the three shapes of `customClass`.
 *
 * `customClass` is typed `string | string[] | Record<string, boolean>` and handed
 * straight to Vue's `:class` normalisation, so all three spellings work:
 *
 *   - string        → append one class
 *   - string array  → append several classes
 *   - boolean map   → toggle classes by condition
 *
 * All three act on the root node; the object form fits "switch by state" cases
 * (see the toggles below).
 */
import { ref } from 'vue'
import SnSkeleton from '@snui/uni-src/components/sn-skeleton/sn-skeleton.vue'

/** Boolean-map form: only keys that are true get applied. */
const dense = ref(false)
const outlined = ref(true)

/** String-array form. */
const arrayClass = ['sn-skeleton-demo__block', 'sn-skeleton-demo__wide']
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">String: custom-class="sn-skeleton-demo__block"</text>
    <SnSkeleton theme="text" custom-class="sn-skeleton-demo__block" />

    <text class="sn-demo__meta">
      String array: custom-class="['sn-skeleton-demo__block', 'sn-skeleton-demo__wide']"
    </text>
    <SnSkeleton theme="paragraph" :custom-class="arrayClass" />

    <text class="sn-demo__meta">
      Boolean map: { dense, outlined } — flip the toggles below and the classes come and go
    </text>
    <view class="sn-demo__row">
      <view class="sn-demo__switch" @tap="dense = !dense">
        <text class="sn-demo__switch-label">dense = {{ dense }}</text>
      </view>
      <view class="sn-demo__switch" @tap="outlined = !outlined">
        <text class="sn-demo__switch-label">outlined = {{ outlined }}</text>
      </view>
    </view>
    <SnSkeleton
      theme="avatar"
      :custom-class="{ 'sn-skeleton-demo__dense': dense, 'sn-skeleton-demo__outlined': outlined }"
    />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
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
.sn-demo__switch {
  display: inline-flex;
  align-items: center;
  padding: var(--sn-mp-spacing-1) var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-action-primary);
}
.sn-demo__switch-label {
  color: var(--sn-mp-color-text-on-primary);
  font-size: var(--sn-mp-font-size-xs);
}
/* All three customClass shapes end up on the sn-skeleton root node. */
.sn-demo :deep(.sn-skeleton-demo__block) {
  padding: var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-surface);
}
.sn-demo :deep(.sn-skeleton-demo__wide) {
  gap: var(--sn-mp-spacing-4);
}
.sn-demo :deep(.sn-skeleton-demo__dense) {
  gap: var(--sn-mp-spacing-1);
}
.sn-demo :deep(.sn-skeleton-demo__outlined) {
  border: 2rpx dashed var(--sn-mp-color-border-default);
}
</style>
