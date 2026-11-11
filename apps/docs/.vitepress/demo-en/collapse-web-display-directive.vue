<script setup lang="ts">
/**
 * collapse-web-display-directive — displayDirective='show' (DOM stays
 * mounted, toggle via display:none — cheaper for content with expensive
 * mount cost).
 */
import { ref } from 'vue';
import { SnCollapse, SnCollapseItem } from '@snui/vue-web';

const open = ref<Array<string | number>>(['1']);
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 24px; width: 100%; min-width: 0">
    <div>
      <p style="margin: 0 0 8px; font-size: 13px; color: var(--vp-c-text-2)">
        displayDirective="show" — DOM stays mounted, only display toggles
      </p>
      <SnCollapse v-model:expanded-names="open" display-directive="show" bordered>
        <SnCollapseItem title="Heavy DOM" name="1">
          <div
            style="
              height: 60px;
              background: linear-gradient(45deg, #f0f0ff, #fff0f0);
              border-radius: 4px;
            "
          ></div>
        </SnCollapseItem>
        <SnCollapseItem title="Heavy DOM 2" name="2">
          <div
            style="
              height: 60px;
              background: linear-gradient(45deg, #fff0f0, #f0fff0);
              border-radius: 4px;
            "
          ></div>
        </SnCollapseItem>
      </SnCollapse>
    </div>
  </div>
</template>
