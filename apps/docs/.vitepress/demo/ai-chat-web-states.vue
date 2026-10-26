<script setup lang="ts">
/**
 * Demo: AI 对话页 — 各状态场景。
 *
 * 把排队中、思考中、流式输出、已完成、失败、已停止六种状态一次性摆出来，
 * 便于对照每种状态下消息模块渲染的差异（等待行 / 光标 / 错误卡片 / 停止提示）。
 */
import { SnAiChat } from '@snui/templates-src/web/index';
import type { SnAiMessage } from '@snui/templates-src/shared/types';

const messages: SnAiMessage[] = [
  {
    id: 'd1',
    role: 'user',
    parts: [{ type: 'text', text: '帮我总结一下这份文档' }],
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
    parts: [{ type: 'thinking', text: '先通读全文，提取关键结论…', done: false }],
  },
  {
    id: 'd4',
    role: 'assistant',
    status: 'streaming',
    parts: [
      { type: 'thinking', text: '已确认文档结构。', done: true, durationMs: 2600 },
      { type: 'text', text: '这份文档主要讲了三件事：' },
    ],
  },
  {
    id: 'd5',
    role: 'assistant',
    status: 'done',
    parts: [
      { type: 'tool', name: 'search_docs', status: 'done', detail: '命中 3 处' },
      { type: 'text', text: '结论：模板把重复的页面结构收敛成了可安装的单元。' },
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
          message: '请求过于频繁',
          hint: '稍后重试，或切换到其他模型',
          retryable: true,
        },
      },
    ],
  },
  {
    id: 'd7',
    role: 'assistant',
    status: 'aborted',
    parts: [{ type: 'text', text: '这份文档主要讲了三件事，首先是' }],
  },
];
</script>

<template>
  <div class="sn-demo sn-demo--states">
    <SnAiChat :messages="messages" title="状态对照" :show-header="true" />
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
