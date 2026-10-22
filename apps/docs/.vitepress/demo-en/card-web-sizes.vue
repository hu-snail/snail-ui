<script setup lang="ts">
/**
 * card-web-sizes — SnCard with all 4 size presets (small/medium/large/huge).
 * `size` drives padding + font-size.
 */
import { SnCard } from '@snui/vue-web'
</script>

<template>
  <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start;">
    <SnCard size="small" title="small" style="width:200px;">
      <p style="margin:0;font-size:13px;">Compact padding, good for dense lists.</p>
    </SnCard>
    <SnCard size="medium" title="medium" style="width:200px;">
      <p style="margin:0;font-size:13px;">Default size; recommended for docs.</p>
    </SnCard>
    <SnCard size="large" title="large" style="width:200px;">
      <p style="margin:0;font-size:13px;">Roomy padding, for hero cards.</p>
    </SnCard>
    <SnCard size="huge" title="huge" style="width:200px;">
      <p style="margin:0;font-size:13px;">Max padding, for promo spots.</p>
    </SnCard>
  </div>
</template>