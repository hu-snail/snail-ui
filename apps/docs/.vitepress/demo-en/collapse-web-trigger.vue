<script setup lang="ts">
/**
 * collapse-web-trigger — SnCollapse with trigger='hover' (mouseenter expands).
 */
import { ref } from 'vue';
import { SnCollapse, SnCollapseItem } from '@snui/vue-web';

const open = ref<Array<string | number>>(['1']);
</script>

<template>
  <!-- The centered flex demo stage shrink-to-fits its children; pin the wrapper
       so the collapse group keeps a stable, parent-driven width. -->
  <div style="display: flex; flex-direction: column; gap: 24px; width: 100%; min-width: 0">
    <div>
      <p style="margin: 0 0 8px; font-size: 13px; color: var(--vp-c-text-2)">
        trigger="hover" — expands automatically on hover
      </p>
      <SnCollapse v-model:expanded-names="open" trigger="hover" arrow-placement="right">
        <SnCollapseItem title="Components" name="1"
          >Real components, one-to-one with Sn*.</SnCollapseItem
        >
        <SnCollapseItem title="Token" name="2"
          >Unified @snui/tokens underneath, emitting the --aui-* primitive layer.</SnCollapseItem
        >
        <SnCollapseItem title="Style Pack" name="3"
          >Style pack system shared across platforms.</SnCollapseItem
        >
      </SnCollapse>
    </div>
  </div>
</template>
