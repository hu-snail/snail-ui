<script setup lang="ts">
/**
 * Demo: 消息模块（uni-app）— 单条消息的移动端排版。
 *
 * 展示思考折叠、工具行、附件行、流式光标与错误重试在 uni 端的渲染。
 */
import SnAiMessage from '@snui/templates-src/uni/sn-ai-message.vue'
import type { SnAiMessage as SnAiMessageData } from '@snui/templates-src/shared/types'

const messages: SnAiMessageData[] = [
  {
    id: 'u1',
    role: 'user',
    status: 'idle',
    parts: [
      { type: 'text', text: '帮我看看这段配置' },
      { type: 'attachment', attachment: { id: 'a1', name: 'config.json', size: 1024, mime: 'application/json' } },
    ],
  },
  {
    id: 'a1',
    role: 'assistant',
    status: 'done',
    parts: [
      { type: 'thinking', text: '检查字段命名与取值。', done: true, durationMs: 1800 },
      { type: 'tool', name: 'read_file', status: 'done' },
      { type: 'text', text: '字段命名一致，只有超时时间偏短。' },
    ],
  },
  {
    id: 'a2',
    role: 'assistant',
    status: 'error',
    parts: [
      {
        type: 'error',
        error: { code: 'TIMEOUT', message: '请求超时', hint: '请重试', retryable: true },
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
