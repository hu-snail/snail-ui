<script setup lang="ts">
/**
 * Demo: sn-popover (uni-end) — menu mode with the row-icon configuration.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-popover from its SFC source.
 *
 * Row glyphs resolve from the three documented sources, highest precedence
 * first:
 *   - `iconData` — an inline IconData object, no registration step
 *   - `iconUrl`  — an image address, rendered as `<image>`
 *   - `icon`     — a name resolved through SnIcon (built-in catalog here)
 * The legacy `iconClass` field keeps working (name or image address).
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnPopover from '@snui/uni-src/components/sn-popover/sn-popover.vue';
import { Star } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const open = ref(false);
const picked = ref('—');

/** Image-typed row glyph as an inline SVG data URL — offline-safe for docs. */
const tagImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 5v14M5 12h14'/%3E%3C/svg%3E";

const menu = [
  { content: '设为星标', iconData: Star },
  { content: '分享给好友', icon: 'share' },
  { content: '添加标签', iconUrl: tagImage },
  { content: '收藏到书签', iconClass: 'bookmark' },
  { content: '删除', icon: 'trash-2', disabled: true },
];

function onMenuClick(payload: { item: { content?: string } }): void {
  picked.value = payload.item.content ?? '—';
  open.value = false;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnPopover
      v-model="open"
      mode="menu"
      :content="menu"
      placement="bottom-end"
      custom-class="sn-demo-contained"
      @menuclick="onMenuClick"
    >
      <SnButton type="primary" block>更多操作</SnButton>
    </SnPopover>

    <text class="sn-demo__meta">已选择：{{ picked }}</text>
    <text class="sn-demo__hint">
      图标来源：iconData（内联数据 / 免注册）· icon（名称）· iconUrl（图片）·
      iconClass（旧字段，兼容）
    </text>
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
/* Docs-preview only — keep the absolutely-positioned bubble inside the phone. */
.sn-popover.sn-demo-contained {
  position: absolute;
}
</style>
