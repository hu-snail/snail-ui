<script setup lang="ts">
/**
 * Demo: sn-dialog (uni-end) — selector / root-portal / custom-style.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-dialog from its SFC source.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnDialog from '@snui/uni-src/components/sn-dialog/sn-dialog.vue'

const open = ref(false)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="open = true">custom-style 自定义面板样式</SnButton>

    <text class="sn-demo__meta">
      custom-style 写在面板节点上（这里加了额外内边距与最小宽度）；
      selector / root-portal 仅为函数式 API 与 wot-ui 对齐而声明，组件形态下无实际效果。
    </text>

    <SnDialog
      v-model="open"
      type="alert"
      title="自定义面板"
      msg="custom-style 会追加到内层面板节点，与组件自身的布局样式叠加。"
      confirm-button-text="知道了"
      selector="sn-demo-dialog"
      :root-portal="true"
      custom-style="padding: var(--sn-mp-spacing-5); min-width: 480rpx;"
      custom-class="sn-demo-contained"
      @confirm="open = false"
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
/* Docs-preview only: the dialog root is `position: fixed`, which would cover the
 * whole docs page instead of the phone screen. Not needed in a real app. */
.sn-dialog.sn-demo-contained {
  position: absolute;
}
</style>
