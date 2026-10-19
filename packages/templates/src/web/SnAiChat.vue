<script setup lang="ts">
/**
 * SnAiChat — the full conversation page template.
 *
 * Composes the message list, the message module, and the prompt into one page,
 * and owns the piece the three do not: the turn scheduler. A host hands this
 * template a transcript plus a "run this turn" function; the template decides
 * when a turn may start, keeps extra submissions in a queue, and folds stream
 * deltas into the transcript through the shared `applyStreamDelta` fold so the
 * web and uni ends stay behaviourally identical.
 *
 * Why the scheduler lives here rather than in the host: queuing is a UI
 * concern — the user must see what is waiting and be able to cancel it. Keeping
 * it inside the template means every consumer gets the same queue semantics
 * instead of re-implementing them per app.
 *
 * Per AGENTS.md §40/§41 an in-flight turn is abortable and the page owns the
 * AbortController: `stop` aborts the signal and marks the turn aborted, and
 * unmounting aborts whatever is still running so no work outlives the page.
 *
 * Usage:
 *   <SnAiChat
 *     :messages="messages"
 *     :run="runTurn"
 *     @update:messages="messages = $event"
 *   />
 */
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { SnConfigProvider } from '@snui/vue-web'
import {
  applyStreamDelta,
  createAssistantMessage,
  createUserMessage,
  markAborted,
  markDone,
  markError,
  nextId,
} from '../shared/stream'
import type {
  SnAiAgent,
  SnAiError,
  SnAiMessage,
  SnAiModel,
  SnAiPermission,
  SnAiPermissionOption,
  SnAiQueuedTurn,
  SnAiThinkingLevel,
  SnAiVendor,
} from '../shared/types'
import type { SnAiStreamDelta } from '../shared/stream'
import SnAiMessageList from './SnAiMessageList.vue'
import SnAiPrompt from './SnAiPrompt.vue'

defineOptions({ name: 'SnAiChat' })

/**
 * A host's turn runner. It receives the queued turn plus an AbortSignal and a
 * delta sink, and resolves once the turn is complete. Emitting deltas through
 * the sink (instead of returning a final string) is what lets reasoning, tool
 * calls, and answer text interleave the way a real stream does.
 */
export type SnAiRunTurn = (
  turn: SnAiQueuedTurn,
  context: {
    signal: AbortSignal
    emit: (delta: SnAiStreamDelta) => void
    messageId: string
  },
) => Promise<void>

const props = withDefaults(
  defineProps<{
    /** The transcript, oldest first. Use with `update:messages`. */
    messages?: SnAiMessage[]
    /** The host's turn runner. */
    run?: SnAiRunTurn | undefined
    /** Agents offered by the prompt's agent selector. */
    agents?: SnAiAgent[] | undefined
    /** Permission scopes offered by the prompt. */
    permissions?: SnAiPermissionOption[] | undefined
    /** Models offered by the prompt's model picker. */
    models?: SnAiModel[] | undefined
    /** Vendors backing the model picker (used to label models by vendor). */
    vendors?: SnAiVendor[] | undefined
    /** Active skin (maps to the Style Pack system). */
    theme?: string | undefined
    /** Page title shown in the header. */
    title?: string
    /** Subtitle shown under the title. */
    subtitle?: string | undefined
    /** Disable the whole page. */
    disabled?: boolean
    /** Whether more than one turn may wait in the queue. Default true. */
    allowQueue?: boolean
    /** Show the header chrome. */
    showHeader?: boolean
    /** Loading state for history fetch. */
    loading?: boolean
    /** Persist the selected model / agent between turns. Default true. */
    rememberSelection?: boolean
  }>(),
  {
    messages: () => [],
    run: undefined,
    agents: () => [],
    permissions: undefined,
    models: () => [],
    vendors: () => [],
    theme: 'default',
    title: 'AI 助手',
    subtitle: undefined,
    disabled: false,
    allowQueue: true,
    showHeader: true,
    loading: false,
    rememberSelection: true,
  },
)

const emit = defineEmits<{
  /** The transcript changed (new turn, stream delta, or status change). */
  (e: 'update:messages', messages: SnAiMessage[]): void
  /** A turn started running. */
  (e: 'turn-start', turn: SnAiQueuedTurn): void
  /** A turn finished, failed, or was aborted. */
  (e: 'turn-end', payload: { turn: SnAiQueuedTurn; message: SnAiMessage }): void
  /** A turn failed. */
  (e: 'error', payload: { turn: SnAiQueuedTurn; error: SnAiError }): void
  /** The user asked to retry a turn. */
  (e: 'retry', message: SnAiMessage): void
  /** The user changed the active model. */
  (e: 'update:modelId', modelId: string): void
  /** The user changed the active agent. */
  (e: 'update:agentId', agentId: string): void
}>()

/* ── Local view state (selection is sticky across turns when asked) ───────── */

const localAgentId = ref<string | undefined>(undefined)
const localPermission = ref<SnAiPermission | undefined>(undefined)
const localModelId = ref<string | undefined>(undefined)
const localThinkingLevel = ref<SnAiThinkingLevel | undefined>(undefined)

/** The queue of turns accepted but not yet dispatched. */
const queue = ref<SnAiQueuedTurn[]>([])
/** The turn currently in flight, if any. */
const activeTurn = ref<SnAiQueuedTurn | null>(null)
/** The AbortController for the in-flight turn, so `stop` can cancel it. */
let controller: AbortController | null = null

const localMessages = ref<SnAiMessage[]>([...(props.messages ?? [])])

/**
 * The transcript the page renders and folds into. Kept local so a host that
 * updates `messages` asynchronously (or not at all, as in a demo) cannot drop
 * stream deltas mid-turn. Resynced whenever the host replaces the prop.
 */
watch(
  () => props.messages,
  (next) => {
    localMessages.value = [...(next ?? [])]
  },
)

const messagesRef = computed<SnAiMessage[]>(() => localMessages.value)

/** Whether a turn is in flight. */
const isActive = computed(() => activeTurn.value !== null)

/** Replace the transcript and notify the host. */
function setMessages(next: SnAiMessage[]): void {
  localMessages.value = next
  emit('update:messages', next)
}

/** Replace one message in the transcript, preserving order. */
function patchMessage(id: string, updater: (message: SnAiMessage) => SnAiMessage): void {
  setMessages(messagesRef.value.map((message) => (message.id === id ? updater(message) : message)))
}

/**
 * Run one queued turn: append the user turn, create the assistant placeholder,
 * then hand both the placeholder id and a delta sink to the host's runner.
 */
async function dispatch(turn: SnAiQueuedTurn): Promise<void> {
  const userMessage = createUserMessage(turn.text, turn.attachments)
  const assistantMessage = createAssistantMessage({
    agentId: turn.agentId,
    modelId: turn.modelId,
  })

  activeTurn.value = turn
  controller = new AbortController()
  setMessages([...messagesRef.value, userMessage, assistantMessage])
  emit('turn-start', turn)

  const signal = controller.signal
  try {
    if (!props.run) {
      // No runner wired: the page still renders the turn so a docs demo or a
      // storybook can show the streaming states without a backend.
      throw Object.assign(new Error('未配置运行器'), {
        code: 'NO_RUNNER',
        hint: '给 <SnAiChat :run="..."> 传入运行函数后即可真实对话',
      })
    }
    await props.run(turn, {
      signal,
      messageId: assistantMessage.id,
      emit: (delta) => {
        patchMessage(assistantMessage.id, (message) => applyStreamDelta(message, delta))
      },
    })
    patchMessage(assistantMessage.id, markDone)
    emit('turn-end', { turn, message: messagesRef.value.find((m) => m.id === assistantMessage.id)! })
  } catch (caught) {
    const aborted = signal.aborted || (caught instanceof Error && caught.name === 'AbortError')
    if (aborted) {
      patchMessage(assistantMessage.id, markAborted)
    } else {
      const error = toStructuredError(caught)
      patchMessage(assistantMessage.id, (message) => markError(message, error))
      emit('error', { turn, error })
    }
    const settled = messagesRef.value.find((m) => m.id === assistantMessage.id)
    if (settled) emit('turn-end', { turn, message: settled })
  } finally {
    controller = null
    activeTurn.value = null
    // Drain the next queued turn, if any.
    const [next, ...rest] = queue.value
    queue.value = rest
    if (next) void dispatch(next)
  }
}

/**
 * Normalize anything a runner may throw into the structured error contract.
 * Per AGENTS.md §28 core errors must carry a stable code, so an unknown throw
 * is wrapped rather than surfaced raw.
 */
function toStructuredError(caught: unknown): SnAiError {
  if (caught && typeof caught === 'object' && 'code' in caught && 'message' in caught) {
    const shape = caught as { code: unknown; message: unknown; hint?: unknown }
    return {
      code: String(shape.code),
      message: String(shape.message),
      hint: typeof shape.hint === 'string' ? shape.hint : undefined,
      retryable: true,
    }
  }
  if (caught instanceof Error) {
    return { code: 'TURN_FAILED', message: caught.message, retryable: true }
  }
  return { code: 'TURN_FAILED', message: '生成失败', retryable: true }
}

/** Accept a composed turn from the prompt: run it now or enqueue it. */
function onSend(turn: SnAiQueuedTurn): void {
  if (isActive.value) {
    if (!props.allowQueue) return
    queue.value = [...queue.value, turn]
    return
  }
  void dispatch(turn)
}

/** Abort the in-flight turn. */
function onStop(): void {
  controller?.abort()
}

/** Remove a queued turn the user cancelled. */
function onRemoveQueued(id: string): void {
  queue.value = queue.value.filter((turn) => turn.id !== id)
}

/** Retry a failed turn by re-dispatching its original composition. */
function onRetry(message: SnAiMessage): void {
  emit('retry', message)
  const turn: SnAiQueuedTurn = {
    id: nextId('sn-ai-turn'),
    text: findPrecedingUserText(message.id),
    attachments: [],
    agentId: message.agentId,
    modelId: message.modelId,
    createdAt: Date.now(),
  }
  onSend(turn)
}

/** The user text immediately preceding an assistant turn (retry context). */
function findPrecedingUserText(assistantId: string): string {
  const list = messagesRef.value
  const index = list.findIndex((message) => message.id === assistantId)
  for (let i = index - 1; i >= 0; i -= 1) {
    const candidate = list[i]
    if (candidate?.role !== 'user') continue
    const text = candidate.parts.find((part) => part.type === 'text')
    if (text?.type === 'text') return text.text
  }
  return ''
}

/** Keep the prompt's selection in sync when the user picks a new value. */
function onModelChange(modelId: string): void {
  if (props.rememberSelection) localModelId.value = modelId
  emit('update:modelId', modelId)
}

function onAgentChange(agentId: string): void {
  if (props.rememberSelection) localAgentId.value = agentId
  emit('update:agentId', agentId)
}

onBeforeUnmount(() => {
  // Abort whatever is still running: work must not outlive the page (§41).
  controller?.abort()
  controller = null
})

/** Whether the transcript is empty (drives the page's empty composition). */
const isEmpty = computed(() => messagesRef.value.length === 0)
</script>

<template>
  <SnConfigProvider :skin="theme ?? 'default'">
    <div class="sn-ai-chat" data-snui-component="ai-chat">
      <header v-if="showHeader" class="sn-ai-chat__header">
        <div class="sn-ai-chat__heading">
          <h1 class="sn-ai-chat__title">{{ title }}</h1>
          <p v-if="subtitle" class="sn-ai-chat__subtitle">{{ subtitle }}</p>
        </div>
        <div class="sn-ai-chat__header-actions">
          <slot name="header-actions" />
        </div>
      </header>

      <div class="sn-ai-chat__transcript">
        <slot name="transcript" :messages="messagesRef" :empty="isEmpty">
          <SnAiMessageList
            :messages="messagesRef"
            :loading="loading"
            @retry="onRetry"
          />
        </slot>
      </div>

      <footer class="sn-ai-chat__composer">
        <SnAiPrompt
          :agents="agents"
          :permissions="permissions"
          :models="models"
          :agent-id="localAgentId"
          :permission="localPermission"
          :model-id="localModelId"
          :thinking-level="localThinkingLevel"
          :active="isActive"
          :queued="queue"
          :disabled="disabled"
          @update:agent-id="onAgentChange"
          @update:permission="localPermission = $event"
          @update:model-id="onModelChange"
          @update:thinking-level="localThinkingLevel = $event"
          @send="onSend"
          @stop="onStop"
          @remove-queued="onRemoveQueued"
        >
          <template v-if="$slots.toolbar" #toolbar>
            <slot name="toolbar" />
          </template>
        </SnAiPrompt>
      </footer>
    </div>
  </SnConfigProvider>
</template>

<style scoped>
.sn-ai-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  background-color: var(--sn-web-color-background-surface);
}

.sn-ai-chat__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--sn-web-spacing-4);
  padding: var(--sn-web-spacing-5) var(--sn-web-spacing-6);
  border-bottom: 1px solid var(--sn-web-color-border-subtle);
}

.sn-ai-chat__heading {
  min-width: 0;
}

.sn-ai-chat__title {
  margin: 0;
  color: var(--sn-web-color-text-primary);
  font-size: var(--sn-web-font-size-xl);
  font-weight: var(--sn-web-font-weight-semibold);
  line-height: var(--sn-web-font-line-height-tight);
}

.sn-ai-chat__subtitle {
  margin: var(--sn-web-spacing-1) 0 0;
  color: var(--sn-web-color-text-tertiary);
  font-size: var(--sn-web-font-size-sm);
}

.sn-ai-chat__header-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-2);
}

.sn-ai-chat__transcript {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding-top: var(--sn-web-spacing-4);
}

.sn-ai-chat__composer {
  flex-shrink: 0;
  padding: var(--sn-web-spacing-4) var(--sn-web-spacing-5) var(--sn-web-spacing-5);
  border-top: 1px solid var(--sn-web-color-border-subtle);
}
</style>
