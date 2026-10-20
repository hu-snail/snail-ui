# AI 对话页 AiChat / sn-ai-chat

一个完整可用的 AI 对话页：Web 端由消息列表模板（转录区）、输入框模板（输入区）与两页共用的轮次引擎（排队调度 / 中断）组装而成。安装后传入一个「运行一轮对话」的函数（`run`）即可跑起来，Web 与 uni-app 两端共用同一份消息 / 流式契约。

> 平台：`Web`（`SnAiChat`，来自 `@snui/templates/web/chat`） / `uni-app`（`SnAiChat`，来自 `@snui/templates/uni/chat`）

## 何时使用

- 需要从零搭一个 AI 对话页，不想重复实现消息渲染与流式折叠
- 已有后端接口，只需要一个把流式增量接到界面上的容器
- 需要消息排队：上一条还在生成时，后续消息排队等待而不是被丢弃
- 需要一整页级别的中断控制：用户随时停止当前轮，页面卸载时不留游离请求
- 希望移动端与桌面端复用同一套数据结构和流式折行逻辑（本页同时覆盖两端）

## 安装与按需加载

样式**按模板**产出：引一个模板只带上它自己的 JS 与它自己的 CSS，不存在「所有模板的样式桶」。三件事：

```ts
// 1) 只导入用到的那个模板：它的 JS 和它自己的样式会一起被带上
import { SnAiChat } from '@snui/templates/web/chat'

// 2) 共享 token 层在应用入口导入一次
import '@snui/templates/styles'

// 3) 需要自己控制代码分割时，也可以单独引某个模板的样式文件
import '@snui/templates/styles/web-chat.css'
```

uni-app 端同理，只换个入口：

```ts
import { SnAiChat } from '@snui/templates/uni/chat'
import '@snui/templates/styles'
import '@snui/templates/styles/uni-chat.css'
```

每个模板的样式文件（都在 `@snui/templates/styles/` 下）：

| 文件 | 对应模板 |
| --- | --- |
| `web-chat.css` | `@snui/templates/web/chat` |
| `uni-chat.css` | `@snui/templates/uni/chat` |

引 `web-chat.css` **不会**带上输入框、消息列表、模型配置等其他模板的规则；反过来，引其他模板也不会带上对话页的规则。共享的 token 层只有一份（第 2 步），引第二个模板时不会重复下载。

## 快速开始

最小可运行版本：一个空转录 + 一个把固定文本喂给 `emit` 的 `run`。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SnAiChat } from '@snui/templates/web/chat'
import type { SnAiRunTurn } from '@snui/templates/web/chat'
import type { SnAiMessage } from '@snui/templates/web'

const messages = ref<SnAiMessage[]>([])

const run: SnAiRunTurn = async (turn, { emit }) => {
  emit({ type: 'thinking', text: '收到问题，先整理一下思路。' })
  emit({ type: 'thinking-end', durationMs: 800 })
  emit({ type: 'text', text: `你刚才说的是：${turn.text}` })
}
</script>

<template>
  <SnAiChat v-model:messages="messages" :run="run" title="AI 助手" />
</template>
```

`v-model:messages` 是双向的：模板新增轮次、折叠流式增量、更新状态，都会通过 `update:messages` 写回你的 `messages`，你不需要自己拼接消息。

## 完整接入示例

下面是一个贴近真实后端的写法：`fetch` 拿到 SSE 流，把每个事件转成 `emit` 的增量，并把 `signal` 透传给请求，这样「停止」按钮和页面卸载都能真正中断它。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SnAiChat } from '@snui/templates/web/chat'
import type { SnAiRunTurn } from '@snui/templates/web/chat'
import type { SnAiMessage } from '@snui/templates/web'

/** 后端 SSE 事件的形状。 */
type BackendEvent =
  | { type: 'reasoning'; text: string }
  | { type: 'tool'; name: string }
  | { type: 'text'; text: string }

const messages = ref<SnAiMessage[]>([])

/** 把 `text/event-stream` 响应拆成一行一个 JSON 事件。 */
async function* readSse(response: Response): AsyncGenerator<BackendEvent> {
  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  for (;;) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      if (line.startsWith('data: ')) yield JSON.parse(line.slice(6)) as BackendEvent
    }
  }
}

const run: SnAiRunTurn = async (turn, { signal, emit }) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      prompt: turn.text,
      // 附件只传 id：上传由宿主机负责，模板不做上传。
      attachments: turn.attachments.map((item) => item.id),
      agentId: turn.agentId,
      permission: turn.permission,
      modelId: turn.modelId,
      thinkingLevel: turn.thinkingLevel,
    }),
    // 用户点「停止」或页面卸载时触发：必须透传，否则请求会继续跑。
    signal,
  })

  for await (const event of readSse(response)) {
    if (event.type === 'reasoning') emit({ type: 'thinking', text: event.text })
    else if (event.type === 'tool') emit({ type: 'tool', name: event.name, status: 'running' })
    else emit({ type: 'text', text: event.text })
  }

  // 声明思考块的耗时；不调用也可以，思考块会停留到本轮结束。
  emit({ type: 'thinking-end', durationMs: 3200 })
}
</script>

<template>
  <SnAiChat
    v-model:messages="messages"
    :run="run"
    title="代码助手"
    subtitle="接入真实后端"
    :models="models"
    @error="({ error }) => console.warn(error.code)"
    @turn-end="({ message }) => console.info('本轮结束：', message.status)"
  />
</template>
```

`run` 收到三样东西：

| 成员 | 类型 | 说明 |
| --- | --- | --- |
| `turn` | `SnAiQueuedTurn` | 这一轮的输入：文本、附件，以及发送时选中的智能体 / 权限 / 模型 / 思考程度。 |
| `signal` | `AbortSignal` | 用户点「停止」或页面卸载时触发，务必透传给请求。 |
| `emit` | `(delta) => void` | 把流式增量交给模板折叠；返回后这一轮即结束。 |
| `messageId` | `string` | 本轮对应的助手消息 id，便于把外部日志与转录对上。 |

流式增量的四种形态：

| delta | 说明 |
| --- | --- |
| `{ type: 'thinking', text }` | 追加思考文本。答案开始后再次出现会另起一个思考块。 |
| `{ type: 'thinking-end', durationMs? }` | 结束当前思考块，并记录耗时。 |
| `{ type: 'text', text }` | 追加答案文本。 |
| `{ type: 'tool', name, status, detail? }` | 记录一次工具调用；同名且状态为 `running` 的行会被后续状态就地更新。 |

`emit` 抛出的错误不需要自己捕获：`run` 的 Promise 被拒绝时，本轮会转为失败状态并触发 `error` 事件。

## 代码演示

### 完整对话流

演示里的运行函数会真实地先输出思考过程、再逐字输出答案，因此你看到的就是接入真实接口后的渲染路径；运行时再次发送会进入排队。

<Demo name="ai-chat-web-basic" description="思考输出 → 逐字流式 → 完成；运行时再次发送会进入排队。" />

### 各状态对照

排队中、思考中、流式输出、已完成、失败、已停止六种状态一次性摆开，便于核对每种状态下的界面差异。

<Demo name="ai-chat-web-states" description="等待行、流式光标、工具行、错误卡片与停止提示的状态对照。" />

### uni-app 端消息与思考输出

uni 端与 Web 端共用消息契约，排版按移动端尺寸呈现：静态转录展示思考折叠、流式光标、错误卡片与停止提示。

<Demo name="ai-chat-mp-basic" description="uni 端与 Web 端共用消息契约，排版按移动端尺寸呈现。" />

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
| `theme` | `string` | `'default'` | 风格包标识，映射到风格包体系（仅 Web 端）。 |
| `title` | `string` | `'AI 助手'` | 页头标题。 |
| `subtitle` | `string` | `undefined` | 页头副标题（仅 Web 端）。 |
| `disabled` | `boolean` | `false` | 禁用整页。 |
| `allowQueue` | `boolean` | `true` | 运行中再次发送是否进入排队；关闭后多余提交会被丢弃。 |
| `showHeader` | `boolean` | `true` | 是否渲染页头。 |
| `loading` | `boolean` | `false` | 历史记录加载中：Web 端在消息列表显示骨架行，uni 端显示「正在加载对话…」。 |
| `rememberSelection` | `boolean` | `true` | 是否在轮次之间保留智能体 / 模型的选择（仅 Web 端）。 |
| `placeholder` | `string` | `'输入消息'` | 输入框占位文案（仅 uni 端）。 |

### Events

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `update:messages` | `SnAiMessage[]` | 转录变化（新增轮次、流式增量、状态变更）。 |
| `turn-start` | `SnAiQueuedTurn` | 一轮开始运行。 |
| `turn-end` | `{ turn, message }` | 一轮结束（正常、失败或被停止）。 |
| `error` | `{ turn, error }` | 一轮失败，`error` 为结构化错误。 |
| `retry` | `SnAiMessage` | 用户请求重试某条失败的消息。 |
| `update:modelId` | `string` | 用户切换了模型（仅 Web 端）。 |
| `update:agentId` | `string` | 用户切换了智能体（仅 Web 端）。 |

### Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `header-actions` | — | 页头右侧的操作区（仅 Web 端）。 |
| `transcript` | `{ messages, empty }` | 替换整个转录区域（仅 Web 端）。 |
| `toolbar` | — | 透传给输入框的额外工具条内容（仅 Web 端）。 |

### 类型导出

| 名称 | 来源 | 说明 |
| --- | --- | --- |
| `SnAiRunTurn` | `@snui/templates/web/chat`、`@snui/templates/uni/chat` | 运行函数签名。 |
| `SnAiMessage` / `SnAiQueuedTurn` / `SnAiError` 等 | `@snui/templates` | 共享契约类型，供宿主机构造数据。 |

## 主题与 token 定制

`theme` 映射到风格包体系：模板把它交给 `SnConfigProvider` 的 `skin`，非 `default` 的值会在 `<body>` 上加一个 `snui-skin-<theme>` 类，由对应风格包覆盖 token 与皮肤 CSS。可用值：`default`（默认，不加类）、`dark`、`ios`、`doodle`、`sticky-note`。

```vue
<SnAiChat title="iOS 风格" theme="ios" :run="run" />
```

只改一两个细节时不必做整套风格包，直接覆盖 `--sn-web-*` 别名即可（它们最终解析到 `--aui-*` 原语层）：

```css
/* 页面根节点上的细粒度覆盖 */
.sn-ai-chat {
  --sn-web-color-background-surface: #faf7f0;
  --sn-web-color-border-subtle: rgba(0, 0, 0, 0.08);
  --sn-web-spacing-6: 28px;
}
```

uni 端没有 `theme` prop：`--sn-mp-*` 别名层由 `@snui/tokens-mp` 提供，覆盖方式相同（注意 uni 的尺寸 token 是 rpx）：

```css
.sn-ai-chat {
  --sn-mp-color-background-surface: #faf7f0;
}
```

## 端差异

两端共用消息、流式增量与错误结构，差异只在排版与输入区能力：

| 方面 | Web（`SnAiChat`） | uni-app（`SnAiChat`） |
| --- | --- | --- |
| 元素 | `<div>` / `<header>` / `<footer>` 等标准标签 | `<view>` / `<text>` / `<scroll-view scroll-y>` 等跨端元素 |
| 单位 | px 级别的 `--sn-web-*` token | `--sn-mp-*` token，尺寸为 rpx，跨设备等比缩放 |
| 页头 | 标题 + 副标题 + `header-actions` 插槽 | 只有标题，无副标题与插槽 |
| 输入区 | 复用 `SnAiPrompt`：附件面板、智能体 / 权限 / 模型选择、思考程度、排队行管理 | 原生 `<input>` + 发送 / 停止按钮；`confirm-type="send"`，`@confirm` 触发发送 |
| 排队 | 可逐条移除（`remove-queued`） | 只读展示队列条目，不可逐条移除 |
| 选择项 | 暴露 `agents` / `permissions` / `models` / `vendors` / `rememberSelection` / `update:modelId` / `update:agentId` | 无选择器，因此也没有这些 props 与事件 |
| 主题 | 支持 `theme` | 无 `theme`，以 `--sn-mp-*` token 覆盖为准 |
| 契约 | `SnAiMessage` / 流式增量 / `SnAiError` 完全一致（来自 `@snui/templates` 的共享层） | 同左 |

## 无障碍

- 页头为语义化标题结构；转录区每行带 `data-status`，读屏与自动化测试可据此定位状态
- 输入框、发送、停止等控件的可访问名称由输入框模板提供
- 运行中发送按钮切换为停止，其可访问名称同步变化
- 仅图标按钮都带可访问名称；排队行、附件行的移除按钮带上对应条目的名称

## 中断与资源回收

- 用户点「停止」会中止 `signal`，该轮标记为 `aborted`（「已停止生成」）并保留已生成内容
- 每次运行由模板自己持有 `AbortController`；一轮结束后释放，不会累积
- 页面卸载（`onBeforeUnmount`）时会中止仍在运行的轮次，不会让请求游离在页面之外
- 宿主机只要把 `signal` 透传给 `fetch` / `uni.request`，就自动获得以上全部行为

## 常见问题

**Q：一定要用 `v-model:messages` 吗？**
可以用 `:messages` + `@update:messages`，但双向绑定最省事。模板内部保留一份本地转录，宿主机异步回填 `messages` 时不会丢掉流式增量。

**Q：为什么发送后界面没动？**
先看有没有触发 `NO_RUNNER`：没有传 `run` 时页面可以渲染，但一轮也无法开始。

**Q：`run` 抛错会怎样？**
模板把该轮标为失败、写入结构化错误并在转录里渲染错误卡片，同时触发 `error`；用户点重试会触发 `retry`，你在那里重新调用 `run` 即可。

**Q：怎么关掉排队？**
`:allow-queue="false"`，运行中多余提交会被直接丢弃，而不是排队。

**Q：附件会上传吗？**
不会。模板只把用户选择的文件通过输入框模板的 `attach` 事件交给宿主机，上传与凭证都属于宿主机职责。
