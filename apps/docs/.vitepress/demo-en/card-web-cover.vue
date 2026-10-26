<script setup lang="ts">
/**
 * card-web-cover — SnCard with cover slot (above header). The `cover`
 * slot hosts a banner image / illustration at the top.
 */
import { SnButton, SnCard } from '@snui/vue-web';
</script>

<template>
  <div style="display: flex; gap: 16px; flex-wrap: wrap">
    <SnCard style="width: 280px" aria-label="Cover example">
      <template #cover>
        <div
          style="
            height: 120px;
            background: linear-gradient(135deg, #1677ff 0%, #722ed1 100%);
            border-radius: 6px 6px 0 0;
          "
        ></div>
      </template>
      <template #header>
        <h3 style="margin: 0">Cover example</h3>
      </template>
      <p style="margin: 0; color: var(--vp-c-text-2); font-size: 13px">
        The cover slot holds a top banner; header + content come after it.
      </p>
      <template #action>
        <SnButton variant="primary" size="small">View details</SnButton>
      </template>
    </SnCard>

    <SnCard style="width: 280px" aria-label="Banner header">
      <template #header>
        <h3 style="margin: 0">Without cover</h3>
        <p style="margin: 4px 0 0; font-size: 12px; color: var(--vp-c-text-2)">
          subtitle goes here
        </p>
      </template>
      <p style="margin: 0; color: var(--vp-c-text-2); font-size: 13px">
        Without a cover, the header sits flush against the Card edge.
      </p>
    </SnCard>
  </div>
</template>
