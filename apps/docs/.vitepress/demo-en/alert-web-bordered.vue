<script setup lang="ts">
/**
 * alert-web-bordered — bordered (default) vs borderless side by side.
 *
 * Shows: the `bordered` prop. Borderless keeps the type tint on the fill
 * instead of drawing a full outline.
 */
import { SnAlert } from '@snui/vue-web'
</script>

<template>
  <div class="alert-bordered">
    <div class="alert-bordered__cell">
      <span class="alert-bordered__cap">bordered (default)</span>
      <SnAlert type="info" title="Bordered">Border and type color apply together; good for standalone blocks of information.</SnAlert>
      <SnAlert type="success" title="Bordered">Operation completed. You can safely continue to the next step.</SnAlert>
    </div>

    <div class="alert-bordered__cell">
      <span class="alert-bordered__cap">:bordered="false"</span>
      <SnAlert type="info" title="Borderless" :bordered="false">
        Removes the outline and keeps only the background and icon; good for nesting inside cards.
      </SnAlert>
      <SnAlert type="success" title="Borderless" :bordered="false">
        Visually lighter and avoids double lines with the card border.
      </SnAlert>
    </div>
  </div>
</template>

<style scoped>
.alert-bordered {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
}
.alert-bordered__cell {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1 1 320px;
}
.alert-bordered__cap {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
