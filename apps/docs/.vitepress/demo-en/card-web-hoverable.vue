<script setup lang="ts">
/**
 * card-web-hoverable — SnCard with `hoverable: true` (mouse hover lifts the
 * card with a soft shadow).
 */
import { SnCard } from '@snui/vue-web';
</script>

<template>
  <div style="display: flex; gap: 16px; flex-wrap: wrap">
    <SnCard hoverable style="width: 240px" aria-label="Hoverable 1">
      <h3 style="margin: 0">Hoverable 1</h3>
      <p style="margin: 8px 0 0; color: var(--vp-c-text-2); font-size: 13px">
        Hovering lifts the card up and adds a shadow.
      </p>
    </SnCard>
    <SnCard hoverable style="width: 240px" aria-label="Hoverable 2">
      <h3 style="margin: 0">Hoverable 2</h3>
      <p style="margin: 8px 0 0; color: var(--vp-c-text-2); font-size: 13px">
        Commonly used for card walls and list items.
      </p>
    </SnCard>
    <SnCard hoverable variant="elevated" style="width: 240px" aria-label="Hoverable elevated">
      <h3 style="margin: 0">Hoverable + elevated</h3>
      <p style="margin: 8px 0 0; color: var(--vp-c-text-2); font-size: 13px">
        Shadow that deepens on hover.
      </p>
    </SnCard>
  </div>
</template>
