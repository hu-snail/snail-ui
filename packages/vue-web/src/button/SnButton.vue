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

import { computed, markRaw } from 'vue'
import SnIcon from '../icon/SnIcon.vue'
import type { IconComponent } from '../icon/sn-icon-registry'
import { resolveIconByName } from '../icon/sn-icon-registry'

defineOptions({ name: 'SnButton' })

const props = withDefaults(
  defineProps<{
    /* ── naive-ui `n-button` 1:1 surface ───────────────────────────────── */

    /** Button visual type. Mirrors n-button.type. */
    type?: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error' | 'tertiary'
    /** Pill-shaped (radius: 999px). */
    round?: boolean
    /** Fully circular — equal padding on all sides. */
    circle?: boolean
    /** Renders block-level (full width). */
    block?: boolean
    /** Plain-text style — transparent background, no border. */
    text?: boolean
    /** Dashed border style for placeholder / disabled-state visuals. */
    dashed?: boolean
    /** Ghost style — transparent background, colored border. */
    ghost?: boolean
    /** Reverse the colored hover state. */
    secondary?: boolean
    /** Lower-emphasis text variant of `text`. */
    tertiary?: boolean
    /** Even lower-emphasis text variant. */
    quaternary?: boolean
    /** Stronger emphasis on filled variants. */
    strong?: boolean
    /** Custom button color (any valid CSS). Overrides `type` color. */
    color?: string
    /** Button size. Drives height + font-size. */
    size?: 'tiny' | 'small' | 'medium' | 'large' | 'huge'
    /** Disabled state — skips click event and aria-disabled. */
    disabled?: boolean
    /** Loading state — shows spinner and skips click event. */
    loading?: boolean
    /** Native button type attribute (button / submit / reset). */
    attrType?: 'button' | 'submit' | 'reset' | undefined
    /**
     * HTML tag rendered as the root. Allows rendering as `<a>` or
     * arbitrary element for navigation. Defaults to `<button>`.
     */
    tag?: 'button' | 'a' | 'div' | 'span'
    /** Native ARIA label override. */
    ariaLabel?: string
    /** Tabindex override (default 0; -1 to remove from tab order). */
    focusable?: boolean
    /**
     * Icon component to render before the default slot. Bundlers walk the
     * named import statically and tree-shake unused icons.
     */
    icon?: IconComponent
    /**
     * Icon name resolved via the SnIcon registry (populated by
     * `registerSnIcons()` at app bootstrap). Convenience prop so the
     * common case does not require wrapping `<SnIcon>` in a slot.
     */
    iconName?: string
    /** Icon placement: 'left' (default) or 'right' of the slot. */
    iconPlacement?: 'left' | 'right'
    /** Pixel / CSS size forwarded to the embedded SnIcon. Default 14. */
    iconSize?: number | string
    /**
     * Whether to show the icon at all. `false` hides icon even if
     * `icon` or `iconName` is set. Defaults to `true`.
     */
    showIcon?: boolean

    /* ── legacy / deprecated aliases (kept for back-compat) ─────────────── */

    /** @deprecated Use `attrType` instead. Kept as undefined-default so
     * `attrType` wins when both are set. */
    htmlType?: 'button' | 'submit' | 'reset' | undefined
    /** @deprecated Renamed; mirrors the legacy boolean border flag. */
    bordered?: boolean
  }>(),
  {
    type: 'default',
    size: 'medium',
    block: false,
    round: false,
    circle: false,
    text: false,
    dashed: false,
    ghost: false,
    secondary: false,
    tertiary: false,
    quaternary: false,
    strong: false,
    disabled: false,
    loading: false,
    /* attrType intentionally defaults to undefined so the legacy
     * htmlType alias can still drive the native type when only it is set. */
    attrType: undefined,
    tag: 'button',
    focusable: true,
    iconSize: 14,
    iconPlacement: 'left',
    showIcon: true,
    /* deprecated aliases — undefined defaults so they don't shadow attrType. */
    htmlType: undefined,
    bordered: true,
  },
)

/**
 * Resolved icon component: prefer explicit `icon`, fall back to
 * registry lookup by `iconName`. Returns `null` when neither resolves
 * (template renders the default spinner / nothing instead).
 *
 * `markRaw` keeps the component out of Vue's reactivity proxy — passing
 * a component through `props` would otherwise warn ("Component that
 * was made a reactive object") every render.
 */
const resolvedIcon = computed<IconComponent | null>(() => {
  const icon = props.icon ?? (props.iconName ? resolveIconByName(props.iconName) : null)
  return icon ? markRaw(icon) : null
})

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

/** Resolved native button type attribute (prefer attrType, fall back to legacy htmlType). */
const resolvedAttrType = computed(() => props.attrType || props.htmlType || 'button')

/** Whether the rendered root has an icon visible. */
const showIconSlot = computed(() => props.showIcon && !props.loading)

/** Inherit color via inline style — naive-ui parity. */
const colorStyle = computed(() => props.color ? `--sn-button-color: ${props.color}` : undefined)

const classList = computed(() => [
  'sn-button',
  `sn-button--${props.type}`,
  `sn-button--${props.size}`,
  {
    'sn-button--block': props.block,
    'sn-button--round': props.round,
    'sn-button--circle': props.circle,
    'sn-button--text': props.text,
    'sn-button--dashed': props.dashed,
    'sn-button--ghost': props.ghost,
    'sn-button--secondary': props.secondary,
    'sn-button--tertiary': props.tertiary,
    'sn-button--quaternary': props.quaternary,
    'sn-button--strong': props.strong,
    'sn-button--disabled': props.disabled,
    'sn-button--loading': props.loading,
    'sn-button--icon-right': props.iconPlacement === 'right',
    'sn-button--bordered': props.bordered,
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
  <component
    :is="tag === 'button' ? 'button' : tag"
    data-snui-component="button"
    :class="classList"
    :style="colorStyle"
    :type="tag === 'button' ? resolvedAttrType : undefined"
    :disabled="(tag === 'button' && (disabled || loading)) || undefined"
    :aria-disabled="disabled || loading || undefined"
    :aria-busy="loading || undefined"
    :tabindex="!focusable && !(disabled || loading) ? -1 : undefined"
    :aria-label="ariaLabel"
    role="button"
    @click="onClick"
  >
    <span v-if="showIconSlot && $slots.icon" class="sn-button__icon">
      <slot name="icon" />
    </span>
    <SnIcon
      v-else-if="showIconSlot && resolvedIcon"
      class="sn-button__icon"
      :icon="resolvedIcon"
      :size="iconSize ?? 14"
    />
    <span v-if="loading" class="sn-button__spinner" aria-hidden="true">
      <slot name="loading">
        <svg viewBox="0 0 16 16" class="sn-button__spinner-svg">
          <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="14 28" />
        </svg>
      </slot>
    </span>
    <span v-if="$slots.default" class="sn-button__content">
      <slot />
    </span>
  </component>
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
.sn-button--huge {
  height: var(--sn-web-button-height-huge, 48px);
  padding: 0 22px;
  font-size: 18px;
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
/* When the `color` prop is set, override default-type chrome to the
 * chosen color: bg → soft tint, border + text → saturated tone. */
.sn-button--default[style*="--sn-button-color"] {
  background-color: color-mix(in srgb, var(--sn-button-color) 12%, var(--sn-web-color-background-surface));
  border-color: var(--sn-button-color);
  color: var(--sn-button-color);
}
.sn-button--default:hover:not(.sn-button--disabled):not(.sn-button--loading) {
  border-color: var(--sn-web-color-action-primary);
  color: var(--sn-web-color-action-primary);
}
.sn-button--default[style*="--sn-button-color"]:hover:not(.sn-button--disabled):not(.sn-button--loading) {
  border-color: var(--sn-button-color);
  color: var(--sn-button-color);
  background-color: color-mix(in srgb, var(--sn-button-color) 22%, var(--sn-web-color-background-surface));
}

/* Tertiary variant — naive-ui n-button tertiary. Soft bg tint +
 * saturated text/border. When `color` prop is set, derives a tint by
 * mixing 14% of the chosen color onto the surface. */
.sn-button--tertiary {
  background-color: color-mix(in srgb, var(--sn-button-color, var(--sn-web-color-action-primary)) 14%, transparent);
  color: var(--sn-button-color, var(--sn-web-color-action-primary));
  border-color: transparent;
}
.sn-button--tertiary:hover:not(.sn-button--disabled):not(.sn-button--loading) {
  background-color: color-mix(in srgb, var(--sn-button-color, var(--sn-web-color-action-primary)) 22%, transparent);
}

/* Text variant — plain text, transparent. */
.sn-button--text {
  background-color: transparent;
  border-color: transparent;
  color: var(--sn-button-color, var(--sn-web-color-text-primary));
}
.sn-button--text:hover:not(.sn-button--disabled):not(.sn-button--loading) {
  background-color: var(--sn-web-color-background-soft, rgba(0, 0, 0, 0.04));
}

/* Dashed border. */
.sn-button--dashed {
  border-style: dashed;
}

/* Ghost — transparent background, colored border. */
.sn-button--ghost {
  background-color: transparent;
}
.sn-button--ghost.sn-button--primary {
  color: var(--sn-web-color-action-primary);
  border-color: var(--sn-web-color-action-primary);
}
.sn-button--ghost.sn-button--error {
  color: var(--sn-web-color-feedback-danger);
  border-color: var(--sn-web-color-feedback-danger);
}
/* Ghost + color prop: pick up --sn-button-color for both border + text. */
.sn-button--ghost[style*="--sn-button-color"] {
  color: var(--sn-button-color);
  border-color: var(--sn-button-color);
}
.sn-button--ghost[style*="--sn-button-color"]:hover:not(.sn-button--disabled):not(.sn-button--loading) {
  background-color: color-mix(in srgb, var(--sn-button-color) 12%, transparent);
}

/* Circle — equal padding, 1:1 aspect ratio. Display: grid +
 * place-items: center is more robust than inline-flex for icon-only
 * circle centering (single child, both axes simultaneously). */
.sn-button--circle {
  border-radius: 50%;
  padding: 0;
  width: var(--sn-web-button-height-medium, 32px);
  height: var(--sn-web-button-height-medium, 32px);
  min-width: var(--sn-web-button-height-medium, 32px);
  min-height: var(--sn-web-button-height-medium, 32px);
  display: inline-grid;
  place-items: center;
  gap: 0;
  line-height: 0;
}
.sn-button--circle.sn-button--tiny {
  width: var(--sn-web-button-height-tiny, 24px);
  height: var(--sn-web-button-height-tiny, 24px);
  min-width: var(--sn-web-button-height-tiny, 24px);
  min-height: var(--sn-web-button-height-tiny, 24px);
}
.sn-button--circle.sn-button--small {
  width: var(--sn-web-button-height-small, 28px);
  height: var(--sn-web-button-height-small, 28px);
  min-width: var(--sn-web-button-height-small, 28px);
  min-height: var(--sn-web-button-height-small, 28px);
}
.sn-button--circle.sn-button--large {
  width: var(--sn-web-button-height-large, 40px);
  height: var(--sn-web-button-height-large, 40px);
  min-width: var(--sn-web-button-height-large, 40px);
  min-height: var(--sn-web-button-height-large, 40px);
}
.sn-button--circle.sn-button--huge {
  width: var(--sn-web-button-height-huge, 48px);
  height: var(--sn-web-button-height-huge, 48px);
  min-width: var(--sn-web-button-height-huge, 48px);
  min-height: var(--sn-web-button-height-huge, 48px);
}

/* Defensive: the icon wrapper is a flex item inside `.sn-button`; lock
 * its own axis centering so lucide's inline SVG (rendered with
 * `display: inline` by default — leaves a tiny baseline gap that nudges
 * the icon off-center inside a square button) sits dead-center. */
.sn-button__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  line-height: 1;
}
.sn-button__icon :deep(svg) {
  display: block;
}

/* Strong — heavier emphasis on filled variants. */
.sn-button--strong.sn-button--primary {
  box-shadow: 0 0 8px var(--sn-web-color-action-primary-soft, rgba(22, 119, 255, 0.4));
}

/* Icon placement — render content + icon in row-reverse for right. */
.sn-button--icon-right { flex-direction: row-reverse; }

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
