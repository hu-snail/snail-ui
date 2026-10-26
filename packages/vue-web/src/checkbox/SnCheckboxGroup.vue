<script setup lang="ts">
/**
 * SnCheckboxGroup — web-end checkbox group component.
 *
 * Reference library: naive-ui `n-checkbox-group`
 *   (https://www.naiveui.com/zh-CN/light/components/checkbox)
 * Props + semantics mirror n-checkbox-group 1:1 (naive has no `max` —
 * intentionally omitted).
 *
 * Children (`SnCheckbox`) read the selection through provide/inject
 * (see `sn-checkbox-types.ts`); the group owns the array v-model.
 *
 * Per AGENTS.md §30/31: props / events / slots / tokens / accessibility
 * declared below; CSS uses `--sn-web-*` token aliases only.
 */

import { computed, provide, toRef } from 'vue'
import SnCheckbox from './SnCheckbox.vue'
import {
  SN_CHECKBOX_GROUP_KEY,
  type SnCheckboxGroupOption,
  type SnCheckboxValue,
} from './sn-checkbox-types'

defineOptions({ name: 'SnCheckboxGroup' })

const props = withDefaults(
  defineProps<{
    /** Selected values (`v-model:value` in naive; here `v-model`). */
    modelValue?: SnCheckboxValue[]
    /** Uncontrolled initial selection. Mirrors n-checkbox-group `default-value`. */
    defaultValue?: SnCheckboxValue[]
    /** Option list — renders checkboxes when provided. Mirrors `options`. */
    options?: SnCheckboxGroupOption[]
    /** Disables every child checkbox. Mirrors n-checkbox-group `disabled`. */
    disabled?: boolean
    /** Size preset applied to every child. Mirrors n-checkbox-group `size`. */
    size?: 'mini' | 'tiny' | 'small' | 'medium' | 'large'
    /** Class on the root wrapper. */
    customClass?: string
    /** Inline style on the root wrapper. */
    customStyle?: string | Record<string, string>
  }>(),
  {
    defaultValue: () => [],
    options: () => [],
    disabled: false,
    size: 'medium',
    customClass: '',
    customStyle: '',
  },
)

const emit = defineEmits<{
  /** v-model sync. */
  (e: 'update:modelValue', value: SnCheckboxValue[]): void
  /** Selection changed — naive-ui's `onUpdate:value` payload. */
  (e: 'update:value', value: SnCheckboxValue[]): void
}>()

defineSlots<{
  /** Default slot children (SnCheckbox instances). Ignored when `options` is non-empty. */
  default?(): unknown
}>()

/** Effective selection: the prop wins when provided (controlled). */
const selectedValues = computed<SnCheckboxValue[]>(() =>
  props.modelValue ?? props.defaultValue,
)

/** Group change dispatcher — emits both spellings. */
function toggleValue(value: SnCheckboxValue, nextChecked: boolean): void {
  const current = selectedValues.value
  let next: SnCheckboxValue[]
  if (nextChecked) {
    if (current.includes(value)) {
      return
    }
    next = [...current, value]
  } else {
    if (!current.includes(value)) {
      return
    }
    next = current.filter(v => v !== value)
  }
  emit('update:modelValue', next)
  emit('update:value', next)
}

provide(SN_CHECKBOX_GROUP_KEY, {
  selectedValues,
  groupDisabled: toRef(props, 'disabled'),
  groupSize: toRef(props, 'size'),
  toggleValue,
  isInsideGroup: true,
})

const hasOptions = computed(() => props.options.length > 0)

const classList = computed(() => [
  'sn-checkbox-group',
  {
    'sn-checkbox-group--disabled': props.disabled,
    'sn-checkbox-group--has-options': hasOptions.value,
  },
  props.customClass,
])

const wrapperStyle = computed(() => {
  if (typeof props.customStyle === 'string') return props.customStyle
  return Object.entries(props.customStyle ?? {}).map(([k, v]) => `${k}:${v}`).join(';')
})
</script>

<template>
  <div
    :class="classList"
    :style="wrapperStyle || undefined"
    :data-snui-component="'checkbox-group'"
    :data-size="size"
    role="group"
  >
    <template v-if="hasOptions">
      <SnCheckbox
        v-for="option in options"
        :key="String(option.value)"
        :value="option.value"
        :label="option.label ?? ''"
        :disabled="option.disabled ?? false"
      />
    </template>
    <slot v-else />
  </div>
</template>

<style scoped>
.sn-checkbox-group {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--sn-web-checkbox-group-gap, 16px);
  font-family: inherit;
  color: var(--sn-web-checkbox-text-color, var(--sn-web-color-text-primary));
}

.sn-checkbox-group--has-options {
  flex-wrap: wrap;
}
</style>
