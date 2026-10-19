# Message Module sn-ai-message

The uni-app single-message renderer: reasoning collapse, tool rows, attachment rows, streaming caret and error retry.

## When to use

- You need to render one conversation message in a mini program / H5 / app
- You want both ends to share one message structure
- You need reasoning and tool calls presented on mobile

## Install and on-demand loading

```ts
import { SnAiMessage } from '@snui/templates/uni/message-list'
```

## Demos

### Single message

Shows reasoning collapse, a tool row, an attachment row, the streaming caret and error retry at uni-end sizing.

<Demo name="ai-message-list-mp-basic" description="Reasoning collapse + tool row + attachment row + error retry." />

## API

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `message` | `SnAiMessage` | required | The message to render. |
| `showThinking` | `boolean` | `true` | Keep reasoning blocks after a turn finishes. |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `retry` | `SnAiMessage` | The user clicked retry on a failed message. |

## Structure and states

Content blocks and message states mean exactly what they mean on the web end:

| Block | Description |
| --- | --- |
| `thinking` | Reasoning; expands while generating and shows the duration once closed |
| `text` | The answer; a caret trails the line while streaming |
| `tool` | A tool call showing running / done / failed |
| `attachment` | An attachment row echoing an upload |
| `error` | An error card with code, hint and retry |

| Status | Presentation |
| --- | --- |
| `queued` | "排队中，等待上一条回复完成" |
| `thinking` | The reasoning block is live |
| `streaming` | The answer grows with a caret |
| `done` | Full answer |
| `error` | Error card |
| `aborted` | Keeps partial output and appends a stop notice |

## Differences from the web end

| Aspect | Description |
| --- | --- |
| Elements | Uses `<view>` / `<text>` cross-end elements |
| Units | Sizes go through the rpx alias layer |
| Icons | Reuses the same path data, rendered by `sn-icon` |
