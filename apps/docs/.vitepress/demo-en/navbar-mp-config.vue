<script setup lang="ts">
/**
 * Demo: sn-navbar — disabled side buttons, safe area, z-index and custom slots.
 *
 * - `left-disabled` / `right-disabled` make that side inert (stopPropagation only,
 *   no `click-left` / `click-right` emit)
 * - `safe-area-inset-top` turns the status-bar height into `padding-top`
 * - `z-index` only applies while `fixed`
 * - `custom-class` / `custom-style` land on the root node
 * - the `capsule` slot takes over the left zone (left slot and left text are not
 *   rendered while it exists)
 */
import { ref } from 'vue'
import SnNavbar from '@snui/uni-src/components/sn-navbar/sn-navbar.vue'
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue'
import { MoreHorizontal } from '@snui/uni-src/components/sn-icon/sn-icon-set'

const lastAction = ref('—')

function report(label: string): void {
  lastAction.value = label
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnNavbar
      title="Both sides disabled"
      left-text="Back"
      right-text="More"
      left-disabled
      right-disabled
      @click-left="report('left (disabled)')"
      @click-right="report('right (disabled)')"
    />

    <SnNavbar title="Safe area + z-index" safe-area-inset-top :z-index="30" bordered />

    <SnNavbar
      title="Custom root"
      custom-class="sn-demo__bar"
      custom-style="background-color: var(--sn-mp-color-background-subtle);"
    >
      <template #title>
        <view class="sn-demo__title">
          <text class="sn-demo__title-text">Title slot</text>
        </view>
      </template>
      <template #capsule>
        <view class="sn-demo__capsule" @tap="report('capsule slot')">
          <SnIcon :icon="MoreHorizontal" :size="32" />
        </view>
      </template>
    </SnNavbar>

    <text class="sn-demo__meta">Last tap: {{ lastAction }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
.sn-demo__title {
  display: flex;
  align-items: center;
  justify-content: center;
}
.sn-demo__title-text {
  font-size: var(--sn-mp-font-size-lg);
  font-weight: var(--sn-mp-font-weight-semibold);
  color: var(--sn-mp-color-action-primary);
}
.sn-demo__capsule {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--sn-mp-spacing-3);
  height: 56rpx;
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-full);
  color: var(--sn-mp-color-text-secondary);
}
</style>
