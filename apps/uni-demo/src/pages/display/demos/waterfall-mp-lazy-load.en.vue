<script setup lang="ts">
/**
 * Demo: sn-waterfall (uni-end) — English shadow of waterfall-mp-lazy-load.
 * Per AUI-DOCS-016: imports the real @snui/uni components from their SFC
 * source. The container turns lazy loading on once; the nested images
 * inherit it, and one image explicitly opts out.
 */
import SnWaterfall from '@snui/uni-src/components/sn-waterfall/sn-waterfall.vue';
import SnImg from '@snui/uni-src/components/sn-img/sn-img.vue';

interface Photo {
  id: string;
  title: string;
  width: number;
  height: number;
}

const photos: Photo[] = [
  { id: 'a', title: 'Featured', width: 400, height: 520 },
  { id: 'b', title: 'Trending', width: 400, height: 320 },
  { id: 'c', title: 'Local', width: 400, height: 460 },
  { id: 'd', title: 'Following', width: 400, height: 380 },
  { id: 'e', title: 'Saved', width: 400, height: 560 },
  { id: 'f', title: 'History', width: 400, height: 300 },
];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <!-- 一处开关：容器 lazy-load 打开，内部图片无需逐张书写 lazy-load。 -->
    <SnWaterfall :columns="2" lazy-load>
      <view v-for="photo in photos" :key="photo.id" class="lazy-card">
        <SnImg
          :src="`https://picsum.photos/seed/snui-waterfall-lazy-${photo.id}/${photo.width}/${photo.height}`"
          mode="widthFix"
          width="100%"
        />
        <text class="lazy-card__title">{{ photo.title }}</text>
      </view>
    </SnWaterfall>
    <text class="sn-demo__caption"
      >Container lazy-load on once — nested sn-img inherits it; an image passing its own lazy-load
      wins</text
    >
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__caption {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
.lazy-card {
  display: flex;
  flex-direction: column;
  background-color: var(--sn-mp-color-background-elevated);
  border-radius: 16rpx;
  overflow: hidden;
}
.lazy-card__title {
  padding: 12rpx 16rpx 16rpx;
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
