<script setup lang="ts">
/**
 * SnAiAssistant — the AI 套件 unified into one page template.
 *
 * It is the umbrella the four narrower templates compose into: the conversation
 * page (`SnAiChat`) plus the model-configuration panel (`SnModelConfig`) behind
 * a drawer, so one component mounts a complete assistant. The pieces stay
 * separately importable for the cases where only one of them is wanted —
 * `@snui/templates/web/prompt` for the composer alone, `/model-config` for the
 * settings page alone, `/message-list` for a transcript alone.
 *
 * Why a wrapper instead of a new hand-written page: `SnAiChat` already owns the
 * turn scheduler, the queue and the abort controller. Re-composing those here
 * would mean two implementations of the same semantics. So this template adds
 * exactly what the chat page does not have — the model-config entry point and
 * the drawer that hosts it — and forwards everything else untouched.
 *
 * Prop / event forwarding: only the assistant-specific props below are
 * declared, so every other attribute, prop and listener falls through to
 * `SnAiChat` (including `messages`, `run`, `models`, `theme`, `@update:messages`
 * and the rest of its event surface). `class` / `style` therefore land on the
 * chat page element, not on this wrapper.
 *
 * Usage:
 *   <SnAiAssistant
 *     v-model:messages="messages"
 *     :run="run"
 *     :vendors="vendors"
 *     v-model:active-model-id="modelId"
 *   />
 *
 * Mount only the composer, without the drawer:
 *   <SnAiAssistant :run="run" :show-model-config="false" />
 */
import { computed, ref } from 'vue'
import { SnButton, SnDrawer, SnDrawerContent, SnIcon } from '@snui/vue-web'
import { ModelIcon } from '../shared/icons'
import { toIconComponent } from './icon-adapter'
import SnAiChat from './SnAiChat.vue'
import SnModelConfig from './SnModelConfig.vue'
import type { SnAiModelParams, SnAiVendor } from '../shared/types'

defineOptions({ name: 'SnAiAssistant', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    /** Show the header entry point and the drawer that hosts model config. */
    showModelConfig?: boolean
    /** Drawer heading. */
    modelConfigTitle?: string
    /** Drawer width; a number is px. */
    modelConfigWidth?: number | string
    /**
     * Configured providers. Declared here because both the drawer and the
     * composer's model picker read the same list.
     */
    vendors?: SnAiVendor[] | undefined
    /** Provider selected in the drawer. */
    activeVendorId?: string | undefined
    /** Model selected in the drawer. */
    activeModelId?: string | undefined
    /** Provider currently being connection-tested (renders its spinner). */
    testingVendorId?: string | undefined
    /** Generation parameters shown in the drawer. */
    modelParams?: SnAiModelParams | undefined
    /** Offer add / edit / delete affordances inside the drawer. */
    editableModels?: boolean
    /** Controlled drawer visibility; leave undefined to let the template own it. */
    modelConfigOpen?: boolean | undefined
  }>(),
  {
    showModelConfig: true,
    vendors: undefined,
    activeVendorId: undefined,
    activeModelId: undefined,
    testingVendorId: undefined,
    modelParams: undefined,
    editableModels: true,
    modelConfigOpen: undefined,
  },
)

const emit = defineEmits<{
  (e: 'update:vendors', vendors: SnAiVendor[]): void
  (e: 'update:activeVendorId', id: string): void
  (e: 'update:activeModelId', id: string): void
  (e: 'update:params', params: SnAiModelParams): void
  (e: 'test-connection', payload: { vendorId: string }): void
  (e: 'update:modelConfigOpen', open: boolean): void
}>()

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

const modelConfigIcon = toIconComponent(ModelIcon)

/**
 * `SnDrawer` / `SnDrawerContent` take non-optional values, so the defaults are
 * resolved here instead of being handed straight through.
 */
const drawerTitle = computed<string>(() => props.modelConfigTitle ?? '模型配置')
const drawerWidth = computed<number | string>(() => props.modelConfigWidth ?? 420)
</script>

<template>
  <div class="sn-ai-assistant" data-snui-component="ai-assistant">
    <SnAiChat v-bind="$attrs" :vendors="vendors">
      <template #header-actions>
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
      </template>

      <template v-if="$slots.transcript" #transcript="scope">
        <slot name="transcript" v-bind="scope" />
      </template>

      <template v-if="$slots.toolbar" #toolbar>
        <slot name="toolbar" />
      </template>
    </SnAiChat>

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
            :params="modelParams"
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
</template>

<style scoped>
/* The wrapper only forwards height; the page inside owns all its own layout. */
.sn-ai-assistant {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.sn-ai-assistant > * {
  min-height: 0;
}
</style>
