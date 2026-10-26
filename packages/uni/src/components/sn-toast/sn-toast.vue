<script setup lang="ts">
/**
 * sn-toast (uni-end) — transient lightweight message for mobile / miniprogram.
 *
 * Reference library: wot-ui `wd-toast`
 *   (https://wot-ui.cn/component/toast.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-toast 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-toast/sn-toast.vue
 * → auto-registered as `<sn-toast>` in any .vue that uses it.
 *
 * ## Component-style only (function API not implemented)
 *
 * wd-toast is normally driven by `useToast()` (`toast.success('…')`), which
 * mounts a hidden singleton. uni-app has no reliable programmatic mount point
 * on every target, so this round ships the component form only:
 *
 *   <sn-toast v-model="visible" msg="保存成功" icon-name="success" />
 *
 * `useToast()` and its `success` / `error` / `warning` / `info` / `loading` /
 * `close` helpers are documented as "未实现". `modelValue` is the component-form
 * counterpart of the `show` state wd-toast keeps internally.
 *
 * ## Documented divergences from wd-toast
 *
 *   - `selector` is accepted for parity but has no effect (no global instance
 *     registry in the component form).
 *   - `class-prefix` / `css-icon` are accepted for parity; uni-end icons are
 *     `IconData` objects resolved through sn-icon, so the class-prefix path is
 *     inert. Documented as "未实现".
 *   - `icon-size` / `icon-color` / `loading-*` apply to the built-in spinner and
 *     status glyphs (see `sn-icon`).
 *
 * ## Dispose (AGENTS.md §41)
 *
 * The auto-close timer is the only resource. It is cleared when the toast is
 * closed, re-opened, or unmounted, so a pending close can never fire on a
 * destroyed node.
 *
 * Per AGENTS.md §32, this component handles rendering + interaction only.
 * No schema validation; no business logic.
 *
 * Not responsible for:
 *   - 顶部条幅通知（可停留、可关闭）— 用 sn-notify
 *   - 带按钮的确认框 — 用 sn-dialog
 *   - 内联加载指示器 — 用 sn-loading
 */

import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import type { IconData } from '../sn-icon/sn-icon.vue';
import { resolveFeedbackIcon } from '../sn-icon/sn-icon-feedback';
import SnLoading from '../sn-loading/sn-loading.vue';

defineOptions({ name: 'SnToast' });

/** Layout direction of icon + text. Mirrors `wd-toast` `direction`. */
type ToastDirection = 'horizontal' | 'vertical';

/** Built-in icon kind. Mirrors `wd-toast` `icon-name`. */
type ToastIconType = '' | 'success' | 'error' | 'warning' | 'loading' | 'info';

/** Spinner shape for `icon-name="loading"`. Mirrors `wd-toast` `loading-type`. */
type ToastLoadingType = 'circular' | 'spinner' | 'dots' | 'wave';

/** Anchor of the toast box. Mirrors `wd-toast` `position`. */
type ToastPosition = 'top' | 'middle-top' | 'middle' | 'bottom';

const props = withDefaults(
  defineProps<{
    /** Whether the toast is shown (v-model). Component-form counterpart of `show`. */
    modelValue?: boolean;
    /** Message text. */
    msg?: string;
    /** Auto-close delay in ms; `0` keeps the toast open. */
    duration?: number;
    /** Layout direction of icon + text. */
    direction?: ToastDirection;
    /** Built-in icon kind; empty renders no icon. */
    iconName?: ToastIconType;
    /** Icon size (bare number = rpx, string passes through). */
    iconSize?: number | string | undefined;
    /** Spinner shape used when `iconName` is `loading`. */
    loadingType?: ToastLoadingType;
    /** Spinner color (any CSS color value). */
    loadingColor?: string;
    /** Spinner size (bare number = rpx, string passes through). */
    loadingSize?: number | string | undefined;
    /** Status glyph color (any CSS color value). */
    iconColor?: string;
    /** Anchor of the toast box. */
    position?: ToastPosition;
    /** Stacking level. */
    zIndex?: number;
    /** Render a transparent full-screen scrim that blocks the page behind. */
    cover?: boolean;
    /** Custom class for the icon node (parity; uni icons are IconData). */
    iconClass?: string;
    /** Icon class prefix (parity; inert on the uni end). */
    classPrefix?: string;
    /** CSS-icon mode (parity; inert on the uni end). */
    cssIcon?: boolean | string;
    /** Instance id used by the function API (parity only, no effect here). */
    selector?: string;
    /** Custom class for the root node. */
    customClass?: string;
    /** Custom inline style for the toast box. */
    customStyle?: string;
  }>(),
  {
    modelValue: false,
    msg: '',
    duration: 2000,
    direction: 'horizontal',
    iconName: '',
    iconSize: undefined,
    loadingType: 'circular',
    loadingColor: '',
    loadingSize: undefined,
    iconColor: '',
    position: 'middle',
    zIndex: 100,
    cover: false,
    iconClass: '',
    classPrefix: 'wd-icon',
    cssIcon: false,
    selector: '',
    customClass: '',
    customStyle: '',
  },
);

defineSlots<{
  /** Custom message content (replaces `msg`). */
  default?(): unknown;
  /** Custom icon area. */
  icon?(): unknown;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  /** Fired once the toast finished appearing. */
  (e: 'opened'): void;
  /** Fired once the toast finished closing. */
  (e: 'closed'): void;
  (e: 'click'): void;
}>();

/** Node present in the tree — cleared after the leave transition. */
const isMounted = ref(props.modelValue);
/** Target visible state — drives the opacity transition. */
const isShown = ref(props.modelValue);

/** Auto-close timer (cleared on close / unmount, §41). */
let closeTimer: ReturnType<typeof setTimeout> | null = null;
/** Leave-transition timer. */
let leaveTimer: ReturnType<typeof setTimeout> | null = null;

/** Duration of the fade transition, kept in sync with the CSS below. */
const FADE_MS = 200;

function clearCloseTimer(): void {
  if (closeTimer !== null) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
}

function clearLeaveTimer(): void {
  if (leaveTimer !== null) {
    clearTimeout(leaveTimer);
    leaveTimer = null;
  }
}

function clearAllTimers(): void {
  clearCloseTimer();
  clearLeaveTimer();
}

/**
 * Resolve a numeric-or-string size prop to a CSS length.
 *
 * A bare number is an rpx design value on the uni end, so the fallback is rpx
 * too: returning the raw number made the browser read it as CSS px and the
 * status glyph rendered at twice the intended size (a 64px check in a toast).
 */
function resolveSize(value: number | string | undefined, fallbackRpx: number): string | number {
  if (value === undefined || value === '') return `${fallbackRpx}rpx`;
  return typeof value === 'number' ? `${value}rpx` : value;
}

const isStatusIcon = computed(() => props.iconName !== '' && props.iconName !== 'loading');

const statusIcon = computed<IconData | null>(() =>
  isStatusIcon.value ? resolveFeedbackIcon(props.iconName) : null,
);

/** Non-undefined spinner shape for the inner sn-loading. */
const spinnerType = computed(() => props.loadingType);

const glyphSize = computed(() => resolveSize(props.iconSize, 64));
const spinnerSize = computed(() => resolveSize(props.loadingSize, 56));

function show(): void {
  clearAllTimers();
  isMounted.value = true;
  isShown.value = true;
  emit('opened');
  if (props.duration > 0) {
    closeTimer = setTimeout(() => {
      closeTimer = null;
      requestClose();
    }, props.duration);
  }
}

function requestClose(): void {
  emit('update:modelValue', false);
}

function hide(): void {
  clearAllTimers();
  isShown.value = false;
  leaveTimer = setTimeout(() => {
    leaveTimer = null;
    isMounted.value = false;
    emit('closed');
  }, FADE_MS);
}

watch(
  () => props.modelValue,
  (value) => {
    if (value) show();
    else hide();
  },
);

onMounted(() => {
  // A toast mounted open must run the full show leg: the auto-close timer is
  // armed in show(), which the modelValue watch only reaches on a transition.
  if (props.modelValue) show();
});

onBeforeUnmount(clearAllTimers);

function onClick(): void {
  emit('click');
}

const rootClass = computed(() => [
  'sn-toast',
  `sn-toast--${props.position}`,
  {
    'sn-toast--cover': props.cover,
  },
  props.customClass,
]);

const rootStyle = computed(() => `z-index: ${props.zIndex}`);

const boxClass = computed(() => [
  'sn-toast__box',
  `sn-toast__box--${props.direction}`,
  { 'sn-toast__box--loading': props.iconName === 'loading' },
]);

const boxStyle = computed(() => (props.customStyle ? props.customStyle : undefined));

const statusStyle = computed(() => (props.iconColor ? `color: ${props.iconColor}` : undefined));

const spinnerStyle = computed(() =>
  props.loadingColor ? `color: ${props.loadingColor}` : undefined,
);
</script>

<template>
  <view v-if="isMounted" :class="rootClass" :style="rootStyle" data-snui-component="toast">
    <view
      class="sn-toast__mask"
      :class="{ 'sn-toast__mask--shown': isShown }"
      aria-hidden="true"
      @touchmove.stop.prevent
    />

    <view :class="boxClass" :style="boxStyle" role="alert" aria-live="assertive" @tap="onClick">
      <slot name="icon">
        <view v-if="iconName === 'loading'" class="sn-toast__icon" :style="spinnerStyle">
          <SnLoading :type="spinnerType" :size="spinnerSize" />
        </view>
        <view v-else-if="statusIcon" class="sn-toast__icon" :class="iconClass" :style="statusStyle">
          <SnIcon :icon="statusIcon" :size="glyphSize" />
        </view>
      </slot>

      <view v-if="msg || $slots.default" class="sn-toast__msg">
        <slot>{{ msg }}</slot>
      </view>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-toast {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  /* The scrim is transparent by default, so the page stays visible. */
  pointer-events: none;
}

.sn-toast--top {
  align-items: flex-start;
  padding-top: 160rpx;
}
.sn-toast--middle-top {
  align-items: flex-start;
  padding-top: 40%;
}
.sn-toast--middle {
  align-items: center;
}
.sn-toast--bottom {
  align-items: flex-end;
  padding-bottom: 160rpx;
}

.sn-toast__mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: transparent;
  pointer-events: none;
  transition-property: background-color;
  transition-duration: 200ms;
  transition-timing-function: ease;
}

.sn-toast--cover .sn-toast__mask {
  pointer-events: auto;
}

.sn-toast--cover .sn-toast__mask--shown {
  background-color: var(--sn-mp-color-background-overlay);
}

.sn-toast__box {
  position: relative;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  gap: var(--sn-mp-spacing-3);
  max-width: 480rpx;
  padding: var(--sn-mp-spacing-5) var(--sn-mp-spacing-6);
  border-radius: var(--sn-mp-radius-lg);
  /* Toast surface: the sunken tone reads as a floating dark plate in light
   * mode and as a raised plate in dark mode (token flips with the theme). */
  background-color: var(--sn-mp-color-background-sunken);
  color: var(--sn-mp-color-text-on-primary);
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-normal);
  pointer-events: auto;
  opacity: 0;
  transform: scale(0.92);
  transition-property: opacity, transform;
  transition-duration: 200ms;
  transition-timing-function: ease;
}

/* Visibility is driven by the mask's shown state so both nodes animate off one
 * flag — the box is a sibling of the mask, so `:has` is not needed. */
.sn-toast__mask--shown + .sn-toast__box {
  opacity: 1;
  transform: scale(1);
}

.sn-toast__box--horizontal {
  flex-direction: row;
  justify-content: center;
}

.sn-toast__box--vertical {
  flex-direction: column;
  min-width: 240rpx;
  padding: var(--sn-mp-spacing-6) var(--sn-mp-spacing-5);
}

.sn-toast__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.sn-toast__msg {
  font-size: inherit;
  color: inherit;
  text-align: center;
}
</style>
