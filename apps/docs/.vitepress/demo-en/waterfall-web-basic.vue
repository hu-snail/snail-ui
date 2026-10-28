<script setup lang="ts">
/**
 * waterfall-web-basic — SnWaterfall basic usage: three columns by default.
 *
 * The tiles are driven by `v-for` (the component flattens the Fragment the
 * slot produces) and have wildly different heights; shortest-column-first
 * placement packs each column on its own, so a short column never leaves a
 * hole beside a tall one.
 *
 * Tile images come from a real network source (picsum.photos): the `seed` is
 * fixed, so the same photo is reproduced every time.
 */
import { SnWaterfall } from '@snui/vue-web';

interface Tile {
  id: number;
  title: string;
  height: number;
  seed: string;
}

const tiles: Tile[] = [
  { id: 1, title: 'Login page', height: 120, seed: 'aui-login' },
  { id: 2, title: 'Dashboard', height: 190, seed: 'aui-dashboard' },
  { id: 3, title: 'Form', height: 96, seed: 'aui-form' },
  { id: 4, title: 'Message feed', height: 210, seed: 'aui-feed' },
  { id: 5, title: 'Profile', height: 140, seed: 'aui-profile' },
  { id: 6, title: 'Settings', height: 104, seed: 'aui-settings' },
  { id: 7, title: 'Order list', height: 168, seed: 'aui-orders' },
  { id: 8, title: 'Detail page', height: 132, seed: 'aui-detail' },
];

/** Request the image at the tile's aspect ratio; `object-fit` crops the rest. */
function photo(seed: string, height: number, width = 300): string {
  const w = 600;
  return `https://picsum.photos/seed/${seed}/${w}/${Math.round((height / width) * w)}`;
}
</script>

<template>
  <SnWaterfall class="waterfall-basic">
    <div
      v-for="tile in tiles"
      :key="tile.id"
      class="waterfall-basic__tile"
      :style="{ height: `${tile.height}px` }"
    >
      <img
        class="waterfall-basic__img"
        :src="photo(tile.seed, tile.height)"
        :alt="tile.title"
        loading="lazy"
      />
      <div class="waterfall-basic__overlay" aria-hidden="true">
        <span class="waterfall-basic__label">{{ tile.title }}</span>
        <span class="waterfall-basic__size">{{ tile.height }}px</span>
      </div>
    </div>
  </SnWaterfall>
</template>

<style scoped>
.waterfall-basic {
  width: 100%;
}

.waterfall-basic__tile {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.waterfall-basic__img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Darken the bottom so white text stays readable on any photo. */
.waterfall-basic__overlay {
  position: absolute;
  inset: auto 0 0 0;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  padding: 24px 12px 10px;
  color: #ffffff;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0));
  font-size: 13px;
}

.waterfall-basic__label {
  font-size: 14px;
  font-weight: 500;
}

.waterfall-basic__size {
  opacity: 0.85;
  font-size: 12px;
}
</style>
