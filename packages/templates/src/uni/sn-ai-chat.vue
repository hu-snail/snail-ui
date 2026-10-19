<script setup lang="ts">
/**
 * sn-ai-chat — uni-end conversation page (AUI-TPL-002).
 *
 * The uni counterpart of the web `SnAiChat`: same transcript contract, same
 * queue semantics, same abort behaviour — different markup. The turn scheduler
 * is deliberately identical to the web page so a host can swap ends without
 * re-learning the flow, and both fold deltas through the shared
 * `applyStreamDelta`.
 *
 * Reference library: wot-ui (AGENTS.md §112 — uni end aligns to wot-ui).
 *
 * Per AGENTS.md §40/§41 an in-flight turn is abortable, and the page aborts it
 * on unmount so no work outlives the page.
 *
 * Usage:
 *   <sn-ai-chat :messages="messages" :run="runTurn" @update:messages="onMessages" />
 */
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import SnButton from '@snui/uni/components/sn-button/sn-button.vue'
import SnIcon from '@snui/uni/components/sn-icon/sn-icon.vue'
import { SendIcon, StopIcon } from '../shared/icons'
import {
  applyStreamDelta,
  createAssistantMessage,
  createUserMessage,
  markAborted,
  markDone,
  markError,
  nextId,
} from '../shared/stream'
import type { SnAiError, SnAiMessage, SnAiQueuedTurn } from '../shared/types'
import type { SnAiStreamDelta } from '../shared/stream'
import SnAiMessageRow from './sn-ai-message.vue'

defineOptions({ name: 'SnAiChat' })

/**
 * A host's turn runner — the same contract as the web page: it receives the
 * turn plus an AbortSignal and a delta sink, and resolves when the turn ends.
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
    messages?: SnAiMessage[] | undefined
    /** The host's turn runner. */
    run?: SnAiRunTurn | undefined
    /** Page title. */
    title?: string | undefined
    /** Prompt placeholder. */
    placeholder?: string | undefined
    /** Disable the whole page. */
    disabled?: boolean | undefined
    /** Whether extra submissions queue up instead of being dropped. */
    allowQueue?: boolean | undefined
    /** Show the header chrome. */
    showHeader?: boolean | undefined
    /** Loading state for history fetch. */
    loading?: boolean | undefined
  }>(),
  {
    messages: undefined,
    run: undefined,
    title: 'AI 助手',
    placeholder: '输入消息',
    disabled: false,
    allowQueue: true,
    showHeader: true,
    loading: false,
  },
)

const emit = defineEmits<{
  (e: 'update:messages', messages: SnAiMessage[]): void
  (e: 'turn-start', turn: SnAiQueuedTurn): void
  (e: 'turn-end', payload: { turn: SnAiQueuedTurn; message: SnAiMessage }): void
  (e: 'error', payload: { turn: SnAiQueuedTurn; error: SnAiError }): void
  (e: 'retry', message: SnAiMessage): void
}>()

/** Draft text bound to the composer. */
const draft = ref('')
/** Turns accepted but not yet dispatched. */
const queue = ref<SnAiQueuedTurn[]>([])
/** The turn currently in flight, if any. */
const activeTurn = ref<SnAiQueuedTurn | null>(null)
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
const isActive = computed(() => activeTurn.value !== null)
const canSend = computed(() => draft.value.trim().length > 0)

function setMessages(next: SnAiMessage[]): void {
  emit('update:messages', next)
}

function patchMessage(id: string, updater: (message: SnAiMessage) => SnAiMessage): void {
  setMessages(messagesRef.value.map((message) => (message.id === id ? updater(message) : message)))
}

/** Normalize any thrown value into the structured error contract (§28). */
function toStructuredError(caught: unknown): SnAiError {
  if (caught && typeof caught === 'object' && 'code' in caught && 'message' in caught) {
    const shape = caught as { code: unknown; message: unknown }
    return { code: String(shape.code), message: String(shape.message), retryable: true }
  }
  if (caught instanceof Error) {
    return { code: 'TURN_FAILED', message: caught.message, retryable: true }
  }
  return { code: 'TURN_FAILED', message: '生成失败', retryable: true }
}

/** Run one queued turn end to end, then drain the queue. */
async function dispatch(turn: SnAiQueuedTurn): Promise<void> {
  const userMessage = createUserMessage(turn.text, turn.attachments)
  const assistantMessage = createAssistantMessage({ modelId: turn.modelId })

  activeTurn.value = turn
  controller = new AbortController()
  setMessages([...messagesRef.value, userMessage, assistantMessage])
  emit('turn-start', turn)

  const signal = controller.signal
  try {
    if (!props.run) {
      throw Object.assign(new Error('未配置运行器'), { code: 'NO_RUNNER' })
    }
    await props.run(turn, {
      signal,
      messageId: assistantMessage.id,
      emit: (delta) => {
        patchMessage(assistantMessage.id, (message) => applyStreamDelta(message, delta))
      },
    })
    patchMessage(assistantMessage.id, markDone)
    const settled = messagesRef.value.find((message) => message.id === assistantMessage.id)
    if (settled) emit('turn-end', { turn, message: settled })
  } catch (caught) {
    const aborted = signal.aborted || (caught instanceof Error && caught.name === 'AbortError')
    if (aborted) {
      patchMessage(assistantMessage.id, markAborted)
    } else {
      const error = toStructuredError(caught)
      patchMessage(assistantMessage.id, (message) => markError(message, error))
      emit('error', { turn, error })
    }
    const settled = messagesRef.value.find((message) => message.id === assistantMessage.id)
    if (settled) emit('turn-end', { turn, message: settled })
  } finally {
    controller = null
    activeTurn.value = null
    const [next, ...rest] = queue.value
    queue.value = rest
    if (next) void dispatch(next)
  }
}

/** Accept the composed draft: run it now, or queue it behind the active turn. */
function onSend(): void {
  if (props.disabled || !canSend.value) return
  const turn: SnAiQueuedTurn = {
    id: nextId('sn-ai-turn'),
    text: draft.value.trim(),
    attachments: [],
    createdAt: Date.now(),
  }
  draft.value = ''
  if (isActive.value) {
    if (props.allowQueue) queue.value = [...queue.value, turn]
    return
  }
  void dispatch(turn)
}

/** Abort the in-flight turn. */
function onStop(): void {
  controller?.abort()
}

/** Retry a failed turn using the user text that preceded it. */
function onRetry(message: SnAiMessage): void {
  emit('retry', message)
  const list = messagesRef.value
  const index = list.findIndex((candidate) => candidate.id === message.id)
  let text = ''
  for (let i = index - 1; i >= 0; i -= 1) {
    const candidate = list[i]
    if (candidate?.role !== 'user') continue
    const part = candidate.parts.find((p) => p.type === 'text')
    if (part?.type === 'text') {
      text = part.text
      break
    }
  }
  const turn: SnAiQueuedTurn = {
    id: nextId('sn-ai-turn'),
    text,
    attachments: [],
    createdAt: Date.now(),
  }
  if (isActive.value) {
    if (props.allowQueue) queue.value = [...queue.value, turn]
    return
  }
  void dispatch(turn)
}

onBeforeUnmount(() => {
  controller?.abort()
  controller = null
})
</script>

<template>
  <view class="sn-ai-chat">
    <view v-if="showHeader" class="sn-ai-chat__header">
      <text class="sn-ai-chat__title">{{ title }}</text>
    </view>

    <scroll-view class="sn-ai-chat__transcript" scroll-y>
      <view v-if="loading" class="sn-ai-chat__loading">
        <text class="sn-ai-chat__loading-text">正在加载对话…</text>
      </view>
      <view v-else-if="!messagesRef.length" class="sn-ai-chat__empty">
        <text class="sn-ai-chat__empty-text">开始新的对话</text>
      </view>
      <template v-else>
        <SnAiMessageRow
          v-for="message in messagesRef"
          :key="message.id"
          :message="message"
          @retry="onRetry"
        />
      </template>
    </scroll-view>

    <!-- Pending queue -->
    <view v-if="queue.length" class="sn-ai-chat__queue">
      <text
        v-for="(turn, index) in queue"
        :key="turn.id"
        class="sn-ai-chat__queue-item"
      >
        {{ index + 1 }}. {{ turn.text }}
      </text>
    </view>

    <view class="sn-ai-chat__composer">
      <input
        v-model="draft"
        class="sn-ai-chat__input"
        :placeholder="placeholder"
        :disabled="disabled"
        confirm-type="send"
        @confirm="onSend"
      />
      <SnButton
        :type="isActive ? 'danger' : 'primary'"
        size="small"
        :disabled="disabled || (!isActive && !canSend)"
        @click="isActive ? onStop() : onSend()"
      >
        <SnIcon :icon="isActive ? StopIcon : SendIcon" :size="16" />
      </SnButton>
    </view>
  </view>
</template>

<style scoped>
.sn-ai-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--sn-mp-color-background-surface);
}

.sn-ai-chat__header {
  padding: var(--sn-mp-spacing-4) var(--sn-mp-spacing-5);
  border-bottom: 1px solid var(--sn-mp-color-border-subtle);
}

.sn-ai-chat__title {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-xl);
  font-weight: 600;
}

.sn-ai-chat__transcript {
  flex: 1;
  min-height: 0;
  padding: 0 var(--sn-mp-spacing-5);
}

.sn-ai-chat__loading,
.sn-ai-chat__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sn-mp-spacing-12) 0;
}

.sn-ai-chat__loading-text,
.sn-ai-chat__empty-text {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-sm);
}

/* Pending queue */
.sn-ai-chat__queue {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-2);
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-5);
}

.sn-ai-chat__queue-item {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
}

/* Composer */
.sn-ai-chat__composer {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sn-mp-spacing-3);
  padding: var(--sn-mp-spacing-4) var(--sn-mp-spacing-5);
  border-top: 1px solid var(--sn-mp-color-border-subtle);
}

.sn-ai-chat__input {
  flex: 1;
  min-width: 0;
  height: var(--sn-mp-input-height-medium);
  padding: 0 var(--sn-mp-input-padding-x);
  border: 1px solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-input-radius);
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
}
</style>
