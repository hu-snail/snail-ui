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

import { computed, markRaw } from 'vue'
import SnIcon from '../sn-icon/sn-icon.vue'
import type { IconData } from '../sn-icon/sn-icon.vue'
import { resolveIconByName } from '../sn-icon/sn-icon-registry'

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
    /**
     * Icon data (frozen `{ viewBox, paths }` object) to render before the
     * default slot. Bundlers walk the named import statically and tree-
     * shake unused icons.
     */
    iconData?: IconData
    /**
     * Icon name resolved via the sn-icon registry (populated by
     * `registerSnIcons()` at app bootstrap). Convenience prop so the
     * common case does not require wrapping `<sn-icon>` in a slot.
     */
    iconName?: string
    /** rpx / pixel size forwarded to the embedded sn-icon. Default 32. */
    iconSize?: number | string
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
    iconSize: 32,
  },
)

/**
 * Resolved icon data: prefer explicit `iconData`, fall back to registry
 * lookup by `iconName`. Returns `null` when neither resolves (template
 * renders the default spinner / nothing instead).
 */
const resolvedIconData = computed<IconData | null>(() => {
  const icon = props.iconData ?? (props.iconName ? resolveIconByName(props.iconName) : null)
  return icon ? markRaw(icon) : null
})

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
  <view
    data-snui-component="button"
    :class="classList"
    :aria-disabled="disabled || loading"
    :aria-busy="loading"
    @tap="onTap"
  >
    <slot name="icon">
      <SnIcon v-if="resolvedIconData" :icon="resolvedIconData" :size="iconSize ?? 32" />
      <view v-else-if="loading" class="sn-button__spinner" aria-hidden="true">
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
  /* uni-app uses rpx for cross-device sizing; rpx is a typography/geometry unit,
     not a color, so hardcoded rpx values are allowed per Spec-01 §3.1. */
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

/* Variants — color tokens only; geometry stays as rpx values above. */
.sn-button--primary {
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
  border-color: var(--sn-mp-color-action-primary);
}
.sn-button--success {
  background-color: var(--sn-mp-color-feedback-success);
  color: var(--sn-mp-color-text-on-primary);
  border-color: var(--sn-mp-color-feedback-success);
}
.sn-button--warning {
  background-color: var(--sn-mp-color-feedback-warning);
  color: var(--sn-mp-color-text-on-primary);
  border-color: var(--sn-mp-color-feedback-warning);
}
.sn-button--danger {
  background-color: var(--sn-mp-color-feedback-danger);
  color: var(--sn-mp-color-text-on-primary);
  border-color: var(--sn-mp-color-feedback-danger);
}

.sn-button--default {
  background-color: var(--sn-mp-color-background-surface);
  color: var(--sn-mp-color-text-primary);
}
.sn-button--default.sn-button--hairline {
  border-color: var(--sn-mp-color-border-default);
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
