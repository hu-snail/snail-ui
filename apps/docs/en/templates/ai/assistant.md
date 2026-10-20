# AI Assistant SnAiAssistant

The whole AI suite in one page: header + transcript + composer, **plus a pre-wired model-config drawer**. It is the chat page `SnAiChat` with a model-config entry point added, so one component gives you a complete AI page that can both chat and change models.

> Platform: `Web`

## When to use

- You need a ready-made AI page: it must chat *and* let the user switch models and tune parameters
- You do not want to assemble "chat page + model-config panel + drawer + the vendor list they share" yourself
- Model config should appear as a drawer that does not interrupt the conversation (instead of a separate settings page)
- You need your own header buttons (history, share, clear), which the `header-actions` slot provides
- You only want one piece (composer only, transcript only, config panel only) — import the matching sub-template instead, see "The unified template and its on-demand sub-templates"

## Install and on-demand loading

Styles are emitted **per template**: importing one template brings its own JS and its own CSS, and there is no all-templates style barrel. Three things:

```ts
// 1) Import only the template you use: its JS and its own styles come with it
import { SnAiAssistant } from '@snui/templates/web/assistant'

// 2) Import the shared token layer once at the app entry
import '@snui/templates/styles'

// 3) When you want to control code splitting yourself, import a single template's stylesheet
import '@snui/templates/styles/web-assistant.css'
```

The per-template stylesheets (all under `@snui/templates/styles/`):

| File | Template |
| --- | --- |
| `web-assistant.css` | `@snui/templates/web/assistant` |
| `web-chat.css` | `@snui/templates/web/chat` |
| `web-prompt.css` | `@snui/templates/web/prompt` |
| `web-message-list.css` | `@snui/templates/web/message-list` |
| `web-model-config.css` | `@snui/templates/web/model-config` |
| `uni-chat.css` | `@snui/templates/uni/chat` |
| `uni-message-list.css` | `@snui/templates/uni/message-list` |

Importing `web-assistant.css` does **not** pull the other templates' rules; the shared token layer exists once (step 2), so a second template does not download it again.

## Quick start

The smallest working version: chatting comes from `SnAiChat`, and the model-config drawer is wired by this template.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SnAiAssistant } from '@snui/templates/web/assistant'
import type { SnAiRunTurn } from '@snui/templates/web/chat'
import type { SnAiMessage, SnAiVendor } from '@snui/templates/web'

const messages = ref<SnAiMessage[]>([])
const vendors = ref<SnAiVendor[]>([])

const run: SnAiRunTurn = async (turn, { emit }) => {
  emit({ type: 'text', text: `You said: ${turn.text}` })
}
</script>

<template>
  <SnAiAssistant
    v-model:messages="messages"
    :run="run"
    :vendors="vendors"
    title="AI assistant"
    @update:vendors="vendors = $event"
  />
</template>
```

A "model config" button appears on the right of the header; opening it reveals the full model-config panel (vendor list, endpoint and credential, model inventory, generation parameters).

## Full integration example

This wires three things at once: real streaming chat, editing vendors and models inside the drawer, and syncing the drawer's selected model to the composer's model picker.

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { SnAiAssistant } from '@snui/templates/web/assistant'
import { SnButton } from '@snui/vue-web'
import type { SnAiRunTurn } from '@snui/templates/web/chat'
import type { SnAiMessage, SnAiModelParams, SnAiVendor } from '@snui/templates/web'

const messages = ref<SnAiMessage[]>([])
const vendors = ref<SnAiVendor[]>([])
const activeVendorId = ref<string | undefined>(undefined)
const activeModelId = ref<string | undefined>(undefined)
const params = ref<SnAiModelParams>({ temperature: 0.7, stream: true })
/** The host owns the drawer state, e.g. to mirror it into the URL or analytics. */
const configOpen = ref(false)

/** The composer's model picker and the drawer share one vendor list. */
const models = computed(() => vendors.value.flatMap((vendor) => vendor.models ?? []))

const run: SnAiRunTurn = async (turn, { signal, emit }) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      prompt: turn.text,
      agentId: turn.agentId,
      permission: turn.permission,
      modelId: turn.modelId ?? activeModelId.value,
      params: params.value,
    }),
    // Stop in the drawer and page unmount both abort it.
    signal,
  })
  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  for (;;) {
    const { value, done } = await reader.read()
    if (done) break
    emit({ type: 'text', text: decoder.decode(value, { stream: true }) })
  }
}

/** The host really verifies the endpoint and credential; this only marks the card as testing. */
const testingVendorId = ref<string | undefined>(undefined)
function onTestConnection({ vendorId }: { vendorId: string }): void {
  testingVendorId.value = vendorId
}
</script>

<template>
  <SnAiAssistant
    v-model:messages="messages"
    v-model:active-vendor-id="activeVendorId"
    v-model:active-model-id="activeModelId"
    v-model:model-config-open="configOpen"
    :run="run"
    :vendors="vendors"
    :models="models"
    v-model:params="params"
    title="AI assistant"
    model-config-title="Models and parameters"
    :model-config-width="480"
    @update:vendors="vendors = $event"
    @update:params="params = $event"
    @test-connection="onTestConnection"
    @error="({ error }) => console.warn(error.code)"
  >
    <!-- Rendered after the model config button: your own header actions go here -->
    <template #header-actions>
      <SnButton size="small" @click="messages = []">Clear conversation</SnButton>
    </template>
  </SnAiAssistant>
</template>
```

To skip the drawer entirely, set `:show-model-config="false"`: the header entry point disappears and the drawer is not mounted at all, which reduces the template to a plain chat page.

## Demos

### The unified template: chat plus model-config drawer

Open "model config" in the header to add and remove vendors and models, edit the endpoint and credential, and tune generation parameters; the drawer's model selection and the composer's picker share one vendor list and stay in sync.

<Demo name="ai-assistant-web-basic" description="A model config entry point in the header plus the vendor / model / parameter panel in the drawer, sharing one data source with the composer." />

## API

### Props

It inherits every `SnAiChat` prop and event unchanged: `messages`, `run`, `agents`, `permissions`, `models`, `vendors`, `theme`, `title`, `subtitle`, `disabled`, `allowQueue`, `showHeader`, `loading`, `rememberSelection`, and the events `update:messages`, `turn-start`, `turn-end`, `error`, `retry`, `update:modelId`, `update:agentId`. See [AI chat page](/en/templates/ai/chat#props) for the per-field descriptions.

Beyond those, this template adds only the members below:

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `showModelConfig` | `boolean` | `true` | Show the header "model config" entry point and the drawer |
| `modelConfigTitle` | `string` | `'模型配置'` | Drawer heading, also the entry button's accessible name |
| `modelConfigWidth` | `number \| string` | `420` | Drawer width; a number is treated as px |
| `modelConfigOpen` | `boolean \| undefined` | `undefined` | Controlled drawer visibility; the template remembers it when unset |
| `activeVendorId` | `string \| undefined` | `undefined` | Vendor passed to the model config |
| `activeModelId` | `string \| undefined` | `undefined` | Model passed to the model config |
| `params` | `SnAiModelParams \| undefined` | `undefined` | Generation parameters passed to the model config |
| `editableModels` | `boolean` | `true` | Offer add / edit / delete affordances inside the drawer |
| `vendors` | `SnAiVendor[] \| undefined` | `undefined` | Configured vendors. The drawer and the composer's model picker share this one list |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `update:modelConfigOpen` | `boolean` | Drawer visibility changed |
| `update:vendors` | `SnAiVendor[]` | A vendor or one of its models changed in the drawer |
| `update:activeVendorId` | `string` | The drawer switched vendors |
| `update:activeModelId` | `string` | The drawer switched the active model |
| `update:params` | `SnAiModelParams` | Generation parameters changed in the drawer |
| `test-connection` | `{ vendorId }` | Ask the host to verify this vendor's endpoint and credential |

Both the prop and the event match the model config template (`params` / `update:params`), so `v-model:params` works and the same handler can be handed to `SnModelConfig` unchanged.

### Slots

| Name | Props | Description |
| --- | --- | --- |
| `header-actions` | — | Custom actions on the right of the header, rendered after the model config button |
| `model-config` | `{ close }` | Replace the drawer body; `close()` closes the drawer through the same state |
| `transcript` | `{ messages, empty }` | Forwarded from `SnAiChat`, replaces the whole transcript area |
| `toolbar` | — | Forwarded from `SnAiChat`, extra controls in the composer toolbar |

### Type exports

| Name | From | Description |
| --- | --- | --- |
| `SnAiAssistant` | `@snui/templates/web/assistant` | The template component itself. |
| `SnAiRunTurn` | `@snui/templates/web/chat` | The runner signature. |
| `SnAiMessage` / `SnAiVendor` / `SnAiModelParams` and friends | `@snui/templates` | Shared contract types so a host can build data. |

## Theme and token customisation

`theme` is forwarded straight to the inner chat page, so it behaves exactly like `SnAiChat`: any value other than `default` adds a `snui-skin-<theme>` class to `<body>`, where the style pack overrides tokens and skin CSS. Available values: `default`, `dark`, `ios`, `doodle`, `sticky-note`.

```vue
<SnAiAssistant title="iOS look" theme="ios" :run="run" />
```

The drawer hosts the model-config template, so overriding the same `--sn-web-*` aliases affects both the conversation and the drawer:

```css
/* Fine-grained override on the page root */
.sn-ai-assistant {
  --sn-web-color-background-surface: #faf7f0;
  --sn-web-color-border-subtle: rgba(0, 0, 0, 0.08);
  --sn-web-spacing-5: 20px;
}
```

Drawer width is not a token; use the `model-config-width` prop.

## Accessibility

- The model config entry point is a button with an accessible name taken from `modelConfigTitle`, mirrored into a `title` tooltip
- The drawer comes from the base drawer component, which owns focus management, the overlay and Escape-to-close; focus returns to the entry button on close
- Each transcript row carries `data-status` for assistive tech and tests
- Accessible names for the composer's input, send and stop controls come from the composer template, and the send button's name follows the running state
- Controls you put in the `header-actions` slot are your own responsibility to label

## Abort and cleanup

- Turn abort is entirely owned by the inner chat page: stop aborts `signal`, and unmounting aborts any turn still running
- This template creates no extra subscriptions or timers; toggling the drawer only changes visibility and never rebuilds the transcript, so it cannot interrupt a generating turn
- With `:show-model-config="false"` the drawer is not mounted at all, so no listener is left behind

## FAQ

**Q: How exactly does it relate to `SnAiChat`?**
`SnAiAssistant` is the umbrella template of the AI suite: inside, it *is* `SnAiChat` plus the model-config entry point and drawer. `SnAiChat` remains available when you want a **plain chat page** with no config entry point. The props and events are fully compatible, so switching from `SnAiChat` only means renaming the tag.

**Q: What if I only want the composer (or only the config panel)?**
Import the sub-template on demand: `@snui/templates/web/prompt`, `@snui/templates/web/model-config`, `@snui/templates/web/message-list`. See "The unified template and its on-demand sub-templates" in the [templates overview](/en/templates/overview).

**Q: Can the component read the credential in the drawer?**
No. The credential is only ever written into the vendor object you passed in; the component exposes no separate credential event channel and never logs it.

**Q: How do I open the drawer by default?**
Use the controlled form: `v-model:model-config-open="configOpen"` with `configOpen` initialised to `true`.

**Q: Does the drawer's model reach `run`?**
The drawer's selected model leaves through `v-model:active-model-id`, while `turn.modelId` comes from the composer's picker. Whether they share one state is your decision as the host (bind `activeModelId` to the composer as well, as the full example does).
