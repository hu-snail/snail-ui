<script setup lang="ts">
/**
 * Demo: sn-popup (uni-end) — modal / closeOnClickModal / transition + duration.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-popup from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnPopup from '@snui/uni-src/components/sn-popup/sn-popup.vue';

const noModal = ref(false);
const noCloseOnTap = ref(false);
const customAnim = ref(false);
const events = ref<string[]>([]);

function record(name: string): void {
  events.value = [...events.value.slice(-3), name];
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton block @click="noModal = true">modal=false（无遮罩）</SnButton>
    <SnButton block @click="noCloseOnTap = true">closeOnClickModal=false（点遮罩不关）</SnButton>
    <SnButton block @click="customAnim = true">transition='zoom-in' + duration 600</SnButton>

    <view v-if="events.length" class="sn-popup-demo__log">
      <text>事件：{{ events.join(' → ') }}</text>
    </view>

    <SnPopup
      v-model="noModal"
      position="center"
      :modal="false"
      round
      custom-class="sn-demo-contained"
      @before-enter="record('before-enter')"
      @after-leave="record('after-leave')"
    >
      <view class="sn-popup-demo__body">
        <text class="sn-popup-demo__title">modal = false</text>
        <text class="sn-popup-demo__text"
          >遮罩不渲染，点击面板外区域不会关闭，用下方按钮关闭。</text
        >
        <SnButton type="primary" block @click="noModal = false">关闭</SnButton>
      </view>
    </SnPopup>

    <SnPopup
      v-model="noCloseOnTap"
      position="bottom"
      :close-on-click-modal="false"
      round
      closable
      custom-class="sn-demo-contained"
      @click-modal="record('click-modal')"
    >
      <view class="sn-popup-demo__body">
        <text class="sn-popup-demo__title">closeOnClickModal = false</text>
        <text class="sn-popup-demo__text"
          >点击遮罩仍会触发 click-modal，但不会关闭；请用右上角关闭按钮。</text
        >
      </view>
    </SnPopup>

    <SnPopup
      v-model="customAnim"
      position="center"
      transition="zoom-in"
      :duration="600"
      round
      custom-class="sn-demo-contained"
    >
      <view class="sn-popup-demo__body">
        <text class="sn-popup-demo__title">transition + duration</text>
        <text class="sn-popup-demo__text">zoom-in 缩放进入，600ms 动画时长。</text>
        <SnButton type="primary" block @click="customAnim = false">关闭</SnButton>
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
.sn-popup-demo__log {
  padding: 16rpx;
  border-radius: 12rpx;
  background: var(--vp-c-bg-soft);
  font-size: 24rpx;
  color: var(--vp-c-text-2);
}
/* Docs-preview only: keep the fixed-position popup inside the phone screen. */
.sn-popup.sn-demo-contained {
  position: absolute;
}
</style>
