<script setup lang="ts">
/**
 * Demo: 消息模块 — 独立嵌入。
 *
 * 消息模块可以不配对话页单独使用：这里只挂载消息列表，并给出每条消息的
 * 思考折叠、流式光标、工具行、附件行、错误卡片与停止提示。
 */
import { ref } from 'vue'
import { SnAiMessageList } from '@snui/templates-src/web/index'
import type { SnAiMessage } from '@snui/templates-src/shared/types'

const copied = ref('')

const messages: SnAiMessage[] = [
  {
    id: 'm1',
    role: 'user',
    status: 'idle',
    parts: [
      { type: 'text', text: 'Read src/index.ts and describe its export structure' },
      { type: 'attachment', attachment: { id: 'a1', name: 'index.ts', size: 2048, mime: 'text/plain' } },
    ],
  },
  {
    id: 'm2',
    role: 'assistant',
    status: 'done',
    createdAt: 1,
    updatedAt: 3200,
    parts: [
      { type: 'thinking', text: 'Check the header comment first, then verify the exports one by one.', done: true, durationMs: 2400 },
      { type: 'tool', name: 'read_file', status: 'done', detail: 'src/index.ts' },
      { type: 'text', text: 'This file is the public entry of the package, with exports organized into components, types, and utilities.' },
    ],
  },
  {
    id: 'm3',
    role: 'assistant',
    status: 'streaming',
    parts: [
      { type: 'thinking', text: 'Checking whether the second file has duplicate exports…', done: false },
      { type: 'text', text: 'Also, the component list in the resolver needs to stay in sync with the entry,' },
    ],
  },
]

function onCopy(message: SnAiMessage): void {
  copied.value = message.id
  setTimeout(() => {
    copied.value = ''
  }, 1500)
}
</script>

<template>
  <div class="sn-demo sn-demo--messages">
    <SnAiMessageList
      :messages="messages"
      max-height="520px"
      empty-text="Start a new conversation"
      empty-hint="Type your question in the input box below"
      @copy="onCopy"
    />
  </div>
</template>

<style scoped>
.sn-demo--messages {
  max-width: 760px;
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: var(--sn-web-radius-lg);
  background-color: var(--sn-web-color-background-surface);
  padding: 0 var(--sn-web-spacing-4);
}
</style>
