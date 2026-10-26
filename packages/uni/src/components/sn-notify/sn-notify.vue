<script setup lang="ts">
/**
 * sn-notify (uni-end) — banner notification below the top edge for mobile.
 *
 * Reference library: wot-ui `wd-notify`
 *   (https://wot-ui.cn/component/notify.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-notify 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-notify/sn-notify.vue
 * → auto-registered as `<sn-notify>` in any .vue that uses it.
 *
 * ## Component-style only (function API not implemented)
 *
 * wd-notify also ships `useNotify()` (a programmatic `notify.show()` call that
 * mounts its own instance). uni-app has no reliable programmatic mount point on
 * every target, so this round ships the component form only:
 *
 *   <sn-notify v-model:visible="open" type="success" message="保存成功" />
 *
 * `useNotify()` is documented as "未实现". `visible` keeps the wd name so the
 * model matches the reference (`v-model:visible`).
 *
 * ## Documented divergences from wd-notify
 *
 *   - `root-portal` is not implemented (no portal host on miniprogram).
 *   - `selector` is accepted for parity but has no effect in the component form.
 *
 * ## Dispose (AGENTS.md §41)
 *
 * The auto-dismiss timer and the leave timer are the only resources; both are
 * cleared on close / re-open / unmount.
 *
 * Per AGENTS.md §32, this component handles rendering + interaction only.
 * No schema validation; no business logic.
 *
 * Not responsible for:
 *   - 无停留的轻提示 — 用 sn-toast
 *   - 横向滚动通知栏 — 用 sn-notice-bar
 *   - 居中确认框 — 用 sn-dialog
 */

import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import type { IconData } from '../sn-icon/sn-icon.vue';
import { resolveFeedbackIcon } from '../sn-icon/sn-icon-feedback';
import { X as XIcon } from '../sn-icon/sn-icon-set';

defineOptions({ name: 'SnNotify' });

/** Semantic type. Mirrors `wd-notify` `type`. */
type NotifyType = 'primary' | 'success' | 'warning' | 'danger';

/** Anchor. Mirrors `wd-notify` `position`. */
type NotifyPosition = 'top' | 'bottom';

/** Visual shape. Mirrors `wd-notify` `variant`. */
type NotifyVariant = 'filled' | 'floating';

/** Leave transition length, kept in sync with the CSS below. */
const LEAVE_MS = 300;

const props = withDefaults(
  defineProps<{
    /** Whether the notification is visible (v-model:visible). */
    visible?: boolean;
    /** Semantic type — drives the fill color and the default icon. */
    type?: NotifyType;
    /** Message text; `\n` renders as a line break. */
    message?: string | number;
    /** Auto-dismiss delay in ms; `0` keeps the notification open. */
    duration?: number;
    /** Anchor of the banner. */
    position?: NotifyPosition;
    /** Text color override (any CSS color value). */
    color?: string;
    /** Background color override (any CSS color value). */
    background?: string;
    /** Stacking level. */
    zIndex?: number;
    /** Extra top offset in px (or any CSS length) — accounts for a custom nav bar. */
    safeHeight?: number | string | undefined;
    /** Show the close button. */
    closable?: boolean;
    /** Visual shape: edge-to-edge bar or a floating rounded card. */
    variant?: NotifyVariant;
    /** Instance id used by the function API (parity only, no effect here). */
    selector?: string;
    /** Custom class for the root node. */
    customClass?: string;
    /** Custom inline style for the root node. */
    customStyle?: string;
    /**
     * Accepted for wot-ui parity, NOT implemented — miniprogram has no portal
     * host, so the layer cannot leave the page's document flow.
     */
    rootPortal?: boolean;
  }>(),
  {
    visible: false,
    type: 'danger',
    message: '',
    duration: 3000,
    position: 'top',
    color: '',
    background: '',
    zIndex: 99,
    safeHeight: undefined,
    closable: false,
    variant: 'filled',
    selector: '',
    customClass: '',
    customStyle: '',
    rootPortal: false,
  },
);

defineSlots<{
  /** Custom notification content (replaces `message`). */
  default?(): unknown;
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'click', event: Event): void;
  (e: 'opened'): void;
  (e: 'closed'): void;
}>();

/** Node present in the tree. */
const isMounted = ref(props.visible);
/** Target visible state — drives the slide transition. */
const isShown = ref(props.visible);

/** Auto-dismiss timer (cleared on close / unmount, §41). */
let dismissTimer: ReturnType<typeof setTimeout> | null = null;
/** Leave-transition timer. */
let leaveTimer: ReturnType<typeof setTimeout> | null = null;

function clearDismissTimer(): void {
  if (dismissTimer !== null) {
    clearTimeout(dismissTimer);
    dismissTimer = null;
  }
}

function clearLeaveTimer(): void {
  if (leaveTimer !== null) {
    clearTimeout(leaveTimer);
    leaveTimer = null;
  }
}

function clearAllTimers(): void {
  clearDismissTimer();
  clearLeaveTimer();
}

/** Status glyph for the semantic type; `primary` has no built-in glyph. */
const statusIcon = computed<IconData | null>(() =>
  props.type === 'primary' ? null : resolveFeedbackIcon(props.type),
);

/** Message split on `\n` so line breaks survive on every uni target. */
const messageLines = computed(() => String(props.message ?? '').split('\n'));

/** Safe height as a CSS length (bare number = px, per the wd reference). */
const safeHeightStyle = computed(() => {
  if (props.safeHeight === undefined || props.safeHeight === '') return '';
  return typeof props.safeHeight === 'number'
    ? `padding-top: ${props.safeHeight}px`
    : `padding-top: ${props.safeHeight}`;
});

function show(): void {
  clearAllTimers();
  isMounted.value = true;
  isShown.value = true;
  emit('opened');
  if (props.duration > 0) {
    dismissTimer = setTimeout(() => {
      dismissTimer = null;
      emit('update:visible', false);
    }, props.duration);
  }
}

function hide(): void {
  clearAllTimers();
  isShown.value = false;
  leaveTimer = setTimeout(() => {
    leaveTimer = null;
    isMounted.value = false;
    emit('closed');
  }, LEAVE_MS);
}

watch(
  () => props.visible,
  (value) => {
    if (value) show();
    else hide();
  },
);

onMounted(() => {
  // A notification mounted visible must run the full show leg: the
  // auto-dismiss timer is armed in show(), which the visible watch only
  // reaches on a transition.
  if (props.visible) show();
});

onBeforeUnmount(clearAllTimers);

function onTap(event: Event): void {
  emit('click', event);
}

function onCloseTap(event: Event): void {
  event.stopPropagation();
  emit('update:visible', false);
}

const rootClass = computed(() => [
  'sn-notify',
  `sn-notify--${props.position}`,
  `sn-notify--${props.variant}`,
  `sn-notify--${props.type}`,
  { 'sn-notify--shown': isShown.value },
  props.customClass,
]);

const rootStyle = computed(() => {
  const parts = [`z-index: ${props.zIndex}`];
  if (safeHeightStyle.value) parts.push(safeHeightStyle.value);
  if (props.background) parts.push(`background-color: ${props.background}`);
  if (props.color) parts.push(`color: ${props.color}`);
  if (props.customStyle) parts.push(props.customStyle);
  return parts.join('; ');
});
</script>

<template>
  <view v-if="isMounted" data-snui-component="notify" :class="rootClass" :style="rootStyle">
    <view class="sn-notify__body" role="alert" aria-live="assertive" @tap="onTap">
      <view v-if="statusIcon" class="sn-notify__icon" aria-hidden="true">
        <SnIcon :icon="statusIcon" :size="18" />
      </view>

      <view class="sn-notify__content">
        <slot>
          <text v-for="(line, index) in messageLines" :key="index" class="sn-notify__line">{{
            line
          }}</text>
        </slot>
      </view>

      <view
        v-if="closable"
        class="sn-notify__close"
        role="button"
        aria-label="close"
        @tap="onCloseTap"
      >
        <SnIcon :icon="XIcon" :size="16" />
      </view>
    </view>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-notify {
  position: fixed;
  left: 0;
  right: 0;
  box-sizing: border-box;
  transition-property: transform, opacity;
  transition-duration: 300ms;
  transition-timing-function: ease;
}

.sn-notify--top {
  top: 0;
  transform: translateY(-100%);
}

.sn-notify--bottom {
  bottom: 0;
  transform: translateY(100%);
}

.sn-notify--shown {
  transform: translateY(0);
  opacity: 1;
}

/* ── Body ─────────────────────────────────────────────────────────────── */

.sn-notify__body {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: var(--sn-mp-spacing-3);
  padding: var(--sn-mp-spacing-4) var(--sn-mp-spacing-5);
  color: var(--sn-mp-color-text-on-primary);
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-normal);
}

/* ── Variant: filled (edge-to-edge, semantic fill) ─────────────────────── */

.sn-notify--filled.sn-notify--primary {
  background-color: var(--sn-mp-color-action-primary);
}
.sn-notify--filled.sn-notify--success {
  background-color: var(--sn-mp-color-feedback-success);
}
.sn-notify--filled.sn-notify--warning {
  background-color: var(--sn-mp-color-feedback-warning);
}
.sn-notify--filled.sn-notify--danger {
  background-color: var(--sn-mp-color-feedback-danger);
}

/* ── Variant: floating (inset rounded card, tinted surface) ───────────── */

.sn-notify--floating {
  left: var(--sn-mp-spacing-4);
  right: var(--sn-mp-spacing-4);
}

.sn-notify--floating.sn-notify--top {
  top: var(--sn-mp-spacing-4);
}

.sn-notify--floating.sn-notify--bottom {
  bottom: var(--sn-mp-spacing-4);
}

.sn-notify--floating .sn-notify__body {
  border-radius: var(--sn-mp-radius-lg);
  background-color: var(--sn-mp-color-background-elevated);
  color: var(--sn-mp-color-text-primary);
  box-shadow: var(--sn-mp-shadow-md);
}

.sn-notify--floating.sn-notify--primary .sn-notify__icon {
  color: var(--sn-mp-color-action-primary);
}
.sn-notify--floating.sn-notify--success .sn-notify__icon {
  color: var(--sn-mp-color-feedback-success);
}
.sn-notify--floating.sn-notify--warning .sn-notify__icon {
  color: var(--sn-mp-color-feedback-warning);
}
.sn-notify--floating.sn-notify--danger .sn-notify__icon {
  color: var(--sn-mp-color-feedback-danger);
}

/* ── Icon / content / close ───────────────────────────────────────────── */

.sn-notify__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  margin-top: 2rpx;
}

.sn-notify__content {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 0;
}

.sn-notify__line {
  color: inherit;
  font-size: inherit;
  line-height: inherit;
  word-break: break-all;
}

.sn-notify__close {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 40rpx;
  height: 40rpx;
  color: inherit;
  opacity: 0.8;
}
</style>
