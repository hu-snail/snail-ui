<script setup lang="ts">
/**
 * SnAiMessageList — scrollable transcript container for a conversation.
 *
 * Why a dedicated container instead of a plain `v-for`: a live transcript has
 * behaviour that a loop cannot express — it must stay pinned to the newest
 * message while output streams, but must NOT yank the viewport back down once
 * the reader has scrolled up to re-read earlier turns. That "stick to bottom
 * unless the user scrolled away" rule is the whole reason this component
 * exists, and it is implemented here with an IntersectionObserver on a bottom
 * sentinel (cheaper and more reliable than reading scrollTop on every frame).
 *
 * Empty / loading / streaming scenarios rendered:
 *   empty      → SnEmpty with a caller-supplied hint
 *   loading    → skeleton rows while history is fetched
 *   populated  → message rows + scroll-to-bottom affordance when unpinned
 *   streaming  → the last row receives the caret; auto-scroll stays engaged
 *
 * Per AGENTS.md §41 every observer is created in `onMounted` and disconnected
 * in `onBeforeUnmount`; the component owns no other resource.
 *
 * Usage:
 *   <SnAiMessageList :messages="messages" @retry="onRetry" />
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { SnEmpty, SnIcon } from '@snui/vue-web'
import { ChevronDownIcon } from '../shared/icons'
import type { SnAiMessage } from '../shared/types'
import { toIconComponent } from './icon-adapter'
import SnAiMessageRow from './SnAiMessage.vue'

defineOptions({ name: 'SnAiMessageList' })

const props = withDefaults(
  defineProps<{
    /** The transcript, oldest first. */
    messages?: SnAiMessage[] | undefined
    /** Show skeleton rows instead of the transcript. */
    loading?: boolean | undefined
    /** Number of skeleton rows while loading. */
    loadingRows?: number | undefined
    /** Text shown when the transcript is empty. */
    emptyText?: string | undefined
    /** Secondary line shown under the empty text. */
    emptyHint?: string | undefined
    /** Automatically follow new output. Default true. */
    autoScroll?: boolean | undefined
    /** Show the copy affordance on finished assistant turns. */
    showCopy?: boolean | undefined
    /** Show reasoning blocks after a turn finishes. */
    showThinking?: boolean | undefined
    /** Max height of the scroll area. Defaults to filling the parent. */
    maxHeight?: string | undefined
    /** Distance in px from the bottom that still counts as "pinned". */
    stickThreshold?: number | undefined
  }>(),
  {
    messages: () => [],
    loading: false,
    loadingRows: 3,
    emptyText: '开始新的对话',
    emptyHint: '在下方输入框输入你的问题',
    autoScroll: true,
    showCopy: true,
    showThinking: true,
    maxHeight: undefined,
    stickThreshold: 48,
  },
)

const emit = defineEmits<{
  /** A failed turn asked to be retried. */
  (e: 'retry', message: SnAiMessage): void
  /** A finished turn asked to be copied. */
  (e: 'copy', message: SnAiMessage): void
  /** The user reached the bottom of the transcript. */
  (e: 'reach-bottom'): void
}>()

const chevronIcon = toIconComponent(ChevronDownIcon)

const scrollRef = ref<HTMLElement | null>(null)
const sentinelRef = ref<HTMLElement | null>(null)

/**
 * Whether the viewport is currently pinned to the bottom. Kept as a ref (not a
 * computed) because it is driven by the observer, and read by the scroll
 * watcher to decide whether a new message should yank the view down.
 */
const isPinned = ref(true)
/** Whether the transcript overflows enough to offer the scroll-down button. */
const isOverflowing = ref(false)
/** Set by the user's copy action; cleared on a timer so it reads as a flash. */
const copiedId = ref<string>('')

let observer: IntersectionObserver | null = null
let copiedTimer: ReturnType<typeof setTimeout> | null = null

/** Whether any message currently has output in flight. */
const isStreaming = computed(() =>
  (props.messages ?? []).some(
    (message) =>
      message.status === 'streaming' ||
      message.status === 'thinking' ||
      message.status === 'queued',
  ),
)

const isEmpty = computed(() => !props.loading && (props.messages ?? []).length === 0)

/** Scroll the viewport to the bottom, immediately and smoothly on next tick. */
function scrollToBottom(smooth = true): void {
  const el = scrollRef.value
  if (!el) return
  el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' })
}

/** Measure whether the content is taller than the viewport. */
function measureOverflow(): void {
  const el = scrollRef.value
  if (!el) return
  isOverflowing.value = el.scrollHeight - el.clientHeight > 4
}

function onRetry(message: SnAiMessage): void {
  emit('retry', message)
}

/** Copy a turn's answer text and flash the confirmation on that row. */
async function onCopy(message: SnAiMessage): Promise<void> {
  emit('copy', message)
  const text = message.parts
    .filter((part) => part.type === 'text')
    .map((part) => (part.type === 'text' ? part.text : ''))
    .join('\n')
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // Clipboard access can be denied (insecure context / user gesture rules).
    // The emit above already told the host, so a failure here is not fatal.
  }
  copiedId.value = message.id
  if (copiedTimer !== null) clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => {
    copiedId.value = ''
  }, 1500)
}

function onScroll(): void {
  measureOverflow()
}

onMounted(() => {
  const sentinel = sentinelRef.value
  const root = scrollRef.value
  if (!sentinel || !root) return
  // The sentinel sits after the last row. While it is visible the reader is at
  // the bottom, so new output should keep following; once it scrolls out of
  // view the reader has moved away and the view must stay put.
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (!entry) return
      isPinned.value = entry.isIntersecting
      if (entry.isIntersecting) emit('reach-bottom')
    },
    { root, threshold: 0 },
  )
  observer.observe(sentinel)
  measureOverflow()
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
  if (copiedTimer !== null) {
    clearTimeout(copiedTimer)
    copiedTimer = null
  }
})

// Follow new output only while pinned. `nextTick` lets the DOM paint the new
// row before measuring its height.
watch(
  () => props.messages?.length,
  async () => {
    if (!props.autoScroll || !isPinned.value) return
    await nextTick()
    scrollToBottom(false)
    measureOverflow()
  },
)

// Streaming text grows without changing the message count, so the last row's
// content is watched too.
watch(
  () => (props.messages ?? []).map((message) => message.updatedAt).join('|'),
  async () => {
    if (!props.autoScroll || !isPinned.value) return
    await nextTick()
    scrollToBottom(false)
    measureOverflow()
  },
)
</script>

<template>
  <div class="sn-ai-message-list" data-snui-component="ai-message-list">
    <div
      ref="scrollRef"
      class="sn-ai-message-list__scroll"
      :style="maxHeight ? { maxHeight } : undefined"
      @scroll.passive="onScroll"
    >
      <!-- Loading skeleton -->
      <template v-if="loading">
        <div v-for="row in loadingRows" :key="`skeleton-${row}`" class="sn-ai-message-list__skeleton">
          <span class="sn-ai-message-list__skeleton-avatar" />
          <span class="sn-ai-message-list__skeleton-lines">
            <span class="sn-ai-message-list__skeleton-line" />
            <span class="sn-ai-message-list__skeleton-line sn-ai-message-list__skeleton-line--short" />
          </span>
        </div>
      </template>

      <!-- Empty state -->
      <div v-else-if="isEmpty" class="sn-ai-message-list__empty">
        <slot name="empty">
          <SnEmpty :description="emptyText ?? '开始新的对话'">
            <template #extra>
              <span v-if="emptyHint" class="sn-ai-message-list__empty-hint">{{ emptyHint }}</span>
            </template>
          </SnEmpty>
        </slot>
      </div>

      <!-- Transcript -->
      <template v-else>
        <SnAiMessageRow
          v-for="message in messages"
          :key="message.id"
          :message="message"
          :copied="copiedId === message.id"
          :show-copy="showCopy"
          :show-thinking="showThinking"
          @retry="onRetry"
          @copy="onCopy"
        />
      </template>

      <div ref="sentinelRef" class="sn-ai-message-list__sentinel" aria-hidden="true" />
    </div>

    <!-- Jump back to the newest output -->
    <Transition name="sn-ai-fade">
      <button
        v-if="isOverflowing && !isPinned"
        type="button"
        class="sn-ai-message-list__jump"
        aria-label="滚动到最新消息"
        @click="scrollToBottom()"
      >
        <SnIcon :icon="chevronIcon" :size="16" />
      </button>
    </Transition>
  </div>
</template>

<style scoped>
.sn-ai-message-list {
  position: relative;
  min-height: 0;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.sn-ai-message-list__scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0 var(--sn-web-spacing-5);
  scrollbar-width: thin;
}

.sn-ai-message-list__sentinel {
  height: 1px;
}

/* Skeleton rows — mirror the message row geometry so the swap is not jarring. */
.sn-ai-message-list__skeleton {
  display: flex;
  gap: var(--sn-web-spacing-4);
  padding: var(--sn-web-spacing-4) 0;
}

.sn-ai-message-list__skeleton-avatar {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: var(--sn-web-radius-full);
  background-color: var(--sn-web-color-background-subtle);
  animation: sn-ai-skeleton-pulse 1.4s ease-in-out infinite;
}

.sn-ai-message-list__skeleton-lines {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--sn-web-spacing-2);
}

.sn-ai-message-list__skeleton-line {
  height: 12px;
  border-radius: var(--sn-web-radius-sm);
  background-color: var(--sn-web-color-background-subtle);
  animation: sn-ai-skeleton-pulse 1.4s ease-in-out infinite;
}

.sn-ai-message-list__skeleton-line--short {
  width: 45%;
}

@keyframes sn-ai-skeleton-pulse {
  0%,
  100% {
    opacity: 0.45;
  }
  50% {
    opacity: 1;
  }
}

.sn-ai-message-list__empty {
  display: grid;
  place-items: center;
  min-height: 240px;
  padding: var(--sn-web-spacing-10) 0;
}

.sn-ai-message-list__empty-hint {
  color: var(--sn-web-color-text-tertiary);
  font-size: var(--sn-web-font-size-sm);
}

/* Jump-to-latest pill, floated over the transcript's bottom edge. */
.sn-ai-message-list__jump {
  position: absolute;
  left: 50%;
  bottom: var(--sn-web-spacing-5);
  transform: translateX(-50%);
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--sn-web-color-border-default);
  border-radius: var(--sn-web-radius-full);
  background-color: var(--sn-web-color-background-surface);
  color: var(--sn-web-color-text-secondary);
  box-shadow: var(--sn-web-shadow-md);
  cursor: pointer;
}

.sn-ai-message-list__jump:hover {
  color: var(--sn-web-color-action-primary);
  border-color: var(--sn-web-color-action-primary);
}

.sn-ai-fade-enter-active,
.sn-ai-fade-leave-active {
  transition: opacity 0.15s ease;
}

.sn-ai-fade-enter-from,
.sn-ai-fade-leave-to {
  opacity: 0;
}
</style>
