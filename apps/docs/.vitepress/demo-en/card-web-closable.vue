<script setup lang="ts">
/**
 * card-web-closable — SnCard with `closable: true` + close event emission.
 */
import { ref } from 'vue'
import { SnCard } from '@snui/vue-web'

const visible = ref(true)
const lastClose = ref<string | null>(null)
</script>

<template>
  <div>
    <SnCard
      v-if="visible"
      title="Closable card"
      closable
      style="max-width:360px;"
      aria-label="Closable example"
      @close="lastClose = new Date().toLocaleTimeString()"
    >
      <p>The × button at the right of the card header closes the card. `closable` is false by default.</p>
      <p style="margin:8px 0 0;color:var(--vp-c-text-2);font-size:13px;">
        Last closed: {{ lastClose ?? '(not closed yet)' }}
      </p>
    </SnCard>
    <div v-else style="padding:12px;border:1px dashed var(--vp-c-divider);border-radius:6px;color:var(--vp-c-text-2);font-size:13px;">
      Closed.
      <button style="margin-left:8px;color:var(--sn-web-color-action-primary);background:none;border:none;cursor:pointer;" @click="visible = true">
        Reset
      </button>
    </div>
  </div>
</template>