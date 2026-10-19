# AI Chat Page AiChat

A complete AI conversation page: message list, composer, queue scheduling and abort control come pre-wired. Install it, pass in a "run one turn" function, and it works.

## When to use

- Building an AI chat page from scratch and not wanting to re-implement message rendering and stream folding
- You already have a backend and just need a container that folds stream deltas into the UI
- You need message queuing (later submissions wait while one turn is still generating)

## Install and on-demand loading

Templates are independent subpath exports, so only the one you mount is loaded:

```ts
// Just the chat page
import { SnAiChat } from '@snui/templates/web/chat'

// Or the whole web barrel when you need several
import { SnAiChat, SnAiPrompt } from '@snui/templates/web'
```

Styles ship with the package; import them once at the app entry:

```ts
import '@snui/templates/styles'
```

## Demos

### Full conversation flow

The demo's runner really emits reasoning first and then types the answer out, so what you see is the same render path you get against a live backend.

<Demo name="ai-chat-web-basic" description="Reasoning → streaming answer → done; sending again while running queues the turn." />

### State reference

Queued, thinking, streaming, done, failed and stopped are laid out side by side so you can compare each state's UI.

<Demo name="ai-chat-web-states" description="Waiting line, streaming caret, tool row, error card and stop notice side by side." />

## Wiring it up

The template owns the "when may a turn start" decision; the host only supplies the runner:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SnAiChat } from '@snui/templates/web/chat'
import type { SnAiRunTurn } from '@snui/templates/web/chat'
import type { SnAiMessage } from '@snui/templates/web'

const messages = ref<SnAiMessage[]>([])

/** Feed stream deltas to `emit`; returning ends the turn. */
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
  <SnAiChat v-model:messages="messages" :run="run" title="AI assistant" />
</template>
```

`run` receives three things:

| Member | Type | Description |
| --- | --- | --- |
| `turn` | `SnAiQueuedTurn` | This turn's input: text, attachments, and the agent / permission / model / reasoning tier selected at send time. |
| `signal` | `AbortSignal` | Fires when the user stops the turn or the page unmounts — pass it through to your request. |
| `emit` | `(delta) => void` | Hands a stream delta to the template; returning from `run` ends the turn. |

The four delta shapes:

| Delta | Description |
| --- | --- |
| `{ type: 'thinking', text }` | Appends reasoning text. Emitted again after answer text starts, it opens a new reasoning block. |
| `{ type: 'thinking-end', durationMs? }` | Closes the current reasoning block and records its duration. |
| `{ type: 'text', text }` | Appends answer text. |
| `{ type: 'tool', name, status, detail? }` | Records a tool call; a later status updates the matching `running` row in place. |

## API

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `messages` | `SnAiMessage[]` | `[]` | The transcript, oldest first. Use with `v-model:messages`. |
| `run` | `SnAiRunTurn` | `undefined` | The function that runs one turn. Without it the page still renders but fails with `NO_RUNNER`. |
| `agents` | `SnAiAgent[]` | `[]` | Agents offered by the composer's agent selector. |
| `permissions` | `SnAiPermissionOption[]` | `undefined` | Permission options; the four standard scopes are used when omitted. |
| `models` | `SnAiModel[]` | `[]` | Models offered by the model picker. |
| `vendors` | `SnAiVendor[]` | `[]` | Vendors backing the models, used to label their origin. |
| `theme` | `string` | `'default'` | Active skin, mapped onto the style pack system. |
| `title` | `string` | `'AI 助手'` | Header title. |
| `subtitle` | `string` | `undefined` | Header subtitle. |
| `disabled` | `boolean` | `false` | Disable the whole page. |
| `allowQueue` | `boolean` | `true` | Whether a submission while running queues; when off, extra submissions are dropped. |
| `showHeader` | `boolean` | `true` | Render the header. |
| `loading` | `boolean` | `false` | History is loading; the message list shows skeleton rows. |
| `rememberSelection` | `boolean` | `true` | Keep the agent / model selection between turns. |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `update:messages` | `SnAiMessage[]` | Transcript changed (new turn, stream delta, status change). |
| `turn-start` | `SnAiQueuedTurn` | A turn started running. |
| `turn-end` | `{ turn, message }` | A turn ended (completed, failed or was stopped). |
| `error` | `{ turn, error }` | A turn failed; `error` is the structured error. |
| `retry` | `SnAiMessage` | The user asked to retry a failed turn. |
| `update:modelId` | `string` | The user changed the model. |
| `update:agentId` | `string` | The user changed the agent. |

### Slots

| Name | Props | Description |
| --- | --- | --- |
| `header-actions` | — | Actions on the right of the header. |
| `transcript` | `{ messages, empty }` | Replace the whole transcript area. |
| `toolbar` | — | Extra controls forwarded to the composer. |

### Type exports

| Name | Description |
| --- | --- |
| `SnAiRunTurn` | The runner signature. |
| `SnAiMessage` / `SnAiQueuedTurn` / `SnAiError` and friends | Re-exported from `@snui/templates` so a host can build data. |

## Accessibility

- The header uses a semantic heading; each transcript row carries `data-status` for assistive tech and tests
- Accessible names for the input, send and stop controls come from the composer template
- While running, the send button becomes stop and its accessible name changes with it

## Abort and cleanup

- Clicking stop aborts `signal`; the turn is marked stopped and keeps whatever it already produced
- Unmounting the page aborts any turn still running, so no request outlives the page
