# AI 输入框 AiPrompt

AI 对话的输入区：多行输入、附件面板、智能体 / 权限 / 模型选择、思考程度调节、发送与停止，以及待发送消息队列。它是「输入区」这一块的完整实现，页面可以自己拥有转录区。

> 平台：`Web`

## 何时使用

- 页面已经有自己的转录区，只需要一个功能完整的输入区
- 需要把「附件、智能体、权限、模型、思考程度」这些选项和发送动作放在一起
- 需要上一条还在生成时把后续输入排进队列，而不是直接丢掉
- 需要在工具条里再塞几个自己的控件（`toolbar` 插槽），或在输入区下方补一行提示（`hint` 插槽）
- 需要一个可复用的输入组件嵌进非对话页面（例如弹窗里的「一句话生成」）

## 安装与按需加载

样式**按模板**产出：引一个模板只带上它自己的 JS 与它自己的 CSS，不存在「所有模板的样式桶」。三件事：

```ts
// 1) 只导入用到的那个模板：它的 JS 和它自己的样式会一起被带上
import { SnAiPrompt } from '@snui/templates/web/prompt'

// 2) 共享 token 层在应用入口导入一次
import '@snui/templates/styles'

// 3) 需要自己控制代码分割时，也可以单独引某个模板的样式文件
import '@snui/templates/styles/web-prompt.css'
```

每个模板的样式文件（都在 `@snui/templates/styles/` 下）：

| 文件 | 对应模板 |
| --- | --- |
| `web-prompt.css` | `@snui/templates/web/prompt` |
| `web-chat.css` | `@snui/templates/web/chat` |
| `web-assistant.css` | `@snui/templates/web/assistant` |
| `web-message-list.css` | `@snui/templates/web/message-list` |
| `web-model-config.css` | `@snui/templates/web/model-config` |
| `uni-chat.css` | `@snui/templates/uni/chat` |
| `uni-message-list.css` | `@snui/templates/uni/message-list` |

引 `web-prompt.css` **不会**带上对话页、消息列表、模型配置等其他模板的规则；共享的 token 层只有一份（第 2 步），再引第二个模板时不会重复下载。

## 快速开始

最小可运行版本：输入框 + 一个「收到整轮输入」的处理函数。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SnAiPrompt } from '@snui/templates/web/prompt'
import type { SnAiQueuedTurn } from '@snui/templates/web'

const draft = ref('')
const active = ref(false)

function onSend(turn: SnAiQueuedTurn): void {
  active.value = true
  console.info('本轮输入：', turn.text, turn.attachments)
  // 你自己的转录区这里开始消费这一轮
  setTimeout(() => {
    active.value = false
  }, 1200)
}
</script>

<template>
  <SnAiPrompt v-model="draft" :active="active" @send="onSend" @stop="active = false" />
</template>
```

发送可用性由组件自己判断：草稿有内容，或已附加至少一个附件，按钮才可点。

## 完整接入示例

把输入区接到真实后端：`send` 拿到整轮输入后先渲染一条用户消息，再流式接收答案；`stop` 中止请求，队列项被踩掉时用 `remove-queued` 同步宿主机状态。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SnAiPrompt } from '@snui/templates/web/prompt'
import { SnAiMessageList } from '@snui/templates/web/message-list'
import type { SnAiAttachment, SnAiMessage, SnAiQueuedTurn } from '@snui/templates/web'

const draft = ref('')
const messages = ref<SnAiMessage[]>([])
const queue = ref<SnAiQueuedTurn[]>([])
const active = ref(false)
const controller = ref<AbortController | null>(null)

const attachments = ref<SnAiAttachment[]>([])

async function consume(turn: SnAiQueuedTurn): Promise<void> {
  // 1) 先把用户这一轮写进转录，界面立刻有反馈
  messages.value = [
    ...messages.value,
    { id: turn.id, role: 'user', parts: [{ type: 'text', text: turn.text }], status: 'done' },
  ]

  // 2) 流式接收答案
  const abort = new AbortController()
  controller.value = abort
  active.value = true
  const reply: SnAiMessage = {
    id: `${turn.id}-reply`,
    role: 'assistant',
    parts: [{ type: 'text', text: '' }],
    status: 'streaming',
  }
  messages.value = [...messages.value, reply]

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
      reply.parts = [{ type: 'text', text: (reply.parts[0] as { text: string }).text + decoder.decode(value, { stream: true }) }]
      messages.value = [...messages.value]
    }
    reply.status = 'done'
  } catch (error) {
    reply.status = abort.signal.aborted ? 'aborted' : 'error'
    if (!abort.signal.aborted) console.warn('这一轮失败了：', error)
  } finally {
    active.value = false
    controller.value = null
    // 3) 下一条排队项开始运行
    const next = queue.value.shift()
    if (next) void consume(next)
  }
}

function onSend(turn: SnAiQueuedTurn): void {
  if (active.value) queue.value = [...queue.value, turn]
  else void consume(turn)
}

function onRemoveQueued(id: string): void {
  queue.value = queue.value.filter((turn) => turn.id !== id)
}

function onAttach(files: File[]): void {
  // 上传属于宿主机职责：传完把结果写回 attachments，失败时把 status 置为 'error'。
  console.info('待上传：', files.map((file) => file.name))
}
</script>

<template>
  <div class="page">
    <SnAiMessageList :messages="messages" :loading="active" />
    <SnAiPrompt
      v-model="draft"
      :active="active"
      :queued="queue"
      :attachments="attachments"
      accept="image/*,.pdf"
      placeholder="描述你的问题，Enter 发送"
      @send="onSend"
      @stop="controller?.abort()"
      @remove-queued="onRemoveQueued"
      @attach="onAttach"
    />
  </div>
</template>
```

## 代码演示

### 完整工具条

附件面板、三个选择器、思考程度拉条、发送与停止切换、以及排队行都在同一个演示里。

<Demo name="ai-prompt-web-basic" description="把图片粘贴进输入框即可看到缩略图，点击缩略图预览；发送后进入运行态，再次发送会看到排队行。" />

## API

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | `undefined` | 输入内容。配合 `v-model` 使用。 |
| `attachments` | `SnAiAttachment[]` | `undefined` | 当前已附加的文件。 |
| `agents` | `SnAiAgent[]` | `undefined` | 智能体选择器的候选项。 |
| `agentId` | `string` | `undefined` | 当前选中的智能体。 |
| `permissions` | `SnAiPermissionOption[]` | `undefined` | 权限选项；不传时使用内置四个标准档位。 |
| `permission` | `SnAiPermission` | `undefined` | 当前选中的权限范围。 |
| `models` | `SnAiModel[]` | `undefined` | 模型选择器的候选项。 |
| `modelId` | `string` | `undefined` | 当前选中的模型。 |
| `thinkingLevel` | `SnAiThinkingLevel` | `undefined` | 思考程度档位。 |
| `active` | `boolean` | `undefined` | 是否有一轮正在运行；决定按钮显示发送还是停止。 |
| `queued` | `SnAiQueuedTurn[]` | `undefined` | 待发送队列。 |
| `disabled` | `boolean` | `false` | 禁用整个输入区。 |
| `placeholder` | `string` | `'输入消息，Enter 发送，Shift + Enter 换行'` | 输入框占位文案。 |
| `maxlength` | `number` | `undefined` | 输入长度上限。 |
| `accept` | `string` | `undefined` | 文件选择器的类型过滤。 |
| `showThinking` | `boolean` | `true` | 是否提供思考程度控件。 |
| `showQueue` | `boolean` | `true` | 是否渲染待发送队列。 |
| `rows` | `number` | `3` | 输入框初始行数。 |

### Events

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `string` | 输入内容变化。 |
| `update:attachments` | `SnAiAttachment[]` | 附件增删。 |
| `update:agentId` | `string` | 切换智能体。 |
| `update:permission` | `SnAiPermission` | 切换权限范围。 |
| `update:modelId` | `string` | 切换模型。 |
| `update:thinkingLevel` | `SnAiThinkingLevel` | 切换思考程度。 |
| `send` | `SnAiQueuedTurn` | 一轮输入已组装完成，可以运行。 |
| `stop` | — | 停止正在运行的一轮。 |
| `remove-queued` | `string` | 移除队列中的某一项。 |
| `attach` | `File[]` | 用户选择或粘贴了文件；上传由宿主机负责。 |

### Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `toolbar` | — | 工具条中的额外控件。 |
| `queue` | `{ turns, remove }` | 自定义排队行的渲染。 |
| `hint` | — | 输入区下方的提示行。 |

### 类型导出

| 名称 | 来源 | 说明 |
| --- | --- | --- |
| `SnAiPrompt` | `@snui/templates/web/prompt` | 模板组件本体。 |
| `SnAiQueuedTurn` / `SnAiAttachment` / `SnAiModel` 等 | `@snui/templates` | 共享契约类型，供宿主机构造数据。 |

### 交互约定

| 行为 | 约定 |
| --- | --- |
| 发送 | `Enter` 发送；`Shift + Enter` 换行 |
| 中文输入 | 输入法候选期间的 `Enter` 不会触发发送 |
| 发送可用性 | 输入框有内容，或已附加至少一个附件 |
| 运行中 | 发送按钮变为停止按钮，点击触发 `stop` |
| 思考程度 | 所选模型不支持推理时，该控件不渲染 |
| 附件 | 通过面板选择，或直接把图片 / 文件粘贴进输入框；两者都走同一个 `attach` 事件交给宿主机上传 |
| 附件预览 | 点击附件前面的缩略图 / 图标预览：图片打开灯箱，其它文件在新标签页打开；需要宿主机在 `SnAiAttachment.url` 上给出地址 |

## 主题与 token 定制

输入框本身不收 `theme` prop，它继承应用级别的风格包：只要祖先里有一个 `SnConfigProvider`（或应用入口挂了风格包），它消费的 `--sn-web-*` 别名就会跟着变。

```vue
<SnConfigProvider skin="ios">
  <SnAiPrompt v-model="draft" @send="onSend" />
</SnConfigProvider>
```

只改这一块的观感时，直接覆盖 `--sn-web-*` 别名：

```css
/* 输入区根节点上的细粒度覆盖 */
.sn-ai-prompt {
  --sn-web-color-background-surface: #faf7f0;
  --sn-web-color-border-subtle: rgba(0, 0, 0, 0.08);
  --sn-web-spacing-3: 12px;
}
```


## 无障碍

- 输入区带可访问名称，附件按钮声明 `aria-haspopup` 与 `aria-expanded`
- 每个仅图标按钮都有 `aria-label`
- 附件行、排队行的移除按钮都带上了对应条目的名称
- 发送与停止是两个不同的可访问名称，运行状态切换时名称同步变化

## 中断与资源回收

- 输入框自己**不发起也不持有**任何请求：中断的责任在宿主机，收到 `stop` 后中止你自己的 `fetch` / `uni.request`
- 附件只以 `attach` 事件交出 `File[]`，组件不创建上传任务，因此没有需要回收的请求
- 组件内部不注册全局监听、不创建定时器；卸载时没有残留订阅
- 队列是受控数据：`remove-queued` 只报告意图，是否真的移除由宿主机决定

## 常见问题

**Q：输入框会自动消费队列吗？**
不会。组件只负责把排队项画出来，并把「开始一轮」/「移除此项」的意图通过 `send` 与 `remove-queued` 交出去，调度逻辑在宿主机（或直接用 [AI 对话页](/templates/ai/chat)，它已经内置了调度）。

**Q：为什么思考程度控件不见了？**
`showThinking` 为 `false`，或者当前 `models` 里被选中的那个模型不支持推理（`supportsThinking` 未开启）。这两条都会让该控件不渲染。

**Q：附件上传失败怎么显示？**
把 `SnAiAttachment.status` 置为 `'error'`，附件行会以警示色呈现。

**Q：能改按键行为吗？**
不能。`Enter` 发送 / `Shift + Enter` 换行是固定约定，输入法组合期间的 `Enter` 一律不发送。

**Q：`queued` 不传行不行？**
可以。不传就没有排队行；配合 `showQueue` 可以只关掉渲染而保留数据。

**Q：附件怎么才能点击预览？**
宿主机在上传完成后把地址写进 `SnAiAttachment.url` 即可：图片会显示缩略图并打开灯箱，其它文件点击后在新标签页打开。没有 `url`（例如还在上传中）的附件仍然只显示图标，且不可点击。
