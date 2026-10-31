<script setup lang="ts">
/**
 * sn-input — uni-end text input component (AUI-MP-003).
 *
 * Phase 1 contract: 1:1 mirror of wot-ui's `wd-input`. Anything new added
 * here must also be added to the web `SnInput` (vue-web) and to the
 * wot-ui reference list documented in AGENTS.md §112.
 *
 * The uni-end layer adds a handful of mini-program-only props that the
 * web layer doesn't need:
 *
 *   - `confirm-type`     — Enter-key hint shown on the soft keyboard
 *   - `hold-keyboard`    — keep the keyboard up after the field blurs
 *   - `adjust-position`  — auto-scroll the page when keyboard covers the field
 *   - `always-embed`     — keep the input mounted even when detached
 *   - `cursor-spacing`   — gap between caret and keyboard
 *   - `confirm-hold`     — keep the keyboard up after the confirm key
 *   - `ignore-composition-event` — IME composition handling opt-out
 *   - `enable-native`    — Alipay MP native-widget opt-in
 *   - `cursor`           — initial caret position
 *   - `selection-start`  — initial selection range start
 *   - `selection-end`    — initial selection range end
 *
 * Per AGENTS.md §32 this component handles rendering + interaction +
 * DOM bridge only. Validation rules live on `sn-form-item`.
 */

import { computed, getCurrentInstance, markRaw, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import type { IconData } from '../sn-icon/sn-icon.vue';
import { Eye, EyeOff, X as XIcon } from '../sn-icon/sn-icon-set';

defineOptions({ name: 'SnInput' });

const props = withDefaults(
  defineProps<{
    /** Bound value. Coerced to `number` when type='number' / 'digit'. */
    modelValue?: string | number;
    /**
     * Native input type. Mirrors the wd-input 16-type grid.
     *  - `text` | `number` | `digit` | `idcard` | `safe-password` | `nickname`
     *  - `tel` | `password` | `email` | `url` | `search` | `textarea`
     */
    type?:
      | 'text'
      | 'number'
      | 'digit'
      | 'idcard'
      | 'safe-password'
      | 'nickname'
      | 'tel'
      | 'password'
      | 'email'
      | 'url'
      | 'search'
      | 'textarea';
    /** Mobile-first size preset. Drives rpx height + font-size. */
    size?: 'small' | 'medium' | 'large';
    /** Placeholder text. */
    placeholder?: string;
    /** Inline style declarations for the placeholder pseudo-element. */
    placeholderStyle?: string;
    /** Class applied to the placeholder pseudo-element (uni-app MP). */
    placeholderClass?: string;
    /** Disables interaction. Native `disabled` attribute is set. */
    disabled?: boolean;
    /** Read-only — value is visible but not editable. */
    readonly?: boolean;
    /** Required for form submission. Renders `aria-required`. */
    required?: boolean;
    /** Accessible label. */
    ariaLabel?: string;
    /** Max character length (cross-end: most MP vendors honor this). */
    maxlength?: number;
    /** Min character length. */
    minlength?: number;
    /**
     * Show the running `current / max` counter (right-aligned).
     * Aliased as `showWordLimit` for wot-ui parity.
     */
    showCount?: boolean;
    /** wot-ui alias for `showCount`. */
    showWordLimit?: boolean;
    /** Show × button to clear value. */
    clearable?: boolean;
    /**
     * When the clear button is shown. `always` shows whenever there is a
     * value; `focus` shows only when the input is focused. Mirrors
     * `wd-input` clear-trigger.
     */
    clearTrigger?: 'always' | 'focus';
    /** After clicking the clear button, refocus the input. */
    focusWhenClear?: boolean;
    /**
     * Render an inline eye-toggle that flips between password and text.
     * Applies only when `type === 'password'`.
     */
    showPassword?: boolean;
    /** Front-icon name. Resolved via the local sn-icon registry. */
    prefixIcon?: string;
    /** Tail-icon name. Resolved via the local sn-icon registry. */
    suffixIcon?: string;
    /** CSS class names for the prefix icon (when prefixIcon is treated as class). */
    iconPrefix?: string;
    /** CSS class names for the suffix icon (when suffixIcon is treated as class). */
    iconSuffix?: string;
    /**
     * CSS-icon mode. When `true`, `prefixIcon` / `suffixIcon` are
     * treated as class names applied directly to a span (rather than
     * resolved through the sn-icon registry).
     */
    cssIcon?: boolean | string;
    /** Visual status. Driven by sn-form-item validation; manual override allowed. */
    status?: 'default' | 'error' | 'warning';
    /** Lower bound (numeric input only). */
    min?: number;
    /** Upper bound (numeric input only). */
    max?: number;
    /** Step (numeric input only). */
    step?: number;
    /** Textarea row count (textarea only). */
    rows?: number;
    /**
     * Border preset (wot-ui parity). 3-way supersedes the legacy boolean.
     *  - `all`    — full 1rpx border on all sides (default).
     *  - `bottom` — only the bottom edge gets a border (inline form rows).
     *  - `none`   — no border at all.
     *
     * The older boolean `bordered` prop is kept as a deprecated alias —
     * `bordered: true` === `border: 'all'`, `bordered: false` === `border: 'none'`.
     */
    border?: 'all' | 'bottom' | 'none';
    /** @deprecated Use `border="all" | "none"` instead. */
    bordered?: boolean;
    /**
     * Background tone. `surface` (default) uses the elevated card
     * color; `transparent` removes the background for inputs that
     * sit directly on a colored banner; `soft` is a subtle secondary
     * fill.
     */
    bg?: 'surface' | 'transparent' | 'soft';
    /** Custom hex / rbg / named color overrides the bg tone. */
    customBg?: string;
    /**
     * Border-radius preset (AUI additive). Tiers map to the mp radius
     * tokens; `default` keeps `--sn-mp-input-radius`:
     *  - `sm`      — `--sn-mp-radius-sm` (8rpx)
     *  - `default` — `--sn-mp-input-radius` (12rpx)
     *  - `lg`      — `--sn-mp-radius-lg` (16rpx)
     *  - `xl`      — `--sn-mp-radius-xl` (24rpx)
     *  - `pill`    — fully rounded field
     *  - `square`  — right-angled
     */
    radius?: 'default' | 'sm' | 'lg' | 'xl' | 'pill' | 'square';
    /** Right-align the value (numeric / amount fields). */
    alignRight?: boolean;
    /**
     * Compact layout — strips default padding / background so the field
     * nests cleanly inside FormItem / Cell. Mirrors `wd-input` compact.
     */
    compact?: boolean;
    /** Initial focus on mount. */
    focus?: boolean;
    /** HTML inputmode hint. */
    inputmode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
    /** Class on the inner native `<input>` / `<textarea>`. */
    customInputClass?: string;
    /** Class on the root wrapper. */
    customClass?: string;
    /** Inline style on the root wrapper. */
    customStyle?: string | Record<string, string>;
    /**
     * Error state (`wd-input` `error`). Drives the `sn-input--error` class and
     * `aria-invalid`. Independent of the legacy 3-way `status` prop — either
     * one turns the error chrome on.
     */
    error?: boolean;

    /* ── uni-app MP-only props ───────────────────────────────────────────── */

    /**
     * Soft-keyboard confirm button label.
     * `send` | `search` | `next` | `go` | `done` (default `done`).
     */
    confirmType?: 'send' | 'search' | 'next' | 'go' | 'done';
    /** Keep the soft keyboard up after the field blurs. */
    holdKeyboard?: boolean;
    /** Auto-scroll the page when keyboard covers the field. */
    adjustPosition?: boolean;
    /** Keep the input mounted even when detached (uni-app MP opt-in). */
    alwaysEmbed?: boolean;
    /** Initial caret position. */
    cursor?: number;
    /** Initial selection range start. */
    selectionStart?: number;
    /** Initial selection range end. */
    selectionEnd?: number;

    /** Distance kept between the caret and the soft keyboard (px). */
    cursorSpacing?: number;
    /** Keep the keyboard up when the confirm key is tapped. */
    confirmHold?: boolean;
    /**
     * Ignore IME composition events. `false` re-enables composition events and
     * lets `input` fire mid-composition (uni-app MP native attribute).
     */
    ignoreCompositionEvent?: boolean;
    /**
     * Alipay MP: render the native input widget instead of the simulated one —
     * `false` avoids the page shifting when the keyboard opens.
     */
    enableNative?: boolean;
  }>(),
  {
    modelValue: '',
    type: 'text',
    size: 'medium',
    placeholder: '',
    placeholderStyle: '',
    placeholderClass: '',
    disabled: false,
    readonly: false,
    required: false,
    showCount: false,
    showWordLimit: false,
    clearable: false,
    clearTrigger: 'always',
    focusWhenClear: true,
    showPassword: false,
    prefixIcon: '',
    suffixIcon: '',
    iconPrefix: '',
    iconSuffix: '',
    cssIcon: false,
    status: 'default',
    rows: 3,
    border: 'all',
    bordered: true,
    bg: 'surface',
    customBg: '',
    radius: 'default',
    alignRight: false,
    compact: false,
    focus: false,
    inputmode: 'text',
    customInputClass: '',
    customClass: '',
    customStyle: '',
    error: false,
    cursorSpacing: 0,
    confirmHold: false,
    ignoreCompositionEvent: true,
    enableNative: true,
    confirmType: 'done',
    holdKeyboard: false,
    adjustPosition: true,
    alwaysEmbed: false,
    cursor: -1,
    selectionStart: -1,
    selectionEnd: -1,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'input', value: string | number, event: Event): void;
  (e: 'change', value: string | number, event: Event): void;
  (e: 'focus', event: Event): void;
  (e: 'blur', event: Event): void;
  (e: 'clear'): void;
  (e: 'click', event: Event): void;
  (e: 'clickPrefixIcon', event: Event): void;
  (e: 'clickSuffixIcon', event: Event): void;
  (e: 'confirm', value: string | number): void;
}>();

defineSlots<{
  prefix?(): unknown;
  'prefix-icon'?(): unknown;
  suffix?(): unknown;
  'suffix-icon'?(): unknown;
  'clear-icon'?(): unknown;
  count?(): unknown;
}>();

// uni 的 vue 运行时（uni-h5-vue / mp 编译目标）不导出 Vue 3.5 的 useId，
// 改用模块级计数器生成稳定的 DOM id（label 关联用，无需跨端唯一语义）。
let snInputUid = 0;
const inputId = `sn-input-${++snInputUid}`;
const slots = useSlots();

/**
 * Template ref on the inner field. In raw/test environments this is the
 * native element; in compiled uni apps it is the uni-input wrapper's
 * EXPOSED object, which only carries `$triggerInput` — no `focus`, no
 * `$el`. All DOM access therefore goes through the component's own root
 * element (see `rootElement`), and `$triggerInput` stays on this ref for
 * the clear flow.
 */
type NativeFieldRef = (HTMLInputElement | HTMLTextAreaElement) | {
  $triggerInput?: (detail: { value: string }) => void;
};
const nativeEl = ref<NativeFieldRef | null>(null);

const instance = getCurrentInstance();

/**
 * sn-input's own root element — the stable ancestor of the inner field for
 * the capture-phase mirror and imperative focus. Template refs on the
 * uni-input wrapper only expose `$triggerInput`, so the DOM must come from
 * the component instance itself.
 */
function rootElement(): Element | null {
  return ((instance?.proxy as { $el?: Element } | null)?.$el ?? null);
}

/** The inner native field, reached through the root element. */
function fieldInputElement(): HTMLInputElement | HTMLTextAreaElement | null {
  const root = rootElement();
  if (root) {
    if (root instanceof HTMLInputElement || root instanceof HTMLTextAreaElement) return root;
    return root.querySelector('input, textarea');
  }
  const direct = nativeEl.value;
  return direct instanceof HTMLInputElement || direct instanceof HTMLTextAreaElement ? direct : null;
}

// uni 的 input 组件 `focus` prop 语义：挂载后自动聚焦。H5 / 测试环境通过真实
// .focus() 实现；MP 编译目标由 uni 运行时按同名 prop 处理。
onMounted(() => {
  if (props.focus) refocusField();
  attachNativeInputMirror();
});

onBeforeUnmount(() => {
  detachNativeMirror?.();
  detachNativeMirror = null;
});

/** DOM-bound value (always string). */
const nativeValue = computed<string>(() =>
  props.modelValue === null || props.modelValue === undefined ? '' : String(props.modelValue),
);

const isTextarea = computed(() => props.type === 'textarea');
const isPassword = computed(() => props.type === 'password');
const textareaRows = computed(() => props.rows ?? 3);

/**
 * Effective border mode after the `bordered` boolean alias is folded
 * into the canonical `border` string.
 */
const borderMode = computed<'all' | 'bottom' | 'none'>(() => {
  if (props.border !== 'all') return props.border;
  return props.bordered === false ? 'none' : 'all';
});

/** Whether the clear button should be visible right now. */
const isFocused = ref(false);
const clearVisible = computed(() => {
  if (!props.clearable || props.disabled || props.readonly) return false;
  if (nativeValue.value.length === 0) return false;
  if (props.clearTrigger === 'focus') return isFocused.value;
  return true;
});

const currentLength = computed(() => nativeValue.value.length);
const isError = computed(() => props.error || props.status === 'error');
const ariaInvalid = computed(() => (isError.value ? 'true' : undefined));
const showCounter = computed(() => props.showCount || props.showWordLimit);
const isInteractive = computed(() => !props.disabled && !props.readonly);

/** Password show/hide state. */
const passwordVisible = ref(false);
const effectivePasswordType = computed(() =>
  props.type === 'password' && passwordVisible.value ? 'text' : props.type,
);
/**
 * Eye-toggle icon — `EyeOff` while password is visible, `Eye` otherwise.
 * Per AGENTS.md §113, UI icons must come from SnIcon / SnIcon registry;
 * emoji 🙈 / 👁 is never rendered.
 */
const passwordToggleIcon = computed<IconData>(() => markRaw(passwordVisible.value ? EyeOff : Eye));
/** Default clear-button glyph (sn-icon-set X). markRaw'd so SnIcon doesn't
 *  proxy the IconData record. */
const defaultClearIcon = markRaw(XIcon);

/**
 * Glyph size for every icon inside the field (prefix / suffix / clear /
 * password toggle). A CSS-var string passes through sn-icon's size
 * normalization untouched, so the token stays overridable at runtime —
 * same pattern as sn-cell's `effectiveIconSize`.
 */
const ICON_SIZE_VAR = 'var(--sn-input-icon-size)';

/**
 * Coerce a typed value to number only when the coercion is lossless in
 * string form ("42", "12.5"). Intermediate literals ("12.", "012") stay
 * strings: coercing them would re-render `:value` with a different string
 * than the field shows, and the controlled patch would eat the character
 * the user just typed. Full coercion happens on change / confirm (commit
 * points).
 */
function coerceTyping(raw: string): number | string {
  if (props.type !== 'number' && props.type !== 'digit') return raw;
  const n = Number(raw);
  return String(n) === raw ? n : raw;
}

/** The `detail.value` string of a uni component-level event, if it carries one. */
function eventDetailValue(event: Event): string | null {
  const detail = (event as unknown as { detail?: { value?: unknown } }).detail;
  return detail && typeof detail.value === 'string' ? detail.value : null;
}

/**
 * Read the typed value off either event shape. uni-h5's component-level
 * `input` events are SYNTHETIC objects: `target` is a plain
 * `{ id, dataset, offsetTop, offsetLeft }` with no `.value`, and the typed
 * text rides `detail.value`. Native (mirror-captured) events carry the real
 * field on `target` and have no `detail`. Reading `target.value` off the
 * synthetic shape yields `undefined` — which cleared the field on every
 * keystroke in compiled apps.
 */
function readEventValue(event: Event): string {
  const detailValue = eventDetailValue(event);
  if (detailValue !== null) return detailValue;
  const target = event.target as HTMLInputElement | null;
  if (target && typeof target.value === 'string') return target.value;
  return '';
}

/** Last value this instance delivered upstream through the typing pipeline. */
let lastTypedValue: string | number | null = null;

/**
 * Single upstream funnel for every typed value, whatever carrier brought it
 * (H5 capture mirror, uni component-level replay, MP component event).
 *
 * Dedupe is BY VALUE, not by event identity: uni-input re-wraps each native
 * keystroke into a FRESH synthetic object (throttled to ~10Hz), so an
 * identity check never matches and H5 delivered every keystroke twice —
 * two model writes and two parent `input` events per key. A value guard
 * drops only that redundant replay. The one hole — an EXTERNAL model write
 * landing on the last typed value between keystrokes (parent set "abc"
 * after we delivered "ab"; backspacing to "ab" must re-deliver) — is closed
 * by the modelValue watcher below, which resets the memo whenever the echo
 * differs from what we last sent. Our own v-model round-trip always equals
 * the memo and passes through without resetting it.
 */
function deliverTypingValue(raw: string, event: Event): void {
  const next = coerceTyping(raw);
  if (next === lastTypedValue) return;
  lastTypedValue = next;
  emit('update:modelValue', next);
  emit('input', next, event);
}

watch(
  () => props.modelValue,
  (value) => {
    if (coerceTyping(value === null || value === undefined ? '' : String(value)) !== lastTypedValue) {
      lastTypedValue = null;
    }
  },
);

function onInput(event: Event): void {
  /* The capture-phase mirror already delivered this native keystroke in
   * real time; uni's component-level replay (throttled) carries the same
   * value in synthetic shape and is deduped in the funnel. MP has no mirror
   * and takes this path alone for every keystroke. */
  deliverTypingValue(readEventValue(event), event);
}

/**
 * uni-input throttles its component-level `input` events to one per 100ms
 * (fast typing drops intermediate values, so counters and v-model readouts
 * visibly lag). On H5 the native `input` event still reaches the wrapper in
 * capture phase — BEFORE uni's own field listener fires and stopPropagation()s
 * the bubble phase — so mirroring it here keeps the model real-time. MP fires
 * unthrottled component events and has no DOM; the mirror stays H5-only.
 */
let detachNativeMirror: (() => void) | null = null;

function attachNativeInputMirror(): void {
  if (typeof document === 'undefined') return;
  /* Listen on sn-input's own root element — an ANCESTOR of the inner field —
   * so the capture-phase handler runs before the field's own listeners and
   * before uni's stopPropagation. */
  const host = rootElement();
  if (!host || typeof host.addEventListener !== 'function') return;
  const handler = (event: Event): void => {
    const target = event.target as HTMLInputElement | null;
    if (!target || typeof target.value !== 'string') return;
    deliverTypingValue(target.value, event);
  };
  host.addEventListener('input', handler, true);
  detachNativeMirror = () => host.removeEventListener('input', handler, true);
}

function onChange(event: Event): void {
  const raw = readEventValue(event);
  const next: number | string =
    (props.type === 'number' || props.type === 'digit') && raw !== '' ? Number(raw) : raw;
  emit('change', next, event);
}

function onFocus(event: Event): void {
  isFocused.value = true;
  emit('focus', event);
}

function onBlur(event: Event): void {
  isFocused.value = false;
  emit('blur', event);
}

function onConfirm(event: Event): void {
  /* uni-h5 / MP confirm events carry `detail.value`; raw dispatches (tests)
   * carry nothing. An explicit empty confirm must stay empty — the model
   * fallback applies only when the event has no detail payload at all. */
  const raw = eventDetailValue(event) ?? nativeValue.value;
  const next: number | string =
    (props.type === 'number' || props.type === 'digit') && raw !== '' ? Number(raw) : raw;
  emit('confirm', next);
}

/**
 * Refocus the field after a clear tap (`focusWhenClear`) and for the mount
 * `focus` prop. Tapping × blurs the field, so without this the next
 * keystrokes go nowhere and the clear icon "never comes back". Imperative
 * DOM focus reached through the component root — the uni-input wrapper's
 * exposed object carries no `focus` and a template `:focus` binding would
 * clobber the element method on the raw-test path. MP keyboards are raised
 * by user taps and stay out of scope here.
 */
function refocusField(): void {
  if (typeof document === 'undefined') return;
  fieldInputElement()?.focus();
}

function onClear(): void {
  emit('update:modelValue', '');
  emit('clear');
  /* uni-input applies external value changes through a 100ms debounce; a
   * keystroke inside that window cancels the pending sync and resurrects
   * the pre-clear text. The wrapper's exposed setter applies it now
   * (raw-element refs — tests / H5 without a wrapper — skip this). */
  const wrapper = nativeEl.value as { $triggerInput?: (d: { value: string }) => void } | null;
  wrapper?.$triggerInput?.({ value: '' });
  if (!props.focusWhenClear) return;
  refocusField();
}

function onClickRoot(event: Event): void {
  emit('click', event);
}

function onClickPrefixIcon(event: Event): void {
  emit('clickPrefixIcon', event);
}

function onClickSuffixIcon(event: Event): void {
  emit('clickSuffixIcon', event);
}

const classList = computed(() => [
  'sn-input',
  `sn-input--${props.size}`,
  `sn-input--${props.type}`,
  `sn-input--border-${borderMode.value}`,
  {
    'sn-input--disabled': props.disabled,
    'sn-input--readonly': props.readonly,
    /* Focus chrome rides this class instead of `:focus-within` (§116.2 —
     * App has no pseudo-classes); the flag is set from the native input's
     * focus / blur events, the same signal the browser used. */
    'sn-input--focused': isFocused.value,
    'sn-input--clearable': props.clearable,
    [`sn-input--bg-${props.bg}`]: true,
    [`sn-input--radius-${props.radius}`]: true,
    [`sn-input--status-${props.status}`]: props.status !== 'default',
    'sn-input--error': isError.value,
    'sn-input--with-prefix': !!(slots.prefix || props.prefixIcon || props.iconPrefix),
    'sn-input--with-suffix': !!(slots.suffix || props.suffixIcon || props.iconSuffix),
    'sn-input--with-count': showCounter.value,
    'sn-input--align-right': props.alignRight,
    'sn-input--compact': props.compact,
    'sn-input--with-clear': clearVisible.value,
  },
  props.customClass,
]);

const wrapperStyle = computed(() => {
  let style = '';
  if (props.customBg) style += `background-color: ${props.customBg};`;
  if (typeof props.customStyle === 'string') style += props.customStyle;
  else if (props.customStyle) {
    style += Object.entries(props.customStyle)
      .map(([k, v]) => `${k}:${v}`)
      .join(';');
  }
  return style || undefined;
});

/**
 * Uni-app MP-only native input attributes grouped into a single computed
 * so vue-tsc doesn't choke on `<input>` not declaring them on its
 * intrinsic HTMLInputElement interface. They're all standard MP runtime
 * hints — uni-app compiles them through to the underlying MP renderer.
 * （MP 端模板不支持 v-bind="obj" 展开，这些属性已在模板中显式逐条绑定。）
 */

/** Placeholder styling is a native input attribute, not a `::placeholder`
 * rule: App has no pseudo-elements (§116.2). The default keeps the token
 * color that the CSS rule used to supply. */
const DEFAULT_PLACEHOLDER_STYLE =
  'color: var(--sn-mp-color-input-placeholder, var(--sn-mp-color-text-tertiary)); opacity: 1';
const placeholderStyleAttr = computed(
  () => props.placeholderStyle || DEFAULT_PLACEHOLDER_STYLE,
);
const placeholderClassAttr = computed(() => props.placeholderClass || undefined);
</script>

<template>
  <view
    :class="classList"
    :style="wrapperStyle"
    :data-snui-component="isTextarea ? 'textarea' : 'input'"
    :data-size="size"
    :data-status="status"
    :data-border="borderMode"
    @click="onClickRoot"
  >
    <view
      v-if="slots.prefix || prefixIcon || iconPrefix"
      class="sn-input__prefix"
      aria-hidden="true"
      @tap.stop="onClickPrefixIcon"
    >
      <slot name="prefix" />
      <view
        v-if="!slots.prefix && (prefixIcon || iconPrefix)"
        :class="cssIcon ? prefixIcon || iconPrefix : 'sn-input__icon-glyph'"
      >
        <slot name="prefix-icon">
          <!-- Name mode resolves through the sn-icon chain
            (registry → built-in catalogue → provider), mirroring the web
            SnInput — the glyph used to render as an empty box here. -->
          <SnIcon v-if="!cssIcon" :icon="prefixIcon || iconPrefix" :size="ICON_SIZE_VAR" />
        </slot>
      </view>
    </view>

    <textarea
      v-if="isTextarea"
      ref="nativeEl"
      :id="inputId"
      :class="['sn-input__native', placeholderClass, customInputClass]"
      :value="nativeValue"
      :placeholder="placeholder"
      :placeholder-style="placeholderStyleAttr"
      :placeholder-class="placeholderClassAttr"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :rows="textareaRows"
      :aria-label="ariaLabel"
      :aria-invalid="ariaInvalid"
      :aria-required="required ? 'true' : undefined"
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
      @input="onInput"
      @change="onChange"
      @focus="onFocus"
      @blur="onBlur"
      @confirm="onConfirm"
    />

    <input
      v-else
      ref="nativeEl"
      :id="inputId"
      :class="['sn-input__native', placeholderClass, customInputClass]"
      :type="effectivePasswordType"
      :inputmode="inputmode"
      :value="nativeValue"
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
      :aria-required="required ? 'true' : undefined"
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
      @input="onInput"
      @change="onChange"
      @focus="onFocus"
      @blur="onBlur"
      @confirm="onConfirm"
    />

    <view v-if="showPassword && isPassword" class="sn-input__password-toggle" aria-hidden="true">
      <view
        class="sn-input__password-toggle-btn"
        :aria-label="passwordVisible ? 'Hide password' : 'Show password'"
        :tabindex="isInteractive ? 0 : -1"
        @tap.stop="passwordVisible = !passwordVisible"
        ><SnIcon :icon="passwordToggleIcon" :size="ICON_SIZE_VAR"
      /></view>
    </view>

    <view v-if="clearVisible" class="sn-input__clear" aria-hidden="true">
      <view
        class="sn-input__clear-btn"
        :aria-label="ariaLabel ? `Clear ${ariaLabel}` : 'Clear input'"
        :tabindex="isInteractive ? 0 : -1"
        @tap.stop="onClear"
      >
        <slot name="clear-icon"><SnIcon :icon="defaultClearIcon" :size="'62%'" /></slot>
      </view>
    </view>

    <view
      v-else-if="slots.suffix || suffixIcon || iconSuffix"
      class="sn-input__suffix"
      aria-hidden="true"
      @tap.stop="onClickSuffixIcon"
    >
      <slot name="suffix" />
      <view
        v-if="!slots.suffix && (suffixIcon || iconSuffix)"
        :class="cssIcon ? suffixIcon || iconSuffix : 'sn-input__icon-glyph'"
      >
        <slot name="suffix-icon">
          <SnIcon v-if="!cssIcon" :icon="suffixIcon || iconSuffix" :size="ICON_SIZE_VAR" />
        </slot>
      </view>
    </view>

    <view v-if="showCounter" class="sn-input__count" aria-live="polite">
      <slot name="count" :current="currentLength" :max="maxlength">
        {{ currentLength }}{{ maxlength ? ` / ${maxlength}` : '' }}
      </slot>
    </view>
  </view>
</template>

<style scoped>
/**
 * Geometry in rpx — uni-app uses rpx for cross-device sizing on every
 * compile target (H5 / WeChat MP / App). Color tokens resolve via the
 * `--sn-mp-*` alias layer that ships from `@snui/tokens-mp`.
 */
.sn-input {
  /* Input-family icon contract — every glyph inside the field (prefix /
   * suffix / clear / password toggle) shares one size and one color. The
   * defaults anchor on `--sn-mp-*` tokens so dark mode and style packs
   * follow automatically (§116.2 — no literal colors). */
  --sn-input-icon-size: var(--sn-mp-icon-size-medium);
  --sn-input-icon-color: var(--sn-mp-color-text-tertiary);
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
  position: relative;
  padding: 0 var(--sn-mp-input-padding-x, 20rpx);
  border: 2rpx solid var(--sn-mp-color-input-border, var(--sn-mp-color-border-default));
  border-radius: var(--sn-mp-input-radius, 12rpx);
  background-color: var(--sn-mp-color-input-bg, var(--sn-mp-color-background-surface));
  color: var(--sn-mp-color-input-text, var(--sn-mp-color-text-primary));
  font-family: inherit;
  line-height: 1;
  box-sizing: border-box;
  transition:
    border-color 0.18s ease-out,
    background-color 0.18s ease-out;
}

/* Radius presets — tiers ride the shared `--sn-mp-radius-*` scale so fields
 * can sit on cards (sm) or hero search bars (xl) without one-off values.
 * Declared BEFORE the border variants: `border='bottom'` must always win the
 * radius (a bottom-edge row is square regardless of the `radius` tier — the
 * classList carries `radius-default` even then, and equal specificity means
 * later-in-stylesheet wins). */
.sn-input--radius-default {
  border-radius: var(--sn-mp-input-radius, 12rpx);
}
.sn-input--radius-sm {
  border-radius: var(--sn-mp-radius-sm);
}
.sn-input--radius-lg {
  border-radius: var(--sn-mp-radius-lg);
}
.sn-input--radius-xl {
  border-radius: var(--sn-mp-radius-xl);
}
.sn-input--radius-pill {
  border-radius: 999rpx;
}
.sn-input--radius-square {
  border-radius: 0;
}

/* Border variants — `border='all'` is the default; `border='bottom'` only
 * shows a bottom edge (typical for inline form rows that sit on a card) and
 * forces square corners; `border='none'` drops the border entirely. */
.sn-input--border-all {
  border: 2rpx solid var(--sn-mp-color-input-border, var(--sn-mp-color-border-default));
}
.sn-input--border-bottom {
  border: none;
  border-bottom: 2rpx solid var(--sn-mp-color-input-border, var(--sn-mp-color-border-default));
  border-radius: 0;
  padding-left: 0;
  padding-right: 0;
}
.sn-input--border-none {
  border-color: transparent;
}
.sn-input--border-none.sn-input--focused {
  border-color: transparent;
}

/* Background tones */
.sn-input--bg-surface {
  background-color: var(--sn-mp-color-input-bg, var(--sn-mp-color-background-surface));
}
.sn-input--bg-transparent {
  background-color: transparent;
}
.sn-input--bg-soft {
  background-color: var(--sn-mp-color-background-soft);
}

/* Focus state — border color soft outer ring so users can see
 * exactly which field owns the focus without a heavy chrome change.
 * Compound classes keep the two-class specificity the `:focus-within`
 * rule had, so the status/error rules below still lose/wins identically. */
.sn-input.sn-input--focused {
  border-color: var(--sn-mp-color-input-border-focus, var(--sn-mp-color-action-primary));
}

/* Sizes */
.sn-input--small {
  height: 56rpx;
  font-size: 24rpx;
}
.sn-input--medium {
  height: 72rpx;
  font-size: 28rpx;
}
.sn-input--large {
  height: 88rpx;
  font-size: 32rpx;
}

/* Status — applied after the focus border so error/warning wins. */
.sn-input--status-error {
  border-color: var(--sn-mp-color-feedback-danger);
}
.sn-input--status-warning {
  border-color: var(--sn-mp-color-feedback-warning);
}

/* `error` boolean (wd-input parity) — same chrome as `status="error"`. */
.sn-input--error {
  border-color: var(--sn-mp-color-feedback-danger);
}
.sn-input--error.sn-input--focused {
  border-color: var(--sn-mp-color-feedback-danger);
}

/* States */
.sn-input--disabled,
.sn-input--disabled .sn-input__native {
  cursor: not-allowed;
  opacity: 0.5;
}
.sn-input--readonly .sn-input__native {
  cursor: default;
}

/* Right-aligned value (amount fields). */
.sn-input--align-right .sn-input__native {
  text-align: right;
}

/* Compact layout — strips padding and background so the field sits flush
 * inside a FormItem / Cell. */
.sn-input--compact {
  padding: 0 16rpx;
  background-color: transparent;
  border-color: transparent;
}
.sn-input--compact.sn-input--focused {
  background-color: var(--sn-mp-color-input-bg, var(--sn-mp-color-background-surface));
  border-color: var(--sn-mp-color-input-border, var(--sn-mp-color-border-default));
}

/* Native input/textarea fill the available row */
.sn-input__native {
  flex: 1 1 auto;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: 1.4;
  padding: 0;
}
/* Placeholder styling rides `placeholder-style` (native attribute), not
 * `::placeholder` — pseudo-elements do not exist on App (§116.2). */

textarea.sn-input__native {
  resize: vertical;
  padding: 8rpx 0;
}

/* Prefix / suffix */
.sn-input__prefix,
.sn-input__suffix {
  display: inline-flex;
  align-items: center;
  color: var(--sn-mp-color-text-secondary);
  font-size: 0.9em;
  flex: 0 0 auto;
  cursor: pointer;
}

/* Icon glyph slot — host project can `<view slot="prefix-icon">` here;
 * name-mode SnIcons land in the same box. */
.sn-input__icon-glyph {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--sn-input-icon-size);
  height: var(--sn-input-icon-size);
  color: var(--sn-input-icon-color);
}

/* Password show/hide toggle */
.sn-input__password-toggle {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
}
.sn-input__password-toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--sn-input-icon-size);
  height: var(--sn-input-icon-size);
  color: var(--sn-input-icon-color);
  border-radius: 50%;
  line-height: 1;
  cursor: pointer;
}

/* Clear button */
.sn-input__clear {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
}
.sn-input__clear-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--sn-input-icon-size);
  height: var(--sn-input-icon-size);
  /* Circular delete chip: token-colored disc with a surface-toned × so the
   * glyph stays legible in dark mode / style packs (both vars flip). */
  background: var(--sn-input-icon-color);
  color: var(--sn-mp-color-background-surface);
  border-radius: 50%;
  line-height: 1;
  cursor: pointer;
}

/* Count */
.sn-input__count {
  font-size: 22rpx;
  color: var(--sn-mp-color-text-tertiary);
  flex: 0 0 auto;
  min-width: 60rpx;
  text-align: right;
  line-height: 1;
}

/* Textarea wrapper layout */
.sn-input--textarea {
  flex-direction: column;
  align-items: stretch;
  height: auto;
  padding: 12rpx var(--sn-mp-input-padding-x, 20rpx);
}
.sn-input--textarea .sn-input__count {
  align-self: flex-end;
  margin-top: 4rpx;
}

/* Doodle skin. */
.snui-skin-doodle .sn-input {
  border-width: 5rpx;
  border-style: solid;
  border-color: #1a1a1a;
  background-color: var(--sn-mp-color-background-elevated);
  font-weight: 600;
}
/* `:hover` chrome dropped — touch platforms have no hover and App has no
 * pseudo-classes (§116.2); the pressed look ships on focus below. */
.snui-skin-doodle .sn-input--focused {
  transform: translate(-2rpx, -2rpx);
  box-shadow: 4rpx 4rpx 0 #1a1a1a;
}
.snui-skin-doodle .sn-input__password-toggle-btn,
.snui-skin-doodle .sn-input__clear-btn {
  /* Ink border eats into the token-sized box — grow the box so the glyph
   * still fits (border-box keeps the outer size predictable). */
  box-sizing: border-box;
  width: 48rpx;
  height: 48rpx;
  border: 4rpx solid #1a1a1a;
  box-shadow: 2rpx 2rpx 0 #1a1a1a;
}
</style>
