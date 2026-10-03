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
    /** Button visual variant. Maps to `--sn-web-button-{variant}-bg`. */
    type?: 'primary' | 'default' | 'success' | 'warning' | 'danger' | 'info'
    /** Button size. Maps to `--sn-web-button-size-{size}-height`. */
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
    data-snui-component="button"
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
  padding: 0 var(--sn-web-button-padding-x, 12px);
  border: 1px solid transparent;
  border-radius: var(--sn-web-button-radius);
  font-family: inherit;
  font-size: var(--sn-web-button-font-size, 14px);
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.15s, border-color 0.15s, color 0.15s, opacity 0.15s;
  outline: none;
}

.sn-button:focus-visible {
  box-shadow: 0 0 0 3px var(--sn-web-focus-ring);
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
  height: var(--sn-web-button-height-tiny);
  padding: 0 8px;
  font-size: 12px;
}
.sn-button--small {
  height: var(--sn-web-button-height-small);
  padding: 0 10px;
  font-size: 13px;
}
.sn-button--medium {
  height: var(--sn-web-button-height-medium);
}
.sn-button--large {
  height: var(--sn-web-button-height-large);
  padding: 0 18px;
  font-size: 16px;
}

/* Variants */
.sn-button--primary {
  background-color: var(--sn-web-color-action-primary);
  color: var(--sn-web-color-text-on-primary);
  border-color: var(--sn-web-color-action-primary);
}
.sn-button--primary:hover:not(.sn-button--disabled):not(.sn-button--loading) {
  background-color: var(--sn-web-color-action-primary-hover);
}

.sn-button--success {
  background-color: var(--sn-web-color-feedback-success);
  color: var(--sn-web-color-text-on-primary);
  border-color: var(--sn-web-color-feedback-success);
}
.sn-button--warning {
  background-color: var(--sn-web-color-feedback-warning);
  color: var(--sn-web-color-text-on-primary);
  border-color: var(--sn-web-color-feedback-warning);
}
.sn-button--danger {
  background-color: var(--sn-web-color-feedback-danger);
  color: var(--sn-web-color-text-on-primary);
  border-color: var(--sn-web-color-feedback-danger);
}
.sn-button--danger:hover:not(.sn-button--disabled):not(.sn-button--loading) {
  background-color: var(--sn-web-color-feedback-danger-hover);
}
.sn-button--info {
  background-color: var(--sn-web-color-feedback-info);
  color: var(--sn-web-color-text-on-primary);
  border-color: var(--sn-web-color-feedback-info);
}

.sn-button--default {
  background-color: var(--sn-web-color-background-surface);
  color: var(--sn-web-color-text-primary);
  border-color: var(--sn-web-color-border-default);
}
.sn-button--default:hover:not(.sn-button--disabled):not(.sn-button--loading) {
  border-color: var(--sn-web-color-action-primary);
  color: var(--sn-web-color-action-primary);
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
