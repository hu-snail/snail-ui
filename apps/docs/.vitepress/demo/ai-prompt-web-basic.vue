<script setup lang="ts">
/**
 * Demo: AI 输入框 — 完整工具条。
 *
 * 覆盖附件面板、智能体 / 权限 / 模型选择器、思考程度拉条、发送与停止切换，
 * 以及待发送消息队列。点击发送后会真的进入排队状态，便于观察排队行的渲染。
 */
import { ref } from 'vue'
import { SnAiPrompt } from '@snui/templates-src/web/index'
import type { SnAiQueuedTurn } from '@snui/templates-src/shared/types'

const text = ref('')
const attachments = ref<{ id: string; name: string; size: number; mime: string }[]>([])
const agentId = ref('code')
const permission = ref<'read-only' | 'ask' | 'auto-edit' | 'full-access'>('ask')
const modelId = ref('deep')
const thinkingLevel = ref<'off' | 'low' | 'medium' | 'high' | 'max'>('medium')
const active = ref(false)
const queue = ref<SnAiQueuedTurn[]>([])

const agents = [
  { id: 'code', name: '代码助手', description: '擅长阅读与修改代码' },
  { id: 'doc', name: '文档助手', description: '整理与润色文档' },
]

const models = [
  { id: 'deep', name: 'Deep', supportsThinking: true, contextWindow: 128000 },
  { id: 'fast', name: 'Fast', supportsThinking: false, contextWindow: 32000 },
]

/** 模拟一次真实上传：把选中的文件登记为附件。 */
function onAttach(files: File[]): void {
  attachments.value = [
    ...attachments.value,
    ...files.map((file, index) => ({
      id: `f-${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      mime: file.type,
    })),
  ]
}

/** 模拟发送：第一条进入运行态，后续进入排队，便于观察两种渲染。 */
function onSend(turn: SnAiQueuedTurn): void {
  if (active.value) {
    queue.value = [...queue.value, turn]
    return
  }
  active.value = true
  setTimeout(() => {
    active.value = false
    const [next, ...rest] = queue.value
    queue.value = rest
    if (next) onSend(next)
  }, 1800)
}

function onStop(): void {
  active.value = false
}

function onRemoveQueued(id: string): void {
  queue.value = queue.value.filter((turn) => turn.id !== id)
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
      <template #hint>Enter 发送 · Shift + Enter 换行 · 运行时再次发送会进入排队</template>
    </SnAiPrompt>
  </div>
</template>

<style scoped>
.sn-demo--prompt {
  max-width: 720px;
}
</style>
