<script setup lang="ts">
/**
 * Demo: SnEllipsis — `expandTrigger="click"` toggles the clamped text between
 * collapsed and expanded in place, without a tooltip round-trip.
 */
import { SnEllipsis } from '@snui/vue-web'

const longText =
  'Click this text to toggle between clamped and full content: collapsed keeps two lines with an ellipsis at the end,' +
  'expanded shows the full content without the tooltip; click again to return to the clamped state.' +
  'The state is fully maintained inside the component; no external expanded prop is needed.'
</script>

<template>
  <div class="ellipsis-expand-demo">
    <section class="ellipsis-expand-demo__block">
      <h4>Click to expand / collapse (lineClamp = 2)</h4>
      <SnEllipsis :width="380" :line-clamp="2" expand-trigger="click">
        {{ longText }}
      </SnEllipsis>
    </section>

    <section class="ellipsis-expand-demo__block">
      <h4>Click to expand / collapse (lineClamp = 3)</h4>
      <SnEllipsis :width="380" :line-clamp="3" expand-trigger="click">
        {{ longText }}
      </SnEllipsis>
    </section>

    <section class="ellipsis-expand-demo__block">
      <h4>Ellipsis only, no expand (expandTrigger = 'none', default)</h4>
      <SnEllipsis :width="380" :line-clamp="2">{{ longText }}</SnEllipsis>
    </section>
  </div>
</template>

<style scoped>
.ellipsis-expand-demo {
  display: grid;
  gap: 20px;
}
.ellipsis-expand-demo__block {
  display: grid;
  gap: 8px;
}
.ellipsis-expand-demo__block h4 {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
