<script setup lang="ts">
/**
 * Demo: sn-popover (uni-end) — menu mode with rich rows and per-row colored
 * glyph plates. Per AUI-DOCS-016: imports the real @snui/uni sn-popover.
 *
 * Row glyphs resolve from the documented sources, highest precedence first:
 *   - `iconData` — an inline IconData object, no registration step
 *   - `iconUrl`  — an image address, rendered as `<image>`
 *   - `icon`     — a name resolved through SnIcon (built-in catalog here)
 * The legacy `iconClass` field keeps working (name or image address).
 * The additive `description` field renders a muted second line; `iconBg` /
 * `iconColor` tint the row's glyph plate (colored icons, reference-style).
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnPopover from '@snui/uni-src/components/sn-popover/sn-popover.vue';
import { Star } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const open = ref(false);
const picked = ref('—');

/** Image-typed row glyph as an inline SVG data URL — offline-safe for docs. */
const tagImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23f59e0b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 5v14M5 12h14'/%3E%3C/svg%3E";

const menu = [
  {
    content: 'Star it',
    description: 'Pin it to your saved list',
    iconData: Star,
    iconBg: 'var(--sn-mp-color-feedback-warning-soft)',
    iconColor: 'var(--sn-mp-color-feedback-warning)',
  },
  {
    content: 'Share with friends',
    description: 'Send via messaging app',
    icon: 'share',
    iconBg: 'var(--sn-mp-color-feedback-info-soft)',
    iconColor: 'var(--sn-mp-color-feedback-info)',
  },
  { content: 'Add a tag', iconUrl: tagImage },
  {
    content: 'Save to bookmarks',
    iconClass: 'bookmark',
    iconBg: 'var(--sn-mp-color-feedback-success-soft)',
    iconColor: 'var(--sn-mp-color-feedback-success)',
  },
  {
    content: 'Delete',
    icon: 'trash-2',
    disabled: true,
    iconBg: 'var(--sn-mp-color-feedback-danger-soft)',
    iconColor: 'var(--sn-mp-color-feedback-danger)',
  },
];

function onMenuClick(payload: { item: { content?: string } }): void {
  picked.value = payload.item.content ?? '—';
  open.value = false;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-popover-demo__center">
      <SnPopover
        v-model="open"
        mode="menu"
        :content="menu"
        placement="bottom"
        custom-class="sn-demo-contained"
        @menuclick="onMenuClick"
      >
        <SnButton type="primary">More actions</SnButton>
      </SnPopover>
    </view>

    <view class="sn-popover-demo__space" />

    <text class="sn-demo__meta">Picked: {{ picked }}</text>
    <text class="sn-demo__hint"
      >Rich rows: `content` the title, `description` the muted line; `iconBg` / `iconColor` tint
      the row plate; glyph sources: iconData (inline / no registration) · icon (name) · iconUrl
      (image) · iconClass (legacy, compatible)</text
    >
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
.sn-demo__hint {
  font-size: 22rpx;
  color: var(--sn-mp-color-text-secondary);
}
.sn-popover-demo__center {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.sn-popover-demo__space {
  height: 420rpx;
}
/* Docs-preview only — keep the absolutely-positioned bubble inside the demo. */
.sn-demo :deep(.sn-popover.sn-demo-contained) {
  position: relative;
  display: block;
}
</style>
