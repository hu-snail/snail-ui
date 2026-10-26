<script setup lang="ts">
/**
 * SnAiChat — the plain conversation page template.
 *
 * An assembly of three parts: the message list (transcript), the composer, and
 * the shared turn engine (`useAiTurnQueue`), which owns everything the parts do
 * not — when a turn may start, the queue of extra submissions, folding stream
 * deltas into the transcript, and aborting whatever is in flight so no work
 * outlives the page (AGENTS.md §40/§41).
 *
 * The engine is shared with `SnAiAssistant` rather than private to this page:
 * both pages schedule turns identically and differ only in layout and in which
 * satellites they bring, so the assistant can mount the same engine next to its
 * model-config drawer instead of wrapping this page to borrow its scheduler.
 *
 * Usage:
 *   <SnAiChat
 *     :messages="messages"
 *     :run="runTurn"
 *     @update:messages="messages = $event"
 *   />
 */
import { SnConfigProvider } from '@snui/vue-web'
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
import type { SnAiRunTurn as SnAiTurnRunner } from './use-ai-turn-queue'
import { useAiTurnQueue } from './use-ai-turn-queue'
import SnAiMessageList from './SnAiMessageList.vue'
import SnAiPrompt from './SnAiPrompt.vue'

defineOptions({ name: 'SnAiChat' })

/**
 * A host's turn runner — re-exported from the engine so consumers keep
 * importing it from the template they are wiring up.
 */
export type SnAiRunTurn = SnAiTurnRunner

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

const {
  messages,
  queue,
  isActive,
  isEmpty,
  agentId,
  permission,
  modelId,
  thinkingLevel,
  send,
  stop,
  removeQueued,
  retry,
  changeModel,
  changeAgent,
} = useAiTurnQueue({
  messages: () => props.messages,
  run: () => props.run,
  allowQueue: () => props.allowQueue,
  rememberSelection: () => props.rememberSelection,
  hostName: () => 'SnAiChat',
  hooks: {
    onMessages: (next) => emit('update:messages', next),
    onTurnStart: (turn) => emit('turn-start', turn),
    onTurnEnd: (payload) => emit('turn-end', payload),
    onError: (payload) => emit('error', payload),
    onRetry: (message) => emit('retry', message),
    onModelChange: (id) => emit('update:modelId', id),
    onAgentChange: (id) => emit('update:agentId', id),
  },
})

/* Permission and reasoning are pure view state, so they are set outright
 * instead of through the engine's reporting hooks. */
function setPermission(next: SnAiPermission): void {
  permission.value = next
}

function setThinkingLevel(next: SnAiThinkingLevel): void {
  thinkingLevel.value = next
}
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
        <slot name="transcript" :messages="messages" :empty="isEmpty">
          <SnAiMessageList
            :messages="messages"
            :loading="loading"
            @retry="retry"
          />
        </slot>
      </div>

      <footer class="sn-ai-chat__composer">
        <SnAiPrompt
          :agents="agents"
          :permissions="permissions"
          :models="models"
          :agent-id="agentId"
          :permission="permission"
          :model-id="modelId"
          :thinking-level="thinkingLevel"
          :active="isActive"
          :queued="queue"
          :disabled="disabled"
          @update:agent-id="changeAgent"
          @update:permission="setPermission"
          @update:model-id="changeModel"
          @update:thinking-level="setThinkingLevel"
          @send="send"
          @stop="stop"
          @remove-queued="removeQueued"
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