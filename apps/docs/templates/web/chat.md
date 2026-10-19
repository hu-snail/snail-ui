# AI 对话页 AiChat

一整页可用的 AI 对话界面：消息列表、输入框、排队调度与中断控制已经组合好。安装后传入一个「运行一轮对话」的函数即可跑起来。

## 何时使用

- 需要从零搭一个 AI 对话页，不想重复实现消息渲染与流式折叠
- 已有后端接口，只需要一个把流式增量接到界面上的容器
- 需要消息排队（上一条还在生成时，后续消息排队等待）

## 安装与按需加载

模板是独立的子路径导出，只加载你实际挂载的那一个：

```ts
// 只要对话页
import { SnAiChat } from '@snui/templates/web/chat'

// 需要多个模板时再引整包
import { SnAiChat, SnAiPrompt } from '@snui/templates/web'
```

样式随包一起提供，在应用入口引一次即可：

```ts
import '@snui/templates/styles'
```

## 代码演示

### 完整对话流

演示里的运行函数会真实地先输出思考过程、再逐字输出答案，因此你看到的就是接入真实接口后的渲染路径。

<Demo name="ai-chat-web-basic" description="思考输出 → 逐字流式 → 完成；运行时再次发送会进入排队。" />

### 各状态对照

排队中、思考中、流式输出、已完成、失败、已停止六种状态一次性摆开，便于核对每种状态下的界面差异。

<Demo name="ai-chat-web-states" description="等待行、流式光标、工具行、错误卡片与停止提示的状态对照。" />

## 接入方式

模板把「什么时候能开始一轮」这件事收在自己手里，宿主机只需要提供运行函数：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SnAiChat } from '@snui/templates/web/chat'
import type { SnAiRunTurn } from '@snui/templates/web/chat'
import type { SnAiMessage } from '@snui/templates/web'

const messages = ref<SnAiMessage[]>([])

/** 收到一轮请求，把流式增量喂给 emit，返回即代表这一轮结束。 */
const run: SnAiRunTurn = async (turn, { signal, emit }) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ prompt: turn.text, model: turn.modelId }),
    signal,
  })
  for await (const chunk of streamOf(response)) {
    if (chunk.type === 'reasoning') emit({ type: 'thinking', text: chunk.text })
    else emit({ type: 'text', text: chunk.text })
  }
  emit({ type: 'thinking-end', durationMs: 3200 })
}
</script>

<template>
  <SnAiChat v-model:messages="messages" :run="run" title="AI 助手" />
</template>
```

`run` 收到三样东西：

| 成员 | 类型 | 说明 |
| --- | --- | --- |
| `turn` | `SnAiQueuedTurn` | 这一轮的输入：文本、附件、以及发送时选中的智能体 / 权限 / 模型 / 思考程度。 |
| `signal` | `AbortSignal` | 用户点「停止」或页面卸载时触发，务必透传给请求。 |
| `emit` | `(delta) => void` | 把流式增量交给模板折叠；返回后这一轮即结束。 |

流式增量的四种形态：

| delta | 说明 |
| --- | --- |
| `{ type: 'thinking', text }` | 追加思考文本。答案开始后再次出现会另起一个思考块。 |
| `{ type: 'thinking-end', durationMs? }` | 结束当前思考块，并记录耗时。 |
| `{ type: 'text', text }` | 追加答案文本。 |
| `{ type: 'tool', name, status, detail? }` | 记录一次工具调用；同名且状态为 `running` 的行会被后续状态就地更新。 |

## API

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `messages` | `SnAiMessage[]` | `[]` | 转录内容，按时间从旧到新。配合 `v-model:messages` 使用。 |
| `run` | `SnAiRunTurn` | `undefined` | 运行一轮对话的函数。未传入时页面仍可渲染，但会以 `NO_RUNNER` 报错。 |
| `agents` | `SnAiAgent[]` | `[]` | 输入框智能体选择器可选的智能体。 |
| `permissions` | `SnAiPermissionOption[]` | `undefined` | 权限选项；不传时使用内置的四个标准档位。 |
| `models` | `SnAiModel[]` | `[]` | 模型选择器可选的模型。 |
| `vendors` | `SnAiVendor[]` | `[]` | 模型所属厂商，用于给模型补充来源信息。 |
| `theme` | `string` | `'default'` | 风格包标识，映射到风格包体系。 |
| `title` | `string` | `'AI 助手'` | 页头标题。 |
| `subtitle` | `string` | `undefined` | 页头副标题。 |
| `disabled` | `boolean` | `false` | 禁用整页。 |
| `allowQueue` | `boolean` | `true` | 运行中再次发送是否进入排队；关闭后多余提交会被丢弃。 |
| `showHeader` | `boolean` | `true` | 是否渲染页头。 |
| `loading` | `boolean` | `false` | 历史记录加载中，消息列表显示骨架行。 |
| `rememberSelection` | `boolean` | `true` | 是否在轮次之间保留智能体 / 模型的选择。 |

### Events

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `update:messages` | `SnAiMessage[]` | 转录变化（新增轮次、流式增量、状态变更）。 |
| `turn-start` | `SnAiQueuedTurn` | 一轮开始运行。 |
| `turn-end` | `{ turn, message }` | 一轮结束（正常、失败或被停止）。 |
| `error` | `{ turn, error }` | 一轮失败，`error` 为结构化错误。 |
| `retry` | `SnAiMessage` | 用户请求重试某条失败的消息。 |
| `update:modelId` | `string` | 用户切换了模型。 |
| `update:agentId` | `string` | 用户切换了智能体。 |

### Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `header-actions` | — | 页头右侧的操作区。 |
| `transcript` | `{ messages, empty }` | 替换整个转录区域。 |
| `toolbar` | — | 透传给输入框的额外工具条内容。 |

### 类型导出

| 名称 | 说明 |
| --- | --- |
| `SnAiRunTurn` | 运行函数签名。 |
| `SnAiMessage` / `SnAiQueuedTurn` / `SnAiError` 等 | 从 `@snui/templates` 重新导出，供宿主机构造数据。 |

## 无障碍

- 页头为语义化标题结构，转录区每行带 `data-status`，便于读屏与测试定位
- 输入框、发送、停止等控件的可访问名称由输入框模板提供
- 运行中发送按钮切换为停止，其可访问名称同步变化

## 中断与回收

- 用户点「停止」会中止 `signal`，该轮标记为「已停止」并保留已生成内容
- 页面卸载时会中止仍在运行的轮次，不会让请求游离在页面之外
