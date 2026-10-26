<script setup lang="ts">
/** Demo: SnHeatmap — `tooltip` slot with the cell DayRect params + a config object. */
import { ref } from 'vue';
import { SnHeatmap } from '@snui/vue-web';

/** Deterministic pseudo-random data over the last ~20 weeks. */
function buildData() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const out: Array<{ timestamp: number; value: number }> = [];
  for (let i = 139; i >= 0; i -= 1) {
    const ts = today.getTime() - i * 86_400_000;
    const seed = Math.abs(Math.sin(ts / 86_400_000 + 6.6));
    out.push({ timestamp: ts, value: Math.floor(seed * 12) });
  }
  return out;
}

const data = ref(buildData());

const WEEK_CHARS = ['日', '一', '二', '三', '四', '五', '六'] as const;

function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
</script>

<template>
  <div class="sn-demo">
    <div class="sn-demo-scroll">
      <SnHeatmap :data="data" :tooltip="{ placement: 'top', delay: 150 }" fill-calendar-leading>
        <template #tooltip="{ timestamp, value, dayOfWeek, rowIndex, colIndex }">
          <div class="sn-demo-cell-tip">
            <strong class="sn-demo-cell-tip__date">{{ formatDate(timestamp) }}</strong>
            <span class="sn-demo-cell-tip__meta">
              {{ value }} 次活动 · 周{{ WEEK_CHARS[dayOfWeek] }}
            </span>
            <span class="sn-demo-cell-tip__meta"
              >第 {{ rowIndex + 1 }} 行 / 第 {{ colIndex + 1 }} 列</span
            >
          </div>
        </template>
      </SnHeatmap>
    </div>
    <p class="sn-demo-tip">
      <code>tooltip</code> 插槽收到格子数据对象
      <code>{ timestamp, value, color, dayOfWeek, rowIndex, colIndex }</code
      >，可完全自定义浮层内容； 对象形式同时透传
      <code>placement / showArrow / delay / style / class</code>。
    </p>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sn-demo-scroll {
  overflow-x: auto;
  padding-bottom: 4px;
}

.sn-demo-tip {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}

.sn-demo-cell-tip {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sn-demo-cell-tip__date {
  font-weight: 600;
}

.sn-demo-cell-tip__meta {
  opacity: 0.85;
}
</style>
