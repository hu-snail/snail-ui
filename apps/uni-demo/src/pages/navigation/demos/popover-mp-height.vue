<script setup lang="ts">
/**
 * Demo: sn-popover (uni-end) — auto height: content is never clipped.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-popover from its SFC source.
 *
 * - the bubble sizes to its content (`height: auto`): long text wraps inside
 *   the bubble max width and the bubble grows downwards
 * - a long menu label wraps the same way (no one-line overflow)
 * - glyph boxes follow `--sn-popover-menu-icon-size`, so a bigger icon grows
 *   the row instead of overflowing it — override per instance via `custom-style`
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnPopover from '@snui/uni-src/components/sn-popover/sn-popover.vue';
import { FileText } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const normalOpen = ref(false);
const menuOpen = ref(false);
const picked = ref('—');

const longMenu = [
  {
    content: '很长的菜单项文案：气泡宽度受限时文案自动换行，气泡随内容自适应高度，不会被裁切',
    iconData: FileText,
  },
  { content: '第二项', icon: 'download' },
];

function onMenuClick(payload: { item: { content?: string } }): void {
  picked.value = payload.item.content ?? '—';
  menuOpen.value = false;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnPopover
      v-model="normalOpen"
      mode="normal"
      content="这段提示很长，用来验证气泡高度随内容自适应：文字在气泡最大宽度内换行，气泡向下增长；内容既不会被裁切，也不会挤出气泡。"
      placement="bottom-start"
      :show-close="true"
      custom-class="sn-demo-contained"
    >
      <SnButton block>长文案 · normal 模式</SnButton>
    </SnPopover>

    <SnPopover
      v-model="menuOpen"
      mode="menu"
      :content="longMenu"
      placement="bottom-start"
      custom-style="--sn-popover-menu-icon-size: 44rpx"
      custom-class="sn-demo-contained"
      @menuclick="onMenuClick"
    >
      <SnButton block>长菜单项 · 放大图标</SnButton>
    </SnPopover>

    <text class="sn-demo__meta">已选择：{{ picked }}</text>
    <text class="sn-demo__hint">
      图标尺寸走 --sn-popover-menu-icon-size（此处 44rpx）：图标变大时行高随内容增长，不溢出。
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
