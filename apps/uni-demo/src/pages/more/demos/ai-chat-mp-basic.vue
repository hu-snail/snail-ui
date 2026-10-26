<script setup lang="ts">
/**
 * Demo: AI 对话页（uni-app）— 消息与思考输出。
 *
 * uni 端模板与 web 端共用同一份消息契约，这里以静态转录展示思考折叠、
 * 流式光标、错误卡片与停止提示在移动端的排版。
 */
import SnAiChat from '@snui/templates-src/uni/sn-ai-chat.vue';
import type { SnAiMessage } from '@snui/templates-src/shared/types';

const messages: SnAiMessage[] = [
  { id: 'u1', role: 'user', status: 'idle', parts: [{ type: 'text', text: '这份文档讲了什么？' }] },
  {
    id: 'a1',
    role: 'assistant',
    status: 'done',
    parts: [
      { type: 'thinking', text: '先看标题与目录。', done: true, durationMs: 2100 },
      { type: 'text', text: '文档说明了模板的安装方式与按需加载约定。' },
    ],
  },
  {
    id: 'a2',
    role: 'assistant',
    status: 'streaming',
    parts: [{ type: 'text', text: '另外还有一层' }],
  },
];
</script>

<template>
  <view class="sn-demo sn-demo--chat-mp">
    <SnAiChat :messages="messages" title="AI 助手" placeholder="输入消息" />
  </view>
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
