<script setup lang="ts">
/**
 * waterfall-web-responsive — the `min-column-width` (responsive) usage.
 *
 * With `min-column-width` set, the column count no longer comes from
 * `columns`: it follows the **measured container width** (computed once a width
 * exists, e.g. after the container enters the viewport). The buttons only change
 * the stage width so the re-flow is visible.
 *
 * Images come from a real network source (picsum.photos); the `seed` is fixed so
 * the same photo is reproduced every time.
 */
import { ref } from 'vue';
import { SnWaterfall } from '@snui/vue-web';

interface Tile {
  id: number;
  height: number;
  seed: string;
}

const tiles: Tile[] = [
  { id: 1, height: 110, seed: 'aui-resp-1' },
  { id: 2, height: 170, seed: 'aui-resp-2' },
  { id: 3, height: 90, seed: 'aui-resp-3' },
  { id: 4, height: 150, seed: 'aui-resp-4' },
  { id: 5, height: 120, seed: 'aui-resp-5' },
  { id: 6, height: 200, seed: 'aui-resp-6' },
  { id: 7, height: 95, seed: 'aui-resp-7' },
  { id: 8, height: 140, seed: 'aui-resp-8' },
];

/** Request the image at the tile's aspect ratio; `object-fit` crops the rest. */
function photo(seed: string, height: number, width = 300): string {
  const w = 600;
  return `https://picsum.photos/seed/${seed}/${w}/${Math.round((height / width) * w)}`;
}

const stageWidths = [
  { label: '720px', value: '720px' },
  { label: '420px', value: '420px' },
  { label: '260px', value: '260px' },
];

const stageWidth = ref('720px');
</script>

<template>
  <div class="waterfall-responsive">
    <div class="waterfall-responsive__toolbar">
      <span class="waterfall-responsive__hint"> min-column-width="150" · container width </span>
      <button
        v-for="width in stageWidths"
        :key="width.value"
        type="button"
        class="waterfall-responsive__button"
        :class="{
          'waterfall-responsive__button--active': stageWidth === width.value,
        }"
        @click="stageWidth = width.value"
      >
        {{ width.label }}
      </button>
    </div>

    <div class="waterfall-responsive__stage" :style="{ width: stageWidth }">
      <SnWaterfall :min-column-width="150" :row-gap="12">
        <img
          v-for="tile in tiles"
          :key="tile.id"
          class="waterfall-responsive__tile"
          :src="photo(tile.seed, tile.height)"
          :alt="`Responsive tile ${tile.id}`"
          loading="lazy"
          :style="{ height: `${tile.height}px` }"
        />
      </SnWaterfall>
    </div>
  </div>
</template>

<style scoped>
.waterfall-responsive {
  width: 100%;
}

.waterfall-responsive__toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 13px;
}

.waterfall-responsive__hint {
  color: var(--vp-c-text-2);
}

.waterfall-responsive__button {
  padding: 2px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 12px;
  cursor: pointer;
}

.waterfall-responsive__button--active {
  border-color: #1677ff;
  background: #1677ff;
  color: #ffffff;
}

.waterfall-responsive__stage {
  max-width: 100%;
  box-sizing: border-box;
  transition: width 0.2s ease;
}

.waterfall-responsive__tile {
  display: block;
  width: 100%;
  object-fit: cover;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}
</style>
