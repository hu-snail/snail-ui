<script setup lang="ts">
/**
 * tooltip-web-placement — 十二个 placement 全览。
 *
 * 布局模拟「触发器在中心、气泡向四周展开」：把十二个方位按
 * 上 / 左中右 / 下 三行排布，每行内部再分 start/center/end，
 * 让方位差异一眼可见，而不是十二个按钮挤成一坨。
 */
import { SnTooltip } from '@snui/vue-web';

const rows = [
  ['top-start', 'top', 'top-end'],
  ['left-start', 'left', 'left-end', 'right-start', 'right', 'right-end'],
  ['bottom-start', 'bottom', 'bottom-end'],
] as const;
</script>

<template>
  <div class="tt-place">
    <section v-for="(row, i) in rows" :key="i" class="tt-place__row">
      <SnTooltip v-for="p in row" :key="p" :content="p" :placement="p">
        <button class="tt-place__btn" type="button">{{ p }}</button>
      </SnTooltip>
    </section>
  </div>
</template>

<style scoped>
.tt-place {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  /* Vertical breathing room so the top / bottom rows have space to open. */
  padding: 72px 0;
}
.tt-place__row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}
.tt-place__btn {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  padding: 6px 14px;
  border-radius: 6px;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  transition:
    border-color 0.15s,
    color 0.15s;
}
.tt-place__btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
</style>
