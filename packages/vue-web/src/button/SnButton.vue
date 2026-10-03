<script setup lang="ts">
/**
 * SnButton — web-end primary button component (AUI-CORE-001 / AUI-WEB-001).
 *
 * API design reference: naive-ui (composition + theme overrides).
 * Token-driven styling: every visual property resolves via `var(--sn-*)`.
 *
 * Per AGENTS.md §30/31: name / version / props / events / slots / tokens /
 * accessibility / capabilities declared in `defineProps` + `defineEmits` +
 * `defineSlots` + CSS variables. The SFC is the source of truth.
 */

import { computed } from 'vue'

defineOptions({ name: 'SnButton' })

const props = withDefaults(
  defineProps<{
    /** Button visual variant. Maps to `--sn-button-{variant}-bg`. */
    type?: 'primary' | 'default' | 'success' | 'warning' | 'danger' | 'info'
    /** Button size. Maps to `--sn-button-size-{size}-height`. */
    size?: 'tiny' | 'small' | 'medium' | 'large'
    /** Renders block-level (full width). */
    block?: boolean
    /** Pill-shaped (radius: 999px). */
    round?: boolean
    /** Disabled state — skips click event and aria-disabled. */
    disabled?: boolean
    /** Loading state — shows spinner and skips click event. */
    loading?: boolean
    /** Native button type attribute (button / submit / reset). */
    htmlType?: 'button' | 'submit' | 'reset'
    /** Whether the button has a border (for ghost / default types). */
    bordered?: boolean
    /** Native ARIA label override. */
    ariaLabel?: string
  }>(),
  {
    type: 'default',
    size: 'medium',
    block: false,
    round: false,
    disabled: false,
    loading: false,
    htmlType: 'button',
    bordered: true,
  },
)

const emit = defineEmits<{
  /** Native click. Skipped when disabled or loading. */
  (e: 'click', event: MouseEvent): void
}>()

defineSlots<{
  /** Default slot — button label. */
  default(): unknown
  /** Custom icon slot — renders before default content. */
  icon(): unknown
  /** Custom loading indicator slot — replaces default spinner. */
  loading(): unknown
}>()

const classList = computed(() => [
  'sn-button',
  `sn-button--${props.type}`,
  `sn-button--${props.size}`,
  {
    'sn-button--block': props.block,
    'sn-button--round': props.round,
    'sn-button--disabled': props.disabled,
    'sn-button--loading': props.loading,
    'sn-button--bordered': props.bordered,
    'sn-button--text': props.type === 'default' && !props.bordered,
  },
])

function onClick(event: MouseEvent): void {
  if (props.disabled || props.loading) {
    event.preventDefault()
    event.stopImmediatePropagation()
    return
  }
  emit('click', event)
}
</script>

<template>
  <button
    :class="classList"
    :type="htmlType"
    :disabled="disabled || loading"
    :aria-disabled="disabled || loading"
    :aria-busy="loading"
    role="button"
    :aria-label="ariaLabel"
    @click="onClick"
  >
    <span v-if="$slots.icon" class="sn-button__icon">
      <slot name="icon" />
    </span>
    <span v-else-if="loading" class="sn-button__spinner" aria-hidden="true">
      <slot name="loading">
        <svg viewBox="0 0 16 16" class="sn-button__spinner-svg">
          <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="14 28" />
        </svg>
      </slot>
    </span>
    <span class="sn-button__content">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.sn-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 0;
  padding: 0 14px;
  border: 1px solid transparent;
  border-radius: var(--sn-radius-button, 6px);
  font-family: inherit;
  font-size: var(--sn-button-font-size, 14px);
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.15s, border-color 0.15s, color 0.15s, opacity 0.15s;
  outline: none;
}

.sn-button:focus-visible {
  box-shadow: 0 0 0 3px var(--sn-color-focus-ring, rgba(22, 119, 255, 0.25));
}

.sn-button--block {
  display: flex;
  width: 100%;
}

.sn-button--round {
  border-radius: 999px;
}

.sn-button--disabled,
.sn-button--disabled:hover,
.sn-button--loading {
  cursor: not-allowed;
  opacity: 0.5;
}

/* Sizes */
.sn-button--tiny {
  height: var(--sn-button-size-tiny-height, 24px);
  padding: 0 8px;
  font-size: 12px;
}
.sn-button--small {
  height: var(--sn-button-size-small-height, 32px);
  padding: 0 10px;
  font-size: 13px;
}
.sn-button--medium {
  height: var(--sn-button-size-medium-height, 36px);
}
.sn-button--large {
  height: var(--sn-button-size-large-height, 44px);
  padding: 0 18px;
  font-size: 16px;
}

/* Variants */
.sn-button--primary {
  background-color: var(--sn-color-action-primary, #1677ff);
  color: var(--sn-color-text-on-primary, #fff);
  border-color: var(--sn-color-action-primary, #1677ff);
}
.sn-button--primary:hover:not(.sn-button--disabled):not(.sn-button--loading) {
  background-color: var(--sn-color-action-primary-hover, #4096ff);
}

.sn-button--success {
  background-color: var(--sn-color-feedback-success, #10b981);
  color: #fff;
  border-color: var(--sn-color-feedback-success, #10b981);
}
.sn-button--warning {
  background-color: var(--sn-color-feedback-warning, #f59e0b);
  color: #fff;
  border-color: var(--sn-color-feedback-warning, #f59e0b);
}
.sn-button--danger {
  background-color: var(--sn-color-feedback-danger, #ef4444);
  color: #fff;
  border-color: var(--sn-color-feedback-danger, #ef4444);
}
.sn-button--danger:hover:not(.sn-button--disabled):not(.sn-button--loading) {
  background-color: var(--sn-color-feedback-danger-hover, #f87171);
}
.sn-button--info {
  background-color: var(--sn-color-feedback-info, #6b7280);
  color: #fff;
  border-color: var(--sn-color-feedback-info, #6b7280);
}

.sn-button--default {
  background-color: var(--sn-color-background-surface, #fff);
  color: var(--sn-color-text-primary, #14171e);
  border-color: var(--sn-color-border-default, #d1d5db);
}
.sn-button--default:hover:not(.sn-button--disabled):not(.sn-button--loading) {
  border-color: var(--sn-color-action-primary, #1677ff);
  color: var(--sn-color-action-primary, #1677ff);
}

.sn-button--text {
  background-color: transparent;
  border-color: transparent;
}

/* Spinner */
.sn-button__spinner {
  display: inline-flex;
  align-items: center;
  animation: sn-button-spin 0.8s linear infinite;
}
.sn-button__spinner-svg {
  width: 14px;
  height: 14px;
}
@keyframes sn-button-spin {
  to { transform: rotate(360deg); }
}
</style>
