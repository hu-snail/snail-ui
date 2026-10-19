# AI 对话页 sn-ai-chat

uni-app 端的 AI 对话页：转录区、输入区、排队调度与中断控制。与 Web 端共用同一份消息契约。

## 何时使用

- 在小程序 / H5 / App 中需要一个完整的 AI 对话页面
- 已经用 Web 端跑通了后端接入，希望两端复用同一套数据结构
- 需要消息排队与中断控制

## 安装与按需加载

```ts
import { SnAiChat } from '@snui/templates/uni/chat'
```

样式随包提供：

```ts
import '@snui/templates/styles'
```

## 代码演示

### 消息与思考输出

以静态转录展示思考折叠、流式光标、错误卡片与停止提示在移动端的排版。

<Demo name="ai-chat-mp-basic" description="uni 端与 Web 端共用消息契约，排版按移动端尺寸呈现。" />

## 接入方式

与 Web 端一致：传入运行函数，把流式增量喂给 `emit`。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SnAiChat } from '@snui/templates/uni/chat'
import type { SnAiRunTurn } from '@snui/templates/uni/chat'
import type { SnAiMessage } from '@snui/templates/uni'

const messages = ref<SnAiMessage[]>([])

const run: SnAiRunTurn = async (turn, { signal, emit }) => {
  const task = uni.request({
    url: '/api/chat',
    method: 'POST',
    data: { prompt: turn.text },
  })
  // 按平台能力把增量交给 emit；signal 触发时中断请求
  for await (const chunk of chunksOf(task)) {
    emit({ type: 'text', text: chunk })
  }
}
</script>

<template>
  <SnAiChat v-model:messages="messages" :run="run" title="AI 助手" />
</template>
```

## API

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `messages` | `SnAiMessage[]` | `undefined` | 转录内容，按时间从旧到新。配合 `v-model:messages` 使用。 |
| `run` | `SnAiRunTurn` | `undefined` | 运行一轮对话的函数。 |
| `title` | `string` | `'AI 助手'` | 页头标题。 |
| `placeholder` | `string` | `'输入消息'` | 输入框占位文案。 |
| `disabled` | `boolean` | `false` | 禁用整页。 |
| `allowQueue` | `boolean` | `true` | 运行中再次发送是否进入排队。 |
| `showHeader` | `boolean` | `true` | 是否渲染页头。 |
| `loading` | `boolean` | `false` | 加载中，显示加载文案。 |

### Events

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `update:messages` | `SnAiMessage[]` | 转录变化。 |
| `turn-start` | `SnAiQueuedTurn` | 一轮开始运行。 |
| `turn-end` | `{ turn, message }` | 一轮结束。 |
| `error` | `{ turn, error }` | 一轮失败，`error` 为结构化错误。 |
| `retry` | `SnAiMessage` | 用户请求重试。 |

## 与 Web 端的差异

| 方面 | 说明 |
| --- | --- |
| 元素 | 使用 `<view>` / `<text>` / `<scroll-view>` 等跨端元素 |
| 单位 | 尺寸走 rpx 别名，保证在不同设备上等比缩放 |
| 输入 | 使用原生 `input` 的 `confirm` 事件触发发送 |
| 契约 | 消息、流式增量、错误结构完全一致 |

## 无障碍与中断

- 发送与停止按钮的可访问名称随状态切换
- 页面卸载时中止仍在运行的轮次
