<script setup lang="ts">
/**
 * SnSwitch — web-end switch component (naive-ui `n-switch` parity).
 *
 * Per AGENTS.md §30/31: name / version / props / events / slots / tokens /
 * accessibility / capabilities declared in `defineProps` + `defineEmits` +
 * `defineSlots` + CSS variables.
 *
 * The value model mirrors naive-ui: `checkedValue` (default `true`) and
 * `uncheckedValue` (default `false`) map arbitrary bound values onto the
 * on/off rail state, so `string` / `number` payloads work 1:1.
 */

import { computed, useSlots } from 'vue';

defineOptions({ name: 'SnSwitch' });

interface SwitchRailStyleContext {
  checked: boolean;
}

const props = withDefaults(
  defineProps<{
    /** Bound value compared against `checkedValue` / `uncheckedValue`. */
    modelValue?: boolean | string | number;
    /** Value emitted when the switch is on. Compared by strict equality. */
    checkedValue?: boolean | string | number;
    /** Value emitted when the switch is off. */
    uncheckedValue?: boolean | string | number;
    /** Visual size preset. Drives rail width / height / knob size. */
    size?: 'small' | 'medium' | 'large';
    /** Disables interaction + dims the rail. */
    disabled?: boolean;
    /** Read-only — renders normally but does not toggle. */
    readonly?: boolean;
    /** Shows a spinner in the knob and blocks interaction while pending. */
    loading?: boolean;
    /** Accessible name for the switch element. */
    ariaLabel?: string;
    /**
     * Custom rail style. Called with `{ checked }` on every render; the
     * returned style object is merged onto the rail element.
     */
    railStyle?: (info: SwitchRailStyleContext) => Record<string, string>;
    /** Class on the root wrapper. */
    customClass?: string;
  }>(),
  {
    modelValue: false,
    checkedValue: true,
    uncheckedValue: false,
    size: 'medium',
    disabled: false,
    readonly: false,
    loading: false,
    ariaLabel: '',
    customClass: '',
  },
);

const emit = defineEmits<{
  /** v-model sync. Payload is `checkedValue` / `uncheckedValue`. */
  (e: 'update:modelValue', value: boolean | string | number): void;
  /** Fired after a successful toggle. Payload is the new value. */
  (e: 'change', value: boolean | string | number): void;
}>();

const slots = useSlots();

defineSlots<{
  /** Content shown inside the rail when checked. */
  checked?(): unknown;
  /** Content shown inside the rail when unchecked. */
  unchecked?(): unknown;
  /** Replaces the default loading spinner inside the knob. */
  'loading-icon'?(): unknown;
}>();

/** Whether the current modelValue equals `checkedValue`. */
const isChecked = computed(() => props.modelValue === props.checkedValue);

/** Blocks toggling: disabled, readonly or pending load. */
const isBlocked = computed(() => props.disabled || props.readonly || props.loading);

function toggle(): void {
  if (isBlocked.value) return;
  const next = isChecked.value ? props.uncheckedValue : props.checkedValue;
  emit('update:modelValue', next);
  emit('change', next);
}

function onClick(): void {
  toggle();
}

function onKeydown(event: KeyboardEvent): void {
  // role="switch" activation keys per WAI-ARIA authoring practices.
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  toggle();
}

const classList = computed(() => [
  'sn-switch',
  `sn-switch--${props.size}`,
  {
    'sn-switch--checked': isChecked.value,
    'sn-switch--disabled': props.disabled,
    'sn-switch--readonly': props.readonly,
    'sn-switch--loading': props.loading,
  },
  props.customClass,
]);

const railStyleValue = computed(() =>
  props.railStyle ? props.railStyle({ checked: isChecked.value }) : undefined,
);
</script>

<template>
  <button
    type="button"
    :class="classList"
    role="switch"
    :aria-checked="isChecked"
    :aria-label="ariaLabel || undefined"
    :aria-disabled="disabled ? 'true' : undefined"
    :aria-readonly="readonly ? 'true' : undefined"
    :aria-busy="loading ? 'true' : undefined"
    :data-snui-component="'switch'"
    :data-size="size"
    @click="onClick"
    @keydown="onKeydown"
  >
    <span class="sn-switch__rail" :style="railStyleValue">
      <span
        v-if="!isChecked && (slots.unchecked || false)"
        class="sn-switch__label sn-switch__label--unchecked"
        ><slot name="unchecked"
      /></span>
      <span
        v-if="isChecked && (slots.checked || false)"
        class="sn-switch__label sn-switch__label--checked"
        ><slot name="checked"
      /></span>
    </span>
    <span class="sn-switch__knob">
      <span v-if="loading" class="sn-switch__loading" role="presentation"
        ><slot name="loading-icon"
      /></span>
    </span>
  </button>
</template>

<style scoped>
.sn-switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  box-sizing: border-box;
}

.sn-switch:focus-visible {
  outline: none;
}

.sn-switch__rail {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: var(--sn-web-switch-rail-width, 40px);
  height: var(--sn-web-switch-rail-height, 22px);
  border-radius: 999px;
  background-color: var(
    --sn-web-switch-bg,
    var(--sn-web-color-background-soft, rgba(0, 0, 0, 0.2))
  );
  transition: background-color 0.2s ease-in-out;
  box-sizing: border-box;
}

.sn-switch--checked .sn-switch__rail {
  background-color: var(--sn-web-switch-bg-checked, var(--sn-web-color-action-primary));
}

/* Sizes */
.sn-switch--small .sn-switch__rail {
  width: var(--sn-web-switch-rail-width-sm, 34px);
  height: var(--sn-web-switch-rail-height-sm, 18px);
}
.sn-switch--large .sn-switch__rail {
  width: var(--sn-web-switch-rail-width-lg, 52px);
  height: var(--sn-web-switch-rail-height-lg, 28px);
}

/* Knob */
.sn-switch__knob {
  position: absolute;
  top: 50%;
  left: 2px;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--sn-web-switch-knob-size, 18px);
  height: var(--sn-web-switch-knob-size, 18px);
  border-radius: 50%;
  background-color: var(--sn-web-switch-knob-bg, var(--sn-web-color-background-surface));
  box-shadow: var(--sn-web-switch-knob-shadow, 0 2px 4px rgba(0, 0, 0, 0.15));
  transition: left 0.2s ease-in-out;
}

.sn-switch--small .sn-switch__knob {
  width: var(--sn-web-switch-knob-size-sm, 14px);
  height: var(--sn-web-switch-knob-size-sm, 14px);
}
.sn-switch--large .sn-switch__knob {
  width: var(--sn-web-switch-knob-size-lg, 24px);
  height: var(--sn-web-switch-knob-size-lg, 24px);
}

/* Rail width minus knob + 2px inset on each side. */
.sn-switch--checked .sn-switch__knob {
  left: calc(100% - var(--sn-web-switch-knob-size, 18px) - 2px);
}
.sn-switch--small.sn-switch--checked .sn-switch__knob {
  left: calc(100% - var(--sn-web-switch-knob-size-sm, 14px) - 2px);
}
.sn-switch--large.sn-switch--checked .sn-switch__knob {
  left: calc(100% - var(--sn-web-switch-knob-size-lg, 24px) - 2px);
}

/* Labels */
.sn-switch__label {
  font-size: var(--sn-web-switch-label-font-size, 12px);
  color: var(--sn-web-switch-label-color, var(--sn-web-color-text-on-primary));
  line-height: 1;
}
.sn-switch__label--unchecked {
  margin-left: 6px;
}
.sn-switch__label--checked {
  margin-right: 6px;
}

/* Disabled / readonly / loading */
.sn-switch--disabled,
.sn-switch--readonly,
.sn-switch--loading {
  cursor: not-allowed;
}
.sn-switch--disabled {
  opacity: var(--sn-web-switch-disabled-opacity, 0.4);
}

/* Loading spinner — token-driven, no hex literals. */
.sn-switch__loading {
  display: inline-block;
  width: 60%;
  height: 60%;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: var(--sn-web-switch-loading-color, var(--sn-web-color-action-primary));
  border-right-color: var(--sn-web-switch-loading-color, var(--sn-web-color-action-primary));
  animation: sn-switch-spin 0.7s linear infinite;
}

@keyframes sn-switch-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Focus ring on the rail, mirroring the design-system focus halo. */
.sn-switch:focus-visible .sn-switch__rail {
  box-shadow: 0 0 0 3px var(--sn-web-focus-ring, rgba(22, 119, 255, 0.15));
}
</style>
