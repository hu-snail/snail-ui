<script setup lang="ts">
/**
 * Demo: sn-drop-menu (uni-end) — sort bar with a slide-out option list.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-drop-menu from its SFC source.
 */
import { ref } from 'vue'
import SnDropMenu from '@snui/uni-src/components/sn-drop-menu/sn-drop-menu.vue'

const sort = ref('default')

const options = [
  { label: 'Recommended', value: 'default', tip: 'Default order' },
  { label: 'Price: low to high', value: 'price-asc' },
  { label: 'Price: high to low', value: 'price-desc' },
  { label: 'Best selling', value: 'sales', disabled: true },
]

const picked = ref('Recommended')

function onChange(payload: { selectedItem?: { label?: string } }): void {
  picked.value = payload.selectedItem?.label ?? '—'
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnDropMenu
      v-model="sort"
      :options="options"
      custom-class="sn-demo-contained"
      @change="onChange"
    />

    <text class="sn-drop-menu-demo__meta">Current sort: {{ picked }}</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-drop-menu-demo__meta {
  font-size: 24rpx;
  color: var(--vp-c-text-2);
}
/* Docs-preview only — the panel is absolutely positioned inside the root. */
.sn-drop-menu.sn-demo-contained {
  position: relative;
}
</style>
