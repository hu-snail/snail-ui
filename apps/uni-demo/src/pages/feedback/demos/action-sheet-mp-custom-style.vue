<script setup lang="ts">
/**
 * Demo: sn-action-sheet (uni-end) — custom-title-class / custom-style.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-action-sheet from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnActionSheet from '@snui/uni-src/components/sn-action-sheet/sn-action-sheet.vue';

const open = ref(false);

const actions = [{ name: '分享给朋友' }, { name: '保存到相册' }, { name: '删除', disabled: true }];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="open = true">打开自定义面板</SnButton>

    <text class="sn-demo__meta">
      custom-title-class 给标题加类名；custom-style 写在面板上，可叠加内边距等面板级样式。
    </text>

    <SnActionSheet
      v-model="open"
      title="自定义标题"
      :actions="actions"
      cancel-text="取消"
      custom-title-class="sn-demo__title"
      custom-style="padding-bottom: var(--sn-mp-spacing-8);"
      custom-class="sn-demo-contained"
    />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* custom-title-class 落在面板标题节点上，需要穿透组件边界。 */
.sn-demo :deep(.sn-demo__title) {
  color: var(--sn-mp-color-action-primary);
  font-weight: var(--sn-mp-font-weight-semibold);
  letter-spacing: 2rpx;
}
/* Docs preview only — pin the fixed layer to the phone frame. The uni-demo-x
 * generated copy strips this rule in gen-x.mjs (vapor ignores style-level
 * conditional compilation, so the App side must not ship it). */
.sn-action-sheet.sn-demo-contained {
  position: absolute;
}
</style>
