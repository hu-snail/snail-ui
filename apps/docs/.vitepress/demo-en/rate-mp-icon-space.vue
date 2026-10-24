<script setup lang="ts">
/**
 * Demo: sn-rate — space / icon / activeIcon / iconPrefix / block.
 *
 * `icon` / `active-icon` are registry names (Heart is registered below);
 * `icon-prefix` is informational parity, `space` sets the gap (a number is an
 * rpx design value ×2) and `block` stretches the icons across the row.
 */
import { ref } from 'vue'
import SnRate from '@snui/uni-src/components/sn-rate/sn-rate.vue'
import { registerSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry'
import { Heart } from '@snui/uni-src/components/sn-icon/sn-icon-set'

registerSnIcons({ Heart })

const wide = ref<number | null>(2)
const hearts = ref<number | null>(3)
const block = ref<number | null>(4)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnRate v-model="wide" :space="16" :size="40" />
    <text class="sn-demo__meta">space=16 (rpx ×2 gap) + size=40</text>

    <SnRate
      v-model="hearts"
      icon="Heart"
      active-icon="Heart"
      icon-prefix="demo-icon"
      color="var(--sn-mp-color-text-tertiary)"
      active-color="var(--sn-mp-color-feedback-danger)"
    />
    <text class="sn-demo__meta">icon / activeIcon resolve through the registry (Heart); iconPrefix is parity only</text>

    <SnRate v-model="block" block />
    <text class="sn-demo__meta">block: the icons share the full row width</text>
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
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
