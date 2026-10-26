# AI Chat Page AiChat / sn-ai-chat

A complete AI conversation page. On the web it is assembled from the message-list template (the transcript), the composer template (the input area) and the turn engine it shares with the assistant (queue scheduling and abort). Install it, pass in a "run one turn" function (`run`), and it works. The web and uni-app ends share one message / stream contract.

> Platform: `Web` (`SnAiChat` from `@snui/templates/web/chat`) / `uni-app` (`SnAiChat` from `@snui/templates/uni/chat`)

## When to use

- Building an AI chat page from scratch and not wanting to re-implement message rendering and stream folding
- You already have a backend and just need a container that folds stream deltas into the UI
- You need message queuing: later submissions wait while one turn is still generating instead of being dropped
- You need page-level abort control: the reader can stop the current turn, and unmounting leaves no dangling request
- You want mobile and desktop to reuse one data shape and one stream fold (this page covers both ends)

## Install and on-demand loading

Styles are emitted **per template**: importing one template brings its own JS and its own CSS, and there is no all-templates style barrel. Three things:

```ts
// 1) Import only the template you use: its JS and its own styles come with it
import { SnAiChat } from '@snui/templates/web/chat'

// 2) Import the shared token layer once at the app entry
import '@snui/templates/styles'

// 3) When you want to control code splitting yourself, import a single template's stylesheet
import '@snui/templates/styles/web-chat.css'
```

The uni-app end is the same, only the entry changes:

```ts
import { SnAiChat } from '@snui/templates/uni/chat'
import '@snui/templates/styles'
import '@snui/templates/styles/uni-chat.css'
```

The per-template stylesheets (all under `@snui/templates/styles/`):

| File | Template |
| --- | --- |
| `web-chat.css` | `@snui/templates/web/chat` |
| `uni-chat.css` | `@snui/templates/uni/chat` |

Importing `web-chat.css` does **not** pull the composer, message list or model config rules; importing any other template does not pull the chat page's rules either. The shared token layer exists once (step 2), so a second template does not download it again.

## Quick start

The smallest working version: an empty transcript plus a `run` that emits fixed text.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SnAiChat } from '@snui/templates/web/chat'
import type { SnAiRunTurn } from '@snui/templates/web/chat'
import type { SnAiMessage } from '@snui/templates/web'

const messages = ref<SnAiMessage[]>([])

const run: SnAiRunTurn = async (turn, { emit }) => {
  emit({ type: 'thinking', text: 'Got it, let me think this through.' })
  emit({ type: 'thinking-end', durationMs: 800 })
  emit({ type: 'text', text: `You said: ${turn.text}` })
}
</script>

<template>
  <SnAiChat v-model:messages="messages" :run="run" title="AI assistant" />
</template>
```

`v-model:messages` is two-way: new turns, folded stream deltas and status changes all come back through `update:messages`, so you never assemble messages by hand.

## Full integration example

A realistic wiring: `fetch` receives an SSE stream, each event becomes an `emit` delta, and `signal` is passed through to the request so the stop button and page unmount really abort it.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SnAiChat } from '@snui/templates/web/chat'
import type { SnAiRunTurn } from '@snui/templates/web/chat'
import type { SnAiMessage } from '@snui/templates/web'

/** The shape of the backend's SSE events. */
type BackendEvent =
  | { type: 'reasoning'; text: string }
  | { type: 'tool'; name: string }
  | { type: 'text'; text: string }

const messages = ref<SnAiMessage[]>([])

/** Split a `text/event-stream` response into one JSON event per line. */
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
      // Only ids go out: uploading belongs to the host, the template never uploads.
      attachments: turn.attachments.map((item) => item.id),
      agentId: turn.agentId,
      permission: turn.permission,
      modelId: turn.modelId,
      thinkingLevel: turn.thinkingLevel,
    }),
    // Fires when the reader stops the turn or the page unmounts: always pass it through.
    signal,
  })

  for await (const event of readSse(response)) {
    if (event.type === 'reasoning') emit({ type: 'thinking', text: event.text })
    else if (event.type === 'tool') emit({ type: 'tool', name: event.name, status: 'running' })
    else emit({ type: 'text', text: event.text })
  }

  // Declare the reasoning duration; skipping it is fine too.
  emit({ type: 'thinking-end', durationMs: 3200 })
}
</script>

<template>
  <SnAiChat
    v-model:messages="messages"
    :run="run"
    title="Code assistant"
    subtitle="Wired to a real backend"
    :models="models"
    @error="({ error }) => console.warn(error.code)"
    @turn-end="({ message }) => console.info('Turn ended:', message.status)"
  />
</template>
```

`run` receives four things:

| Member | Type | Description |
| --- | --- | --- |
| `turn` | `SnAiQueuedTurn` | This turn's input: text, attachments, and the agent / permission / model / reasoning tier selected at send time. |
| `signal` | `AbortSignal` | Fires when the reader stops the turn or the page unmounts — pass it through to your request. |
| `emit` | `(delta) => void` | Hands a stream delta to the template; returning from `run` ends the turn. |
| `messageId` | `string` | The assistant message id for this turn, useful for matching external logs to the transcript. |

The four delta shapes:

| Delta | Description |
| --- | --- |
| `{ type: 'thinking', text }` | Appends reasoning text. Emitted again after answer text starts, it opens a new reasoning block. |
| `{ type: 'thinking-end', durationMs? }` | Closes the current reasoning block and records its duration. |
| `{ type: 'text', text }` | Appends answer text. |
| `{ type: 'tool', name, status, detail? }` | Records a tool call; a later status updates the matching `running` row in place. |

You do not need to catch errors thrown from `emit`: when `run`'s promise rejects, the turn turns into a failure and `error` fires.

## Demos

### Full conversation flow

The demo's runner really emits reasoning first and then types the answer out, so what you see is the same render path you get against a live backend; sending again while running queues the turn.

<Demo name="ai-chat-web-basic" description="Reasoning → streaming answer → done; sending again while running queues the turn." />

### State reference

Queued, thinking, streaming, done, failed and stopped are laid out side by side so you can compare each state's UI.

<Demo name="ai-chat-web-states" description="Waiting line, streaming caret, tool row, error card and stop notice side by side." />

### uni-app messages and reasoning output

The uni end shares the message contract with the web end while the layout follows mobile sizing: a static transcript showing reasoning collapse, the streaming caret, an error card and the stop notice.

<Demo name="ai-chat-mp-basic" description="The uni end shares the message contract with the web end; layout follows mobile sizing." />

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
| `theme` | `string` | `'default'` | Active skin, mapped onto the style pack system (web end only). |
| `title` | `string` | `'AI 助手'` | Header title. |
| `subtitle` | `string` | `undefined` | Header subtitle (web end only). |
| `disabled` | `boolean` | `false` | Disable the whole page. |
| `allowQueue` | `boolean` | `true` | Whether a submission while running queues; when off, extra submissions are dropped. |
| `showHeader` | `boolean` | `true` | Render the header. |
| `loading` | `boolean` | `false` | History is loading: the web end shows skeleton rows, the uni end shows "正在加载对话…". |
| `rememberSelection` | `boolean` | `true` | Keep the agent / model selection between turns (web end only). |
| `placeholder` | `string` | `'输入消息'` | Composer placeholder (uni end only). |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `update:messages` | `SnAiMessage[]` | Transcript changed (new turn, stream delta, status change). |
| `turn-start` | `SnAiQueuedTurn` | A turn started running. |
| `turn-end` | `{ turn, message }` | A turn ended (completed, failed or was stopped). |
| `error` | `{ turn, error }` | A turn failed; `error` is the structured error. |
| `retry` | `SnAiMessage` | The user asked to retry a failed turn. |
| `update:modelId` | `string` | The user changed the model (web end only). |
| `update:agentId` | `string` | The user changed the agent (web end only). |

### Slots

| Name | Props | Description |
| --- | --- | --- |
| `header-actions` | — | Actions on the right of the header (web end only). |
| `transcript` | `{ messages, empty }` | Replace the whole transcript area (web end only). |
| `toolbar` | — | Extra controls forwarded to the composer (web end only). |

### Type exports

| Name | From | Description |
| --- | --- | --- |
| `SnAiRunTurn` | `@snui/templates/web/chat`, `@snui/templates/uni/chat` | The runner signature. |
| `SnAiMessage` / `SnAiQueuedTurn` / `SnAiError` and friends | `@snui/templates` | Shared contract types so a host can build data. |

## Theme and token customisation

`theme` maps onto the style pack system: the template hands it to `SnConfigProvider`'s `skin`, and any value other than `default` adds a `snui-skin-<theme>` class to `<body>`, where the matching style pack overrides tokens and skin CSS. Available values: `default` (no class), `dark`, `ios`, `doodle`, `sticky-note`.

```vue
<SnAiChat title="iOS look" theme="ios" :run="run" />
```

For one or two details you do not need a whole style pack — override the `--sn-web-*` aliases directly (they resolve down to the `--aui-*` primitives):

```css
/* Fine-grained override on the page root */
.sn-ai-chat {
  --sn-web-color-background-surface: #faf7f0;
  --sn-web-color-border-subtle: rgba(0, 0, 0, 0.08);
  --sn-web-spacing-6: 28px;
}
```

The uni end has no `theme` prop: the `--sn-mp-*` alias layer comes from `@snui/tokens-mp` and overrides the same way (uni size tokens are rpx):

```css
.sn-ai-chat {
  --sn-mp-color-background-surface: #faf7f0;
}
```

## End differences

Both ends share the message, stream-delta and error shapes; only layout and composer capability differ:

| Aspect | Web (`SnAiChat`) | uni-app (`SnAiChat`) |
| --- | --- | --- |
| Elements | Standard `<div>` / `<header>` / `<footer>` tags | Cross-end `<view>` / `<text>` / `<scroll-view scroll-y>` elements |
| Units | `--sn-web-*` tokens in px | `--sn-mp-*` tokens, sized in rpx so they scale across devices |
| Header | Title, subtitle and a `header-actions` slot | Title only, no subtitle or slots |
| Composer | Reuses `SnAiPrompt`: attachment panel, agent / permission / model selectors, reasoning tier, queue management | Native `<input>` plus a send / stop button; `confirm-type="send"` with `@confirm` firing the send |
| Queue | Items can be removed individually (`remove-queued`) | Queue entries render read-only |
| Selection | Exposes `agents` / `permissions` / `models` / `vendors` / `rememberSelection` / `update:modelId` / `update:agentId` | No selectors, therefore none of those props or events |
| Theme | Supports `theme` | No `theme`; override `--sn-mp-*` tokens instead |
| Contract | `SnAiMessage`, stream deltas and `SnAiError` are identical (from the `@snui/templates` shared layer) | Same |

## Accessibility

- The header uses a semantic heading; each transcript row carries `data-status` for assistive tech and tests
- Accessible names for the input, send and stop controls come from the composer template
- While running, the send button becomes stop and its accessible name changes with it
- Every icon-only button has an accessible name, and attachment / queue row remove buttons include the item's name

## Abort and cleanup

- Clicking stop aborts `signal`; the turn is marked `aborted` ("已停止生成") and keeps whatever it already produced
- The template owns one `AbortController` per run and releases it when the turn ends, so nothing accumulates
- Unmounting the page (`onBeforeUnmount`) aborts any turn still running, so no request outlives the page
- Passing `signal` through to `fetch` / `uni.request` is all a host needs to do to get all of the above

## FAQ

**Q: Is `v-model:messages` required?**
You can use `:messages` plus `@update:messages`, but two-way binding is less work. The template keeps a local transcript copy, so a host backfilling `messages` asynchronously cannot drop stream deltas.

**Q: Why did nothing happen after I sent?**
Check for `NO_RUNNER`: without `run` the page still renders but no turn can start.

**Q: What happens when `run` throws?**
The template marks the turn failed, writes the structured error and renders an error card in the transcript, and fires `error`. When the user clicks retry, `retry` fires and you call `run` again there.

**Q: How do I turn queuing off?**
`:allow-queue="false"` — extra submissions while running are dropped instead of queued.

**Q: Does it upload attachments?**
No. The composer template hands the files the user picked to the host through `attach`; uploading and credentials are the host's responsibility.
