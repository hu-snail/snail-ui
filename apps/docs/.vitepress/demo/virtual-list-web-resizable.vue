<script setup lang="ts">
/** Demo: SnVirtualList — itemResizable 动态测高。 */
import { SnVirtualList } from '@snui/vue-web';

const WORDS = [
  '短',
  '中等内容，占两行高度展示动态测高能力',
  '这是一条很长的内容，用来验证 ResizeObserver 测量后前缀和重排是否把后续行的位置整体下移，滚动条总高度随之增长，窗口计算仍然准确。',
];

const items = Array.from({ length: 300 }, (_, i) => ({
  value: i,
  label: `条目 ${i + 1} — ${WORDS[i % WORDS.length]}`,
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
      行高随内容自适应（itemResizable），未测量的行回退到 itemSize 估算。
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
