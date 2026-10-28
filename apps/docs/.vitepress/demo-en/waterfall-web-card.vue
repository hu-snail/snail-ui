<script setup lang="ts">
/**
 * waterfall-web-card — card wall: `SnCard` as the waterfall items.
 *
 * Three things on show:
 *   - `columns` controls the column count (2 / 3 / 4);
 *   - `masonry=false` drops the multi-column layout into a plain vertical stack;
 *   - the same item data is re-distributed shortest-column-first as the count changes.
 *
 * Covers come from a real network source (picsum.photos); the `seed` is fixed so
 * the same photo is reproduced every time.
 */
import { ref } from 'vue';
import { SnCard, SnWaterfall } from '@snui/vue-web';

interface CardItem {
  id: number;
  title: string;
  desc: string;
  coverHeight: number;
  tags: string[];
  seed: string;
}

const cards: CardItem[] = [
  {
    id: 1,
    title: 'Design system tokens',
    desc: 'Primitive → Semantic → Component aliasing in three layers; the same variables shared across platforms.',
    coverHeight: 96,
    tags: ['token', 'web'],
    seed: 'aui-card-token',
  },
  {
    id: 2,
    title: 'Schema First',
    desc: 'The protocol layer does not depend on Vue: Schema → Runtime → Renderer is a one-way dependency; the renderer is just an adapter.',
    coverHeight: 132,
    tags: ['schema', 'runtime'],
    seed: 'aui-card-schema',
  },
  {
    id: 3,
    title: 'Waterfall usage',
    desc: 'Each column packs independently — uneven heights never push holes into each other.',
    coverHeight: 80,
    tags: ['layout'],
    seed: 'aui-card-layout',
  },
  {
    id: 4,
    title: 'Shortest column first',
    desc: 'A new item is appended to the currently shortest column; placed items never move, so a late image only grows its own column.',
    coverHeight: 116,
    tags: ['masonry', 'perf'],
    seed: 'aui-card-masonry',
  },
  {
    id: 5,
    title: 'Responsive mode',
    desc: 'With min-column-width set the column count is computed from the measured container width, so a width change re-flows the columns.',
    coverHeight: 88,
    tags: ['responsive'],
    seed: 'aui-card-responsive',
  },
  {
    id: 6,
    title: 'A11y',
    desc: 'The container renders role="list", each item wrapper renders role="listitem", and the column wrappers are presentation.',
    coverHeight: 104,
    tags: ['a11y'],
    seed: 'aui-card-a11y',
  },
];

/** Request the cover at its aspect ratio; `object-fit` crops the rest. */
function photo(seed: string, height: number, width = 300): string {
  const w = 600;
  return `https://picsum.photos/seed/${seed}/${w}/${Math.round((height / width) * w)}`;
}

const columnOptions = [2, 3, 4];
const columns = ref(3);
const masonry = ref(true);
</script>

<template>
  <div class="waterfall-card">
    <div class="waterfall-card__toolbar">
      <span class="waterfall-card__hint">Columns</span>
      <button
        v-for="option in columnOptions"
        :key="option"
        type="button"
        class="waterfall-card__button"
        :class="{
          'waterfall-card__button--active': columns === option && masonry,
        }"
        :disabled="!masonry"
        @click="columns = option"
      >
        {{ option }}
      </button>
      <button
        type="button"
        class="waterfall-card__button"
        :class="{ 'waterfall-card__button--active': !masonry }"
        @click="masonry = !masonry"
      >
        masonry: {{ masonry ? 'on' : 'off' }}
      </button>
    </div>

    <SnWaterfall :columns="columns" :masonry="masonry" :row-gap="12">
      <SnCard
        v-for="card in cards"
        :key="card.id"
        class="waterfall-card__item"
        bordered
        :aria-label="card.title"
      >
        <template #cover>
          <img
            class="waterfall-card__cover"
            :src="photo(card.seed, card.coverHeight)"
            :alt="card.title"
            loading="lazy"
            :style="{ height: `${card.coverHeight}px` }"
          />
        </template>
        <template #header>
          <h4 class="waterfall-card__title">{{ card.title }}</h4>
        </template>
        <p class="waterfall-card__desc">{{ card.desc }}</p>
        <div class="waterfall-card__tags">
          <span v-for="tag in card.tags" :key="tag" class="waterfall-card__tag">
            {{ tag }}
          </span>
        </div>
      </SnCard>
    </SnWaterfall>
  </div>
</template>

<style scoped>
.waterfall-card {
  width: 100%;
}

.waterfall-card__toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 13px;
}

.waterfall-card__hint {
  color: var(--vp-c-text-2);
}

.waterfall-card__button {
  padding: 2px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 12px;
  cursor: pointer;
}

.waterfall-card__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.waterfall-card__button--active {
  border-color: #1677ff;
  background: #1677ff;
  color: #ffffff;
}

.waterfall-card__item {
  overflow: hidden;
}

.waterfall-card__cover {
  display: block;
  width: 100%;
  object-fit: cover;
  border-radius: 6px 6px 0 0;
  background: var(--vp-c-bg-soft);
}

.waterfall-card__title {
  margin: 0;
  font-size: 14px;
}

.waterfall-card__desc {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.6;
}

.waterfall-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.waterfall-card__tag {
  padding: 1px 8px;
  border-radius: 10px;
  background: rgba(22, 119, 255, 0.12);
  color: #1677ff;
  font-size: 12px;
}
</style>
