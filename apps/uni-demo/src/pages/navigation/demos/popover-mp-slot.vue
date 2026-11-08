<script setup lang="ts">
/**
 * Demo: sn-popover — 旧字段 `iconClass` 兼容、`content` 插槽与 `custom-arrow` / `custom-pop`。
 *
 * - `mode="menu"` 时 `content` 是 `{ content, iconClass, disabled }` 数组；
 *   `iconClass`（wd 兼容字段）既可是名称（走 SnIcon：内置目录 / 注册表），
 *   也可直接是图片地址（以 `http` / `//` / `/` / `./` 开头时按图片渲染）
 * - 新字段 `iconData` / `iconUrl` / `icon` 优先级更高（见 menu 场景）
 * - `content` 插槽完全替换气泡正文（normal / menu 两种模式都可用）
 * - `custom-arrow` / `custom-pop` 给箭头节点与气泡节点追加类名
 * - `offset` 与 `custom-style` 同时作用在根节点（`offset` 走 CSS 变量）
 *
 * 预览专用：`custom-class="sn-demo-contained"` 把气泡定位收在 demo 内。
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnPopover from '@snui/uni-src/components/sn-popover/sn-popover.vue';

const imageMenuOpen = ref(false);
const slotOpen = ref(false);
const picked = ref('—');

/** 旧字段 `iconClass` 仍兼容：名称 → SnIcon 解析；图片地址 → `<image>`。 */
const imageMenu = [
  { content: '设为常用', iconClass: 'star' },
  { content: '编辑', iconClass: 'square-pen' },
  { content: '删除', iconClass: 'trash-2', disabled: true },
];

function onMenuClick(payload: { item: { content?: string } }): void {
  picked.value = payload.item.content ?? '—';
  imageMenuOpen.value = false;
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
      <SnButton block>菜单模式 + custom-arrow / custom-pop</SnButton>
    </SnPopover>

    <SnPopover
      v-model="slotOpen"
      mode="normal"
      placement="top"
      custom-class="sn-demo-contained"
      custom-style="display: block;"
    >
      <SnButton block>normal 模式 + content 插槽</SnButton>
      <template #content>
        <view class="sn-demo__body">
          <text class="sn-demo__title">自定义气泡正文</text>
          <text class="sn-demo__text">content 插槽可放任意结构；custom-style 追加在根节点上。</text>
        </view>
      </template>
    </SnPopover>

    <text class="sn-demo__meta">已选择：{{ picked }}</text>
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
