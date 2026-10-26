<script setup lang="ts">
/**
 * float-button-web-placement — all eight placement anchors.
 *
 * Every cell is a small `position: relative` stage, and the button is pinned with
 * `fixed: false` to the matching corner / edge midpoint of its own cell, so a single
 * diagram compares every placement instead of stacking all the buttons in the
 * bottom-right corner of the browser window.
 *
 * Four corners: `top-left` / `top-right` / `bottom-left` / `bottom-right`
 * Four edge midpoints: `top` / `right` / `bottom` / `left` (centred with `50%` + translate)
 */
import { Bell } from 'lucide-vue-next';
import { SnFloatButton } from '@snui/vue-web';
import type { SnFloatButtonPlacement } from '@snui/vue-web';

interface Anchor {
  placement: SnFloatButtonPlacement;
  label: string;
}

const anchors: Anchor[] = [
  { placement: 'top-left', label: 'top-left' },
  { placement: 'top', label: 'top' },
  { placement: 'top-right', label: 'top-right' },
  { placement: 'left', label: 'left' },
  { placement: 'right', label: 'right' },
  { placement: 'bottom-left', label: 'bottom-left' },
  { placement: 'bottom', label: 'bottom' },
  { placement: 'bottom-right', label: 'bottom-right' },
];
</script>

<template>
  <div class="placement-demo">
    <div class="placement-demo__grid">
      <div v-for="anchor in anchors" :key="anchor.placement" class="placement-demo__cell">
        <span class="placement-demo__label">{{ anchor.label }}</span>
        <div class="placement-demo__stage">
          <SnFloatButton
            :fixed="false"
            :placement="anchor.placement"
            :icon="Bell"
            :tooltip="anchor.label"
          />
        </div>
      </div>
    </div>
    <p class="placement-demo__hint">
      Each cell is a <code>position: relative</code> stage with <code>fixed: false</code>; in a real
      page, omitting <code>fixed</code> pins the button to the matching viewport position.
    </p>
  </div>
</template>

<style scoped>
.placement-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.placement-demo__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 720px) {
  .placement-demo__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.placement-demo__cell {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.placement-demo__label {
  font-family: ui-monospace, monospace;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.placement-demo__stage {
  position: relative;
  height: 104px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}

.placement-demo__hint {
  margin: 0;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.placement-demo__hint code {
  padding: 0 4px;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
}
</style>
