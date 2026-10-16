<script setup lang="ts">
/**
 * tooltip-web-placement — all twelve placements on a single stage.
 */
import { SnTooltip } from '@snui/vue-web'

const placements = [
  'top-start', 'top', 'top-end',
  'left-start', 'left', 'left-end', 'right-start', 'right', 'right-end',
  'bottom-start', 'bottom', 'bottom-end',
] as const
</script>

<template>
  <div class="tt-place">
    <div class="tt-place__grid">
      <SnTooltip
        v-for="p in placements"
        :key="p"
        :content="p"
        :placement="p"
      >
        <button class="tt-btn" type="button">{{ p }}</button>
      </SnTooltip>
    </div>
  </div>
</template>

<style scoped>
.tt-place {
  width: 100%;
  padding: 60px 0;
}
.tt-place__grid {
  display: grid;
  grid-template-columns: repeat(3, max-content);
  gap: 16px;
  justify-content: center;
}
.tt-btn {
  border: 1px solid var(--sn-web-color-border);
  background: var(--sn-web-color-background);
  color: var(--sn-web-color-text);
  padding: 6px 14px;
  border-radius: 6px;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
}
.tt-btn:hover {
  border-color: var(--sn-web-color-primary);
  color: var(--sn-web-color-primary);
}
</style>
