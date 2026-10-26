<script setup lang="ts">
/**
 * SnAiThinking — collapsible reasoning block for one assistant turn.
 *
 * Renders the model's reasoning trace above (or between) answer blocks. The
 * block is open while reasoning streams and collapses once the answer starts,
 * so the reader sees the trace forming then gets it out of the way — the
 * standard reasoning-display behaviour.
 *
 * States rendered (all covered by tests):
 *   - streaming  → spinner + live text, header shows "思考中"
 *   - closed     → collapsed body, header shows the elapsed duration
 *   - interleaved→ a second block after answer text re-opens independently
 *
 * Per AGENTS.md §41 the auto-collapse is a pure derived state (no timer, no
 * listener), so there is nothing to dispose.
 *
 * Usage:
 *   <SnAiThinking :part="thinkingPart" />
 */
import { computed } from 'vue';
import { SnIcon } from '@snui/vue-web';
import { ChevronDownIcon, ChevronRightIcon, ClockIcon } from '../shared/icons';
import { toIconComponent } from './icon-adapter';
import { formatThinkingDuration } from '../shared/stream';
import type { SnAiThinkingPart } from '../shared/types';

defineOptions({ name: 'SnAiThinking' });

const props = withDefaults(
  defineProps<{
    /** The reasoning block to render. */
    part: SnAiThinkingPart;
    /**
     * Whether the body is expanded. `undefined` = auto: open while the block
     * is still streaming, collapsed once it has closed.
     */
    expanded?: boolean | undefined;
    /** Force the block collapsed regardless of state. */
    defaultCollapsed?: boolean;
  }>(),
  {
    expanded: undefined,
    defaultCollapsed: false,
  },
);

/** Whether the body is visible. Auto mode follows the streaming state. */
const isExpanded = computed(() => {
  if (props.defaultCollapsed) return false;
  if (props.expanded !== undefined) return props.expanded;
  return !props.part.done;
});

const chevron = computed(() =>
  isExpanded.value ? toIconComponent(ChevronDownIcon) : toIconComponent(ChevronRightIcon),
);
const clock = toIconComponent(ClockIcon);

/** Header text: live label while streaming, duration once closed. */
const headerLabel = computed(() => {
  if (!props.part.done) return '思考中';
  const duration = formatThinkingDuration(props.part.durationMs);
  return duration ? `已思考 ${duration}` : '思考过程';
});

const emit = defineEmits<{
  /** Fired when the user toggles the disclosure. */
  (e: 'toggle', expanded: boolean): void;
}>();

function onToggle(): void {
  emit('toggle', !isExpanded.value);
}
</script>

<template>
  <div
    class="sn-ai-thinking"
    :class="{ 'sn-ai-thinking--open': isExpanded, 'sn-ai-thinking--live': !part.done }"
    data-snui-component="ai-thinking"
  >
    <button
      type="button"
      class="sn-ai-thinking__header"
      :aria-expanded="isExpanded ? 'true' : 'false'"
      @click="onToggle"
    >
      <SnIcon :icon="chevron" :size="14" class="sn-ai-thinking__chevron" />
      <span v-if="!part.done" class="sn-ai-thinking__spinner" aria-hidden="true" />
      <SnIcon v-else :icon="clock" :size="14" class="sn-ai-thinking__clock" />
      <span class="sn-ai-thinking__label">{{ headerLabel }}</span>
    </button>

    <div v-show="isExpanded" class="sn-ai-thinking__body">
      <p class="sn-ai-thinking__text">{{ part.text }}</p>
    </div>
  </div>
</template>

<style scoped>
.sn-ai-thinking {
  margin: 0 0 var(--sn-web-spacing-4);
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: var(--sn-web-radius-lg);
  background-color: var(--sn-web-color-background-subtle);
  overflow: hidden;
}

.sn-ai-thinking__header {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-2);
  width: 100%;
  padding: var(--sn-web-spacing-3) var(--sn-web-spacing-4);
  border: 0;
  background: transparent;
  color: var(--sn-web-color-text-secondary);
  font-family: inherit;
  font-size: var(--sn-web-font-size-sm);
  line-height: var(--sn-web-font-line-height-normal);
  text-align: left;
  cursor: pointer;
}

.sn-ai-thinking__header:hover {
  color: var(--sn-web-color-text-primary);
}

.sn-ai-thinking__chevron,
.sn-ai-thinking__clock {
  flex-shrink: 0;
}

.sn-ai-thinking__label {
  font-weight: var(--sn-web-font-weight-medium);
}

.sn-ai-thinking--live .sn-ai-thinking__label {
  color: var(--sn-web-color-action-primary);
}

.sn-ai-thinking__spinner {
  flex-shrink: 0;
  width: 12px;
  height: 12px;
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

.sn-ai-thinking__body {
  padding: 0 var(--sn-web-spacing-4) var(--sn-web-spacing-3);
}

.sn-ai-thinking__text {
  margin: 0;
  color: var(--sn-web-color-text-secondary);
  font-size: var(--sn-web-font-size-sm);
  line-height: var(--sn-web-font-line-height-loose);
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
