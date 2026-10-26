<script setup lang="ts">
/** Demo: SnVirtualList — 1000 行固定行高虚拟滚动。 */
import { SnVirtualList } from '@snui/vue-web';

const items = Array.from({ length: 1000 }, (_, i) => ({
  value: i,
  label: `Row ${i + 1}`,
}));
</script>

<template>
  <div class="virtual-list-demo">
    <SnVirtualList :items="items" :item-size="32" :visible-height="240" :overscan="5">
      <template #item="{ item }">
        <div class="virtual-list-demo__row">Row {{ item.value + 1 }} · {{ item.label }}</div>
      </template>
    </SnVirtualList>
    <p class="virtual-list-demo__hint">
      1,000 items — only the visible window plus overscan rows are rendered.
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
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 12px;
  border-bottom: 1px solid var(--sn-web-color-border-subtle);
  font-size: 13px;
  color: var(--sn-web-color-text-primary);
}

.virtual-list-demo__hint {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
