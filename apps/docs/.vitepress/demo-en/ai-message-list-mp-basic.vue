<script setup lang="ts">
/**
 * Demo: message module (uni-app) — mobile layout of a single message.
 *
 * Renders reasoning collapse, tool row, attachment row, streaming cursor and error retry on uni.
 */
import SnAiMessage from '@snui/templates-src/uni/sn-ai-message.vue'
import type { SnAiMessage as SnAiMessageData } from '@snui/templates-src/shared/types'

const messages: SnAiMessageData[] = [
  {
    id: 'u1',
    role: 'user',
    status: 'idle',
    parts: [
      { type: 'text', text: 'Help me review this config' },
      { type: 'attachment', attachment: { id: 'a1', name: 'config.json', size: 1024, mime: 'application/json' } },
    ],
  },
  {
    id: 'a1',
    role: 'assistant',
    status: 'done',
    parts: [
      { type: 'thinking', text: 'Check the field naming and values.', done: true, durationMs: 1800 },
      { type: 'tool', name: 'read_file', status: 'done' },
      { type: 'text', text: 'Field naming is consistent; only the timeout is a bit short.' },
    ],
  },
  {
    id: 'a2',
    role: 'assistant',
    status: 'error',
    parts: [
      {
        type: 'error',
        error: { code: 'TIMEOUT', message: 'Request timed out', hint: 'Please retry', retryable: true },
      },
    ],
  },
]
</script>

<template>
  <div class="sn-demo sn-demo--message-mp">
    <SnAiMessage v-for="message in messages" :key="message.id" :message="message" />
  </div>
</template>

<style scoped>
.sn-demo--message-mp {
  max-width: 420px;
  padding: 0 var(--sn-mp-spacing-4);
  border: 1px solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-lg);
}
</style>
