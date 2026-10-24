<script setup lang="ts">
/**
 * Demo: sn-action-sheet (uni-end) — icon grid panels (one and two rows).
 * Per AUI-DOCS-016: imports the real @snui/uni sn-action-sheet from its SFC source.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnActionSheet from '@snui/uni-src/components/sn-action-sheet/sn-action-sheet.vue'
import { registerSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry'
import { Download, Edit, Heart, Star, Trash, Upload } from '@snui/uni-src/components/sn-icon/sn-icon-set'

registerSnIcons({ Download, Edit, Heart, Star, Trash, Upload })

const oneRow = ref(false)
const twoRows = ref(false)
const picked = ref('—')

const flatPanels = [
  { title: 'Star', name: 'star', icon: 'Star' },
  { title: 'Like', name: 'heart', icon: 'Heart' },
  { title: 'Edit', name: 'edit', icon: 'Edit' },
]

const nestedPanels = [
  [
    { title: 'Star', name: 'star', icon: 'Star' },
    { title: 'Like', name: 'heart', icon: 'Heart' },
    { title: 'Edit', name: 'edit', icon: 'Edit' },
  ],
  [
    { title: 'Upload', name: 'upload', icon: 'Upload' },
    { title: 'Download', name: 'download', icon: 'Download' },
    { title: 'Delete', name: 'trash', icon: 'Trash' },
  ],
]
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="oneRow = true">Single-row grid</SnButton>
    <SnButton block @tap="twoRows = true">Multi-row grid</SnButton>
    <text class="sn-action-sheet-demo__meta">Picked: {{ picked }}</text>

    <SnActionSheet
      v-model="oneRow"
      title="Single-row grid"
      :panels="flatPanels"
      cancel-text="Cancel"
      custom-class="sn-demo-contained"
      @select="picked = $event.item.name ?? ''"
    />

    <SnActionSheet
      v-model="twoRows"
      title="Multi-row grid"
      :panels="nestedPanels"
      cancel-text="Cancel"
      custom-class="sn-demo-contained"
      @select="picked = `${$event.item.name ?? ''} (${$event.rowIndex}, ${$event.colIndex})`"
    />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-action-sheet-demo__meta {
  font-size: 24rpx;
  color: var(--vp-c-text-2);
}
/* Docs-preview only — pin the fixed layer to the phone screen. */
.sn-action-sheet.sn-demo-contained {
  position: absolute;
}
</style>
