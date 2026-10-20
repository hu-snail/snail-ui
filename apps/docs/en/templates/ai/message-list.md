# Message List AiMessageList / sn-ai-message

The transcript module: message bubbles, collapsible reasoning, streaming output, tool-call rows, attachment rows, error cards and retry. The web end ships a list container plus a single-row renderer, the uni-app end ships the single-row renderer, and both ends share one message structure.

> Platform: `Web` (`SnAiMessageList` + the single-row `SnAiMessage` from `@snui/templates/web/message-list`) / `uni-app` (the single-row `SnAiMessage` from `@snui/templates/uni/message-list`)

## When to use

- You need to render a conversation as a readable transcript
- Reasoning should expand while generating and collapse once the answer starts
- Output should follow the newest content while streaming, but must not yank the view back once the reader scrolls up
- You need one message rendered outside a list: a quoted reply, a preview card, an export preview
- You need the same message structure in uni-app (this page covers both ends)

## Install and on-demand loading

Styles are emitted **per template**: importing one template brings its own JS and its own CSS, and there is no all-templates style barrel. Three things:

```ts
// 1) Import only the template you use: its JS and its own styles come with it
import { SnAiMessageList, SnAiMessage } from '@snui/templates/web/message-list'

// 2) Import the shared token layer once at the app entry
import '@snui/templates/styles'

// 3) When you want to control code splitting yourself, import a single template's stylesheet
import '@snui/templates/styles/web-message-list.css'
```

The uni-app end is the same:

```ts
import { SnAiMessage } from '@snui/templates/uni/message-list'
import '@snui/templates/styles'
import '@snui/templates/styles/uni-message-list.css'
```

The per-template stylesheets (all under `@snui/templates/styles/`):

| File | Template |
| --- | --- |
| `web-message-list.css` | `@snui/templates/web/message-list` |
| `uni-message-list.css` | `@snui/templates/uni/message-list` |
| `web-assistant.css` | `@snui/templates/web/assistant` |
| `web-chat.css` | `@snui/templates/web/chat` |
| `web-prompt.css` | `@snui/templates/web/prompt` |
| `web-model-config.css` | `@snui/templates/web/model-config` |
| `uni-chat.css` | `@snui/templates/uni/chat` |

Importing `web-message-list.css` does **not** pull the composer, chat page or model config rules; the shared token layer exists once (step 2), so a second template does not download it again.

`SnAiMessage` renders a single message and works outside a list (for a quoted reply or a preview card).

## Quick start

The smallest working version: a static transcript.

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
    parts: [{ type: 'text', text: 'Summarise this document for me.' }],
  },
  {
    id: 'a1',
    role: 'assistant',
    status: 'done',
    parts: [
      { type: 'thinking', text: 'Read the table of contents, then grab each heading.', done: true, durationMs: 2400 },
      { type: 'tool', name: 'read_file', status: 'done', detail: 'spec.md' },
      { type: 'text', text: 'The document has three sections: positioning, contract, integration.' },
    ],
  },
])

function onRetry(message: SnAiMessage): void {
  console.info('Retry requested:', message.id)
}
</script>

<template>
  <SnAiMessageList :messages="messages" @retry="onRetry" />
</template>
```

## Full integration example

A transcript usually pairs with a streaming request: fold the deltas into the message array as they arrive. This is the smallest usable version — update `parts` per delta instead of re-parsing a whole string.

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { SnAiMessageList, SnAiMessage as SnAiMessageRow } from '@snui/templates/web/message-list'
import type { SnAiError, SnAiMessage, SnAiQueuedTurn } from '@snui/templates/web'

const messages = ref<SnAiMessage[]>([])
const running = ref(false)
const quoted = ref<SnAiMessage | undefined>(undefined)
let controller: AbortController | null = null

/** Fold one request into the transcript: the reasoning block grows first, the answer follows. */
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

  /** Find this turn's assistant message and patch it in place. */
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

/** Retrying means running the original turn again. */
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

    <!-- The single-row renderer outside a list: a quoted bar -->
    <aside v-if="quoted" class="quoted">
      <SnAiMessageRow :message="quoted" :show-copy="false" :show-thinking="false" />
      <p class="quoted__hint">Quoted: {{ quotedText.slice(0, 40) }}</p>
    </aside>
  </div>
</template>
```

## Demos

### Standalone embedding

Only the message list is mounted — no composer — showing reasoning collapse, a tool row, an attachment row and the streaming caret.

<Demo name="ai-message-list-web-basic" description="Reasoning collapse + tool row + attachment row + streaming caret." />

### uni-app single message

The uni end ships the single-row renderer, showing reasoning collapse, a tool row, an attachment row, the streaming caret and error retry at mobile sizing.

<Demo name="ai-message-list-mp-basic" description="Reasoning collapse + tool row + attachment row + error retry." />

## API

### Props

`SnAiMessageList`:

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
| `stickThreshold` | `number` | `48` | How many pixels from the bottom still count as "pinned" before following stops. |

Single-row `SnAiMessage`:

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `message` | `SnAiMessage` | required | The message to render. |
| `copied` | `boolean` | `false` | Whether the copy button shows the copied confirmation. |
| `showThinking` | `boolean` | `true` | Keep reasoning blocks. |
| `showCopy` | `boolean` | `true` | Offer copy. |

`SnAiThinking` (the reasoning block itself, usable on its own):

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `part` | `SnAiThinkingPart` | required | The reasoning block to render. |
| `expanded` | `boolean` | `undefined` | Expansion state; `undefined` means auto — open while streaming, collapsed once closed. |
| `defaultCollapsed` | `boolean` | `false` | Force collapsed, taking priority over `expanded`. |

### Events

`SnAiMessageList`:

| Name | Payload | Description |
| --- | --- | --- |
| `retry` | `SnAiMessage` | The user clicked retry on a failed message. |
| `copy` | `SnAiMessage` | The user copied a message's answer. |
| `reach-bottom` | — | The user scrolled to the bottom of the transcript. |

Single-row `SnAiMessage`: `retry` and `copy` (same payloads).

### Slots

`SnAiMessageList`:

| Name | Props | Description |
| --- | --- | --- |
| `empty` | — | Custom empty state. |

Single-row `SnAiMessage`:

| Name | Props | Description |
| --- | --- | --- |
| `avatar` | — | Replace the avatar area (the role's default is used when unset). |

### Type exports

| Name | From | Description |
| --- | --- | --- |
| `SnAiMessageList` / `SnAiMessage` / `SnAiThinking` | `@snui/templates/web/message-list` | The list, single-row and reasoning-block renderers. |
| `SnAiMessage` / `SnAiMessagePart` / `SnAiThinkingPart` and friends | `@snui/templates` | Shared contract types so a host can build data. |

### Message structure

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
| `idle` | The resting state for user / system messages: the body renders as-is. |
| `queued` | Shows "排队中，等待上一条回复完成". |
| `thinking` | The reasoning block is live; shows "正在思考…" while there is no answer yet. |
| `streaming` | The answer grows with a caret. |
| `done` | Full answer plus a copy affordance. |
| `error` | The error card replaces the tail of the body. |
| `aborted` | Keeps the partial output and appends a "已停止生成" notice. |

## Theme and token customisation

Neither renderer takes a `theme` prop: they inherit the app-level style pack (an ancestor `SnConfigProvider`, or a style pack mounted at the app entry), so the `--sn-web-*` aliases they consume follow it.

```vue
<SnConfigProvider skin="ios">
  <SnAiMessageList :messages="messages" />
</SnConfigProvider>
```

To change only the transcript, override the `--sn-web-*` aliases:

```css
/* Fine-grained override on the list root */
.sn-ai-message-list {
  --sn-web-color-background-subtle: #f6f3ec;
  --sn-web-color-text-secondary: #5b564d;
  --sn-web-spacing-4: 18px;
}
```

The uni end overrides `--sn-mp-*` (its size tokens are rpx):

```css
.sn-ai-message {
  --sn-mp-color-background-subtle: #f6f3ec;
}
```

## End differences

Content blocks and statuses mean exactly the same on both ends; the structure and capabilities differ:

| Aspect | Web (`SnAiMessageList` / `SnAiMessage`) | uni-app (`SnAiMessage`) |
| --- | --- | --- |
| What ships | List container + single-row renderer + reasoning block, each usable alone | Single-row renderer only; the page builds the list with `v-for` |
| Elements | Standard `<div>` / `<ul>` / `<li>` tags | Cross-end `<view>` / `<text>` elements |
| Units | `--sn-web-*` tokens in px | `--sn-mp-*` tokens, sized in rpx |
| Scrolling | Own scroll area and a "jump to latest" button, tunable via `maxHeight` / `stickThreshold` | No scroll area: the uni chat page's `<scroll-view scroll-y>` owns it |
| Empty state | `emptyText` / `emptyHint` / the `empty` slot | None (rendered by the uni chat page) |
| Copy | `showCopy` + the `copy` event + the `copied` state | No copy capability |
| Avatar | Has the `avatar` slot | No avatar slot |
| Icons | Reuses the same path data, rendered by `SnIcon` | Reuses the same path data, rendered by `sn-icon` |
| Contract | `SnAiMessage`, content blocks and statuses come from the `@snui/templates` shared layer | Same |

## Accessibility

- Each message carries `data-status`, so assistive tech and tests can locate its state
- The reasoning disclosure button carries `aria-expanded`, matching the body's visibility, and the header names either "思考中" or the elapsed duration
- Retry and copy buttons have accessible names
- The error card states the code and hint as text, so colour is never the only signal

## Abort and cleanup

- The list creates its scroll observer in `onMounted` and disconnects it in `onBeforeUnmount`, so nothing is left behind
- The "copied" confirmation is driven by a timer that is cleared on unmount, so state is never written after unmount
- The transcript issues no requests: abort and cleanup belong to the host (or to the [AI chat page](/en/templates/ai/chat)), and `retry` only reports the intent
- `messages` is controlled data and the component keeps no copy, so replacing the whole array cannot leave ghost messages

## FAQ

**Q: Why did auto-scrolling stop once I scrolled up?**
That is intentional: the list places an observation point at the bottom — while it is visible the reader is at the bottom, and once it scrolls out of view the viewport stops being pulled down and a "jump to latest" button appears. `stickThreshold` tunes how much slack still counts as pinned.

**Q: The reasoning block stays after the turn ends — can I hide it?**
`:show-thinking="false"` removes the reasoning block once a turn finishes; if you only want it collapsed, use `SnAiThinking` directly with `default-collapsed`.

**Q: Does an `aborted` message lose what it produced?**
No. The partial output is kept and a "已停止生成" notice is appended.

**Q: Does the list replace the message when `retry` fires?**
No. The component only reports that the reader asked to retry; whether and how to re-run is the host's decision (the full example shows one approach).

**Q: Can I use the list container in uni-app too?**
No — the uni end ships only the single-row renderer `SnAiMessage`. Import `@snui/templates/uni/chat` to get a full transcript with a `<scroll-view>`.
