<script setup lang="ts">
/**
 * Demo: sn-popup (uni-end) — basic bottom sheet.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-popup from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnPopup from '@snui/uni-src/components/sn-popup/sn-popup.vue';

const bottomOpen = ref(false);
const centerOpen = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @click="bottomOpen = true">底部弹出（bottom）</SnButton>
    <SnButton block @click="centerOpen = true">居中弹出（center）</SnButton>

    <SnPopup v-model="bottomOpen" position="bottom" round custom-class="sn-demo-contained">
      <view class="sn-popup-demo__body">
        <text class="sn-popup-demo__title">底部弹层</text>
        <text class="sn-popup-demo__text">点击遮罩或关闭按钮收起。</text>
        <SnButton type="primary" block @click="bottomOpen = false">知道了</SnButton>
      </view>
    </SnPopup>

    <SnPopup v-model="centerOpen" position="center" round closable custom-class="sn-demo-contained">
      <view class="sn-popup-demo__body">
        <text class="sn-popup-demo__title">居中弹层</text>
        <text class="sn-popup-demo__text">closable 开启右上角关闭按钮。</text>
      </view>
    </SnPopup>
  </view>
</template>

<style scoped>
.sn-popup-demo__body {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-popup-demo__title {
  font-size: 32rpx;
  font-weight: 600;
}
.sn-popup-demo__text {
  font-size: 28rpx;
  color: var(--vp-c-text-2);
}
/*
 * Docs-preview only: the popup root is `position: fixed` (correct for the real
 * uni-app runtime), which would cover the whole docs page instead of the phone
 * screen. `custom-class` lands on the component root, so the preview pins it to
 * the phone screen's containing block. Not needed in a real app.
 */
.sn-popup.sn-demo-contained {
  position: absolute;
}
</style>
