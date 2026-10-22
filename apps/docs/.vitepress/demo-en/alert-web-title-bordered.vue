<script setup lang="ts">
/**
 * alert-web-title-bordered — contrasts the default bordered look with
 * `bordered="false"` (bare fill, no outline).
 */
import { SnAlert } from '@snui/vue-web'
</script>

<template>
  <div class="alert-demo">
    <p class="alert-demo__label">bordered (default true)</p>
    <SnAlert type="info" title="Bordered">
      Draws a 1px outline by default; the outline color derives from type.
    </SnAlert>

    <p class="alert-demo__label">:bordered="false"</p>
    <SnAlert type="info" title="Borderless" :bordered="false">
      Removes the outer border, keeping only the fill and the leading icon.
    </SnAlert>

    <p class="alert-demo__label">No title (body only)</p>
    <SnAlert type="warning">With body content only, the title row is not rendered.</SnAlert>
  </div>
</template>

<style scoped>
.alert-demo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}
.alert-demo__label {
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--vp-c-text-2);
  font-family: ui-monospace, monospace;
}
</style>
