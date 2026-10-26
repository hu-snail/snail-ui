<script setup lang="ts">
/**
 * waterfall-web-card — 卡片墙：`SnCard` 作为瀑布流子项。
 *
 * 演示三件事：
 *   - `columns` 控制列数（2 / 3 / 4）；
 *   - `masonry=false` 关掉多列布局，退化为普通单列竖向堆叠；
 *   - `row-gap` 由每个子项的 `margin-bottom` 提供（这里用 12）。
 */
import { ref } from 'vue';
import { SnCard, SnWaterfall } from '@snui/vue-web';

interface CardItem {
  id: number;
  title: string;
  desc: string;
  coverHeight: number;
  tags: string[];
  from: string;
  to: string;
}

const cards: CardItem[] = [
  {
    id: 1,
    title: 'Design system tokens',
    desc: 'Primitive → Semantic → Component aliasing in three layers; the same variables shared across platforms.',
    coverHeight: 96,
    tags: ['token', 'web'],
    from: '#1677ff',
    to: '#69b1ff',
  },
  {
    id: 2,
    title: 'Schema First',
    desc: 'The protocol layer does not depend on Vue: Schema → Runtime → Renderer is a one-way dependency; the renderer is just an adapter.',
    coverHeight: 132,
    tags: ['schema', 'runtime'],
    from: '#722ed1',
    to: '#b37feb',
  },
  {
    id: 3,
    title: 'Waterfall usage',
    desc: 'Each column packs independently — uneven heights never push holes into each other.',
    coverHeight: 80,
    tags: ['layout'],
    from: '#13c2c2',
    to: '#5cdbd3',
  },
  {
    id: 4,
    title: 'Zero-JS measurement',
    desc: 'No ResizeObserver and no scroll listeners: the column count comes from CSS multi-column layout + available width, and the browser reflows on resize.',
    coverHeight: 116,
    tags: ['css', 'a11y'],
    from: '#fa8c16',
    to: '#ffc069',
  },
  {
    id: 5,
    title: 'Responsive mode',
    desc: 'With min-column-width set it switches to column-width; the column count follows the width.',
    coverHeight: 88,
    tags: ['responsive'],
    from: '#eb2f96',
    to: '#ff85c0',
  },
  {
    id: 6,
    title: 'A11y',
    desc: 'The container renders role="list" and each item wrapper renders role="listitem".',
    coverHeight: 104,
    tags: ['a11y'],
    from: '#52c41a',
    to: '#95de64',
  },
];

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
          <div
            class="waterfall-card__cover"
            :style="{
              height: `${card.coverHeight}px`,
              backgroundImage: `linear-gradient(135deg, ${card.from}, ${card.to})`,
            }"
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
  border-radius: 6px 6px 0 0;
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
