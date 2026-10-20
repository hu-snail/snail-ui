<script setup lang="ts">
/**
 * SnAiPrompt — the AI composer: text input, attachment panel, agent /
 * permission / model selectors, reasoning-budget slider, send / stop, and the
 * pending message queue.
 *
 * Why this is one component rather than a row of inputs: the controls are not
 * independent. Send is only legal when text or an attachment exists, the stop
 * affordance replaces send while a turn runs, and the thinking slider must be
 * disabled when the picked model cannot reason. Keeping them together means
 * those rules live in one place instead of being re-derived by every host.
 *
 * The attachment button opens a panel (not a bare file dialog) because a real
 * composer offers several ways in — pick an image, pick a document, or paste a
 * link — and shows the attached chips with their upload state in the same
 * surface.
 *
 * Per AGENTS.md §41 this component owns no timers or listeners: the hidden
 * file input is a plain element, and the copy-flash lives in the message list.
 *
 * Usage:
 *   <SnAiPrompt v-model="text" :models="models" @send="onSend" @stop="onStop" />
 */
import { computed, ref } from 'vue'
import { SnDropdown, SnIcon, SnImage, SnSlider, SnTooltip } from '@snui/vue-web'
import type { IconComponent } from '@snui/vue-web'
import {
  AgentIcon,
  ChevronDownIcon,
  CloseIcon,
  FileIcon,
  ImageIcon,
  ModelIcon,
  PaperclipIcon,
  SendIcon,
  ShieldIcon,
  StopIcon,
  ThinkingIcon,
  TrashIcon,
} from '../shared/icons'
import {
  DEFAULT_PERMISSION_OPTIONS,
  THINKING_LEVELS,
  formatBytes,
  formatContextWindow,
  nextId,
  thinkingBudget,
} from '../shared/stream'
import type {
  SnAiAgent,
  SnAiAttachment,
  SnAiModel,
  SnAiPermission,
  SnAiPermissionOption,
  SnAiQueuedTurn,
  SnAiThinkingLevel,
} from '../shared/types'
import { toIconComponent } from './icon-adapter'

defineOptions({ name: 'SnAiPrompt' })

const props = withDefaults(
  defineProps<{
    /** Prompt text. Use with `update:modelValue`. */
    modelValue?: string | undefined
    /** Attachments already accepted for this turn. */
    attachments?: SnAiAttachment[] | undefined
    /** Agents offered by the agent selector. */
    agents?: SnAiAgent[] | undefined
    /** Currently selected agent id. */
    agentId?: string | undefined
    /** Permission scopes offered; defaults to the four standard scopes. */
    permissions?: SnAiPermissionOption[] | undefined
    /** Currently selected permission scope. */
    permission?: SnAiPermission | undefined
    /** Models offered by the model picker. */
    models?: SnAiModel[] | undefined
    /** Currently selected model id. */
    modelId?: string | undefined
    /** Reasoning budget tier. */
    thinkingLevel?: SnAiThinkingLevel | undefined
    /** A turn is running: the send button becomes stop. */
    active?: boolean | undefined
    /** Turns accepted but not yet dispatched. */
    queued?: SnAiQueuedTurn[] | undefined
    /** Disable the whole composer. */
    disabled?: boolean | undefined
    /** Placeholder for the text area. */
    placeholder?: string | undefined
    /** Maximum prompt length. */
    maxlength?: number | undefined
    /** Accept filter for the hidden file input. */
    accept?: string | undefined
    /** Offer the reasoning-budget slider. */
    showThinking?: boolean | undefined
    /** Render the pending queue above the toolbar. */
    showQueue?: boolean | undefined
    /** Number of visible text rows before the area scrolls. */
    rows?: number | undefined
  }>(),
  {
    modelValue: undefined,
    attachments: undefined,
    agents: undefined,
    agentId: undefined,
    permissions: undefined,
    permission: undefined,
    models: undefined,
    modelId: undefined,
    thinkingLevel: undefined,
    active: undefined,
    queued: undefined,
    disabled: false,
    placeholder: '输入消息，Enter 发送，Shift + Enter 换行',
    maxlength: undefined,
    accept: undefined,
    showThinking: true,
    showQueue: true,
    rows: 3,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'update:attachments', value: SnAiAttachment[]): void
  (e: 'update:agentId', value: string): void
  (e: 'update:permission', value: SnAiPermission): void
  (e: 'update:modelId', value: string): void
  (e: 'update:thinkingLevel', value: SnAiThinkingLevel): void
  /** A composed turn is ready to run. */
  (e: 'send', turn: SnAiQueuedTurn): void
  /** Stop the running turn. */
  (e: 'stop'): void
  /** Remove a queued turn. */
  (e: 'remove-queued', id: string): void
  /** The user picked files; the host owns the actual upload. */
  (e: 'attach', files: File[]): void
}>()

const icons = {
  paperclip: toIconComponent(PaperclipIcon),
  send: toIconComponent(SendIcon),
  stop: toIconComponent(StopIcon),
  agent: toIconComponent(AgentIcon),
  shield: toIconComponent(ShieldIcon),
  model: toIconComponent(ModelIcon),
  thinking: toIconComponent(ThinkingIcon),
  chevron: toIconComponent(ChevronDownIcon),
  close: toIconComponent(CloseIcon),
  file: toIconComponent(FileIcon),
  image: toIconComponent(ImageIcon),
  trash: toIconComponent(TrashIcon),
}

/** The textarea element, so the file picker can be opened from its button. */
const fileInputRef = ref<HTMLInputElement | null>(null)
/** Whether the attachment panel is open. */
const attachOpen = ref(false)

const attachments = computed<SnAiAttachment[]>(() => props.attachments ?? [])
const agents = computed<SnAiAgent[]>(() => props.agents ?? [])
const models = computed<SnAiModel[]>(() => props.models ?? [])
const queued = computed<SnAiQueuedTurn[]>(() => props.queued ?? [])
const permissionOptions = computed<SnAiPermissionOption[]>(
  () => [...(props.permissions ?? DEFAULT_PERMISSION_OPTIONS)],
)

const text = computed(() => props.modelValue ?? '')
const isDisabled = computed(() => props.disabled === true)
const isActive = computed(() => props.active === true)

/** Whether the composer has anything worth sending. */
const canSend = computed(() => text.value.trim().length > 0 || attachments.value.length > 0)

const selectedAgent = computed(() => agents.value.find((agent) => agent.id === props.agentId))
const selectedModel = computed(() => models.value.find((model) => model.id === props.modelId))
const selectedPermission = computed(() =>
  permissionOptions.value.find((option) => option.value === props.permission),
)

/** The reasoning tier, resolved to a concrete value for the slider index. */
const thinkingLevel = computed<SnAiThinkingLevel>(() => props.thinkingLevel ?? 'off')
const thinkingIndex = computed(() => THINKING_LEVELS.indexOf(thinkingLevel.value))
/** The picked model cannot reason → the slider is not offered at all. */
const thinkingAvailable = computed(
  () => props.showThinking === true && selectedModel.value?.supportsThinking !== false,
)
const thinkingLabel = computed(() => {
  const level = thinkingLevel.value
  const labels: Record<SnAiThinkingLevel, string> = {
    off: '关闭',
    low: '轻量',
    medium: '中等',
    high: '深入',
    max: '极限',
  }
  const budget = thinkingBudget(level)
  return budget > 0 ? `${labels[level]} · ${budget} tokens` : labels[level]
})

/* ── Text editing ────────────────────────────────────────────────────────── */

function onInput(event: Event): void {
  const target = event.target as HTMLTextAreaElement | null
  if (!target) return
  emit('update:modelValue', target.value)
}

/**
 * Enter sends, Shift + Enter inserts a newline — the composer convention.
 * A composition session (IME) is never treated as a send, otherwise picking a
 * Chinese candidate would submit a half-typed word.
 */
function onKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return
  event.preventDefault()
  submit()
}

/* ── Attachment panel ────────────────────────────────────────────────────── */

function openFilePicker(): void {
  attachOpen.value = false
  fileInputRef.value?.click()
}

function onFilesPicked(event: Event): void {
  const input = event.target as HTMLInputElement | null
  if (!input?.files?.length) return
  emit('attach', Array.from(input.files))
  // Reset so picking the same file twice fires `change` again.
  input.value = ''
}

/**
 * Paste an image or file straight into the composer. Clipboard files arrive as
 * `kind === 'file'` items, and they carry no filename (Chromium yields
 * `image.png`, Safari `blob`), so the host gets the same `attach` channel as
 * the file picker and needs only one upload path.
 *
 * A text-only paste is left alone so the textarea inserts it as usual.
 */
function onPaste(event: ClipboardEvent): void {
  const items = event.clipboardData?.items
  if (!items) return

  const files: File[] = []
  for (const item of items) {
    if (item.kind !== 'file') continue
    const file = item.getAsFile()
    if (file) files.push(file)
  }
  if (!files.length) return

  event.preventDefault()
  emit('attach', files)
}

function removeAttachment(id: string): void {
  emit(
    'update:attachments',
    attachments.value.filter((attachment) => attachment.id !== id),
  )
}

/** Attachment chips use the image glyph for image MIME types, file otherwise. */
function attachmentIcon(attachment: SnAiAttachment): IconComponent {
  return attachment.mime?.startsWith('image/') ? icons.image : icons.file
}

function attachmentMeta(attachment: SnAiAttachment): string {
  const size = formatBytes(attachment.size)
  return [attachment.mime ?? '', size].filter(Boolean).join(' · ')
}

/**
 * How a chip's leading element previews its attachment: `image` renders an
 * `SnImage` (its own lightbox overlay), `link` opens the url in a new tab, and
 * anything without a url keeps a plain glyph. The url comes from the host once
 * it has finished uploading, so a still-uploading chip simply has no preview.
 */
function attachmentPreview(attachment: SnAiAttachment): 'image' | 'link' | 'none' {
  if (!attachment.url) return 'none'
  return attachment.mime?.startsWith('image/') ? 'image' : 'link'
}

/* ── Selectors ───────────────────────────────────────────────────────────── */

function pickAgent(id: string): void {
  emit('update:agentId', id)
}

function pickPermission(value: SnAiPermission): void {
  emit('update:permission', value)
}

function pickModel(id: string): void {
  emit('update:modelId', id)
}

/** Slider index → tier. Out-of-range indices clamp to the ends. */
function onThinkingInput(index: number): void {
  const level = THINKING_LEVELS[index] ?? THINKING_LEVELS[0]
  if (level) emit('update:thinkingLevel', level)
}

/* ── Submit / stop / queue ───────────────────────────────────────────────── */

/** Compose the current draft into a queued turn and hand it to the host. */
function submit(): void {
  if (isDisabled.value || isActive.value || !canSend.value) return
  emit('send', {
    id: nextId('sn-ai-turn'),
    text: text.value.trim(),
    attachments: [...attachments.value],
    agentId: props.agentId,
    permission: props.permission,
    modelId: props.modelId,
    thinkingLevel: thinkingLevel.value,
    createdAt: Date.now(),
  })
  emit('update:modelValue', '')
  emit('update:attachments', [])
}

function onPrimaryAction(): void {
  if (isActive.value) {
    emit('stop')
    return
  }
  submit()
}

function removeQueued(id: string): void {
  emit('remove-queued', id)
}

/** One-line preview of a queued turn's text. */
function queuePreview(turn: SnAiQueuedTurn): string {
  const flat = turn.text.replace(/\s+/g, ' ').trim()
  if (flat.length <= 48) return flat
  return `${flat.slice(0, 48)}…`
}
</script>

<template>
  <div class="sn-ai-prompt" :class="{ 'sn-ai-prompt--disabled': isDisabled }" data-snui-component="ai-prompt">
    <!-- Pending queue -->
    <ul v-if="showQueue && queued.length" class="sn-ai-prompt__queue" aria-label="待发送消息队列">
      <slot name="queue" :turns="queued" :remove="removeQueued">
        <li v-for="(turn, index) in queued" :key="turn.id" class="sn-ai-prompt__queue-item">
          <span class="sn-ai-prompt__queue-index">{{ index + 1 }}</span>
          <span class="sn-ai-prompt__queue-text">{{ queuePreview(turn) }}</span>
          <span v-if="turn.attachments.length" class="sn-ai-prompt__queue-badge">
            {{ turn.attachments.length }} 个附件
          </span>
          <button
            type="button"
            class="sn-ai-prompt__queue-remove"
            aria-label="移除排队消息"
            @click="removeQueued(turn.id)"
          >
            <SnIcon :icon="icons.close" :size="12" />
          </button>
        </li>
      </slot>
    </ul>

    <div class="sn-ai-prompt__box">
      <!-- Attachment chips -->
      <div v-if="attachments.length" class="sn-ai-prompt__chips">
        <span
          v-for="attachment in attachments"
          :key="attachment.id"
          class="sn-ai-prompt__chip"
          :class="{ 'sn-ai-prompt__chip--error': attachment.status === 'error' }"
        >
          <!-- The leading element doubles as the preview affordance: an image
               opens the SnImage lightbox, any other file with a url opens in a
               new tab, and a file without one keeps the plain glyph. -->
          <SnImage
            v-if="attachmentPreview(attachment) === 'image'"
            class="sn-ai-prompt__chip-thumb"
            :src="attachment.url"
            :alt="attachment.name"
            :width="20"
            :height="20"
            object-fit="cover"
          />
          <a
            v-else-if="attachmentPreview(attachment) === 'link'"
            class="sn-ai-prompt__chip-preview"
            :href="attachment.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`预览附件 ${attachment.name}`"
            :title="`预览附件 ${attachment.name}`"
          >
            <SnIcon :icon="attachmentIcon(attachment)" :size="13" />
          </a>
          <SnIcon v-else :icon="attachmentIcon(attachment)" :size="13" />
          <span class="sn-ai-prompt__chip-name">{{ attachment.name }}</span>
          <span v-if="attachmentMeta(attachment)" class="sn-ai-prompt__chip-meta">
            {{ attachmentMeta(attachment) }}
          </span>
          <button
            type="button"
            class="sn-ai-prompt__chip-remove"
            :aria-label="`移除附件 ${attachment.name}`"
            @click="removeAttachment(attachment.id)"
          >
            <SnIcon :icon="icons.close" :size="11" />
          </button>
        </span>
      </div>

      <textarea
        class="sn-ai-prompt__input"
        :class="{ 'sn-ai-prompt__input--rtl': false }"
        :value="text"
        :rows="rows"
        :maxlength="maxlength"
        :placeholder="placeholder"
        :disabled="isDisabled"
        aria-label="消息内容"
        @input="onInput"
        @keydown="onKeydown"
        @paste="onPaste"
      />

      <!-- Toolbar: attachment, agent, permission, model, thinking -->
      <div class="sn-ai-prompt__toolbar">
        <div class="sn-ai-prompt__toolbar-left">
          <!-- Attachment button + panel -->
          <div class="sn-ai-prompt__attach">
            <button
              type="button"
              class="sn-ai-prompt__tool"
              :disabled="isDisabled"
              aria-label="添加附件"
              aria-haspopup="menu"
              :aria-expanded="attachOpen ? 'true' : 'false'"
              @click="attachOpen = !attachOpen"
            >
              <SnIcon :icon="icons.paperclip" :size="15" />
            </button>
            <Transition name="sn-ai-prompt-pop">
              <div v-if="attachOpen" class="sn-ai-prompt__attach-panel" role="menu">
                <button type="button" class="sn-ai-prompt__attach-item" role="menuitem" @click="openFilePicker">
                  <SnIcon :icon="icons.image" :size="14" />
                  <span>上传图片</span>
                </button>
                <button type="button" class="sn-ai-prompt__attach-item" role="menuitem" @click="openFilePicker">
                  <SnIcon :icon="icons.file" :size="14" />
                  <span>上传文档</span>
                </button>
                <button
                  type="button"
                  class="sn-ai-prompt__attach-item"
                  role="menuitem"
                  @click="attachOpen = false"
                >
                  <SnIcon :icon="icons.paperclip" :size="14" />
                  <span>粘贴链接（在输入框粘贴）</span>
                </button>
              </div>
            </Transition>
            <input
              ref="fileInputRef"
              class="sn-ai-prompt__file"
              type="file"
              multiple
              :accept="accept ?? '*/*'"
              tabindex="-1"
              aria-hidden="true"
              @change="onFilesPicked"
            />
          </div>

          <!-- Agent selector -->
          <SnDropdown
            v-if="agents.length"
            trigger="click"
            placement="top-start"
            :options="
              agents.map((agent) => ({
                key: agent.id,
                label: agent.name,
                disabled: agent.disabled === true,
              }))
            "
            @select="pickAgent(String($event))"
          >
            <button type="button" class="sn-ai-prompt__tool sn-ai-prompt__tool--wide" :disabled="isDisabled">
              <SnIcon :icon="icons.agent" :size="14" />
              <span>{{ selectedAgent?.name ?? '选择智能体' }}</span>
              <SnIcon :icon="icons.chevron" :size="12" />
            </button>
          </SnDropdown>

          <!-- Permission selector -->
          <SnDropdown
            trigger="click"
            placement="top-start"
            :options="
              permissionOptions.map((option) => ({
                key: option.value,
                label: option.label,
              }))
            "
            @select="pickPermission($event as SnAiPermission)"
          >
            <button
              type="button"
              class="sn-ai-prompt__tool sn-ai-prompt__tool--wide"
              :class="{ 'sn-ai-prompt__tool--warn': selectedPermission?.tone === 'warning' }"
              :disabled="isDisabled"
            >
              <SnIcon :icon="icons.shield" :size="14" />
              <span>{{ selectedPermission?.label ?? '权限' }}</span>
              <SnIcon :icon="icons.chevron" :size="12" />
            </button>
          </SnDropdown>

          <!-- Model selector -->
          <SnDropdown
            v-if="models.length"
            trigger="click"
            placement="top-start"
            :options="
              models.map((model) => ({
                key: model.id,
                label: model.contextWindow
                  ? `${model.name} · ${formatContextWindow(model.contextWindow)}`
                  : model.name,
                disabled: model.disabled === true,
              }))
            "
            @select="pickModel(String($event))"
          >
            <button type="button" class="sn-ai-prompt__tool sn-ai-prompt__tool--wide" :disabled="isDisabled">
              <SnIcon :icon="icons.model" :size="14" />
              <span>{{ selectedModel?.name ?? '选择模型' }}</span>
              <SnIcon :icon="icons.chevron" :size="12" />
            </button>
          </SnDropdown>

          <slot name="toolbar" />
        </div>

        <!-- Send / stop -->
        <SnTooltip :content="isActive ? '停止生成' : '发送'">
          <button
            type="button"
            class="sn-ai-prompt__primary"
            :class="{ 'sn-ai-prompt__primary--stop': isActive }"
            :disabled="isDisabled || (!isActive && !canSend)"
            :aria-label="isActive ? '停止生成' : '发送'"
            @click="onPrimaryAction"
          >
            <SnIcon :icon="isActive ? icons.stop : icons.send" :size="16" />
          </button>
        </SnTooltip>
      </div>

      <!-- Reasoning budget -->
      <div v-if="thinkingAvailable" class="sn-ai-prompt__thinking">
        <SnIcon :icon="icons.thinking" :size="14" class="sn-ai-prompt__thinking-icon" />
        <span class="sn-ai-prompt__thinking-label">思考程度</span>
        <SnSlider
          class="sn-ai-prompt__thinking-slider"
          :min="0"
          :max="THINKING_LEVELS.length - 1"
          :step="1"
          :model-value="thinkingIndex < 0 ? 0 : thinkingIndex"
          :disabled="isDisabled"
          :format-tooltip="() => thinkingLabel"
          @update:model-value="onThinkingInput(Number($event))"
        />
        <span class="sn-ai-prompt__thinking-value">{{ thinkingLabel }}</span>
      </div>
    </div>

    <p v-if="$slots.hint" class="sn-ai-prompt__hint">
      <slot name="hint" />
    </p>
  </div>
</template>

<style scoped>
.sn-ai-prompt {
  display: flex;
  flex-direction: column;
  gap: var(--sn-web-spacing-3);
}

.sn-ai-prompt--disabled {
  opacity: 0.6;
}

/* Pending queue */
.sn-ai-prompt__queue {
  display: flex;
  flex-direction: column;
  gap: var(--sn-web-spacing-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.sn-ai-prompt__queue-item {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-2);
  padding: var(--sn-web-spacing-2) var(--sn-web-spacing-3);
  border: 1px dashed var(--sn-web-color-border-default);
  border-radius: var(--sn-web-radius-md);
  background-color: var(--sn-web-color-background-subtle);
  color: var(--sn-web-color-text-secondary);
  font-size: var(--sn-web-font-size-sm);
}

.sn-ai-prompt__queue-index {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: var(--sn-web-radius-full);
  background-color: var(--sn-web-color-action-primary);
  color: var(--sn-web-color-text-on-primary);
  font-size: var(--sn-web-font-size-xs);
  font-weight: var(--sn-web-font-weight-semibold);
}

.sn-ai-prompt__queue-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--sn-web-color-text-primary);
}

.sn-ai-prompt__queue-badge {
  flex-shrink: 0;
  color: var(--sn-web-color-text-tertiary);
  font-size: var(--sn-web-font-size-xs);
}

.sn-ai-prompt__queue-remove {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  border-radius: var(--sn-web-radius-sm);
  background: transparent;
  color: var(--sn-web-color-text-tertiary);
  cursor: pointer;
}

.sn-ai-prompt__queue-remove:hover {
  background-color: var(--sn-web-color-background-surface);
  color: var(--sn-web-color-feedback-danger);
}

/* Composer box */
.sn-ai-prompt__box {
  display: flex;
  flex-direction: column;
  gap: var(--sn-web-spacing-2);
  padding: var(--sn-web-spacing-3);
  border: 1px solid var(--sn-web-color-border-default);
  border-radius: var(--sn-web-radius-xl);
  background-color: var(--sn-web-color-background-surface);
  box-shadow: var(--sn-web-shadow-xs);
}

.sn-ai-prompt__box:focus-within {
  border-color: var(--sn-web-color-action-primary);
}

.sn-ai-prompt__input {
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--sn-web-color-text-primary);
  font-family: inherit;
  font-size: var(--sn-web-font-size-md);
  line-height: var(--sn-web-font-line-height-normal);
  resize: none;
  outline: none;
}

.sn-ai-prompt__input::placeholder {
  color: var(--sn-web-color-text-tertiary);
}

/* Attachment chips */
.sn-ai-prompt__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sn-web-spacing-2);
}

.sn-ai-prompt__chip {
  display: inline-flex;
  align-items: center;
  gap: var(--sn-web-spacing-2);
  padding: 2px var(--sn-web-spacing-2) 2px var(--sn-web-spacing-3);
  border: 1px solid var(--sn-web-color-border-default);
  border-radius: var(--sn-web-radius-full);
  background-color: var(--sn-web-color-background-subtle);
  color: var(--sn-web-color-text-secondary);
  font-size: var(--sn-web-font-size-xs);
}

.sn-ai-prompt__chip--error {
  border-color: var(--sn-web-color-feedback-danger);
  color: var(--sn-web-color-feedback-danger);
}

.sn-ai-prompt__chip-name {
  color: var(--sn-web-color-text-primary);
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sn-ai-prompt__chip-meta {
  color: var(--sn-web-color-text-tertiary);
}

/* Preview affordances at the leading edge of a chip. The thumbnail is an
 * SnImage, so clicking it opens the shared lightbox overlay. */
.sn-ai-prompt__chip-thumb {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: var(--sn-web-radius-sm);
  overflow: hidden;
  cursor: zoom-in;
}

.sn-ai-prompt__chip-preview {
  display: inline-flex;
  align-items: center;
  color: inherit;
}

.sn-ai-prompt__chip-remove {
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  padding: 0;
  border: 0;
  border-radius: var(--sn-web-radius-full);
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.sn-ai-prompt__chip-remove:hover {
  background-color: var(--sn-web-color-border-default);
}

/* Toolbar */
.sn-ai-prompt__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sn-web-spacing-2);
}

.sn-ai-prompt__toolbar-left {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-1);
  min-width: 0;
  flex-wrap: wrap;
}

.sn-ai-prompt__tool {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 var(--sn-web-spacing-2);
  border: 0;
  border-radius: var(--sn-web-radius-md);
  background: transparent;
  color: var(--sn-web-color-text-secondary);
  font-family: inherit;
  font-size: var(--sn-web-font-size-sm);
  cursor: pointer;
}

.sn-ai-prompt__tool:hover:not(:disabled) {
  background-color: var(--sn-web-color-background-subtle);
  color: var(--sn-web-color-text-primary);
}

.sn-ai-prompt__tool:disabled {
  cursor: not-allowed;
  color: var(--sn-web-color-text-disabled);
}

.sn-ai-prompt__tool--wide {
  max-width: 180px;
}

.sn-ai-prompt__tool--wide span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sn-ai-prompt__tool--warn {
  color: var(--sn-web-color-feedback-warning);
}

/* Attachment panel */
.sn-ai-prompt__attach {
  position: relative;
}

.sn-ai-prompt__attach-panel {
  position: absolute;
  bottom: calc(100% + var(--sn-web-spacing-2));
  left: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  min-width: 200px;
  padding: var(--sn-web-spacing-1);
  border: 1px solid var(--sn-web-color-border-default);
  border-radius: var(--sn-web-radius-lg);
  background-color: var(--sn-web-color-background-surface);
  box-shadow: var(--sn-web-shadow-lg);
}

.sn-ai-prompt__attach-item {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-2);
  width: 100%;
  padding: var(--sn-web-spacing-2) var(--sn-web-spacing-3);
  border: 0;
  border-radius: var(--sn-web-radius-md);
  background: transparent;
  color: var(--sn-web-color-text-secondary);
  font-family: inherit;
  font-size: var(--sn-web-font-size-sm);
  text-align: left;
  cursor: pointer;
}

.sn-ai-prompt__attach-item:hover {
  background-color: var(--sn-web-color-background-subtle);
  color: var(--sn-web-color-text-primary);
}

.sn-ai-prompt__file {
  display: none;
}

.sn-ai-prompt-pop-enter-active,
.sn-ai-prompt-pop-leave-active {
  transition: opacity 0.12s ease, transform 0.12s ease;
}

.sn-ai-prompt-pop-enter-from,
.sn-ai-prompt-pop-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

/* Primary action */
.sn-ai-prompt__primary {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: var(--sn-web-radius-full);
  background-color: var(--sn-web-color-action-primary);
  color: var(--sn-web-color-text-on-primary);
  cursor: pointer;
  transition: background-color 0.15s, opacity 0.15s;
}

.sn-ai-prompt__primary:hover:not(:disabled) {
  background-color: var(--sn-web-color-action-primary-hover);
}

.sn-ai-prompt__primary:disabled {
  background-color: var(--sn-web-color-border-default);
  color: var(--sn-web-color-text-disabled);
  cursor: not-allowed;
}

.sn-ai-prompt__primary--stop {
  background-color: var(--sn-web-color-feedback-danger);
}

/* Reasoning budget row */
.sn-ai-prompt__thinking {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-3);
  padding-top: var(--sn-web-spacing-2);
  border-top: 1px solid var(--sn-web-color-border-subtle);
}

.sn-ai-prompt__thinking-icon {
  flex-shrink: 0;
  color: var(--sn-web-color-text-tertiary);
}

.sn-ai-prompt__thinking-label {
  flex-shrink: 0;
  color: var(--sn-web-color-text-secondary);
  font-size: var(--sn-web-font-size-sm);
}

.sn-ai-prompt__thinking-slider {
  flex: 1;
  min-width: 120px;
}

.sn-ai-prompt__thinking-value {
  flex-shrink: 0;
  min-width: 108px;
  text-align: right;
  color: var(--sn-web-color-text-tertiary);
  font-size: var(--sn-web-font-size-xs);
}

.sn-ai-prompt__hint {
  margin: 0;
  color: var(--sn-web-color-text-tertiary);
  font-size: var(--sn-web-font-size-xs);
}
</style>
