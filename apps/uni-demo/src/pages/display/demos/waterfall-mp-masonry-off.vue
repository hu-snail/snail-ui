<script setup lang="ts">
/**
 * Demo: sn-waterfall (uni-end) — masonry=false 退化为单列垂直堆叠。
 * Per AUI-DOCS-016: imports the real @snui/uni components from their SFC
 * source. The same item list renders as a plain stack when masonry is off.
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
  { id: 'a', title: '开篇', width: 400, height: 300 },
  { id: 'b', title: '细节', width: 400, height: 400 },
  { id: 'c', title: '收尾', width: 400, height: 260 },
];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnWaterfall :masonry="false" :row-gap="16">
      <view v-for="photo in photos" :key="photo.id" class="stack-card">
        <SnImg
          :src="`https://picsum.photos/seed/snui-waterfall-off-${photo.id}/${photo.width}/${photo.height}`"
          mode="widthFix"
          width="100%"
          :radius="12"
        />
        <text class="stack-card__title">{{ photo.title }}</text>
      </view>
    </SnWaterfall>
    <text class="sn-demo__caption">masonry=false — 同样的内容退化为单列垂直堆叠（项恢复 margin-bottom）</text>
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
.stack-card {
  display: flex;
  flex-direction: column;
  background-color: var(--sn-mp-color-background-elevated);
  border-radius: 16rpx;
  overflow: hidden;
}
.stack-card__title {
  padding: 12rpx 16rpx 16rpx;
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>