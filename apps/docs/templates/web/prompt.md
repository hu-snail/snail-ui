# AI 输入框 AiPrompt

AI 对话的输入区：多行输入、附件面板、智能体 / 权限 / 模型选择、思考程度调节、发送与停止，以及待发送消息队列。

## 何时使用

- 页面已经有自己的转录区，只需要一个功能完整的输入区
- 需要把「附件、智能体、权限、模型、思考程度」这些选项和发送动作放在一起
- 需要上一条还在生成时把后续输入排进队列，而不是直接丢掉

## 安装与按需加载

```ts
import { SnAiPrompt } from '@snui/templates/web/prompt'
```

## 代码演示

### 完整工具条

附件面板、三个选择器、思考程度拉条、发送与停止切换、以及排队行都在同一个演示里。

<Demo name="ai-prompt-web-basic" description="点击发送后进入运行态，再次发送会看到排队行。" />

## 交互约定

| 行为 | 约定 |
| --- | --- |
| 发送 | `Enter` 发送；`Shift + Enter` 换行 |
| 中文输入 | 输入法候选期间的 `Enter` 不会触发发送 |
| 发送可用性 | 输入框有内容，或已附加至少一个附件 |
| 运行中 | 发送按钮变为停止按钮，点击触发 `stop` |
| 思考程度 | 所选模型不支持推理时，该控件不渲染 |
| 附件 | 通过面板选择图片 / 文档，选中的文件以 `attach` 事件交给宿主机上传 |

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
| `attach` | `File[]` | 用户选择了文件，上传由宿主机负责。 |

### Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `toolbar` | — | 工具条中的额外控件。 |
| `queue` | `{ turns, remove }` | 自定义排队行的渲染。 |
| `hint` | — | 输入区下方的提示行。 |

## 无障碍

- 输入区带可访问名称，附件按钮声明 `aria-haspopup` 与 `aria-expanded`
- 每个仅图标按钮都有 `aria-label`
- 附件行、排队行的移除按钮都带上了对应条目的名称

## 附件与凭证

- 组件本身不做上传，只把选中的文件通过 `attach` 交给宿主机
- 附件行的失败状态由 `SnAiAttachment.status` 驱动，失败时以警示色呈现
