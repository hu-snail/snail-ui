<script setup lang="ts">
/**
 * Demo: sn-waterfall (uni-end) — 图片懒加载配置级联（容器 lazy-load 级联 sn-img）。
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
  { id: 'a', title: '推荐', width: 400, height: 520 },
  { id: 'b', title: '热榜', width: 400, height: 320 },
  { id: 'c', title: '同城', width: 400, height: 460 },
  { id: 'd', title: '关注', width: 400, height: 380 },
  { id: 'e', title: '收藏', width: 400, height: 560 },
  { id: 'f', title: '历史', width: 400, height: 300 },
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
      >容器 lazy-load 一处开启 → 内部 sn-img 继承；图片显式传 lazy-load 时以图片为准</text
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
