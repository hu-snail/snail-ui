<script setup lang="ts">
/**
 * waterfall-web-image — image wall: SnWaterfall + SnImage lazy loading.
 *
 * The standard recipe for an image feed; three things on show:
 *   1. `width` / `height` are both given, so the browser reserves the aspect
 *      ratio before the image arrives and the layout never jumps (the thing a
 *      waterfall fears most).
 *   2. `lazy` + `intersection-observer-options.rootMargin`: loading starts
 *      400px before the viewport, so scrolling shows no gaps and the whole
 *      wall is not downloaded at once.
 *   3. SnWaterfall only places items: a late image grows its own column, while
 *      every placed card and every other column stays put.
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
  { id: 1, seed: 'aui-1', width: 400, height: 260, title: 'Morning mist' },
  { id: 2, seed: 'aui-2', width: 400, height: 520, title: 'City at night' },
  { id: 3, seed: 'aui-3', width: 400, height: 340, title: 'Sunset by the sea' },
  { id: 4, seed: 'aui-4', width: 400, height: 460, title: 'Forest path' },
  { id: 5, seed: 'aui-5', width: 400, height: 300, title: 'Snow peak' },
  { id: 6, seed: 'aui-6', width: 400, height: 420, title: 'Desert caravan' },
  { id: 7, seed: 'aui-7', width: 400, height: 240, title: 'Corner café' },
  { id: 8, seed: 'aui-8', width: 400, height: 480, title: 'Old town at dusk' },
  { id: 9, seed: 'aui-9', width: 400, height: 320, title: 'Winter sun' },
  { id: 10, seed: 'aui-10', width: 400, height: 400, title: 'Sea of clouds' },
  { id: 11, seed: 'aui-11', width: 400, height: 280, title: 'Rainbow after rain' },
  { id: 12, seed: 'aui-12', width: 400, height: 440, title: 'Lake reflection' },
];

/** Preload one screen ahead so fast scrolling shows no blank tiles. */
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
