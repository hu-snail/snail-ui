<script setup lang="ts">
/** Demo: SnVirtualList — itemResizable 动态测高。 */
import { SnVirtualList } from '@snui/vue-web';

const WORDS = [
  'Short',
  'Medium content, two lines tall, to show dynamic height measuring',
  'A very long item used to verify that after ResizeObserver measuring, prefixing and reflowing shift later rows down as a whole; total scrollbar height grows accordingly and window calculations stay accurate.',
];

const items = Array.from({ length: 300 }, (_, i) => ({
  value: i,
  label: `Item ${i + 1} — ${WORDS[i % WORDS.length]}`,
}));
</script>

<template>
  <div class="virtual-list-demo">
    <SnVirtualList :items="items" :item-size="40" item-resizable :visible-height="240">
      <template #item="{ item }">
        <div
          class="virtual-list-demo__row"
          :class="{ 'virtual-list-demo__row--long': item.value % 3 === 2 }"
        >
          {{ item.label }}
        </div>
      </template>
    </SnVirtualList>
    <p class="virtual-list-demo__hint">
      Row height adapts to content (itemResizable); unmeasured rows fall back to the itemSize
      estimate.
    </p>
  </div>
</template>

<style scoped>
.virtual-list-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 480px;
}

.virtual-list-demo__row {
  padding: 8px 12px;
  border-bottom: 1px solid var(--sn-web-color-border-subtle);
  font-size: 13px;
  color: var(--sn-web-color-text-primary);
}

.virtual-list-demo__row--long {
  line-height: 1.6;
}

.virtual-list-demo__hint {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
