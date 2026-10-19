<script setup lang="ts">
/**
 * sn-ai-message — uni-end transcript row (AUI-TPL-002).
 *
 * The uni counterpart of the web `SnAiMessage`. It renders the exact same
 * `SnAiMessage` contract, so a host can move a transcript between ends without
 * reshaping the data. Only the markup differs: uni-app needs `<view>` / `<text>`
 * cross-end elements instead of `div` / `p`, and styling uses `rpx` sizes.
 *
 * Reference library: wot-ui (AGENTS.md §112 — uni end aligns to wot-ui).
 *
 * Scenarios rendered (mirrors the web module):
 *   queued / thinking / streaming / done / error / aborted
 *   reasoning block (collapsible) · tool row · attachment chip · inline error
 *
 * Per AGENTS.md §113 the icons come from the shared path-data set through
 * `sn-icon`, never emoji.
 *
 * Usage:
 *   <sn-ai-message :message="message" @retry="onRetry" />
 */
import { computed, ref } from 'vue'
import SnIcon from '@snui/uni/components/sn-icon/sn-icon.vue'
import type { IconData } from '@snui/uni/components/sn-icon/sn-icon.vue'
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  FileIcon,
  ImageIcon,
  RetryIcon,
  ToolIcon,
  WarningIcon,
} from '../shared/icons'
import { formatBytes, formatThinkingDuration } from '../shared/stream'
import type { SnAiAttachment, SnAiMessage, SnAiThinkingPart, SnAiToolPart } from '../shared/types'

defineOptions({ name: 'SnAiMessage' })

const props = withDefaults(
  defineProps<{
    /** The turn to render. */
    message: SnAiMessage
    /** Show reasoning blocks after the turn finishes. */
    showThinking?: boolean | undefined
  }>(),
  {
    showThinking: true,
  },
)

const emit = defineEmits<{
  (e: 'retry', message: SnAiMessage): void
}>()

/** Whether the reasoning body is expanded. */
const thinkingOpen = ref(true)

const isUser = computed(() => props.message.role === 'user')
const isAssistant = computed(() => props.message.role === 'assistant')
const isStreaming = computed(() => props.message.status === 'streaming')
const isQueued = computed(() => props.message.status === 'queued')
const isThinkingOnly = computed(() => props.message.status === 'thinking')
const isAborted = computed(() => props.message.status === 'aborted')
const isDone = computed(() => props.message.status === 'done')

/** Body parts excluding the inline error, which renders separately. */
const bodyParts = computed(() => props.message.parts.filter((part) => part.type !== 'error'))
const errorParts = computed(() => props.message.parts.filter((part) => part.type === 'error'))
const hasBody = computed(() => bodyParts.value.length > 0)

/** The reasoning block, if any. */
const thinking = computed<SnAiThinkingPart | undefined>(() => {
  const part = bodyParts.value.find((candidate) => candidate.type === 'thinking')
  return part?.type === 'thinking' ? part : undefined
})

/** The answer text, if any. */
const answer = computed<string>(() => {
  const part = bodyParts.value.find((candidate) => candidate.type === 'text')
  return part?.type === 'text' ? part.text : ''
})

/** Tool rows. */
const tools = computed<SnAiToolPart[]>(() =>
  bodyParts.value.filter((part): part is SnAiToolPart => part.type === 'tool'),
)

/** Attachment chips echoed from a user turn. */
const attachments = computed<SnAiAttachment[]>(() =>
  bodyParts.value.flatMap((part) => (part.type === 'attachment' ? [part.attachment] : [])),
)

const thinkingLabel = computed(() => {
  const part = thinking.value
  if (!part) return ''
  if (!part.done) return '思考中'
  const duration = formatThinkingDuration(part.durationMs)
  return duration ? `已思考 ${duration}` : '思考过程'
})

/** Whether a reasoning block should be visible at all. */
const showThinkingBlock = computed(
  () => thinking.value !== undefined && (props.showThinking || isThinkingOnly.value),
)

function attachmentIcon(attachment: SnAiAttachment): IconData {
  return attachment.mime?.startsWith('image/') ? ImageIcon : FileIcon
}

function attachmentMeta(attachment: SnAiAttachment): string {
  const size = formatBytes(attachment.size)
  return [attachment.mime ?? '', size].filter(Boolean).join(' · ')
}

function toolStatusLabel(status: SnAiToolPart['status']): string {
  if (status === 'running') return '执行中'
  if (status === 'error') return '执行失败'
  return '已完成'
}

function onRetry(): void {
  emit('retry', props.message)
}
</script>

<template>
  <view
    class="sn-ai-message"
    :class="[`sn-ai-message--${message.role}`]"
    :data-status="message.status ?? 'idle'"
  >
    <view v-if="!isUser" class="sn-ai-message__avatar">
      <text class="sn-ai-message__avatar-text">{{ isAssistant ? 'AI' : 'SYS' }}</text>
    </view>

    <view class="sn-ai-message__body">
      <!-- Reasoning block -->
      <view v-if="showThinkingBlock && thinking" class="sn-ai-thinking">
        <view class="sn-ai-thinking__header" @click="thinkingOpen = !thinkingOpen">
          <SnIcon
            :icon="thinkingOpen ? ChevronDownIcon : ChevronRightIcon"
            :size="14"
            class="sn-ai-thinking__chevron"
          />
          <view v-if="!thinking.done" class="sn-ai-thinking__spinner" />
          <SnIcon v-else :icon="ClockIcon" :size="14" />
          <text class="sn-ai-thinking__label">{{ thinkingLabel }}</text>
        </view>
        <view v-if="thinkingOpen" class="sn-ai-thinking__body">
          <text class="sn-ai-thinking__text">{{ thinking.text }}</text>
        </view>
      </view>

      <!-- Tool rows -->
      <view
        v-for="(tool, index) in tools"
        :key="`${message.id}-tool-${index}`"
        class="sn-ai-message__tool"
        :class="`sn-ai-message__tool--${tool.status}`"
      >
        <SnIcon :icon="ToolIcon" :size="14" />
        <text class="sn-ai-message__tool-name">{{ tool.name }}</text>
        <view v-if="tool.status === 'running'" class="sn-ai-message__spinner" />
        <text class="sn-ai-message__tool-status">{{ toolStatusLabel(tool.status) }}</text>
      </view>

      <!-- Attachment chips -->
      <view
        v-for="attachment in attachments"
        :key="attachment.id"
        class="sn-ai-message__attachment"
      >
        <SnIcon :icon="attachmentIcon(attachment)" :size="14" />
        <text class="sn-ai-message__attachment-name">{{ attachment.name }}</text>
        <text v-if="attachmentMeta(attachment)" class="sn-ai-message__attachment-meta">
          {{ attachmentMeta(attachment) }}
        </text>
      </view>

      <!-- Answer text -->
      <view v-if="answer" class="sn-ai-message__text-wrap" :class="{ 'sn-ai-message__text-wrap--user': isUser }">
        <text class="sn-ai-message__text">{{ answer }}</text>
        <text v-if="isStreaming" class="sn-ai-message__caret">|</text>
      </view>

      <!-- Waiting lines -->
      <text v-if="isQueued" class="sn-ai-message__pending">排队中，等待上一条回复完成</text>
      <text v-else-if="isThinkingOnly && !hasBody" class="sn-ai-message__pending">正在思考…</text>
      <text v-else-if="!hasBody && !errorParts.length" class="sn-ai-message__pending">等待输出…</text>

      <!-- Aborted notice -->
      <text v-if="isAborted" class="sn-ai-message__notice">
        已停止生成<template v-if="answer">，以上为已生成内容</template>
      </text>

      <!-- Inline failures -->
      <view
        v-for="(part, index) in errorParts"
        :key="`${message.id}-err-${index}`"
        class="sn-ai-message__error"
      >
        <view class="sn-ai-message__error-head">
          <SnIcon :icon="WarningIcon" :size="14" />
          <text class="sn-ai-message__error-title">{{ part.type === 'error' ? part.error.message : '' }}</text>
        </view>
        <text v-if="part.type === 'error' && part.error.code" class="sn-ai-message__error-code">
          {{ part.type === 'error' ? part.error.code : '' }}
        </text>
        <text v-if="part.type === 'error' && part.error.hint" class="sn-ai-message__error-hint">
          {{ part.type === 'error' ? part.error.hint : '' }}
        </text>
        <view
          v-if="part.type === 'error' && part.error.retryable !== false && isAssistant"
          class="sn-ai-message__retry"
          @click="onRetry"
        >
          <SnIcon :icon="RetryIcon" :size="13" />
          <text class="sn-ai-message__retry-text">重试</text>
        </view>
      </view>

      <!-- Turn actions -->
      <view v-if="isAssistant && isDone && answer" class="sn-ai-message__actions">
        <SnIcon :icon="CheckIcon" :size="12" />
        <text class="sn-ai-message__done">已完成</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.sn-ai-message {
  display: flex;
  flex-direction: row;
  gap: var(--sn-mp-spacing-4);
  padding: var(--sn-mp-spacing-4) 0;
}

.sn-ai-message--user {
  flex-direction: row-reverse;
}

.sn-ai-message__avatar {
  flex-shrink: 0;
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--sn-mp-radius-xl);
  background-color: var(--sn-mp-color-background-subtle);
}

.sn-ai-message__avatar-text {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-icon-size-small);
}

.sn-ai-message__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

/* Reasoning block */
.sn-ai-thinking {
  margin-bottom: var(--sn-mp-spacing-4);
  border: 1px solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-lg);
  background-color: var(--sn-mp-color-background-subtle);
  overflow: hidden;
}

.sn-ai-thinking__header {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sn-mp-spacing-2);
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-4);
}

.sn-ai-thinking__chevron {
  flex-shrink: 0;
}

.sn-ai-thinking__spinner {
  width: 24rpx;
  height: 24rpx;
  border: 4rpx solid var(--sn-mp-color-border-default);
  border-top-color: var(--sn-mp-color-action-primary);
  border-radius: var(--sn-mp-radius-xl);
}

.sn-ai-thinking__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-icon-size-small);
}

.sn-ai-thinking__body {
  padding: 0 var(--sn-mp-spacing-4) var(--sn-mp-spacing-3);
}

.sn-ai-thinking__text {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-icon-size-small);
  line-height: var(--sn-mp-font-line-height-loose, 1.8);
}

/* Tool row */
.sn-ai-message__tool {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sn-mp-spacing-2);
  margin-bottom: var(--sn-mp-spacing-3);
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-3);
  border: 1px solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-subtle);
}

.sn-ai-message__tool--error {
  border-color: var(--sn-mp-color-feedback-danger);
}

.sn-ai-message__tool-name {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-icon-size-small);
}

.sn-ai-message__tool-status {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-icon-size-tiny);
}

.sn-ai-message__spinner {
  width: 20rpx;
  height: 20rpx;
  border: 4rpx solid var(--sn-mp-color-border-default);
  border-top-color: var(--sn-mp-color-action-primary);
  border-radius: var(--sn-mp-radius-xl);
}

/* Attachment chip */
.sn-ai-message__attachment {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sn-mp-spacing-2);
  margin-bottom: var(--sn-mp-spacing-3);
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-3);
  border: 1px solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-md);
}

.sn-ai-message__attachment-name {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-icon-size-small);
}

.sn-ai-message__attachment-meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-icon-size-tiny);
}

/* Answer text */
.sn-ai-message__text-wrap {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: var(--sn-mp-spacing-3);
}

.sn-ai-message__text-wrap--user {
  justify-content: flex-end;
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-4);
  border-radius: var(--sn-mp-radius-lg);
  background-color: var(--sn-mp-color-action-primary);
}

.sn-ai-message__text {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md, 28rpx);
  line-height: var(--sn-mp-font-line-height-loose, 1.8);
}

.sn-ai-message__text-wrap--user .sn-ai-message__text {
  color: var(--sn-mp-color-text-on-primary);
}

.sn-ai-message__caret {
  color: var(--sn-mp-color-action-primary);
}

.sn-ai-message__pending,
.sn-ai-message__notice {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-icon-size-small);
  margin-bottom: var(--sn-mp-spacing-3);
}

/* Error card */
.sn-ai-message__error {
  margin-bottom: var(--sn-mp-spacing-3);
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-4);
  border: 1px solid var(--sn-mp-color-feedback-danger);
  border-radius: var(--sn-mp-radius-lg);
}

.sn-ai-message__error-head {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sn-mp-spacing-2);
}

.sn-ai-message__error-title {
  color: var(--sn-mp-color-feedback-danger);
  font-size: var(--sn-mp-icon-size-small);
}

.sn-ai-message__error-code {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-icon-size-tiny);
}

.sn-ai-message__error-hint {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-icon-size-small);
}

.sn-ai-message__retry {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sn-mp-spacing-2);
  margin-top: var(--sn-mp-spacing-3);
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-4);
  border: 1px solid var(--sn-mp-color-feedback-danger);
  border-radius: var(--sn-mp-radius-md);
}

.sn-ai-message__retry-text {
  color: var(--sn-mp-color-feedback-danger);
  font-size: var(--sn-mp-icon-size-small);
}

/* Actions */
.sn-ai-message__actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sn-mp-spacing-2);
}

.sn-ai-message__done {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-icon-size-tiny);
}
</style>
