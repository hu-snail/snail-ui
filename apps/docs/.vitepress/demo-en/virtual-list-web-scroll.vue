<script setup lang="ts">
/** Demo: SnVirtualList — scroll / update:scrollTop 实时回显 + overscan 预渲染对照。 */
import { reactive } from 'vue'
import { SnVirtualList } from '@snui/vue-web'

/** 本地造 1000 条数据。 */
const items = Array.from({ length: 1000 }, (_, i) => ({
  value: i,
  label: `Row ${i + 1}`,
}))

/** 两组滚动回显：native scroll 计数 + rAF 节流后的 scrollTop。 */
const readouts = reactive({
  plain: { scrollTop: 0, scrollCount: 0 },
  buffered: { scrollTop: 0, scrollCount: 0 },
})

function onScrollTop(key: 'plain' | 'buffered', next: number): void {
  readouts[key].scrollTop = next
  readouts[key].scrollCount += 1
}
</script>

<template>
  <div class="virtual-list-demo">
    <div class="virtual-list-demo__grid">
      <section class="virtual-list-demo__block">
        <h4 class="virtual-list-demo__title">overscan 0 — renders only the visible rows</h4>
        <SnVirtualList
          :items="items"
          :item-size="32"
          :visible-height="200"
          :overscan="0"
          @scroll="readouts.plain.scrollCount += 1"
          @update:scroll-top="onScrollTop('plain', $event)"
        >
          <template #item="{ item }">
            <div class="virtual-list-demo__row">Row {{ item.value + 1 }} · {{ item.label }}</div>
          </template>
        </SnVirtualList>
        <p class="virtual-list-demo__hint">
          scrollTop {{ readouts.plain.scrollTop }}px · {{ readouts.plain.scrollCount }} scroll events
        </p>
      </section>
      <section class="virtual-list-demo__block">
        <h4 class="virtual-list-demo__title">overscan 12 — renders 12 extra buffer rows above and below the viewport</h4>
        <SnVirtualList
          :items="items"
          :item-size="32"
          :visible-height="200"
          :overscan="12"
          @scroll="readouts.buffered.scrollCount += 1"
          @update:scroll-top="onScrollTop('buffered', $event)"
        >
          <template #item="{ item }">
            <div class="virtual-list-demo__row">Row {{ item.value + 1 }} · {{ item.label }}</div>
          </template>
        </SnVirtualList>
        <p class="virtual-list-demo__hint">
          scrollTop {{ readouts.buffered.scrollTop }}px · {{ readouts.buffered.scrollCount }} scroll events
        </p>
      </section>
    </div>
    <p class="virtual-list-demo__hint virtual-list-demo__hint--note">
      scroll is a native high-frequency event; update:scrollTop is throttled via rAF. A larger overscan lowers the chance of blank rows during fast scrolling.
    </p>
  </div>
</template>

<style scoped>
.virtual-list-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.virtual-list-demo__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.virtual-list-demo__block {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1 1 300px;
  min-width: 0;
}

.virtual-list-demo__title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--sn-web-color-text-secondary);
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

.virtual-list-demo__hint--note {
  font-size: 12px;
}
</style>
