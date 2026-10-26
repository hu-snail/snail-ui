<script setup lang="ts">
/**
 * tooltip-web-placement — an overview of all twelve placements.
 *
 * The layout mimics "trigger in the middle, bubbles opening outwards": the twelve
 * positions are arranged in three rows (top / left-center-right / bottom), and each
 * row is further split into start/center/end, so the differences are obvious at a
 * glance instead of twelve buttons crowded into one blob.
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
