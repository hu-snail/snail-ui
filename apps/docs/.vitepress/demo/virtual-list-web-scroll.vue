<script setup lang="ts">
/** Demo: SnVirtualList — scroll / update:scrollTop 实时回显 + overscan 预渲染对照。 */
import { reactive } from 'vue'
import { SnVirtualList } from '@snui/vue-web'

/** 本地造 1000 条数据。 */
const items = Array.from({ length: 1000 }, (_, i) => ({
  value: i,
  label: `第 ${i + 1} 行`,
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
        <h4 class="virtual-list-demo__title">overscan 0 — 只渲染可视窗口行</h4>
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
          scrollTop {{ readouts.plain.scrollTop }}px · scroll 事件 {{ readouts.plain.scrollCount }} 次
        </p>
      </section>
      <section class="virtual-list-demo__block">
        <h4 class="virtual-list-demo__title">overscan 12 — 视口上下各多渲染 12 行缓冲</h4>
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
          scrollTop {{ readouts.buffered.scrollTop }}px · scroll 事件 {{ readouts.buffered.scrollCount }} 次
        </p>
      </section>
    </div>
    <p class="virtual-list-demo__hint virtual-list-demo__hint--note">
      scroll 为原生高频事件，update:scrollTop 经 rAF 节流后提交；overscan 越大，快速滚动时白屏概率越低。
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
