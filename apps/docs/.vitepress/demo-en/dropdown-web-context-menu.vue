<script setup lang="ts">
/** Demo: SnDropdown — contextMenu trigger (right-click at pointer). */
import { SnDropdown } from '@snui/vue-web';
import { ref } from 'vue';
const options = [
  { label: 'Open', key: 'open' },
  { label: 'Rename', key: 'rename' },
  { type: 'divider' as const, key: 'd1' },
  { label: 'Delete', key: 'delete' },
];
const lastKey = ref('');
</script>

<template>
  <div>
    <p style="margin: 0 0 12px; font-size: 13px; color: var(--sn-web-color-text-secondary, #666)">
      Right-click the text below (select closes; right-click again re-anchors):
    </p>
    <SnDropdown trigger="contextMenu" :options="options" @select="(key) => (lastKey = String(key))">
      <p
        style="
          margin: 0;
          padding: 16px;
          border: 1px dashed var(--sn-web-color-border-subtle, #ddd);
          border-radius: 4px;
          line-height: 1.7;
          user-select: none;
        "
      >
        This paragraph has a context menu. Right-click it and the action menu opens at the pointer —
        the common pattern for file lists, cards and message bubbles.
      </p>
    </SnDropdown>
    <p v-if="lastKey" style="margin: 12px 0 0; font-size: 13px">Last selected: {{ lastKey }}</p>
  </div>
</template>
