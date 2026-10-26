<script setup lang="ts">
/**
 * waterfall-web-responsive — 响应式（`min-column-width`）用法。
 *
 * 设置 `min-column-width` 后容器改用 `column-width`：列数不再由
 * `columns` 决定，而是跟随可用宽度自动变化（此时 `columns` 被忽略）。
 * 下面的按钮只切换外层容器宽度，用来观察列数重排。
 */
import { ref } from 'vue'
import { SnWaterfall } from '@snui/vue-web'

interface Tile {
  id: number
  height: number
  from: string
  to: string
}

const tiles: Tile[] = [
  { id: 1, height: 110, from: '#1677ff', to: '#69b1ff' },
  { id: 2, height: 170, from: '#722ed1', to: '#b37feb' },
  { id: 3, height: 90, from: '#13c2c2', to: '#5cdbd3' },
  { id: 4, height: 150, from: '#fa8c16', to: '#ffc069' },
  { id: 5, height: 120, from: '#eb2f96', to: '#ff85c0' },
  { id: 6, height: 200, from: '#52c41a', to: '#95de64' },
  { id: 7, height: 95, from: '#2f54eb', to: '#85a5ff' },
  { id: 8, height: 140, from: '#f5222d', to: '#ff7875' },
]

const stageWidths = [
  { label: '720px', value: '720px' },
  { label: '420px', value: '420px' },
  { label: '260px', value: '260px' },
]

const stageWidth = ref('720px')
</script>

<template>
  <div class="waterfall-responsive">
    <div class="waterfall-responsive__toolbar">
      <span class="waterfall-responsive__hint">
        min-column-width="150" · 容器宽度
      </span>
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
        <div
          v-for="tile in tiles"
          :key="tile.id"
          class="waterfall-responsive__tile"
          :style="{
            height: `${tile.height}px`,
            backgroundImage: `linear-gradient(135deg, ${tile.from}, ${tile.to})`,
          }"
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
  border-radius: 8px;
}
</style>