<script setup lang="ts">
/**
 * Demo: AI 对话页 — 完整对话流（含思考、流式输出、排队、停止）。
 *
 * 用一个本地模拟运行器驱动真实的流式折叠：先输出思考过程，再逐字输出答案，
 * 这样文档里的演示与真实接入时的渲染路径完全一致。
 */
import { ref } from 'vue';
import { SnAiChat } from '@snui/templates-src/web/index';
import type { SnAiRunTurn } from '@snui/templates-src/web/SnAiChat.vue';
import type { SnAiMessage } from '@snui/templates-src/shared/types';

const messages = ref<SnAiMessage[]>([]);

const agents = [
  { id: 'code', name: '代码助手', description: '擅长阅读与修改代码' },
  { id: 'doc', name: '文档助手', description: '整理与润色文档' },
];

const models = [
  { id: 'deep', name: 'Deep', supportsThinking: true, contextWindow: 128000 },
  { id: 'fast', name: 'Fast', supportsThinking: false, contextWindow: 32000 },
];

/** 模拟运行器：真实地走一遍思考 → 思考结束 → 逐字答案的流。 */
const run: SnAiRunTurn = async (_turn, context) => {
  const reasoning = '先确认用户想了解的是模板的接入方式，再组织回答。';
  for (const chunk of reasoning.match(/.{1,4}/g) ?? []) {
    await new Promise((resolve) => setTimeout(resolve, 40));
    if (context.signal.aborted) return;
    context.emit({ type: 'thinking', text: chunk });
  }
  context.emit({ type: 'thinking-end', durationMs: 1200 });

  const answer = 'AI 对话页模板已经把消息列表、输入框与排队调度组合好了，接入时只需传入 run 函数。';
  for (const chunk of answer.match(/.{1,3}/g) ?? []) {
    await new Promise((resolve) => setTimeout(resolve, 45));
    if (context.signal.aborted) return;
    context.emit({ type: 'text', text: chunk });
  }
};
</script>

<template>
  <div class="sn-demo sn-demo--chat">
    <SnAiChat
      v-model:messages="messages"
      :run="run"
      :agents="agents"
      :models="models"
      title="AI 助手"
      subtitle="思考 · 流式输出 · 消息排队"
    />
  </div>
</template>

<style scoped>
.sn-demo--chat {
  height: 520px;
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: var(--sn-web-radius-lg);
  overflow: hidden;
}
</style>
