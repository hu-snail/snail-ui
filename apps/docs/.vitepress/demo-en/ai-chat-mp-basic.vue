<script setup lang="ts">
/**
 * Demo: AI chat page (uni-app) — messages and reasoning output.
 *
 * The uni template shares the message contract with the web end; this static
 * transcript shows reasoning collapse, streaming cursor, error card and stop hint on mobile.
 */
import SnAiChat from '@snui/templates-src/uni/sn-ai-chat.vue'
import type { SnAiMessage } from '@snui/templates-src/shared/types'

const messages: SnAiMessage[] = [
  { id: 'u1', role: 'user', status: 'idle', parts: [{ type: 'text', text: 'What does this document cover?' }] },
  {
    id: 'a1',
    role: 'assistant',
    status: 'done',
    parts: [
      { type: 'thinking', text: 'Check the title and table of contents first.', done: true, durationMs: 2100 },
      { type: 'text', text: 'The document explains how to install the template and its on-demand loading conventions.' },
    ],
  },
  {
    id: 'a2',
    role: 'assistant',
    status: 'streaming',
    parts: [{ type: 'text', text: 'There is also another layer' }],
  },
]
</script>

<template>
  <div class="sn-demo sn-demo--chat-mp">
    <SnAiChat :messages="messages" title="AI assistant" placeholder="Type a message" />
  </div>
</template>

<style scoped>
.sn-demo--chat-mp {
  max-width: 420px;
  height: 560px;
  border: 1px solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-lg);
  overflow: hidden;
}
</style>
