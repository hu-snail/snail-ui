<script setup lang="ts">
/**
 * SnRadioGroup — web-end radio group (AUI-WEB-RADIO-001).
 *
 * Naive-ui `n-radio-group` 1:1 surface: owns the shared `modelValue`,
 * `name`, `size`, `status`, `disabled`, renders children from `options`
 * or the default slot, and provides the injection context that SnRadio /
 * SnRadioButton consume.
 */
import { computed, provide, useSlots } from 'vue';
import SnRadio from './SnRadio.vue';
import SnRadioButton from './SnRadioButton.vue';
import {
  snRadioGroupInjectionKey,
  type SnRadioOption,
  type SnRadioSize,
  type SnRadioStatus,
  type SnRadioValue,
} from './sn-radio-types';

defineOptions({ name: 'SnRadioGroup' });

const props = withDefaults(
  defineProps<{
    /** The bound value — the child whose `checkedValue` matches is checked. */
    modelValue?: SnRadioValue | null;
    /** Options to render radios declaratively. Default slot wins when set. */
    options?: SnRadioOption[] | Array<SnRadioValue>;
    /** Shared native radio `name` (drives arrow-key navigation). */
    name?: string | undefined;
    /** Disables all child radios. */
    disabled?: boolean;
    /** Group size applied to every child (unless overridden per child). */
    size?: SnRadioSize;
    /** Group status applied to every child (unless overridden per child). */
    status?: SnRadioStatus;
    /** Render children as buttons (naive `button`-styled group children). */
    button?: boolean;
    /** Class on the root wrapper. */
    customClass?: string;
    /** Inline style on the root wrapper. */
    customStyle?: string | Record<string, string>;
  }>(),
  {
    modelValue: null,
    options: () => [],
    disabled: false,
    size: 'medium',
    status: 'default',
    button: false,
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  /** v-model sync. */
  (e: 'update:modelValue', value: SnRadioValue): void;
  /** Fires when a child radio is activated. */
  (e: 'change', value: SnRadioValue, event?: Event): void;
}>();

defineSlots<{
  /** Custom children (SnRadio / SnRadioButton). Wins over `options`. */
  default?(): unknown;
}>();

const slots = useSlots();

const modelValueRef = computed(() => props.modelValue);
const nameRef = computed(() => props.name);
const sizeRef = computed(() => props.size);
const statusRef = computed(() => props.status);
const disabledRef = computed(() => props.disabled);

provide(snRadioGroupInjectionKey, {
  modelValue: modelValueRef,
  name: nameRef,
  size: sizeRef,
  status: statusRef,
  disabled: disabledRef,
  onChange(value: SnRadioValue) {
    emit('update:modelValue', value);
    emit('change', value);
  },
});

/** Normalized option list — plain values are coerced to { label, value }. */
const normalizedOptions = computed<SnRadioOption[]>(() =>
  (props.options as Array<SnRadioOption | SnRadioValue>).map((option) => {
    if (typeof option === 'string' || typeof option === 'number' || typeof option === 'boolean') {
      return { label: String(option), value: option };
    }
    return option as SnRadioOption;
  }),
);

/** True when the default slot renders children (options ignored). */
const hasSlotChildren = computed(() => !!slots.default);

const classList = computed(() => [
  'sn-radio-group',
  `sn-radio-group--${props.size}`,
  { 'sn-radio-group--button': props.button },
  props.customClass,
]);

const wrapperStyle = computed(() => {
  if (typeof props.customStyle === 'string') return props.customStyle;
  return Object.entries(props.customStyle ?? {})
    .map(([k, v]) => `${k}:${v}`)
    .join(';');
});

const ChildComponent = computed(() => (props.button ? SnRadioButton : SnRadio));
</script>

<template>
  <div
    :class="classList"
    :style="wrapperStyle || undefined"
    :data-snui-component="'radio-group'"
    role="radiogroup"
    :data-size="size"
    :data-status="status"
  >
    <slot v-if="hasSlotChildren" />
    <template v-else>
      <component
        :is="ChildComponent"
        v-for="(option, index) in normalizedOptions"
        :key="index"
        :checked-value="option.value ?? null"
        :label="option.label ?? ''"
        :disabled="disabled || (option.disabled ?? false)"
        :readonly="option.readonly ?? false"
      />
    </template>
  </div>
</template>

<style scoped>
.sn-radio-group {
  display: inline-flex;
  align-items: center;
  gap: var(--sn-web-radio-group-gap, 12px);
  font-family: inherit;
  box-sizing: border-box;
}

.sn-radio-group--button {
  gap: 0;
}

.sn-radio-group--button:not(:only-child) {
  border-radius: var(--sn-web-radio-button-group-radius, var(--sn-web-radius-md, 6px));
  overflow: hidden;
}
</style>
