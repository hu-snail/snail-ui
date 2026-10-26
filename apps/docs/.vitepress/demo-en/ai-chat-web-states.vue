<script setup lang="ts">
/**
 * Demo: AI 对话页 — 各状态场景。
 *
 * 把排队中、思考中、流式输出、已完成、失败、已停止六种状态一次性摆出来，
 * 便于对照每种状态下消息模块渲染的差异（等待行 / 光标 / 错误卡片 / 停止提示）。
 */
import { SnAiChat } from '@snui/templates-src/web/index'
import type { SnAiMessage } from '@snui/templates-src/shared/types'

const messages: SnAiMessage[] = [
  {
    id: 'd1',
    role: 'user',
    parts: [{ type: 'text', text: 'Summarize this document for me' }],
    status: 'idle',
  },
  {
    id: 'd2',
    role: 'assistant',
    status: 'queued',
    parts: [],
  },
  {
    id: 'd3',
    role: 'assistant',
    status: 'thinking',
    parts: [{ type: 'thinking', text: 'Read the full text first and pull out the key takeaways…', done: false }],
  },
  {
    id: 'd4',
    role: 'assistant',
    status: 'streaming',
    parts: [
      { type: 'thinking', text: 'Document structure confirmed.', done: true, durationMs: 2600 },
      { type: 'text', text: 'This document mainly covers three things:' },
    ],
  },
  {
    id: 'd5',
    role: 'assistant',
    status: 'done',
    parts: [
      { type: 'tool', name: 'search_docs', status: 'done', detail: '3 hits' },
      { type: 'text', text: 'Conclusion: the template turns repeated page structure into installable units.' },
    ],
  },
  {
    id: 'd6',
    role: 'assistant',
    status: 'error',
    parts: [
      {
        type: 'error',
        error: {
          code: 'RATE_LIMITED',
          message: 'Too many requests',
          hint: 'Retry later, or switch to another model',
          retryable: true,
        },
      },
    ],
  },
  {
    id: 'd7',
    role: 'assistant',
    status: 'aborted',
    parts: [{ type: 'text', text: 'This document mainly covers three things. First,' }],
  },
]
</script>

<template>
  <div class="sn-demo sn-demo--states">
    <SnAiChat :messages="messages" title="Status comparison" :show-header="true" />
  </div>
</template>

<style scoped>
.sn-demo--states {
  height: 640px;
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: var(--sn-web-radius-lg);
  overflow: hidden;
}
</style>
