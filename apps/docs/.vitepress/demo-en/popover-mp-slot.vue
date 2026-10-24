<script setup lang="ts">
/**
 * Demo: sn-popover — image icons in menu mode, the `content` slot and
 * `custom-arrow` / `custom-pop`.
 *
 * - with `mode="menu"` the `content` prop is an array of
 *   `{ content, iconClass, disabled }`; `iconClass` is either an `sn-icon` registry
 *   name or an image source (values starting with `http` / `//` / `/` / `./` render
 *   as `<image>`)
 * - the `content` slot replaces the bubble body entirely (works in both modes)
 * - `custom-arrow` / `custom-pop` append a class to the arrow node / bubble node
 * - `offset` and `custom-style` both act on the root (`offset` goes through CSS vars)
 *
 * Docs-preview only: `custom-class="sn-demo-contained"` keeps the bubble's
 * positioning context inside the demo.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnPopover from '@snui/uni-src/components/sn-popover/sn-popover.vue'
import { registerSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry'
import { Edit, Star, Trash } from '@snui/uni-src/components/sn-icon/sn-icon-set'

registerSnIcons({ Edit, Star, Trash })

const imageMenuOpen = ref(false)
const slotOpen = ref(false)
const picked = ref('—')

const imageMenu = [
  { content: 'Pin to top', iconClass: 'Star' },
  { content: 'Edit', iconClass: 'Edit' },
  { content: 'Delete', iconClass: 'Trash', disabled: true },
]

function onMenuClick(payload: { item: { content?: string } }): void {
  picked.value = payload.item.content ?? '—'
  imageMenuOpen.value = false
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnPopover
      v-model="imageMenuOpen"
      mode="menu"
      :content="imageMenu"
      placement="bottom-start"
      :offset="{ x: 0, y: 4 }"
      custom-arrow="sn-demo__arrow"
      custom-pop="sn-demo__pop"
      custom-class="sn-demo-contained"
      @menuclick="onMenuClick"
    >
      <SnButton block>Menu mode + custom-arrow / custom-pop</SnButton>
    </SnPopover>

    <SnPopover
      v-model="slotOpen"
      mode="normal"
      placement="top"
      custom-class="sn-demo-contained"
      custom-style="display: block;"
    >
      <SnButton block>normal mode + content slot</SnButton>
      <template #content>
        <view class="sn-demo__body">
          <text class="sn-demo__title">Custom bubble body</text>
          <text class="sn-demo__text">The content slot accepts any structure; custom-style is appended on the root node.</text>
        </view>
      </template>
    </SnPopover>

    <text class="sn-demo__meta">Picked: {{ picked }}</text>
  </view>
</template>

<style scoped>
.sn-demo__body {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-1);
}
.sn-demo__title {
  font-size: 26rpx;
  font-weight: var(--sn-mp-font-weight-semibold);
}
.sn-demo__text {
  font-size: 22rpx;
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
/* Docs-preview only — keep the absolutely-positioned bubble inside the demo. */
.sn-demo :deep(.sn-popover.sn-demo-contained) {
  position: relative;
  display: block;
}
/* custom-pop / custom-arrow land on the bubble and arrow nodes. */
.sn-demo :deep(.sn-demo__pop) {
  border-color: var(--sn-mp-color-action-primary);
}
.sn-demo :deep(.sn-demo__arrow) {
  border-color: var(--sn-mp-color-action-primary);
}
</style>
