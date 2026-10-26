# AI Prompt AiPrompt

The AI composer: multi-line input, attachment panel, agent / permission / model selectors, reasoning-tier control, send and stop, plus the pending message queue. It is the complete composer block, for pages that own their own transcript.

> Platform: `Web`

## When to use

- Your page already owns its transcript and you only need a fully-featured composer
- You need attachments, agent, permission, model and reasoning tier grouped with the send action
- You need submissions to queue while a turn is still generating instead of being dropped
- You need a few extra controls in the toolbar (`toolbar` slot) or a hint line under the composer (`hint` slot)
- You need a reusable input component inside a non-chat page (for example a "one-line generate" dialog)

## Install and on-demand loading

Styles are emitted **per template**: importing one template brings its own JS and its own CSS, and there is no all-templates style barrel. Three things:

```ts
// 1) Import only the template you use: its JS and its own styles come with it
import { SnAiPrompt } from '@snui/templates/web/prompt';

// 2) Import the shared token layer once at the app entry
import '@snui/templates/styles';

// 3) When you want to control code splitting yourself, import a single template's stylesheet
import '@snui/templates/styles/web-prompt.css';
```

The per-template stylesheets (all under `@snui/templates/styles/`):

| File                   | Template                           |
| ---------------------- | ---------------------------------- |
| `web-prompt.css`       | `@snui/templates/web/prompt`       |
| `web-chat.css`         | `@snui/templates/web/chat`         |
| `web-assistant.css`    | `@snui/templates/web/assistant`    |
| `web-message-list.css` | `@snui/templates/web/message-list` |
| `web-model-config.css` | `@snui/templates/web/model-config` |
| `uni-chat.css`         | `@snui/templates/uni/chat`         |
| `uni-message-list.css` | `@snui/templates/uni/message-list` |

Importing `web-prompt.css` does **not** pull the chat page, message list or model config rules; the shared token layer exists once (step 2), so a second template does not download it again.

## Quick start

The smallest working version: a composer plus a handler for a composed turn.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { SnAiPrompt } from '@snui/templates/web/prompt';
import type { SnAiQueuedTurn } from '@snui/templates/web';

const draft = ref('');
const active = ref(false);

function onSend(turn: SnAiQueuedTurn): void {
  active.value = true;
  console.info('Turn composed:', turn.text, turn.attachments);
  // Your own transcript starts consuming the turn here
  setTimeout(() => {
    active.value = false;
  }, 1200);
}
</script>

<template>
  <SnAiPrompt v-model="draft" :active="active" @send="onSend" @stop="active = false" />
</template>
```

Send availability is decided by the component: the draft has text, or at least one attachment is present.

## Full integration example

Wiring the composer to a real backend: `send` gives you the composed turn, which renders a user message first and then streams the answer; `stop` aborts the request, and queue entries removed by the reader are reconciled through `remove-queued`.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { SnAiPrompt } from '@snui/templates/web/prompt';
import { SnAiMessageList } from '@snui/templates/web/message-list';
import type { SnAiAttachment, SnAiMessage, SnAiQueuedTurn } from '@snui/templates/web';

const draft = ref('');
const messages = ref<SnAiMessage[]>([]);
const queue = ref<SnAiQueuedTurn[]>([]);
const active = ref(false);
const attachments = ref<SnAiAttachment[]>([]);
const controller = ref<AbortController | null>(null);

async function consume(turn: SnAiQueuedTurn): Promise<void> {
  // 1) Write the user turn into the transcript first, so the UI reacts immediately
  messages.value = [
    ...messages.value,
    { id: turn.id, role: 'user', parts: [{ type: 'text', text: turn.text }], status: 'done' },
  ];

  // 2) Stream the answer
  const abort = new AbortController();
  controller.value = abort;
  active.value = true;
  const reply: SnAiMessage = {
    id: `${turn.id}-reply`,
    role: 'assistant',
    parts: [{ type: 'text', text: '' }],
    status: 'streaming',
  };
  messages.value = [...messages.value, reply];

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prompt: turn.text, modelId: turn.modelId }),
      signal: abort.signal,
    });
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      const part = reply.parts[0];
      reply.parts = [
        { type: 'text', text: (part?.type === 'text' ? part.text : '') + decoder.decode(value, { stream: true }) },
      ];
      messages.value = [...messages.value];
    }
    reply.status = 'done';
  } catch (error) {
    reply.status = abort.signal.aborted ? 'aborted' : 'error';
    if (!abort.signal.aborted) console.warn('Turn failed:', error);
  } finally {
    active.value = false;
    controller.value = null;
    // 3) Start the next queued turn
    const next = queue.value.shift();
    if (next) void consume(next);
  }
}

function onSend(turn: SnAiQueuedTurn): void {
  if (active.value) queue.value = [...queue.value, turn];
  else void consume(turn);
}

function onRemoveQueued(id: string): void {
  queue.value = queue.value.filter((turn) => turn.id !== id);
}

function onAttach(files: File[]): void {
  // Uploading belongs to the host: write the result back into `attachments`, and set `status: 'error'` when it fails.
  console.info(
    'Pending upload:',
    files.map((file) => file.name),
  );
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
      placeholder="Describe your question; Enter sends"
      @send="onSend"
      @stop="controller?.abort()"
      @remove-queued="onRemoveQueued"
      @attach="onAttach"
    />
  </div>
</template>
```

## Demos

### Full toolbar

The attachment panel, the three selectors, the reasoning slider, the send/stop swap and the queue row all appear in one demo.

<Demo name="ai-prompt-web-basic" description="Paste an image into the composer to get a chip with a clickable thumbnail; sending puts it into a running state and sending again shows the queue row." />

## API

### Props

| Name            | Type                     | Default                                      | Description                                                         |
| --------------- | ------------------------ | -------------------------------------------- | ------------------------------------------------------------------- |
| `modelValue`    | `string`                 | `undefined`                                  | Draft text. Use with `v-model`.                                     |
| `attachments`   | `SnAiAttachment[]`       | `undefined`                                  | Files currently attached.                                           |
| `agents`        | `SnAiAgent[]`            | `undefined`                                  | Candidates for the agent selector.                                  |
| `agentId`       | `string`                 | `undefined`                                  | Currently selected agent.                                           |
| `permissions`   | `SnAiPermissionOption[]` | `undefined`                                  | Permission options; the four standard scopes are used when omitted. |
| `permission`    | `SnAiPermission`         | `undefined`                                  | Currently selected permission scope.                                |
| `models`        | `SnAiModel[]`            | `undefined`                                  | Candidates for the model picker.                                    |
| `modelId`       | `string`                 | `undefined`                                  | Currently selected model.                                           |
| `thinkingLevel` | `SnAiThinkingLevel`      | `undefined`                                  | Reasoning tier.                                                     |
| `active`        | `boolean`                | `undefined`                                  | Whether a turn is running; decides send vs stop.                    |
| `queued`        | `SnAiQueuedTurn[]`       | `undefined`                                  | The pending queue.                                                  |
| `disabled`      | `boolean`                | `false`                                      | Disable the whole composer.                                         |
| `placeholder`   | `string`                 | `'输入消息，Enter 发送，Shift + Enter 换行'` | Input placeholder.                                                  |
| `maxlength`     | `number`                 | `undefined`                                  | Maximum draft length.                                               |
| `accept`        | `string`                 | `undefined`                                  | File picker accept filter.                                          |
| `showThinking`  | `boolean`                | `true`                                       | Offer the reasoning-tier control.                                   |
| `showQueue`     | `boolean`                | `true`                                       | Render the pending queue.                                           |
| `rows`          | `number`                 | `3`                                          | Initial text-area rows.                                             |

### Events

| Name                   | Payload             | Description                                                     |
| ---------------------- | ------------------- | --------------------------------------------------------------- |
| `update:modelValue`    | `string`            | Draft changed.                                                  |
| `update:attachments`   | `SnAiAttachment[]`  | Attachments added or removed.                                   |
| `update:agentId`       | `string`            | Agent changed.                                                  |
| `update:permission`    | `SnAiPermission`    | Permission scope changed.                                       |
| `update:modelId`       | `string`            | Model changed.                                                  |
| `update:thinkingLevel` | `SnAiThinkingLevel` | Reasoning tier changed.                                         |
| `send`                 | `SnAiQueuedTurn`    | A turn is composed and ready to run.                            |
| `stop`                 | —                   | Stop the running turn.                                          |
| `remove-queued`        | `string`            | Remove a queued turn.                                           |
| `attach`               | `File[]`            | The user picked or pasted files; uploading belongs to the host. |

### Slots

| Name      | Props               | Description                    |
| --------- | ------------------- | ------------------------------ |
| `toolbar` | —                   | Extra controls in the toolbar. |
| `queue`   | `{ turns, remove }` | Custom queue row rendering.    |
| `hint`    | —                   | Hint line under the composer.  |

### Type exports

| Name                                                          | From                         | Description                                     |
| ------------------------------------------------------------- | ---------------------------- | ----------------------------------------------- |
| `SnAiPrompt`                                                  | `@snui/templates/web/prompt` | The template component itself.                  |
| `SnAiQueuedTurn` / `SnAiAttachment` / `SnAiModel` and friends | `@snui/templates`            | Shared contract types so a host can build data. |

### Interaction contract

| Behaviour          | Contract                                                                                                                                              |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Send               | `Enter` sends; `Shift + Enter` inserts a newline                                                                                                      |
| IME                | `Enter` during an input-method composition never sends                                                                                                |
| Send availability  | The draft has text, or at least one attachment is present                                                                                             |
| While running      | The send button becomes stop and emits `stop`                                                                                                         |
| Reasoning tier     | The control is not rendered when the picked model cannot reason                                                                                       |
| Attachments        | Pick from the panel, or paste an image / file straight into the composer; both are handed to the host through the same `attach` event                 |
| Attachment preview | Click the chip's thumbnail / glyph to preview: images open the lightbox, other files open in a new tab. Requires the host to set `SnAiAttachment.url` |

## Theme and token customisation

The composer takes no `theme` prop; it inherits the app-level style pack: as long as an ancestor is a `SnConfigProvider` (or a style pack is mounted at the app entry), the `--sn-web-*` aliases it consumes follow along.

```vue
<SnConfigProvider skin="ios">
  <SnAiPrompt v-model="draft" @send="onSend" />
</SnConfigProvider>
```

To change only this block, override the `--sn-web-*` aliases:

```css
/* Fine-grained override on the composer root */
.sn-ai-prompt {
  --sn-web-color-background-surface: #faf7f0;
  --sn-web-color-border-subtle: rgba(0, 0, 0, 0.08);
  --sn-web-spacing-3: 12px;
}
```

## Accessibility

- The composer has an accessible name; the attachment button declares `aria-haspopup` and `aria-expanded`
- Every icon-only button carries an `aria-label`
- Remove buttons on attachment and queue rows include the item's name
- Send and stop are two distinct accessible names, and the name follows the running state

## Abort and cleanup

- The composer **never issues or holds** a request: aborting is the host's job, so kill your own `fetch` / `uni.request` when `stop` arrives
- Attachments leave only as `File[]` through `attach`; the component creates no upload task, so there is no request to reclaim
- The component registers no global listeners and creates no timers, so nothing is left behind on unmount
- The queue is controlled data: `remove-queued` only reports the intent, and the host decides whether to remove the entry

## FAQ

**Q: Does the composer consume the queue itself?**
No. It renders the pending entries and reports "start a turn" / "remove this entry" through `send` and `remove-queued`; scheduling lives in the host (or use the [AI chat page](/en/templates/ai/chat), which has scheduling built in).

**Q: Why is the reasoning-tier control missing?**
Either `showThinking` is `false`, or the model currently selected in `models` cannot reason (`supportsThinking` is off). Both cases skip rendering the control.

**Q: How do I show a failed attachment upload?**
Set `SnAiAttachment.status` to `'error'`; the attachment row then renders in the warning colour.

**Q: Can I change the key behaviour?**
No. `Enter` to send and `Shift + Enter` for a newline are fixed, and `Enter` during an IME composition never sends.

**Q: Can I omit `queued`?**
Yes. Without it there is no queue row; `showQueue` lets you hide the rendering while keeping the data.

**Q: How do I make an attachment previewable?**
Set `SnAiAttachment.url` once the upload finishes: images then render a thumbnail that opens the lightbox, and other files open in a new tab when clicked. A chip without a `url` (still uploading, say) keeps its glyph and is not clickable.
