<script setup lang="ts">
/**
 * SnAiAssistant — the AI 套件 assembled into one page template.
 *
 * An assembly, not a wrapper: the transcript is the message-list template, the
 * input area is the composer template, the model config sits in the drawer
 * behind the header's entry point, and the turn engine (`useAiTurnQueue`)
 * supplies what the leaf templates deliberately do not own — scheduling, the
 * queue, stream folding and abort. Every one of those pieces is importable on
 * its own (`web/message-list`, `web/prompt`, `web/model-config`) for a host that
 * needs only one of them.
 *
 * `SnAiChat` mounts the same engine, the same message list and the same
 * composer, minus the model config; the two pages therefore cannot drift apart,
 * and this page adds no scheduling logic of its own.
 *
 * Prop / event surface: identical to `SnAiChat`'s (same names, same semantics)
 * plus the model-config members further down, so a host can move between the
 * pages by changing the tag.
 *
 * Usage:
 *   <SnAiAssistant
 *     v-model:messages="messages"
 *     :run="run"
 *     :vendors="vendors"
 *     v-model:active-model-id="modelId"
 *   />
 *
 * Without the drawer — the composer only:
 *   <SnAiAssistant :run="run" :show-model-config="false" />
 */
import { computed, ref } from 'vue'
import { SnButton, SnConfigProvider, SnDrawer, SnDrawerContent, SnIcon } from '@snui/vue-web'
import type {
  SnAiAgent,
  SnAiError,
  SnAiMessage,
  SnAiModel,
  SnAiModelParams,
  SnAiPermission,
  SnAiPermissionOption,
  SnAiQueuedTurn,
  SnAiThinkingLevel,
  SnAiVendor,
} from '../shared/types'
import { ModelIcon } from '../shared/icons'
import type { SnAiRunTurn } from './use-ai-turn-queue'
import { useAiTurnQueue } from './use-ai-turn-queue'
import { toIconComponent } from './icon-adapter'
import SnAiMessageList from './SnAiMessageList.vue'
import SnAiPrompt from './SnAiPrompt.vue'
import SnModelConfig from './SnModelConfig.vue'

defineOptions({ name: 'SnAiAssistant' })

/** Re-exported so a host can type its runner from this template too. */
export type { SnAiRunTurn }

const props = withDefaults(
  defineProps<{
    /* ── Conversation (same names and semantics as SnAiChat) ─────────────── */
    /** The transcript, oldest first. Use with `update:messages`. */
    messages?: SnAiMessage[]
    /** The host's turn runner. */
    run?: SnAiRunTurn | undefined
    /** Agents offered by the composer's agent selector. */
    agents?: SnAiAgent[] | undefined
    /** Permission scopes offered by the composer. */
    permissions?: SnAiPermissionOption[] | undefined
    /** Models offered by the composer's model picker. */
    models?: SnAiModel[] | undefined
    /** Active skin (maps to the Style Pack system). */
    theme?: string | undefined
    /** Page title shown in the header. */
    title?: string
    /** Subtitle shown under the title. */
    subtitle?: string | undefined
    /** Disable the whole page. */
    disabled?: boolean
    /** Whether more than one turn may wait in the queue. */
    allowQueue?: boolean
    /** Show the header chrome. */
    showHeader?: boolean
    /** Loading state for history fetch. */
    loading?: boolean
    /** Persist the selected model / agent between turns. */
    rememberSelection?: boolean
    /* ── Model configuration (this template's own) ──────────────────────── */
    /**
     * Configured providers. Declared here because both the drawer and the
     * composer's model picker read the same list.
     */
    vendors?: SnAiVendor[] | undefined
    /** Show the header entry point and the drawer that hosts model config. */
    showModelConfig?: boolean
    /** Drawer heading. */
    modelConfigTitle?: string
    /** Drawer width; a number is px. */
    modelConfigWidth?: number | string
    /** Provider selected in the drawer. */
    activeVendorId?: string | undefined
    /** Model selected in the drawer. */
    activeModelId?: string | undefined
    /** Provider currently being connection-tested (renders its spinner). */
    testingVendorId?: string | undefined
    /**
     * Generation parameters shown in the drawer. Named to mirror
     * `SnModelConfig` (`params` / `update:params`), so `v-model:params` works
     * here and one handler can be handed to either component.
     */
    params?: SnAiModelParams | undefined
    /** Offer add / edit / delete affordances inside the drawer. */
    editableModels?: boolean
    /** Controlled drawer visibility; leave undefined to let the template own it. */
    modelConfigOpen?: boolean | undefined
  }>(),
  {
    messages: () => [],
    run: undefined,
    agents: () => [],
    permissions: undefined,
    models: () => [],
    theme: 'default',
    title: 'AI 助手',
    subtitle: undefined,
    disabled: false,
    allowQueue: true,
    showHeader: true,
    loading: false,
    rememberSelection: true,
    vendors: undefined,
    showModelConfig: true,
    activeVendorId: undefined,
    activeModelId: undefined,
    testingVendorId: undefined,
    params: undefined,
    editableModels: true,
    modelConfigOpen: undefined,
  },
)

const emit = defineEmits<{
  /* ── Conversation (same as SnAiChat) ─────────────────────────────────── */
  (e: 'update:messages', messages: SnAiMessage[]): void
  (e: 'turn-start', turn: SnAiQueuedTurn): void
  (e: 'turn-end', payload: { turn: SnAiQueuedTurn; message: SnAiMessage }): void
  (e: 'error', payload: { turn: SnAiQueuedTurn; error: SnAiError }): void
  (e: 'retry', message: SnAiMessage): void
  (e: 'update:modelId', modelId: string): void
  (e: 'update:agentId', agentId: string): void
  /* ── Model configuration ────────────────────────────────────────────── */
  (e: 'update:vendors', vendors: SnAiVendor[]): void
  (e: 'update:activeVendorId', id: string): void
  (e: 'update:activeModelId', id: string): void
  (e: 'update:params', params: SnAiModelParams): void
  (e: 'test-connection', payload: { vendorId: string }): void
  (e: 'update:modelConfigOpen', open: boolean): void
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
  hostName: () => 'SnAiAssistant',
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

/* ── Model-config drawer ─────────────────────────────────────────────────── */

/**
 * Uncontrolled by default: the template remembers the drawer state itself and
 * reports it, and a `modelConfigOpen` prop takes over when the host binds it.
 */
const internalOpen = ref(false)
const isOpen = computed(() => props.modelConfigOpen ?? internalOpen.value)

function setOpen(next: boolean): void {
  internalOpen.value = next
  emit('update:modelConfigOpen', next)
}

/**
 * `SnDrawer` / `SnDrawerContent` take non-optional values, so the defaults are
 * resolved here instead of being handed straight through.
 */
const drawerTitle = computed<string>(() => props.modelConfigTitle ?? '模型配置')
const drawerWidth = computed<number | string>(() => props.modelConfigWidth ?? 420)

const modelConfigIcon = toIconComponent(ModelIcon)
</script>

<template>
  <SnConfigProvider :skin="theme ?? 'default'">
    <div class="sn-ai-assistant" data-snui-component="ai-assistant">
      <header v-if="showHeader" class="sn-ai-assistant__header">
        <div class="sn-ai-assistant__heading">
          <h1 class="sn-ai-assistant__title">{{ title }}</h1>
          <p v-if="subtitle" class="sn-ai-assistant__subtitle">{{ subtitle }}</p>
        </div>
        <div class="sn-ai-assistant__header-actions">
          <SnButton
            v-if="showModelConfig"
            class="sn-ai-assistant__trigger"
            size="small"
            :aria-label="drawerTitle"
            :title="drawerTitle"
            @click="setOpen(true)"
          >
            <SnIcon :icon="modelConfigIcon" :size="16" />
          </SnButton>
          <!-- Host actions keep the far end of the header row. -->
          <slot name="header-actions" />
        </div>
      </header>

      <div class="sn-ai-assistant__transcript">
        <slot name="transcript" :messages="messages" :empty="isEmpty">
          <SnAiMessageList :messages="messages" :loading="loading" @retry="retry" />
        </slot>
      </div>

      <footer class="sn-ai-assistant__composer">
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

      <SnDrawer
        v-if="showModelConfig"
        :show="isOpen"
        placement="right"
        :width="drawerWidth"
        @update:show="setOpen"
      >
        <SnDrawerContent :title="drawerTitle" closable>
          <slot name="model-config" :close="() => setOpen(false)">
            <SnModelConfig
              :vendors="vendors"
              :active-vendor-id="activeVendorId"
              :active-model-id="activeModelId"
              :params="params"
              :testing-vendor-id="testingVendorId"
              :editable="editableModels"
              :title="drawerTitle"
              @update:vendors="emit('update:vendors', $event)"
              @update:active-vendor-id="emit('update:activeVendorId', $event)"
              @update:active-model-id="emit('update:activeModelId', $event)"
              @update:params="emit('update:params', $event)"
              @test-connection="emit('test-connection', $event)"
            />
          </slot>
        </SnDrawerContent>
      </SnDrawer>
    </div>
  </SnConfigProvider>
</template>

<style scoped>
.sn-ai-assistant {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  background-color: var(--sn-web-color-background-surface);
}

.sn-ai-assistant__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--sn-web-spacing-4);
  padding: var(--sn-web-spacing-5) var(--sn-web-spacing-6);
  border-bottom: 1px solid var(--sn-web-color-border-subtle);
}

.sn-ai-assistant__heading {
  min-width: 0;
}

.sn-ai-assistant__title {
  margin: 0;
  color: var(--sn-web-color-text-primary);
  font-size: var(--sn-web-font-size-xl);
  font-weight: var(--sn-web-font-weight-semibold);
  line-height: var(--sn-web-font-line-height-tight);
}

.sn-ai-assistant__subtitle {
  margin: var(--sn-web-spacing-1) 0 0;
  color: var(--sn-web-color-text-tertiary);
  font-size: var(--sn-web-font-size-sm);
}

.sn-ai-assistant__header-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-2);
}

.sn-ai-assistant__trigger {
  color: var(--sn-web-color-text-secondary);
}

.sn-ai-assistant__transcript {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding-top: var(--sn-web-spacing-4);
}

.sn-ai-assistant__composer {
  flex-shrink: 0;
  padding: var(--sn-web-spacing-4) var(--sn-web-spacing-5) var(--sn-web-spacing-5);
  border-top: 1px solid var(--sn-web-color-border-subtle);
}
</style>