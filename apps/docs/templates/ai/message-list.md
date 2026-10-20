# 消息列表 AiMessageList / sn-ai-message

对话转录的展示模块：消息气泡、思考过程折叠、流式输出、工具调用行、附件行、错误提示与重试。Web 端同时提供列表容器与单条渲染器，uni-app 端提供单条渲染器，两端共用同一份消息结构。

> 平台：`Web`（`SnAiMessageList` + 单条 `SnAiMessage`，来自 `@snui/templates/web/message-list`） / `uni-app`（单条 `SnAiMessage`，来自 `@snui/templates/uni/message-list`）

## 何时使用

- 需要把一段对话记录渲染成可读的转录区
- 需要「思考过程」在生成时展开、生成结束后自动收起
- 需要在流式输出时自动跟随最新内容，但用户向上翻阅时不要被拉回底部
- 需要把单条消息渲染到列表之外：引用某条回复、在卡片里做预览、做导出预览
- 需要在 uni-app 里复用同一份消息结构（本页同时覆盖两端）

## 安装与按需加载

样式**按模板**产出：引一个模板只带上它自己的 JS 与它自己的 CSS，不存在「所有模板的样式桶」。三件事：

```ts
// 1) 只导入用到的那个模板：它的 JS 和它自己的样式会一起被带上
import { SnAiMessageList, SnAiMessage } from '@snui/templates/web/message-list'

// 2) 共享 token 层在应用入口导入一次
import '@snui/templates/styles'

// 3) 需要自己控制代码分割时，也可以单独引某个模板的样式文件
import '@snui/templates/styles/web-message-list.css'
```

uni-app 端同理：

```ts
import { SnAiMessage } from '@snui/templates/uni/message-list'
import '@snui/templates/styles'
import '@snui/templates/styles/uni-message-list.css'
```

每个模板的样式文件（都在 `@snui/templates/styles/` 下）：

| 文件 | 对应模板 |
| --- | --- |
| `web-message-list.css` | `@snui/templates/web/message-list` |
| `uni-message-list.css` | `@snui/templates/uni/message-list` |
| `web-assistant.css` | `@snui/templates/web/assistant` |
| `web-chat.css` | `@snui/templates/web/chat` |
| `web-prompt.css` | `@snui/templates/web/prompt` |
| `web-model-config.css` | `@snui/templates/web/model-config` |
| `uni-chat.css` | `@snui/templates/uni/chat` |

引 `web-message-list.css` **不会**带上输入框、对话页、模型配置等其他模板的规则；共享的 token 层只有一份（第 2 步），再引第二个模板时不会重复下载。

`SnAiMessage` 是单条消息的渲染器，可以脱离列表单独使用（例如引用某条回复、或在卡片里做预览）。

## 快速开始

最小可运行版本：一个静态转录。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SnAiMessageList } from '@snui/templates/web/message-list'
import type { SnAiMessage } from '@snui/templates/web'

const messages = ref<SnAiMessage[]>([
  {
    id: 'u1',
    role: 'user',
    status: 'done',
    parts: [{ type: 'text', text: '帮我总结一下这份文档。' }],
  },
  {
    id: 'a1',
    role: 'assistant',
    status: 'done',
    parts: [
      { type: 'thinking', text: '先读取目录，再抓每节标题。', done: true, durationMs: 2400 },
      { type: 'tool', name: 'read_file', status: 'done', detail: 'spec.md' },
      { type: 'text', text: '文档共三节：定位、契约、接入。' },
    ],
  },
])

function onRetry(message: SnAiMessage): void {
  console.info('请求重试：', message.id)
}
</script>

<template>
  <SnAiMessageList :messages="messages" @retry="onRetry" />
</template>
```

## 完整接入示例

转录区通常和流式请求成对出现：一边接收增量、一边折进消息数组。下面是最小可用的一版——自己按增量更新 `parts`，而不是从头解析整段文本。

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { SnAiMessageList, SnAiMessage as SnAiMessageRow } from '@snui/templates/web/message-list'
import type { SnAiError, SnAiMessage, SnAiQueuedTurn } from '@snui/templates/web'

const messages = ref<SnAiMessage[]>([])
const running = ref(false)
const quoted = ref<SnAiMessage | undefined>(undefined)
let controller: AbortController | null = null

/** 把一轮请求折进转录：思考块先长，答案随后。 */
async function run(turn: SnAiQueuedTurn): Promise<void> {
  const replyId = `${turn.id}-reply`
  messages.value = [
    ...messages.value,
    { id: turn.id, role: 'user', status: 'done', parts: [{ type: 'text', text: turn.text }] },
    {
      id: replyId,
      role: 'assistant',
      status: 'thinking',
      parts: [{ type: 'thinking', text: '', done: false }],
    },
  ]

  const abort = new AbortController()
  controller = abort
  running.value = true

  /** 找到本轮那条助手消息并就地更新（保持数组引用不变时也能触发重渲染）。 */
  function patch(update: (message: SnAiMessage) => void): void {
    const next = [...messages.value]
    const index = next.findIndex((message) => message.id === replyId)
    if (index === -1) return
    const copy = { ...next[index], parts: [...next[index].parts] }
    update(copy)
    next[index] = copy
    messages.value = next
  }

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prompt: turn.text, modelId: turn.modelId }),
      signal: abort.signal,
    })
    const reader = response.body!.getReader()
    const decoder = new TextDecoder()
    for (;;) {
      const { value, done } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      patch((message) => {
        const last = message.parts[message.parts.length - 1]
        if (last?.type === 'text') last.text += chunk
        else message.parts.push({ type: 'text', text: chunk })
        message.status = 'streaming'
      })
    }
    patch((message) => {
      const thinking = message.parts.find((part) => part.type === 'thinking')
      if (thinking?.type === 'thinking') thinking.done = true
      message.status = 'done'
    })
  } catch (cause) {
    patch((message) => {
      if (abort.signal.aborted) {
        message.status = 'aborted'
        return
      }
      const error: SnAiError = { code: 'REQUEST_FAILED', message: String(cause), retryable: true }
      message.status = 'error'
      message.error = error
      message.parts.push({ type: 'error', error })
    })
  } finally {
    running.value = false
    controller = null
  }
}

/** 重试就是拿原来的那一轮再跑一次。 */
function onRetry(message: SnAiMessage): void {
  const index = messages.value.findIndex((item) => item.id === message.id)
  const part = messages.value[index - 1]?.parts.find((item) => item.type === 'text')
  messages.value = messages.value.filter((item) => item.id !== message.id)
  if (part?.type === 'text') {
    void run({ id: message.id, text: part.text, attachments: [], createdAt: Date.now() })
  }
}

onBeforeUnmount(() => controller?.abort())

const quotedText = computed(() => {
  const part = quoted.value?.parts.find((item) => item.type === 'text')
  return part?.type === 'text' ? part.text : ''
})
</script>

<template>
  <div class="thread">
    <SnAiMessageList
      :messages="messages"
      :loading="running"
      :auto-scroll="true"
      max-height="60vh"
      @retry="onRetry"
      @copy="(message) => (quoted = message)"
    />

    <!-- 单条渲染器脱离列表使用：引用条 -->
    <aside v-if="quoted" class="quoted">
      <SnAiMessageRow :message="quoted" :show-copy="false" :show-thinking="false" />
      <p class="quoted__hint">已引用：{{ quotedText.slice(0, 40) }}</p>
    </aside>
  </div>
</template>
```

## 代码演示

### 独立嵌入

只挂载消息列表，不配输入框，展示思考折叠、工具行、附件行与流式光标。

<Demo name="ai-message-list-web-basic" description="思考折叠 + 工具行 + 附件行 + 流式光标的组合。" />

### uni-app 端单条消息

uni 端提供的是单条渲染器，展示思考折叠、工具行、附件行、流式光标与错误重试在移动端的渲染。

<Demo name="ai-message-list-mp-basic" description="思考折叠 + 工具行 + 附件行 + 错误重试。" />

## API

### Props

`SnAiMessageList`：

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `messages` | `SnAiMessage[]` | `[]` | 转录内容，按时间从旧到新。 |
| `loading` | `boolean` | `false` | 加载中，显示骨架行。 |
| `loadingRows` | `number` | `3` | 骨架行数量。 |
| `emptyText` | `string` | `'开始新的对话'` | 空状态主文案。 |
| `emptyHint` | `string` | `'在下方输入框输入你的问题'` | 空状态副文案。 |
| `autoScroll` | `boolean` | `true` | 是否自动跟随最新输出。 |
| `showCopy` | `boolean` | `true` | 完成的消息是否提供复制。 |
| `showThinking` | `boolean` | `true` | 生成结束后是否仍保留思考块。 |
| `maxHeight` | `string` | `undefined` | 滚动区最大高度；不设时撑满父容器。 |
| `stickThreshold` | `number` | `48` | 距底部多少像素内仍算「贴底」，超出后才不再自动跟随。 |

单条 `SnAiMessage`：

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `message` | `SnAiMessage` | 必填 | 要渲染的消息。 |
| `copied` | `boolean` | `false` | 复制按钮是否显示「已复制」。 |
| `showThinking` | `boolean` | `true` | 是否保留思考块。 |
| `showCopy` | `boolean` | `true` | 是否提供复制。 |

`SnAiThinking`（思考块本体，可单独使用）：

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `part` | `SnAiThinkingPart` | 必填 | 要渲染的思考块。 |
| `expanded` | `boolean` | `undefined` | 展开状态；`undefined` 表示自动——生成中展开、结束后收起。 |
| `defaultCollapsed` | `boolean` | `false` | 强制收起，优先级高于 `expanded`。 |

### Events

`SnAiMessageList`：

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `retry` | `SnAiMessage` | 用户点击了某条失败消息的重试。 |
| `copy` | `SnAiMessage` | 用户复制了某条消息的答案。 |
| `reach-bottom` | — | 用户滚动到了转录区底部。 |

单条 `SnAiMessage`：`retry`、`copy`（参数同上）。

### Slots

`SnAiMessageList`：

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `empty` | — | 自定义空状态。 |

单条 `SnAiMessage`：

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `avatar` | — | 替换头像区（不传时用角色默认头像）。 |

### 类型导出

| 名称 | 来源 | 说明 |
| --- | --- | --- |
| `SnAiMessageList` / `SnAiMessage` / `SnAiThinking` | `@snui/templates/web/message-list` | 列表、单条、思考块三个渲染器。 |
| `SnAiMessage` / `SnAiMessagePart` / `SnAiThinkingPart` 等 | `@snui/templates` | 共享契约类型，供宿主机构造数据。 |

### 消息结构

一条消息由若干「内容块」按顺序组成，渲染顺序与数组顺序一致：

| 内容块 | 说明 |
| --- | --- |
| `thinking` | 思考过程。生成时展开并显示「思考中」，结束后收起并显示耗时。 |
| `text` | 答案正文。流式输出时行尾显示光标。 |
| `tool` | 工具调用行。`running` 显示转圈，`done` / `error` 显示结果状态。 |
| `attachment` | 附件行，回显用户上传的文件。 |
| `error` | 错误卡片，含错误码、提示与重试按钮。 |

一条消息的状态决定它整体呈现成什么样：

| 状态 | 呈现 |
| --- | --- |
| `idle` | 用户 / 系统消息的静止状态，直接渲染正文。 |
| `queued` | 显示「排队中，等待上一条回复完成」。 |
| `thinking` | 思考块实时展开；尚无正文时显示「正在思考…」。 |
| `streaming` | 正文逐字增长并带光标。 |
| `done` | 完整正文，并提供复制。 |
| `error` | 错误卡片替换正文尾部。 |
| `aborted` | 保留已生成内容，并追加「已停止生成」提示。 |

## 主题与 token 定制

这两个渲染器都不收 `theme` prop：它们继承应用级别的风格包（祖先里的 `SnConfigProvider`，或应用入口挂的风格包），消费的 `--sn-web-*` 别名随风格包变化。

```vue
<SnConfigProvider skin="ios">
  <SnAiMessageList :messages="messages" />
</SnConfigProvider>
```

只改转录区的观感时，直接覆盖 `--sn-web-*` 别名：

```css
/* 列表根节点上的细粒度覆盖 */
.sn-ai-message-list {
  --sn-web-color-background-subtle: #f6f3ec;
  --sn-web-color-text-secondary: #5b564d;
  --sn-web-spacing-4: 18px;
}
```

uni 端覆盖 `--sn-mp-*`（尺寸 token 是 rpx）：

```css
.sn-ai-message {
  --sn-mp-color-background-subtle: #f6f3ec;
}
```

## 端差异

两端内容块与状态语义完全一致，差异在结构与能力：

| 方面 | Web（`SnAiMessageList` / `SnAiMessage`） | uni-app（`SnAiMessage`） |
| --- | --- | --- |
| 提供的东西 | 列表容器 + 单条渲染器 + 思考块，各自可单独使用 | 只有单条渲染器，列表由页面自己 `v-for` |
| 元素 | `<div>` / `<ul>` / `<li>` 等标准标签 | `<view>` / `<text>` 等跨端元素 |
| 单位 | px 级别的 `--sn-web-*` token | `--sn-mp-*` token，尺寸为 rpx |
| 滚动 | 自带滚动区与「回到最新」按钮，`maxHeight` / `stickThreshold` 可调 | 不含滚动区，由 uni 对话页的 `<scroll-view scroll-y>` 负责 |
| 空状态 | 有 `emptyText` / `emptyHint` / `empty` 插槽 | 无空状态（由 uni 对话页渲染） |
| 复制 | `showCopy` + `copy` 事件 + `copied` 状态 | 无复制能力 |
| 头像 | 有 `avatar` 插槽 | 无头像插槽 |
| 图标 | 复用同一份路径数据，由 `SnIcon` 渲染 | 复用同一份路径数据，由 `sn-icon` 渲染 |
| 契约 | `SnAiMessage` / 内容块 / 状态定义来自 `@snui/templates` 共享层 | 同左 |

## 无障碍

- 每条消息带 `data-status`，读屏与自动化测试可据此定位状态
- 思考块的展开按钮带 `aria-expanded`，其状态与内容可见性一致；头部同时给出「思考中」或耗时文本
- 重试、复制等按钮都有可访问名称
- 错误卡片以文本给出错误码与提示，不只靠颜色区分

## 中断与资源回收

- 列表在 `onMounted` 创建滚动观测器，`onBeforeUnmount` 断开，不会残留
- 「已复制」提示由一个定时器驱动，组件卸载时会清除，不会在卸载后改写状态
- 转录区本身不发请求：中断与资源回收由宿主机（或 [AI 对话页](/templates/ai/chat)）负责，`retry` 只是把意图交出去
- `messages` 是受控数据，组件不缓存副本，因此替换整个数组不会留下幽灵消息

## 常见问题

**Q：向上翻阅时为什么不再自动滚动？**
这是有意行为：列表底部放了一个观测点，观测点可见表示读者正在底部；一旦向上翻阅，观测点离开视野，视图就不再被拉回底部，右下角会出现回到最新消息的按钮。可用 `stickThreshold` 调整「算贴底」的宽容度。

**Q：思考块结束后还在，能关掉吗？**
`:show-thinking="false"` 会在生成结束后移除思考块；只想默认收起而不隐藏时，单独用 `SnAiThinking` 并传 `default-collapsed`。

**Q：`aborted` 的消息会丢掉已生成的内容吗？**
不会。已生成的内容保留，末尾追加「已停止生成」提示。

**Q：`retry` 之后列表会自动替换那条消息吗？**
不会。组件只报告用户点了重试，是否替换、如何重跑由宿主机决定（完整示例里演示了一种写法）。

**Q：能在 uni-app 里也用列表容器吗？**
不能，uni 端只提供单条渲染器 `SnAiMessage`；直接引 `@snui/templates/uni/chat` 即可获得带 `<scroll-view>` 的完整转录区。
