<script setup lang="ts">
/** Demo: sn-image-preview (uni-end) — 微信级手势：捏合缩放 / 双击 / 下滑关闭。 */
import { ref } from 'vue';
import SnImagePreview from '@snui/uni-src/components/sn-image-preview/sn-image-preview.vue';

const images = [
  'https://picsum.photos/id/1015/800/1200',
  'https://picsum.photos/id/1035/800/1000',
  'https://picsum.photos/id/1043/1200/800',
];

const preview = ref();

function open(index: number): void {
  preview.value?.open({ images, startPosition: index });
}
</script>

<template>
  <view class="sn-demo">
    <view class="sn-demo__thumbs">
      <image
        v-for="(src, index) in images"
        :key="src"
        class="sn-demo__thumb"
        :src="src"
        mode="aspectFill"
        @click="open(index)"
      />
    </view>
    <text class="sn-demo__hint">双指捏合缩放 · 双击放大 · 缩放后拖动 · 下滑关闭</text>
    <SnImagePreview ref="preview" :images="images" />
  </view>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sn-demo__thumbs {
  display: flex;
  flex-direction: row;
  gap: 8px;
}

.sn-demo__thumb {
  width: 200rpx;
  height: 200rpx;
  border-radius: 12rpx;
}

.sn-demo__hint {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 12px;
}
</style>
