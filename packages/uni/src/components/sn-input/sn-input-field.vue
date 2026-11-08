<script setup lang="ts">
/**
 * sn-input-field — internal wrapper around uni-input / uni-textarea for
 * sn-input (AUI-MP-003). NOT a public component.
 *
 * Why this exists: uni-input's render reads its INTERNAL state2.value, not
 * the `value` prop. If anything re-renders uni-input while a keystroke is in
 * flight (the parent's per-keystroke counter/clear re-render, echoed through
 * shouldUpdateComponent by any prop whose identity churns — a fresh `:class`
 * array, a per-keystroke `:value`), uni-h5-vue's patchDOMProp writes the
 * STALE internal text back over the field and eats the character Blink just
 * inserted. Chrome's per-listener microtask checkpoints hit this on every
 * key; WebKit's ordering happens to survive it.
 *
 * This component isolates uni-input behind a props boundary whose values are
 * identity- and value-stable during typing:
 *   - `value` carries EXTERNAL model writes only (see sn-input's
 *     externalValue / boundNativeValue);
 *   - `nativeClass` is a cached computed inside this component, not a fresh
 *     array literal per parent render;
 *   - events re-emit the raw uni event objects upward.
 *
 * The uni-input element keeps its `value` binding for mount-time / MP
 * external sync; during typing it never changes, so uni-input keeps its own
 * in-flight state and no patch touches the field mid-dispatch.
 */
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref } from 'vue';

defineOptions({ name: 'SnInputField' });

const props = withDefaults(
  defineProps<{
    /** External model value, already string-normalized by the parent. */
    value?: string;
    isTextarea?: boolean | undefined;
    type?: string | undefined;
    inputmode?:
      'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url' | undefined;
    placeholder?: string | undefined;
    placeholderStyle?: string | undefined;
    placeholderClass?: string | undefined;
    disabled?: boolean | undefined;
    readonly?: boolean | undefined;
    maxlength?: number | undefined;
    minlength?: number | undefined;
    min?: number | undefined;
    max?: number | undefined;
    step?: number | undefined;
    ariaLabel?: string | undefined;
    ariaInvalid?: 'true' | undefined;
    ariaRequired?: 'true' | undefined;
    rows?: number | undefined;
    customInputClass?: string | undefined;
    confirmType?: 'send' | 'search' | 'next' | 'go' | 'done' | undefined;
    holdKeyboard?: boolean | undefined;
    adjustPosition?: boolean | undefined;
    alwaysEmbed?: boolean | undefined;
    cursorSpacing?: number | undefined;
    confirmHold?: boolean | undefined;
    ignoreCompositionEvent?: boolean | undefined;
    enableNative?: boolean | undefined;
    cursor?: number | undefined;
    selectionStart?: number | undefined;
    selectionEnd?: number | undefined;
  }>(),
  {
    value: '',
    isTextarea: false,
    type: 'text',
    inputmode: 'text',
    placeholder: '',
    placeholderStyle: '',
    placeholderClass: '',
    disabled: false,
    readonly: false,
    rows: 3,
    customInputClass: '',
    confirmType: 'done',
    holdKeyboard: false,
    adjustPosition: true,
    alwaysEmbed: false,
    cursorSpacing: 0,
    confirmHold: false,
    ignoreCompositionEvent: true,
    enableNative: true,
    cursor: -1,
    selectionStart: -1,
    selectionEnd: -1,
  },
);

const emit = defineEmits<{
  (e: 'input', event: Event): void;
  (e: 'change', event: Event): void;
  (e: 'focus', event: Event): void;
  (e: 'blur', event: Event): void;
  (e: 'confirm', event: Event): void;
}>();

// uni 的 vue 运行时不导出 Vue 3.5 的 useId；模块级计数器生成稳定的 DOM id。
let snInputFieldUid = 0;
const inputId = `sn-input-${++snInputFieldUid}`;

/**
 * Cached computed — see the component docblock. A fresh array literal here
 * would re-trigger uni-input on every parent render.
 */
const nativeClass = computed(() => [
  'sn-input__native',
  props.placeholderClass,
  props.customInputClass,
]);

/** Placeholder styling rides the native attribute — App has no pseudo-elements. */
const DEFAULT_PLACEHOLDER_STYLE =
  'color: var(--sn-mp-color-input-placeholder, var(--sn-mp-color-text-tertiary)); opacity: 1';
const placeholderStyleAttr = computed(() => props.placeholderStyle || DEFAULT_PLACEHOLDER_STYLE);
const placeholderClassAttr = computed(() => props.placeholderClass || undefined);

/**
 * Template ref on the uni-input wrapper. In compiled uni apps it is the
 * wrapper's EXPOSED object (carries `$triggerInput`); in raw/test
 * environments it is the native element.
 */
type NativeFieldRef =
  | (HTMLInputElement | HTMLTextAreaElement)
  | {
      $triggerInput?: (detail: { value: string }) => void;
    };
const nativeEl = ref<NativeFieldRef | null>(null);

/**
 * Apply an external value to the field immediately, bypassing uni-input's
 * 100ms debounced value sync (used by the clear flow: a keystroke inside the
 * debounce window would otherwise cancel the pending sync and resurrect the
 * pre-clear text).
 */
function syncValue(text: string): void {
  callTriggerInput(text);
  const direct = nativeEl.value;
  if (direct instanceof HTMLInputElement || direct instanceof HTMLTextAreaElement) {
    direct.value = text;
  }
}

function callTriggerInput(text: string): void {
  const wrapper = nativeEl.value as { $triggerInput?: (d: { value: string }) => void } | null;
  if (typeof wrapper?.$triggerInput === 'function') {
    wrapper.$triggerInput({ value: text });
  }
}

/**
 * Capture-phase mirror on the uni-input element — THE Chrome-typing fix.
 *
 * uni-input's render reads its internal `state2.value`, which its own field
 * listener only syncs in the BUBBLE phase. The parent's per-keystroke UI
 * re-render flushes (Chrome runs a microtask checkpoint after EVERY event
 * listener) in between — assigning the STALE `state2` text over the field
 * and eating the character Blink just inserted. Calling uni's own exposed
 * `$triggerInput` here keeps `state2` in lockstep with the DOM from capture
 * time onward, so every later re-render re-asserts the CURRENT text (a
 * no-op) instead of the stale one. WebKit's ordering survives without this;
 * Chrome's does not. The raw event is still re-emitted for the parent's
 * dedupe funnel, which keeps the v-model real-time (uni-input itself
 * throttles its component-level input events to ~10Hz).
 */
let detachNativeMirror: (() => void) | null = null;

onMounted(() => {
  if (typeof document === 'undefined') return;
  const inst = getCurrentInstance();
  const host = (inst?.proxy as { $el?: Element } | null)?.$el ?? null;
  if (!host || typeof host.addEventListener !== 'function') return;
  const handler = (event: Event): void => {
    const target = event.target as HTMLInputElement | null;
    if (!target || typeof target.value !== 'string') return;
    callTriggerInput(target.value);
    emit('input', event);
  };
  host.addEventListener('input', handler, true);
  detachNativeMirror = () => host.removeEventListener('input', handler, true);
});

onBeforeUnmount(() => {
  detachNativeMirror?.();
  detachNativeMirror = null;
});

defineExpose({ syncValue });
</script>

<template>
  <textarea
    v-if="isTextarea"
    ref="nativeEl"
    :id="inputId"
    :class="nativeClass"
    :value="value"
    :placeholder="placeholder"
    :placeholder-style="placeholderStyleAttr"
    :placeholder-class="placeholderClassAttr"
    :disabled="disabled"
    :readonly="readonly"
    :maxlength="maxlength"
    :rows="rows"
    :aria-label="ariaLabel"
    :aria-invalid="ariaInvalid"
    :aria-required="ariaRequired"
    :confirm-type="confirmType"
    :hold-keyboard="holdKeyboard"
    :adjust-position="adjustPosition"
    :always-embed="alwaysEmbed"
    :cursor-spacing="cursorSpacing"
    :confirm-hold="confirmHold"
    :ignore-composition-event="ignoreCompositionEvent"
    :enable-native="enableNative"
    :cursor="cursor !== undefined && cursor >= 0 ? cursor : undefined"
    :selection-start="
      selectionStart !== undefined && selectionStart >= 0 ? selectionStart : undefined
    "
    :selection-end="selectionEnd !== undefined && selectionEnd >= 0 ? selectionEnd : undefined"
    @input="emit('input', $event)"
    @change="emit('change', $event)"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
    @confirm="emit('confirm', $event)"
  />
  <input
    v-else
    ref="nativeEl"
    :id="inputId"
    :class="nativeClass"
    :type="type"
    :inputmode="inputmode"
    :value="value"
    :placeholder="placeholder"
    :placeholder-style="placeholderStyleAttr"
    :placeholder-class="placeholderClassAttr"
    :disabled="disabled"
    :readonly="readonly"
    :maxlength="maxlength"
    :minlength="minlength"
    :min="min"
    :max="max"
    :step="step"
    :aria-label="ariaLabel"
    :aria-invalid="ariaInvalid"
    :aria-required="ariaRequired"
    :confirm-type="confirmType"
    :hold-keyboard="holdKeyboard"
    :adjust-position="adjustPosition"
    :always-embed="alwaysEmbed"
    :cursor-spacing="cursorSpacing"
    :confirm-hold="confirmHold"
    :ignore-composition-event="ignoreCompositionEvent"
    :enable-native="enableNative"
    :cursor="cursor !== undefined && cursor >= 0 ? cursor : undefined"
    :selection-start="
      selectionStart !== undefined && selectionStart >= 0 ? selectionStart : undefined
    "
    :selection-end="selectionEnd !== undefined && selectionEnd >= 0 ? selectionEnd : undefined"
    @input="emit('input', $event)"
    @change="emit('change', $event)"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
    @confirm="emit('confirm', $event)"
  />
</template>
