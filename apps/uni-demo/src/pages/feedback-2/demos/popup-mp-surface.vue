<script setup lang="ts">
/**
 * Demo: sn-popup (uni-end) — modal-style / custom-style / safe-area-inset-bottom /
 * lazy-render / root-portal.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-popup from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnPopup from '@snui/uni-src/components/sn-popup/sn-popup.vue';

const scrimStyle = ref(false);
const panelStyle = ref(false);
const eager = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="scrimStyle = true">modal-style（遮罩内联样式）</SnButton>
    <SnButton block @tap="panelStyle = true"> custom-style + safe-area-inset-bottom </SnButton>
    <SnButton block @tap="eager = true">lazy-render=false（提前渲染）</SnButton>

    <text class="sn-demo__meta">
      root-portal 仅为 wot-ui 对齐而声明：小程序没有 portal 宿主，传 true 不改变层级。
    </text>

    <SnPopup
      v-model="scrimStyle"
      position="center"
      round
      modal-style="background-color: var(--sn-mp-color-background-subtle); opacity: 0.8;"
      custom-class="sn-demo-contained"
    >
      <view class="sn-demo__body">
        <text class="sn-demo__title">modalStyle</text>
        <text class="sn-demo__text">内联样式写在遮罩节点上，可叠加透明度或额外内边距。</text>
        <SnButton type="primary" block @tap="scrimStyle = false">关闭</SnButton>
      </view>
    </SnPopup>

    <SnPopup
      v-model="panelStyle"
      position="bottom"
      round
      safe-area-inset-bottom
      :root-portal="true"
      custom-style="padding-bottom: var(--sn-mp-spacing-8);"
      custom-class="sn-demo-contained"
    >
      <view class="sn-demo__body">
        <text class="sn-demo__title">customStyle + safeAreaInsetBottom</text>
        <text class="sn-demo__text">custom-style 落在面板上；安全区留白叠加在面板底部。</text>
        <SnButton type="primary" block @tap="panelStyle = false">关闭</SnButton>
      </view>
    </SnPopup>

    <SnPopup
      v-model="eager"
      position="center"
      round
      :lazy-render="false"
      custom-class="sn-demo-contained"
    >
      <view class="sn-demo__body">
        <text class="sn-demo__title">lazyRender = false</text>
        <text class="sn-demo__text">
          lazy-render 默认 true，首次打开前不渲染面板内容；置 false 后组件挂载即渲染。
        </text>
        <SnButton type="primary" block @tap="eager = false">关闭</SnButton>
      </view>
    </SnPopup>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__body {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__title {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-lg);
  font-weight: var(--sn-mp-font-weight-semibold);
}
.sn-demo__text,
.sn-demo__meta {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* Docs-preview only: keep the fixed-position popup inside the phone screen. */
.sn-popup.sn-demo-contained {
  position: absolute;
}
</style>
