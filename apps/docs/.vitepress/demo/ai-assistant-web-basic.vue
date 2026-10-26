<script setup lang="ts">
/**
 * Demo: AI 助手 — 统一模板（对话页 + 模型配置抽屉）。
 *
 * 页头右侧多出一个「模型配置」入口，点开是完整的模型配置面板；同时输入区的
 * 模型选择器与抽屉共用同一份厂商列表，切换后会立刻反映到两边。
 */
import { ref } from 'vue';
import { SnAiAssistant } from '@snui/templates-src/web/index';
import type { SnAiRunTurn } from '@snui/templates-src/web/SnAiChat.vue';
import type { SnAiMessage, SnAiModelParams, SnAiVendor } from '@snui/templates-src/shared/types';

const messages = ref<SnAiMessage[]>([]);
const modelId = ref('deep');
const params = ref<SnAiModelParams>({ temperature: 0.7, topP: 1, maxTokens: 4096, stream: true });
const testingVendorId = ref<string | undefined>(undefined);

const vendors = ref<SnAiVendor[]>([
  {
    id: 'v-local',
    name: '本地服务',
    baseUrl: 'https://api.example.com/v1',
    hasCredential: true,
    models: [
      { id: 'deep', name: 'Deep', vendorId: 'v-local', tags: ['推理'], supportsThinking: true },
      { id: 'fast', name: 'Fast', vendorId: 'v-local', tags: ['低延迟'] },
    ],
  },
]);

const models = [
  { id: 'deep', name: 'Deep', supportsThinking: true },
  { id: 'fast', name: 'Fast', supportsThinking: false },
];

/** 模拟连接测试：短暂展示加载态，用于说明 test-connection 的用法。 */
function onTest(payload: { vendorId: string }): void {
  testingVendorId.value = payload.vendorId;
  setTimeout(() => {
    testingVendorId.value = undefined;
  }, 1000);
}

/** 模拟运行器：先思考、再逐字输出，与真实接入的渲染路径一致。 */
const run: SnAiRunTurn = async (_turn, context) => {
  for (const chunk of ('先读取当前模型配置，' + '再用它组织这一轮回答。').match(/.{1,4}/g) ?? []) {
    await new Promise((resolve) => setTimeout(resolve, 40));
    if (context.signal.aborted) return;
    context.emit({ type: 'thinking', text: chunk });
  }
  context.emit({ type: 'thinking-end', durationMs: 900 });

  const answer = 'AI 助手模板把对话页与模型配置合成一个模板，点右上角的设置图标即可打开模型配置。';
  for (const chunk of answer.match(/.{1,3}/g) ?? []) {
    await new Promise((resolve) => setTimeout(resolve, 45));
    if (context.signal.aborted) return;
    context.emit({ type: 'text', text: chunk });
  }
};
</script>

<template>
  <div class="sn-demo sn-demo--assistant">
    <SnAiAssistant
      v-model:messages="messages"
      v-model:active-model-id="modelId"
      v-model:params="params"
      :run="run"
      :vendors="vendors"
      :models="models"
      :testing-vendor-id="testingVendorId"
      title="AI 助手"
      subtitle="对话 · 模型配置 · 按需组合"
      @test-connection="onTest"
    />
  </div>
</template>

<style scoped>
.sn-demo--assistant {
  height: 560px;
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: var(--sn-web-radius-lg);
  overflow: hidden;
}
</style>
