# 消息模块 AiMessageList

对话转录的展示模块：消息气泡、思考过程折叠、流式输出、工具调用行、附件行、错误提示与重试。

## 何时使用

- 需要把一段对话记录渲染成可读的转录区
- 需要「思考过程」在生成时展开、生成结束后自动收起
- 需要在流式输出时自动跟随最新内容，但用户向上翻阅时不要被拉回底部

## 安装与按需加载

```ts
import { SnAiMessageList, SnAiMessage } from '@snui/templates/web/message-list'
```

`SnAiMessage` 是单条消息的渲染器，可以脱离列表单独使用（例如引用某条回复、或在卡片里做预览）。

## 代码演示

### 独立嵌入

只挂载消息列表，不配输入框，展示思考折叠、工具行、附件行与流式光标。

<Demo name="ai-message-list-web-basic" description="思考折叠 + 工具行 + 附件行 + 流式光标的组合。" />

## 消息结构

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
| `queued` | 显示「排队中，等待上一条回复完成」 |
| `thinking` | 思考块实时展开；尚无正文时显示「正在思考…」 |
| `streaming` | 正文逐字增长并带光标 |
| `done` | 完整正文，并提供复制 |
| `error` | 错误卡片替换正文尾部 |
| `aborted` | 保留已生成内容，并追加「已停止生成」提示 |

## API

### Props

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

### Events

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `retry` | `SnAiMessage` | 用户点击了某条失败消息的重试。 |
| `copy` | `SnAiMessage` | 用户复制了某条消息的答案。 |
| `reach-bottom` | — | 用户滚动到了转录区底部。 |

### Slots

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `empty` | — | 自定义空状态。 |

### 单条消息 Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `message` | `SnAiMessage` | 必填 | 要渲染的消息。 |
| `copied` | `boolean` | `false` | 复制按钮是否显示「已复制」。 |
| `showThinking` | `boolean` | `true` | 是否保留思考块。 |
| `showCopy` | `boolean` | `true` | 是否提供复制。 |

## 无障碍

- 每条消息带 `data-status`，读屏与自动化测试可据此定位状态
- 思考块的展开按钮带 `aria-expanded`，其状态与内容可见性一致
- 重试、复制等按钮都有可访问名称

## 滚动行为

转录区在底部放了一个观测点：观测点可见表示读者正在底部，新输出会自动跟随；一旦读者向上翻阅，观测点离开视野，视图就不再被拉回底部，此时右下角出现回到最新消息的按钮。
