# AI Chat Page sn-ai-chat

The uni-app AI conversation page: transcript, composer, queue scheduling and abort control. It shares the same message contract as the web end.

## When to use

- You need a complete AI chat page in a mini program / H5 / app
- You already wired a backend through the web end and want both ends to reuse one data shape
- You need message queuing and abort control

## Install and on-demand loading

```ts
import { SnAiChat } from '@snui/templates/uni/chat'
```

Styles ship with the package:

```ts
import '@snui/templates/styles'
```

## Demos

### Messages and reasoning output

A static transcript showing reasoning collapse, the streaming caret, an error card and the stop notice at mobile sizing.

<Demo name="ai-chat-mp-basic" description="The uni end shares the message contract with the web end; layout follows mobile sizing." />

## Wiring it up

Same as the web end: pass a runner and hand stream deltas to `emit`.

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
  // Feed deltas as your platform allows; abort the request when `signal` fires.
  for await (const chunk of chunksOf(task)) {
    emit({ type: 'text', text: chunk })
  }
}
</script>

<template>
  <SnAiChat v-model:messages="messages" :run="run" title="AI assistant" />
</template>
```

## API

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `messages` | `SnAiMessage[]` | `undefined` | The transcript, oldest first. Use with `v-model:messages`. |
| `run` | `SnAiRunTurn` | `undefined` | The function that runs one turn. |
| `title` | `string` | `'AI 助手'` | Header title. |
| `placeholder` | `string` | `'输入消息'` | Composer placeholder. |
| `disabled` | `boolean` | `false` | Disable the whole page. |
| `allowQueue` | `boolean` | `true` | Whether a submission while running queues. |
| `showHeader` | `boolean` | `true` | Render the header. |
| `loading` | `boolean` | `false` | Show a loading line. |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `update:messages` | `SnAiMessage[]` | Transcript changed. |
| `turn-start` | `SnAiQueuedTurn` | A turn started running. |
| `turn-end` | `{ turn, message }` | A turn ended. |
| `error` | `{ turn, error }` | A turn failed; `error` is the structured error. |
| `retry` | `SnAiMessage` | The user asked to retry. |

## Differences from the web end

| Aspect | Description |
| --- | --- |
| Elements | Uses `<view>` / `<text>` / `<scroll-view>` cross-end elements |
| Units | Sizes go through the rpx alias layer, so they scale across devices |
| Input | Sends on the native `input`'s `confirm` event |
| Contract | Messages, stream deltas and error shape are identical |

## Accessibility and abort

- The send and stop buttons' accessible names change with the state
- Unmounting the page aborts any turn still running
