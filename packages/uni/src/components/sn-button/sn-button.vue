<script setup lang="ts">
/**
 * SnButton (uni-end) — primary button for uni-app.
 *
 * API design reference: wot-ui (mobile-first, easycom-registered).
 * File path follows the uni-app easycom convention:
 *   components/sn-button/sn-button.vue
 * → auto-registered as `<sn-button>` in any .vue that uses it.
 *
 * Per AGENTS.md §32, this component handles rendering + interaction + DOM
 * bridge only. No schema validation; no business logic.
 */

import { computed } from 'vue'

defineOptions({ name: 'SnButton' })

const props = withDefaults(
  defineProps<{
    /** Visual variant. Drives background / border / text color. */
    type?: 'primary' | 'default' | 'success' | 'warning' | 'danger'
    /** Size preset. */
    size?: 'small' | 'medium' | 'large'
    /** Block (full-width) layout — common on mobile. */
    block?: boolean
    /** Pill shape. */
    round?: boolean
    /** Disabled. Skips click. */
    disabled?: boolean
    /** Loading. Shows spinner. Skips click. */
    loading?: boolean
    /** Show hairline border (default type only). */
    hairline?: boolean
    /** Tap feedback (active state opacity). */
    feedback?: boolean
  }>(),
  {
    type: 'default',
    size: 'medium',
    block: false,
    round: false,
    disabled: false,
    loading: false,
    hairline: true,
    feedback: true,
  },
)

const emit = defineEmits<{
  (e: 'click', event: Event): void
}>()

defineSlots<{
  default(): unknown
  icon(): unknown
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
    'sn-button--hairline': props.hairline && props.type === 'default',
    'sn-button--feedback': props.feedback,
  },
])

function onTap(event: Event): void {
  if (props.disabled || props.loading) {
    event.preventDefault()
    event.stopImmediatePropagation()
    return
  }
  emit('click', event)
}
</script>

<template>
  <view :class="classList" :aria-disabled="disabled || loading" :aria-busy="loading" @tap="onTap">
    <slot name="icon">
      <view v-if="loading" class="sn-button__spinner" aria-hidden="true">
        <slot name="loading">
          <view class="sn-button__spinner-dot" />
        </slot>
      </view>
    </slot>
    <slot />
  </view>
</template>

<style scoped>
.sn-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 0 28rpx;
  border: 2rpx solid transparent;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  transition: opacity 0.15s, background-color 0.15s, border-color 0.15s, color 0.15s;
  /* uni-app uses rpx for cross-device sizing */
  box-sizing: border-box;
}

.sn-button--block {
  display: flex;
  width: 100%;
}

.sn-button--round {
  border-radius: 999rpx;
}

.sn-button--disabled,
.sn-button--loading {
  cursor: not-allowed;
  opacity: 0.5;
}

.sn-button--feedback:active:not(.sn-button--disabled):not(.sn-button--loading) {
  opacity: 0.7;
}

/* Sizes */
.sn-button--small {
  height: 56rpx;
  padding: 0 20rpx;
  font-size: 24rpx;
}
.sn-button--medium {
  height: 72rpx;
}
.sn-button--large {
  height: 88rpx;
  padding: 0 36rpx;
  font-size: 32rpx;
}

/* Variants */
.sn-button--primary {
  background-color: var(--sn-color-action-primary, #1677ff);
  color: #fff;
  border-color: var(--sn-color-action-primary, #1677ff);
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

.sn-button--default {
  background-color: var(--sn-color-background-surface, #ffffff);
  color: var(--sn-color-text-primary, #14171e);
}
.sn-button--default.sn-button--hairline {
  border-color: var(--sn-color-border-default, #d1d5db);
}

/* Spinner */
.sn-button__spinner {
  display: inline-flex;
  align-items: center;
  animation: sn-button-spin 0.8s linear infinite;
}
.sn-button__spinner-dot {
  width: 16rpx;
  height: 16rpx;
  border: 4rpx solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
}
@keyframes sn-button-spin {
  to { transform: rotate(360deg); }
}
</style>
