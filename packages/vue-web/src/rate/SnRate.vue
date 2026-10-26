<script setup lang="ts">
/**
 * SnRate — web-end rating component (n-rate 1:1 parity).
 *
 * Per AGENTS.md §30/31: props / events / slots / tokens / accessibility
 * declared via defineProps + defineEmits + defineSlots + CSS variables.
 * Emoji-as-icon is forbidden (§113) — every star is an inline SVG path.
 */

import { computed } from 'vue'

defineOptions({ name: 'SnRate' })

const props = withDefaults(
  defineProps<{
    /** Bound rating value. 0 (or null) = unrated. */
    modelValue?: number | null
    /** Number of stars rendered. */
    count?: number
    /** Allow half-star precision (0.5 steps). */
    allowHalf?: boolean
    /** Read-only — visible but not interactive. */
    readonly?: boolean
    /** Disabled — greyed out, not interactive. */
    disabled?: boolean
    /** Visual size preset. Drives star glyph size. */
    size?: 'small' | 'medium' | 'large'
    /**
     * Filled-star color. Accepts any CSS color (token variable like
     * `var(--sn-web-color-feedback-warning)` is recommended); applied via
     * the `--sn-rate-color` CSS variable so it stays themeable.
     */
    color?: string
    /** Clicking the same rating again resets the value to 0. */
    clearable?: boolean
    /** Accessible label for the radiogroup. */
    ariaLabel?: string
  }>(),
  {
    modelValue: null,
    count: 5,
    allowHalf: false,
    readonly: false,
    disabled: false,
    size: 'medium',
    color: '',
    clearable: false,
    ariaLabel: '',
  },
)

const emit = defineEmits<{
  /** v-model sync. */
  (e: 'update:modelValue', value: number): void
  /** Fired on every committed rating change (click / keyboard). */
  (e: 'change', value: number): void
}>()

defineSlots<{
  /** Custom per-star content. Replaces the built-in SVG star. */
  icon?(props: { index: number; filled: boolean }): unknown
}>()

const currentValue = computed(() => props.modelValue ?? 0)

const isInteractive = computed(() => !props.disabled && !props.readonly)

/** Inline style exposing the `color` prop as a themeable CSS variable. */
const colorStyle = computed(() =>
  props.color ? { '--sn-rate-color': props.color } : undefined,
)

const starIndices = computed(() =>
  Array.from({ length: props.count }, (_, i) => i + 1),
)

/** Fill ratio (0..1) of the star at `index` (1-based). */
function fillOf(index: number): number {
  return Math.min(Math.max(currentValue.value - (index - 1), 0), 1)
}

function isItemChecked(index: number): boolean {
  // The "checked" radio is the star the value points at.
  return currentValue.value > 0 && Math.ceil(currentValue.value) === index
}

/** Tabindex: exactly one stop inside the radiogroup (active star, else first). */
function itemTabindex(index: number): number {
  if (!isInteractive.value) return -1
  const active = currentValue.value > 0 ? Math.ceil(currentValue.value) : 1
  return index === active ? 0 : -1
}

function commit(next: number): void {
  if (!isInteractive.value) return
  // n-rate parity: a no-op change (clamped boundary, repeat click
  // without clearable) emits nothing rather than re-emitting the value.
  if (next === currentValue.value) return
  emit('update:modelValue', next)
  emit('change', next)
}

/**
 * Clicking the same value again with `clearable` resets to 0 —
 * the n-rate "click again to clear" behavior.
 */
function select(next: number): void {
  if (props.clearable && next === currentValue.value) {
    commit(0)
    return
  }
  commit(next)
}

function onHalfClick(index: number, half: 'left' | 'right'): void {
  select(half === 'left' ? index - 0.5 : index)
}

function onKeydown(event: KeyboardEvent): void {
  const step = props.allowHalf ? 0.5 : 1
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    commit(Math.max(currentValue.value - step, 0))
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    commit(Math.min(currentValue.value + step, props.count))
  }
}

const classList = computed(() => [
  'sn-rate',
  `sn-rate--${props.size}`,
  {
    'sn-rate--disabled': props.disabled,
    'sn-rate--readonly': props.readonly,
    'sn-rate--half': props.allowHalf,
  },
])
</script>

<template>
  <div
    :class="classList"
    :style="colorStyle"
    role="radiogroup"
    :aria-label="ariaLabel || 'Rating'"
    :aria-disabled="disabled ? 'true' : undefined"
    :aria-readonly="readonly ? 'true' : undefined"
    data-snui-component="rate"
  >
    <div
      v-for="index in starIndices"
      :key="index"
      class="sn-rate__item"
      role="radio"
      :aria-checked="isItemChecked(index) ? 'true' : 'false'"
      :tabindex="itemTabindex(index)"
      :aria-label="`${index} star${index > 1 ? 's' : ''}`"
      @keydown="onKeydown"
    >
      <!-- allowHalf: two hit zones per star keep half selection
           deterministic (no offset math, works on all pointer types). -->
      <template v-if="allowHalf">
        <span
          class="sn-rate__half sn-rate__half--left"
          :aria-hidden="true"
          @click="onHalfClick(index, 'left')"
        >
          <slot name="icon" :index="index" :filled="fillOf(index) === 1">
            <svg
              class="sn-rate__star sn-rate__star--base"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.58L12 17.77l-5.9 3.1 1.13-6.58L2.45 9.44l6.6-.96L12 2.5z"
              />
            </svg>
          </slot>
        </span>
        <span
          class="sn-rate__half sn-rate__half--right"
          :aria-hidden="true"
          @click="onHalfClick(index, 'right')"
        >
          <svg class="sn-rate__star sn-rate__star--base" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.58L12 17.77l-5.9 3.1 1.13-6.58L2.45 9.44l6.6-.96L12 2.5z"
            />
          </svg>
        </span>
      </template>
      <span v-else class="sn-rate__full" :aria-hidden="true" @click="select(index)">
        <slot name="icon" :index="index" :filled="fillOf(index) === 1">
          <svg class="sn-rate__star sn-rate__star--base" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.58L12 17.77l-5.9 3.1 1.13-6.58L2.45 9.44l6.6-.96L12 2.5z"
            />
          </svg>
        </slot>
      </span>
      <!-- filled overlay clipped to the value -->
      <span class="sn-rate__fill" :style="{ width: `${fillOf(index) * 100}%` }" :aria-hidden="true">
        <svg class="sn-rate__star sn-rate__star--filled" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.58L12 17.77l-5.9 3.1 1.13-6.58L2.45 9.44l6.6-.96L12 2.5z"
          />
        </svg>
      </span>
    </div>
  </div>
</template>

<style scoped>
.sn-rate {
  display: inline-flex;
  align-items: center;
  gap: var(--sn-web-rate-gap, 4px);
  line-height: 1;
}

.sn-rate__item {
  position: relative;
  display: inline-flex;
  width: var(--sn-web-rate-star-size, 18px);
  height: var(--sn-web-rate-star-size, 18px);
  cursor: pointer;
}

.sn-rate__half {
  display: inline-flex;
  width: 50%;
  height: 100%;
  overflow: hidden;
}

/* The right hit zone must reveal the star's RIGHT half: shift the
   fixed-size star left by one zone width (100% of the 50%-wide zone). */
.sn-rate__half--right .sn-rate__star {
  margin-left: -100%;
}

.sn-rate__full {
  display: inline-flex;
  width: 100%;
  height: 100%;
}

.sn-rate__star {
  width: var(--sn-web-rate-star-size, 18px);
  height: var(--sn-web-rate-star-size, 18px);
  display: block;
  /* Hit zones are inline-flex: without flex:none the SVG flex-shrinks to the
     50%-wide zone (squashed star, misaligned with the fill overlay). */
  flex: none;
}

/* Unfilled star: outline via token border color. */
.sn-rate__star--base path {
  fill: none;
  stroke: var(--sn-web-rate-inactive, var(--sn-web-color-border-default));
  stroke-width: 1.5;
}

.sn-rate__fill {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

/* Filled star: token-driven fill, overridable by the `color` prop. */
.sn-rate__star--filled path {
  fill: var(--sn-rate-color, var(--sn-web-rate-color, var(--sn-web-color-action-primary)));
  stroke: var(--sn-rate-color, var(--sn-web-rate-color, var(--sn-web-color-action-primary)));
  stroke-width: 1.5;
}

/* Sizes */
.sn-rate--small { --sn-web-rate-star-size: var(--sn-web-rate-size-small, 14px); }
.sn-rate--medium { --sn-web-rate-star-size: var(--sn-web-rate-size-medium, 18px); }
.sn-rate--large { --sn-web-rate-star-size: var(--sn-web-rate-size-large, 22px); }

/* Keyboard focus ring on the radio item (custom, token-based). */
.sn-rate__item:focus-visible {
  outline: 2px solid var(--sn-web-focus-ring, var(--sn-web-color-action-primary));
  outline-offset: 1px;
  border-radius: 2px;
}

.sn-rate--disabled .sn-rate__item,
.sn-rate--readonly .sn-rate__item {
  cursor: not-allowed;
}

.sn-rate--disabled {
  opacity: var(--sn-web-rate-disabled-opacity, 0.4);
}
</style>
