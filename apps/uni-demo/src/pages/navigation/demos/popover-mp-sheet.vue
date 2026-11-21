<script setup lang="ts">
/**
 * Demo: sn-popover (uni-end) — sheet presentation: a fixed bottom panel with
 * mask, handle, centred heading, rich option rows and a Cancel pill.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnPopover from '@snui/uni-src/components/sn-popover/sn-popover.vue';
import { Download, FileText, Share2 } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const open = ref(false);
const picked = ref('—');

const shareRows = [
  {
    content: '分享链接',
    description: '通过消息应用发送',
    iconData: Share2,
    iconBg: 'var(--sn-mp-color-feedback-info-soft)',
    iconColor: 'var(--sn-mp-color-feedback-info)',
  },
  {
    content: '复制链接',
    description: '复制到剪贴板',
    iconData: FileText,
    iconBg: 'var(--sn-mp-color-feedback-warning-soft)',
    iconColor: 'var(--sn-mp-color-feedback-warning)',
  },
  {
    content: '离线保存',
    description: '下载以备后用',
    iconData: Download,
    iconBg: 'var(--sn-mp-color-feedback-success-soft)',
    iconColor: 'var(--sn-mp-color-feedback-success)',
  },
];

function onPick(payload: { item: { content?: string } }): void {
  picked.value = payload.item.content ?? '—';
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-popover-demo__center">
      <SnPopover
        v-model="open"
        presentation="sheet"
        mode="menu"
        title="分享选项"
        subtitle="选择分享方式"
        :content="shareRows"
        cancel-text="取消"
        custom-class="sn-demo-sheet"
        @menuclick="onPick"
      >
        <SnButton type="primary">更多选项</SnButton>
      </SnPopover>
    </view>

    <text class="sn-demo__meta">已选择：{{ picked }}</text>
    <text class="sn-demo__hint"
      >presentation="sheet"：底部面板（遮罩 + 把手 + 居中标题 + 富选项行 +
      取消按钮），忽略 placement / 箭头；点遮罩或取消关闭。</text
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

/* uni-app x 的 view 默认 overflow: hidden——本 demo 的包装类全链放开，
   锚定弹层（tooltip / popover / drop-menu）伸出包装盒时不被裁
   （App.vue 全局规则只命中页面级元素与 demo 根节点，AGENTS.md §103）。 */
.sn-popover-demo__center {
  overflow: visible;
}
</style>
