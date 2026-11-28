<script setup lang="ts">
/**
 * Demo: sn-popover (uni-end). Per AUI-DOCS-016: imports the real @snui/uni
 * sn-popover.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnPopover from '@snui/uni-src/components/sn-popover/sn-popover.vue';

const open = ref(false);
const picked = ref('—');
const menu = [
  { content: '分享给好友', iconClass: 'share' },
  { content: '收藏到书签', iconClass: 'bookmark' },
  { content: '删除', iconClass: 'trash-2' },
];

function onMenuClick(payload: { item: { content: string }; index: number }): void {
  picked.value = `${payload.item.content}（第 ${payload.index + 1} 项）`;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-popover-demo__center">
      <SnPopover
        v-model="open"
        mode="menu"
        :content="menu"
        custom-class="sn-demo-contained"
        @menuclick="onMenuClick"
      >
        <SnButton type="primary">更多操作</SnButton>
      </SnPopover>
    </view>

    <view class="sn-popover-demo__space" />

    <text class="sn-demo__meta">已选择：{{ picked }}</text>
    <text class="sn-demo__hint">menu 模式把 content 渲染为操作列表；iconClass 指定行图标名称；点击某一行会触发 menuclick 并收起。</text>
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
  height: 220rpx;
}
/* Docs-preview only — the bubble stays anchored to the component root; the
 * spacer leaves room for the bubble instead of covering the copy below. */
.sn-demo :deep(.sn-popover.sn-demo-contained) {
  position: relative;
  display: block;
}

/* uni-app x 的 view 默认 overflow: hidden——本 demo 的包装类全链放开，
   弹层伸出包装盒时不被裁（App.vue 全局规则只命中页面级元素与 demo 根
   节点，够不到 demo 内部包装类，AGENTS.md §103）。 */
.sn-popover-demo__center {
  overflow: visible;
}
.sn-popover-demo__space {
  overflow: visible;
}
</style>
