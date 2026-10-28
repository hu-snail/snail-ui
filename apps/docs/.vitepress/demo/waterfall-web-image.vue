<script setup lang="ts">
/**
 * waterfall-web-image — 图片墙：SnWaterfall + SnImage 懒加载。
 *
 * 图片流的标准配方，演示三点：
 *   1. `width` / `height` 同时给出：浏览器在图片下载完成前就预留出等比空间，
 *      布局不跳动（瀑布流最怕的“图片加载后整列乱跳”）。
 *   2. `lazy` + `intersection-observer-options.rootMargin`：提前 400px 进入
 *      视口才开始加载，滚动时不会有白块，也不会一次下载整墙图片。
 *   3. SnWaterfall 只负责列分配：图片晚到只会把自己那一列撑高，已放置的
 *      卡片与其它列都不会移动。
 */
import { SnImage, SnWaterfall } from '@snui/vue-web';

interface Photo {
  id: number;
  seed: string;
  width: number;
  height: number;
  title: string;
}

const photos: Photo[] = [
  { id: 1, seed: 'aui-1', width: 400, height: 260, title: '晨雾山谷' },
  { id: 2, seed: 'aui-2', width: 400, height: 520, title: '城市夜景' },
  { id: 3, seed: 'aui-3', width: 400, height: 340, title: '海边落日' },
  { id: 4, seed: 'aui-4', width: 400, height: 460, title: '林间小路' },
  { id: 5, seed: 'aui-5', width: 400, height: 300, title: '雪山日落' },
  { id: 6, seed: 'aui-6', width: 400, height: 420, title: '沙漠驼队' },
  { id: 7, seed: 'aui-7', width: 400, height: 240, title: '街角咖啡' },
  { id: 8, seed: 'aui-8', width: 400, height: 480, title: '古镇夜色' },
  { id: 9, seed: 'aui-9', width: 400, height: 320, title: '冬日暖阳' },
  { id: 10, seed: 'aui-10', width: 400, height: 400, title: '云海日出' },
  { id: 11, seed: 'aui-11', width: 400, height: 280, title: '雨后彩虹' },
  { id: 12, seed: 'aui-12', width: 400, height: 440, title: '湖畔倒影' },
];

/** 提前一屏预加载，滚动时不会出现空白。 */
const observerOptions = { rootMargin: '400px' };
</script>

<template>
  <SnWaterfall class="waterfall-image" :columns="4" :column-gap="12" :row-gap="12">
    <SnImage
      v-for="photo in photos"
      :key="photo.id"
      class="waterfall-image__photo"
      :src="`https://picsum.photos/seed/${photo.seed}/${photo.width}/${photo.height}`"
      :width="photo.width"
      :height="photo.height"
      :alt="photo.title"
      object-fit="cover"
      lazy
      :intersection-observer-options="observerOptions"
    />
  </SnWaterfall>
</template>

<style scoped>
.waterfall-image {
  width: 100%;
}

.waterfall-image__photo {
  display: block;
  width: 100%;
}

.waterfall-image__photo :deep(img) {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 8px;
}
</style>
