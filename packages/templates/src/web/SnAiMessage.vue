<script setup lang="ts">
/**
 * SnAiMessage — one turn in the transcript, rendering every message part.
 *
 * Part rendering (each covered by tests):
 *   thinking   → SnAiThinking (collapsible, duration, live spinner)
 *   text       → streamed answer, with a caret while still streaming
 *   tool       → tool-call row (running spinner / done / error)
 *   attachment → attachment chip echoed from the user turn
 *   error      → inline error card with retry + code
 *
 * Status scenarios the row distinguishes (see `SnAiMessageStatus`):
 *   queued     → "排队中" chip, no body yet
 *   thinking   → reasoning block live, answer area shows a waiting line
 *   streaming  → answer text growing, stop affordance owned by the prompt
 *   done       → full body, copy affordance available
 *   error      → error card replaces the tail of the body
 *   aborted    → body kept, "已停止" notice appended
 *
 * Per AGENTS.md §46 the row is a pure function of the message contract — it
 * holds no timers or listeners of its own, so there is nothing to dispose.
 *
 * Usage:
 *   <SnAiMessage :message="message" @retry="onRetry" />
 */
import { computed } from 'vue';
import { SnIcon } from '@snui/vue-web';
import {
  CheckIcon,
  CopyIcon,
  FileIcon,
  ImageIcon,
  RetryIcon,
  ToolIcon,
  WarningIcon,
} from '../shared/icons';
import { formatBytes, formatThinkingDuration } from '../shared/stream';
import type { SnAiAttachment, SnAiMessage, SnAiToolPart } from '../shared/types';
import type { IconComponent } from '@snui/vue-web';
import { toIconComponent } from './icon-adapter';
import SnAiThinking from './SnAiThinking.vue';

defineOptions({ name: 'SnAiMessage' });

const props = withDefaults(
  defineProps<{
    /** The turn to render. */
    message: SnAiMessage;
    /** Whether the row's copy affordance shows the copied confirmation. */
    copied?: boolean | undefined;
    /** Show the reasoning block even after the turn finishes. */
    showThinking?: boolean | undefined;
    /** Show the copy affordance on finished assistant turns. */
    showCopy?: boolean | undefined;
  }>(),
  {
    copied: false,
    showThinking: true,
    showCopy: true,
  },
);

const emit = defineEmits<{
  /** User asked to retry a failed turn. */
  (e: 'retry', message: SnAiMessage): void;
  /** User asked to copy the turn's answer text. */
  (e: 'copy', message: SnAiMessage): void;
}>();

const icons = {
  warning: toIconComponent(WarningIcon),
  retry: toIconComponent(RetryIcon),
  copy: toIconComponent(CopyIcon),
  check: toIconComponent(CheckIcon),
  tool: toIconComponent(ToolIcon),
  file: toIconComponent(FileIcon),
  image: toIconComponent(ImageIcon),
};

/** Assistant rows carry the copy affordance; user rows are right-aligned. */
const isAssistant = computed(() => props.message.role === 'assistant');

/** Parts that belong to the body (everything except error, rendered apart). */
const bodyParts = computed(() => props.message.parts.filter((part) => part.type !== 'error'));

/** Inline failures for this turn. */
const errorParts = computed(() => props.message.parts.filter((part) => part.type === 'error'));

/** Whether the answer is still arriving (drives the caret + waiting line). */
const isStreaming = computed(() => props.message.status === 'streaming');
const isQueued = computed(() => props.message.status === 'queued');
const isThinkingOnly = computed(() => props.message.status === 'thinking');
const isAborted = computed(() => props.message.status === 'aborted');
const isDone = computed(() => props.message.status === 'done');

/** Whether the row has any visible content yet. */
const hasBody = computed(() => bodyParts.value.length > 0);

/** Icon for an attachment chip, chosen from its MIME type. */
function attachmentIcon(attachment: SnAiAttachment): IconComponent {
  return attachment.mime?.startsWith('image/') ? icons.image : icons.file;
}

/** Human-readable attachment metadata line. */
function attachmentMeta(attachment: SnAiAttachment): string {
  const size = formatBytes(attachment.size);
  const type = attachment.mime ?? '';
  return [type, size].filter(Boolean).join(' · ');
}

/** Label for a tool row's status. */
function toolStatusLabel(status: SnAiToolPart['status']): string {
  if (status === 'running') return '执行中';
  if (status === 'error') return '执行失败';
  return '已完成';
}

/** Whether a thinking block should render given `showThinking`. */
const visibleThinking = computed(() => props.showThinking || isThinkingOnly.value);

function onRetry(): void {
  emit('retry', props.message);
}

function onCopy(): void {
  emit('copy', props.message);
}
</script>

<template>
  <article
    class="sn-ai-message"
    :class="[
      `sn-ai-message--${message.role}`,
      { 'sn-ai-message--streaming': isStreaming, 'sn-ai-message--queued': isQueued },
    ]"
    :data-snui-component="'ai-message'"
    :data-status="message.status ?? 'idle'"
  >
    <div
      v-if="isAssistant || message.role === 'system'"
      class="sn-ai-message__avatar"
      aria-hidden="true"
    >
      <slot name="avatar">
        <span class="sn-ai-message__avatar-fallback">{{ isAssistant ? 'AI' : 'SYS' }}</span>
      </slot>
    </div>

    <div class="sn-ai-message__body">
      <!-- Reasoning blocks -->
      <template v-for="(part, index) in bodyParts" :key="`${message.id}-part-${index}`">
        <SnAiThinking
          v-if="part.type === 'thinking' && visibleThinking"
          :part="part"
          :expanded="part.done ? undefined : true"
        />

        <p v-else-if="part.type === 'text'" class="sn-ai-message__text">
          {{ part.text }}<span v-if="isStreaming" class="sn-ai-message__caret" aria-hidden="true" />
        </p>

        <div
          v-else-if="part.type === 'tool'"
          class="sn-ai-message__tool"
          :class="`sn-ai-message__tool--${part.status}`"
        >
          <SnIcon :icon="icons.tool" :size="14" class="sn-ai-message__tool-icon" />
          <span class="sn-ai-message__tool-name">{{ part.name }}</span>
          <span
            v-if="part.status === 'running'"
            class="sn-ai-message__tool-spinner"
            aria-hidden="true"
          />
          <span class="sn-ai-message__tool-status">{{ toolStatusLabel(part.status) }}</span>
          <span v-if="part.detail" class="sn-ai-message__tool-detail">{{ part.detail }}</span>
        </div>

        <div v-else-if="part.type === 'attachment'" class="sn-ai-message__attachment">
          <SnIcon :icon="attachmentIcon(part.attachment)" :size="14" />
          <span class="sn-ai-message__attachment-name">{{ part.attachment.name }}</span>
          <span v-if="attachmentMeta(part.attachment)" class="sn-ai-message__attachment-meta">
            {{ attachmentMeta(part.attachment) }}
          </span>
        </div>
      </template>

      <!-- Waiting line: queued / reasoning-only turns have no body text yet -->
      <p v-if="isQueued" class="sn-ai-message__pending">
        <span class="sn-ai-message__pending-dot" aria-hidden="true" />
        排队中，等待上一条回复完成
      </p>
      <p v-else-if="isThinkingOnly && !hasBody" class="sn-ai-message__pending">
        <span class="sn-ai-message__pending-dot" aria-hidden="true" />
        正在思考…
      </p>
      <p v-else-if="!hasBody && !errorParts.length" class="sn-ai-message__pending">
        <span class="sn-ai-message__pending-dot" aria-hidden="true" />
        等待输出…
      </p>

      <!-- Aborted notice -->
      <p v-if="isAborted" class="sn-ai-message__notice">
        已停止生成<template v-if="message.parts.some((p) => p.type === 'text')"
          >，以上为已生成内容</template
        >
      </p>

      <!-- Inline failures -->
      <div
        v-for="(part, index) in errorParts"
        :key="`${message.id}-err-${index}`"
        class="sn-ai-message__error"
      >
        <div class="sn-ai-message__error-head">
          <SnIcon :icon="icons.warning" :size="14" class="sn-ai-message__error-icon" />
          <span class="sn-ai-message__error-title">{{ part.error.message }}</span>
          <code class="sn-ai-message__error-code">{{ part.error.code }}</code>
        </div>
        <p v-if="part.error.hint" class="sn-ai-message__error-hint">{{ part.error.hint }}</p>
        <button
          v-if="part.error.retryable !== false && isAssistant"
          type="button"
          class="sn-ai-message__error-retry"
          @click="onRetry"
        >
          <SnIcon :icon="icons.retry" :size="13" />
          重试
        </button>
      </div>

      <!-- Turn actions: copy on finished assistant turns -->
      <div v-if="isAssistant && isDone && showCopy && hasBody" class="sn-ai-message__actions">
        <button type="button" class="sn-ai-message__action" @click="onCopy">
          <SnIcon :icon="copied ? icons.check : icons.copy" :size="13" />
          <span>{{ copied ? '已复制' : '复制' }}</span>
        </button>
        <span
          v-if="
            formatThinkingDuration(
              message.updatedAt && message.createdAt
                ? message.updatedAt - message.createdAt
                : undefined,
            )
          "
          class="sn-ai-message__elapsed"
        >
          用时
          {{
            formatThinkingDuration(
              message.updatedAt && message.createdAt
                ? message.updatedAt - message.createdAt
                : undefined,
            )
          }}
        </span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.sn-ai-message {
  display: flex;
  gap: var(--sn-web-spacing-4);
  padding: var(--sn-web-spacing-4) 0;
}

.sn-ai-message--user {
  flex-direction: row-reverse;
}

.sn-ai-message__avatar {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: var(--sn-web-radius-full);
  background-color: var(--sn-web-color-background-subtle);
  color: var(--sn-web-color-text-secondary);
  font-size: var(--sn-web-font-size-xs);
  font-weight: var(--sn-web-font-weight-semibold);
}

.sn-ai-message--user .sn-ai-message__avatar {
  background-color: var(--sn-web-color-action-primary);
  color: var(--sn-web-color-text-on-primary);
}

.sn-ai-message__body {
  min-width: 0;
  flex: 1;
  max-width: 100%;
}

.sn-ai-message--user .sn-ai-message__body {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.sn-ai-message__text {
  margin: 0 0 var(--sn-web-spacing-3);
  color: var(--sn-web-color-text-primary);
  font-size: var(--sn-web-font-size-md);
  line-height: var(--sn-web-font-line-height-loose);
  white-space: pre-wrap;
  word-break: break-word;
}

.sn-ai-message--user .sn-ai-message__text {
  padding: var(--sn-web-spacing-3) var(--sn-web-spacing-4);
  border-radius: var(--sn-web-radius-lg);
  background-color: var(--sn-web-color-action-primary);
  color: var(--sn-web-color-text-on-primary);
}

/* Streaming caret — a blinking block that signals live output. */
.sn-ai-message__caret {
  display: inline-block;
  width: 2px;
  height: 1em;
  margin-left: 2px;
  vertical-align: text-bottom;
  background-color: var(--sn-web-color-action-primary);
  animation: sn-ai-caret 1s steps(2, start) infinite;
}

@keyframes sn-ai-caret {
  to {
    visibility: hidden;
  }
}

.sn-ai-message__pending {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-2);
  margin: 0 0 var(--sn-web-spacing-3);
  color: var(--sn-web-color-text-tertiary);
  font-size: var(--sn-web-font-size-sm);
}

.sn-ai-message__pending-dot {
  width: 6px;
  height: 6px;
  border-radius: var(--sn-web-radius-full);
  background-color: var(--sn-web-color-action-primary);
  animation: sn-ai-pulse 1.2s ease-in-out infinite;
}

@keyframes sn-ai-pulse {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}

.sn-ai-message__notice {
  margin: 0 0 var(--sn-web-spacing-3);
  color: var(--sn-web-color-text-tertiary);
  font-size: var(--sn-web-font-size-sm);
}

/* Tool-call row */
.sn-ai-message__tool {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-2);
  margin: 0 0 var(--sn-web-spacing-3);
  padding: var(--sn-web-spacing-2) var(--sn-web-spacing-3);
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: var(--sn-web-radius-md);
  background-color: var(--sn-web-color-background-subtle);
  color: var(--sn-web-color-text-secondary);
  font-size: var(--sn-web-font-size-sm);
}

.sn-ai-message__tool--error {
  border-color: var(--sn-web-color-feedback-danger);
  color: var(--sn-web-color-feedback-danger);
}

.sn-ai-message__tool-name {
  font-weight: var(--sn-web-font-weight-medium);
  color: var(--sn-web-color-text-primary);
}

.sn-ai-message__tool-spinner {
  width: 10px;
  height: 10px;
  border: 2px solid var(--sn-web-color-border-default);
  border-top-color: var(--sn-web-color-action-primary);
  border-radius: var(--sn-web-radius-full);
  animation: sn-ai-thinking-spin 0.8s linear infinite;
}

@keyframes sn-ai-thinking-spin {
  to {
    transform: rotate(360deg);
  }
}

.sn-ai-message__tool-detail {
  margin-left: auto;
  color: var(--sn-web-color-text-tertiary);
  font-size: var(--sn-web-font-size-xs);
}

/* Attachment chip */
.sn-ai-message__attachment {
  display: inline-flex;
  align-items: center;
  gap: var(--sn-web-spacing-2);
  margin: 0 0 var(--sn-web-spacing-3);
  padding: var(--sn-web-spacing-2) var(--sn-web-spacing-3);
  border: 1px solid var(--sn-web-color-border-default);
  border-radius: var(--sn-web-radius-md);
  background-color: var(--sn-web-color-background-surface);
  color: var(--sn-web-color-text-secondary);
  font-size: var(--sn-web-font-size-sm);
}

.sn-ai-message__attachment-name {
  color: var(--sn-web-color-text-primary);
}

.sn-ai-message__attachment-meta {
  color: var(--sn-web-color-text-tertiary);
  font-size: var(--sn-web-font-size-xs);
}

/* Error card */
.sn-ai-message__error {
  margin: 0 0 var(--sn-web-spacing-3);
  padding: var(--sn-web-spacing-3) var(--sn-web-spacing-4);
  border: 1px solid var(--sn-web-color-feedback-danger);
  border-radius: var(--sn-web-radius-lg);
  background-color: color-mix(in srgb, var(--sn-web-color-feedback-danger) 8%, transparent);
}

.sn-ai-message__error-head {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-2);
  color: var(--sn-web-color-feedback-danger);
  font-size: var(--sn-web-font-size-sm);
}

.sn-ai-message__error-icon {
  flex-shrink: 0;
}

.sn-ai-message__error-title {
  font-weight: var(--sn-web-font-weight-medium);
}

.sn-ai-message__error-code {
  margin-left: auto;
  padding: 1px 6px;
  border-radius: var(--sn-web-radius-sm);
  background-color: var(--sn-web-color-background-subtle);
  color: var(--sn-web-color-text-tertiary);
  font-family: monospace;
  font-size: var(--sn-web-font-size-xs);
}

.sn-ai-message__error-hint {
  margin: var(--sn-web-spacing-2) 0 0;
  color: var(--sn-web-color-text-secondary);
  font-size: var(--sn-web-font-size-sm);
}

.sn-ai-message__error-retry {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: var(--sn-web-spacing-3);
  padding: 0 10px;
  height: 28px;
  border: 1px solid var(--sn-web-color-feedback-danger);
  border-radius: var(--sn-web-radius-md);
  background: transparent;
  color: var(--sn-web-color-feedback-danger);
  font-family: inherit;
  font-size: var(--sn-web-font-size-sm);
  cursor: pointer;
}

.sn-ai-message__error-retry:hover {
  background-color: color-mix(in srgb, var(--sn-web-color-feedback-danger) 12%, transparent);
}

/* Turn actions */
.sn-ai-message__actions {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-3);
  margin-top: var(--sn-web-spacing-2);
}

.sn-ai-message__action {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  border: 0;
  border-radius: var(--sn-web-radius-sm);
  background: transparent;
  color: var(--sn-web-color-text-tertiary);
  font-family: inherit;
  font-size: var(--sn-web-font-size-xs);
  cursor: pointer;
}

.sn-ai-message__action:hover {
  background-color: var(--sn-web-color-background-subtle);
  color: var(--sn-web-color-text-primary);
}

.sn-ai-message__elapsed {
  color: var(--sn-web-color-text-tertiary);
  font-size: var(--sn-web-font-size-xs);
}
</style>
