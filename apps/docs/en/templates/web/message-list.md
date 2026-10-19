# Message Module AiMessageList

The transcript module: message bubbles, collapsible reasoning, streaming output, tool-call rows, attachment rows, error cards and retry.

## When to use

- You need to render a conversation as a readable transcript
- Reasoning should expand while generating and collapse once the answer starts
- Output should follow the newest content while streaming, but must not yank the view back once the reader scrolls up

## Install and on-demand loading

```ts
import { SnAiMessageList, SnAiMessage } from '@snui/templates/web/message-list'
```

`SnAiMessage` renders a single message and works outside a list (for a quoted reply or a preview card).

## Demos

### Standalone embedding

Only the message list is mounted — no composer — showing reasoning collapse, a tool row, an attachment row and the streaming caret.

<Demo name="ai-message-list-web-basic" description="Reasoning collapse + tool row + attachment row + streaming caret." />

## Message structure

A message is an ordered list of content blocks, rendered in array order:

| Block | Description |
| --- | --- |
| `thinking` | Reasoning. Expands while generating ("思考中"), then collapses showing the elapsed duration. |
| `text` | The answer. A caret trails the line while streaming. |
| `tool` | A tool call. `running` shows a spinner; `done` / `error` show the outcome. |
| `attachment` | An attachment row echoing a user upload. |
| `error` | An error card with code, hint and a retry button. |

The message status decides the overall presentation:

| Status | Presentation |
| --- | --- |
| `queued` | Shows "排队中，等待上一条回复完成" |
| `thinking` | The reasoning block is live; shows "正在思考…" while there is no answer yet |
| `streaming` | The answer grows with a caret |
| `done` | Full answer plus a copy affordance |
| `error` | The error card replaces the tail of the body |
| `aborted` | Keeps the partial output and appends a "已停止生成" notice |

## API

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `messages` | `SnAiMessage[]` | `[]` | The transcript, oldest first. |
| `loading` | `boolean` | `false` | Show skeleton rows while loading. |
| `loadingRows` | `number` | `3` | Number of skeleton rows. |
| `emptyText` | `string` | `'开始新的对话'` | Empty-state headline. |
| `emptyHint` | `string` | `'在下方输入框输入你的问题'` | Empty-state secondary line. |
| `autoScroll` | `boolean` | `true` | Follow the newest output. |
| `showCopy` | `boolean` | `true` | Offer copy on finished messages. |
| `showThinking` | `boolean` | `true` | Keep reasoning blocks after a turn finishes. |
| `maxHeight` | `string` | `undefined` | Max height of the scroll area; fills the parent when unset. |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `retry` | `SnAiMessage` | The user clicked retry on a failed message. |
| `copy` | `SnAiMessage` | The user copied a message's answer. |
| `reach-bottom` | — | The user scrolled to the bottom of the transcript. |

### Slots

| Name | Props | Description |
| --- | --- | --- |
| `empty` | — | Custom empty state. |

### Single-message props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `message` | `SnAiMessage` | required | The message to render. |
| `copied` | `boolean` | `false` | Whether the copy button shows the copied confirmation. |
| `showThinking` | `boolean` | `true` | Keep reasoning blocks. |
| `showCopy` | `boolean` | `true` | Offer copy. |

## Accessibility

- Each message carries `data-status`, so assistive tech and tests can locate its state
- The reasoning disclosure button carries `aria-expanded`, matching the body's visibility
- Retry and copy buttons have accessible names

## Scroll behaviour

The transcript places an observation point at the bottom: while it is visible the reader is at the bottom, so new output follows automatically; once the reader scrolls up the observation point leaves view and the viewport stops being pulled down, at which point a "jump to latest" button appears.
