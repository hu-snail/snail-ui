<script setup lang="ts">
/**
 * Demo: 消息模块 — 独立嵌入。
 *
 * 消息模块可以不配对话页单独使用：这里只挂载消息列表，并给出每条消息的
 * 思考折叠、流式光标、工具行、附件行、错误卡片与停止提示。
 */
import { ref } from 'vue';
import { SnAiMessageList } from '@snui/templates-src/web/index';
import type { SnAiMessage } from '@snui/templates-src/shared/types';

const copied = ref('');

const messages: SnAiMessage[] = [
  {
    id: 'm1',
    role: 'user',
    status: 'idle',
    parts: [
      { type: 'text', text: '读一下 src/index.ts，然后说明它的导出结构' },
      {
        type: 'attachment',
        attachment: { id: 'a1', name: 'index.ts', size: 2048, mime: 'text/plain' },
      },
    ],
  },
  {
    id: 'm2',
    role: 'assistant',
    status: 'done',
    createdAt: 1,
    updatedAt: 3200,
    parts: [
      {
        type: 'thinking',
        text: '先看文件头部的注释，再逐个确认导出。',
        done: true,
        durationMs: 2400,
      },
      { type: 'tool', name: 'read_file', status: 'done', detail: 'src/index.ts' },
      { type: 'text', text: '该文件是包的公共入口，按组件、类型、工具函数三段组织导出。' },
    ],
  },
  {
    id: 'm3',
    role: 'assistant',
    status: 'streaming',
    parts: [
      { type: 'thinking', text: '正在核对第二个文件的导出是否重复…', done: false },
      { type: 'text', text: '另外，resolver 的组件清单需要与入口保持一致，' },
    ],
  },
];

function onCopy(message: SnAiMessage): void {
  copied.value = message.id;
  setTimeout(() => {
    copied.value = '';
  }, 1500);
}
</script>

<template>
  <div class="sn-demo sn-demo--messages">
    <SnAiMessageList
      :messages="messages"
      max-height="520px"
      empty-text="开始新的对话"
      empty-hint="在下方输入框输入你的问题"
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
