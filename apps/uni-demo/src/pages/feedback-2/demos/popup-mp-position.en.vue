<script setup lang="ts">
/**
 * Demo: sn-popup (uni-end) — the five anchors.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-popup from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnPopup from '@snui/uni-src/components/sn-popup/sn-popup.vue';

type Anchor = 'center' | 'top' | 'right' | 'bottom' | 'left';

const open = ref(false);
const anchor = ref<Anchor>('bottom');

const anchors: Anchor[] = ['center', 'top', 'right', 'bottom', 'left'];

function show(position: Anchor): void {
  anchor.value = position;
  open.value = true;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-popup-demo__row">
      <SnButton v-for="item in anchors" :key="item" size="small" @click="show(item)">{{
        item
      }}</SnButton>
    </view>

    <SnPopup v-model="open" :position="anchor" round custom-class="sn-demo-contained">
      <view class="sn-popup-demo__body">
        <text class="sn-popup-demo__title">position = {{ anchor }}</text>
        <text class="sn-popup-demo__text"
          >The default animation follows the anchor: bottom → slide-up, left → slide-right.</text
        >
      </view>
    </SnPopup>
  </view>
</template>

<style scoped>
.sn-popup-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
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
/* Docs preview only — pin the fixed layer to the phone frame. The uni-demo-x
 * generated copy strips this rule in gen-x.mjs (vapor ignores style-level
 * conditional compilation, so the App side must not ship it). */
.sn-popup.sn-demo-contained {
  position: absolute;
}
</style>
