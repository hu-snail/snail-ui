<script setup lang="ts">
/**
 * Demo: sn-popover (uni-end) — auto height: content is never clipped.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-popover from its SFC source.
 *
 * - the bubble sizes to its content (`height: auto`): long text wraps inside
 *   the fixed card width and the bubble grows downwards
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
    content:
      'A very long menu label: when the bubble width is capped the text wraps and the bubble grows with its content — never clipped',
    iconData: FileText,
  },
  { content: 'Second item', icon: 'download' },
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
      content="This hint is long on purpose, to verify that the bubble height follows its content: text wraps inside the card width and the bubble grows downwards — nothing is clipped, nothing spills out."
      placement="bottom-start"
      :show-close="true"
      custom-class="sn-demo-contained"
    >
      <SnButton block>Long copy · normal mode</SnButton>
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
      <SnButton block>Long labels · enlarged icon</SnButton>
    </SnPopover>

    <view class="sn-popover-demo__space" />

    <text class="sn-demo__meta">Picked: {{ picked }}</text>
    <text class="sn-demo__hint">
      The glyph scale rides --sn-popover-menu-icon-size (44rpx here): a bigger icon grows the
      row instead of overflowing it.
    </text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-popover-demo__space {
  height: 220rpx;
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
  position: relative;
}

/* uni-app x 的 view 默认 overflow: hidden——本 demo 的包装类全链放开，
   弹层伸出包装盒时不被裁（App.vue 全局规则只命中页面级元素与 demo 根
   节点，够不到 demo 内部包装类，AGENTS.md §103）。 */
.sn-popover-demo__space {
  overflow: visible;
}
</style>
