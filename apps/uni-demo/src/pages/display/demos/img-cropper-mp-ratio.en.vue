<script setup lang="ts">
/**
 * Demo: sn-img-cropper (uni-end) — aspect-ratio switching and disabled rotation.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-img-cropper from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnImgCropper from '@snui/uni-src/components/sn-img-cropper/sn-img-cropper.vue';

const visible = ref(false);
const ratio = ref<'1:1' | '16:9' | '9:16'>('16:9');
const lastRatio = ref('—');

const imgSrc = 'https://picsum.photos/seed/snui-crop-wide/1400/900';

function open(next: '1:1' | '16:9' | '9:16') {
  ratio.value = next;
  visible.value = true;
}

function onConfirm() {
  lastRatio.value = ratio.value;
}
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__row">
      <SnButton size="small" @tap="open('1:1')">1:1</SnButton>
      <SnButton size="small" @tap="open('16:9')">16:9</SnButton>
      <SnButton size="small" @tap="open('9:16')">9:16</SnButton>
    </view>
    <text class="sn-demo__meta">Last confirmed ratio: {{ lastRatio }}</text>

    <SnImgCropper
      v-model="visible"
      :img-src="imgSrc"
      :aspect-ratio="ratio"
      disabled-rotate
      cancel-button-text="Discard"
      confirm-button-text="Save"
      custom-class="sn-demo-contained"
      @confirm="onConfirm"
    />
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  width: 100%;
  align-items: flex-start;
}
.sn-demo__row {
  display: flex;
  gap: 12rpx;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 24rpx;
}
/* Docs-preview only: the cropper root is `position: fixed`, which would cover the
 * whole docs page instead of the phone screen. Not needed in a real app. */
.sn-img-cropper.sn-demo-contained {
  position: absolute;
}
</style>
