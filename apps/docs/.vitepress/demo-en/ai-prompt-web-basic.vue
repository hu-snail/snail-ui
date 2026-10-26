<script setup lang="ts">
/**
 * Demo: AI 输入框 — 完整工具条。
 *
 * 覆盖附件面板、智能体 / 权限 / 模型选择器、思考程度拉条、发送与停止切换，
 * 以及待发送消息队列。附件既可来自面板，也可直接粘贴图片 / 文件；上传完成后
 * 附件带缩略图，点击即可预览。点击发送后会真的进入排队状态，便于观察排队行。
 */
import { onBeforeUnmount, ref } from 'vue';
import { SnAiPrompt } from '@snui/templates-src/web/index';
import type { SnAiAttachment, SnAiQueuedTurn } from '@snui/templates-src/shared/types';

const text = ref('');
const attachments = ref<SnAiAttachment[]>([]);
const agentId = ref('code');
const permission = ref<'read-only' | 'ask' | 'auto-edit' | 'full-access'>('ask');
const modelId = ref('deep');
const thinkingLevel = ref<'off' | 'low' | 'medium' | 'high' | 'max'>('medium');
const active = ref(false);
const queue = ref<SnAiQueuedTurn[]>([]);

const agents = [
  { id: 'code', name: 'Code assistant', description: 'Great at reading and editing code' },
  { id: 'doc', name: 'Docs assistant', description: 'Organize and polish documents' },
];

const models = [
  { id: 'deep', name: 'Deep', supportsThinking: true, contextWindow: 128000 },
  { id: 'fast', name: 'Fast', supportsThinking: false, contextWindow: 32000 },
];

/** 预览用的对象 URL；卸载时统一回收，免得多跑一次上传就多留一份 blob。 */
const objectUrls: string[] = [];

/**
 * 模拟一次真实上传：给每个文件建一个对象 URL 并标记为已完成，附件因此可以点击
 * 预览（图片走灯箱，其它文件在新标签页打开）。
 */
function onAttach(files: File[]): void {
  attachments.value = [
    ...attachments.value,
    ...files.map((file, index) => {
      const url = URL.createObjectURL(file);
      objectUrls.push(url);
      return {
        id: `f-${Date.now()}-${index}`,
        name: file.name,
        size: file.size,
        mime: file.type,
        url,
        status: 'done' as const,
      };
    }),
  ];
}

onBeforeUnmount(() => {
  for (const url of objectUrls) URL.revokeObjectURL(url);
  objectUrls.length = 0;
});

/** 模拟发送：第一条进入运行态，后续进入排队，便于观察两种渲染。 */
function onSend(turn: SnAiQueuedTurn): void {
  if (active.value) {
    queue.value = [...queue.value, turn];
    return;
  }
  active.value = true;
  setTimeout(() => {
    active.value = false;
    const [next, ...rest] = queue.value;
    queue.value = rest;
    if (next) onSend(next);
  }, 1800);
}

function onStop(): void {
  active.value = false;
}

function onRemoveQueued(id: string): void {
  queue.value = queue.value.filter((turn) => turn.id !== id);
}
</script>

<template>
  <div class="sn-demo sn-demo--prompt">
    <SnAiPrompt
      v-model="text"
      v-model:attachments="attachments"
      v-model:agent-id="agentId"
      v-model:permission="permission"
      v-model:model-id="modelId"
      v-model:thinking-level="thinkingLevel"
      :agents="agents"
      :models="models"
      :active="active"
      :queued="queue"
      @attach="onAttach"
      @send="onSend"
      @stop="onStop"
      @remove-queued="onRemoveQueued"
    >
      <template #hint
        >Enter to send · Shift + Enter for a newline · sending again while running queues the
        turn</template
      >
    </SnAiPrompt>
  </div>
</template>

<style scoped>
.sn-demo--prompt {
  max-width: 720px;
}
</style>
