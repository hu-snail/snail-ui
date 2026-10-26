<script setup lang="ts">
/**
 * SnNotification — a single notification card in the provider-managed stack
 * (AUI-WEB-FB-012).
 *
 * Reference library: naive-ui `n-notification`
 *   (https://www.naiveui.com/zh-CN/light/components/notification)
 * Per AGENTS.md §112, props + semantics mirror `n-notification` 1:1.
 *
 * 1:1 parity (props): type / title / content / description / meta / avatar /
 *   footer / duration / closable / keepAliveOnHover.
 * 1:1 parity (slots): default (body) / header (title) / icon / footer /
 *   avatar.
 * 1:1 parity (per-type built-in icon, same glyph table as the reference):
 *   info → Info, success → CircleCheck, warning → AlertTriangle (lucide's
 *   canonical name: TriangleAlert), error → CircleAlert.
 *
 * Scope note — this is the *card*, not the stack:
 *   like the reference library, notifications are meant to be created through
 *   `useNotification()` inside a `<SnNotificationProvider>`. The provider
 *   (SnNotificationProvider.vue) owns the stack: placement, max cap, the
 *   `<TransitionGroup>` enter/leave/move animation, teleporting to `body`,
 *   and the `onAfterEnter` / `onAfterLeave` callbacks (those fire from the
 *   stack's transition hooks, not from the card). This component renders one
 *   card and manages its own pieces of the contract:
 *
 *   - `duration` countdown: a plain `setTimeout` that emits `destroy` when it
 *     expires (the provider then removes the card). `duration <= 0` disables
 *     the countdown entirely.
 *   - `keepAliveOnHover`: pausing the countdown on `mouseenter` and resuming
 *     with the remaining time on `mouseleave`. Hover listeners are template
 *     bindings (removed with the element); the timer is cleared in
 *     `onBeforeUnmount` (AGENTS.md §41/§42).
 *   - `onClose` is fired by the provider when the card is destroyed by any
 *     path (close button, countdown, `handle.destroy()`); the card only
 *     reports the intent through the `destroy` event.
 *
 * Divergence from `n-notification` (documented):
 *   - Upstream reads ~20 `--n-*` vars from a JS theme object. This card reads
 *     `--sn-web-*` tokens in CSS instead, so no inline style is needed and
 *     theming works by overriding tokens (AGENTS.md §34).
 *   - The per-type icon colours follow the reference icon colour table:
 *     the `success` glyph (CircleCheck) is tinted with the info colour, the
 *     `error` glyph (CircleAlert) with the danger colour. Each colour has a
 *     `--sn-web-notification-icon-color-*` override hook.
 *   - The card's `role` is a literal `alert` / `status` (see below) instead
 *     of an aria live region managed by the stack container.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnNotification type="success" title="已保存" content="配置已生效" />
 */

import { computed, onBeforeUnmount, onMounted, useSlots } from 'vue';
import { useLocale } from '../locales/use-locale';
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-vue-next';
import SnIcon from '../icon/SnIcon.vue';
import type { IconComponent } from '../icon/sn-icon-registry';
import type { NotificationType } from './notification-types';

defineOptions({ name: 'SnNotification' });

/** Active locale (injected once at setup — inject() is setup-only). */
const locale = useLocale();

const props = withDefaults(
  defineProps<{
    /** Semantic type — drives the built-in icon + colour. */
    type?: NotificationType | undefined;
    /** Bold heading line. */
    title?: string | undefined;
    /** Primary body text. Replaced by the default slot. */
    content?: string | undefined;
    /** Secondary body text under `content`. */
    description?: string | undefined;
    /** Small footer-left caption. */
    meta?: string | undefined;
    /** Leading avatar render function (from the API options). */
    avatar?: (() => unknown) | undefined;
    /** Footer render function (from the API options). */
    footer?: (() => unknown) | undefined;
    /** Auto-destroy delay in ms. `<= 0` disables the countdown. */
    duration?: number | undefined;
    /** Render the close button. */
    closable?: boolean | undefined;
    /** Pause the countdown while hovered. */
    keepAliveOnHover?: boolean | undefined;
  }>(),
  {
    type: 'default',
    title: undefined,
    content: undefined,
    description: undefined,
    meta: undefined,
    avatar: undefined,
    footer: undefined,
    duration: 3000,
    closable: true,
    keepAliveOnHover: true,
  },
);

const emit = defineEmits<{
  /** The card must be removed (close button clicked or countdown expired). */
  (e: 'destroy'): void;
}>();

const slots = useSlots();

/**
 * Same glyph table as the reference library's icon render map. `'default'`
 * never reaches this map — the icon column only renders for the four
 * semantic types.
 */
const ICON_BY_TYPE: Record<Exclude<NotificationType, 'default'>, IconComponent> = {
  info: Info as IconComponent,
  success: CircleCheck as IconComponent,
  warning: TriangleAlert as IconComponent,
  error: CircleAlert as IconComponent,
};

const iconComponent = computed<IconComponent | null>(() => {
  if (props.type === 'default') {
    return null;
  }
  return ICON_BY_TYPE[props.type];
});

/**
 * `error` / `warning` cards are announced assertively (`role="alert"`);
 * the rest use the polite live region (`role="status"`).
 */
const cardRole = computed(() =>
  props.type === 'error' || props.type === 'warning' ? 'alert' : 'status',
);

/* ── duration countdown + keepAliveOnHover pause ──────────────────────────
 * The countdown tracks *remaining* time instead of a fixed delay so a hover
 * pause mid-flight resumes where it stopped. `startedAt` anchors the elapsed
 * measurement at (re)start time. */

let timer: ReturnType<typeof setTimeout> | null = null;
let remaining = props.duration;
let startedAt = 0;

function clearTimer(): void {
  if (timer !== null) {
    clearTimeout(timer);
    timer = null;
  }
}

function startTimer(): void {
  clearTimer();
  if (!(props.duration > 0)) {
    return;
  }
  startedAt = Date.now();
  timer = setTimeout(() => {
    timer = null;
    emit('destroy');
  }, remaining);
}

/** Freeze the countdown; called on `mouseenter` when keepAliveOnHover. */
function pauseTimer(): void {
  if (timer === null) {
    return;
  }
  clearTimer();
  const elapsed = Date.now() - startedAt;
  remaining = Math.max(0, remaining - elapsed);
}

function handleEnter(): void {
  if (props.keepAliveOnHover) {
    pauseTimer();
  }
}

function handleLeave(): void {
  // Resume only when a countdown is actually in play (duration > 0); after a
  // full pause-and-resume cycle `remaining` may already be 0, which makes the
  // resumed timer a no-op that fires immediately — intended.
  if (props.keepAliveOnHover && props.duration > 0) {
    startTimer();
  }
}

function handleCloseClick(): void {
  clearTimer();
  emit('destroy');
}

onMounted(() => {
  startTimer();
});

onBeforeUnmount(() => {
  clearTimer();
});
</script>

<template>
  <div
    class="sn-notification"
    :class="`sn-notification--${type}`"
    :role="cardRole"
    data-snui-component="notification"
    @mouseenter="handleEnter"
    @mouseleave="handleLeave"
  >
    <!-- Leading avatar: render-function prop (API options) or slot. -->
    <div v-if="avatar || slots.avatar" class="sn-notification__avatar">
      <slot name="avatar">
        <component :is="avatar" />
      </slot>
    </div>

    <!-- Built-in per-type icon ('default' has none, same as upstream). -->
    <div v-if="iconComponent" class="sn-notification__icon" aria-hidden="true">
      <slot name="icon">
        <SnIcon :icon="iconComponent" />
      </slot>
    </div>

    <div class="sn-notification__main">
      <div v-if="title || slots.header" class="sn-notification__header">
        <slot name="header">{{ title }}</slot>
      </div>

      <div v-if="content || slots.default" class="sn-notification__content">
        <slot>{{ content }}</slot>
      </div>

      <div v-if="description" class="sn-notification__description">
        {{ description }}
      </div>

      <div v-if="meta" class="sn-notification__meta">{{ meta }}</div>

      <div v-if="footer || slots.footer" class="sn-notification__footer">
        <slot name="footer">
          <component :is="footer" />
        </slot>
      </div>
    </div>

    <button
      v-if="closable"
      type="button"
      class="sn-notification__close"
      :aria-label="locale.Common.close"
      @click="handleCloseClick"
    >
      <SnIcon :icon="X" />
    </button>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`).
 * Component-specific sizes below have no token yet, so they read
 * `var(--sn-web-notification-*, <fallback>)` — overridable, with the
 * fallback as the built-in default. */

.sn-notification {
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  width: var(--sn-web-notification-width, 330px);
  padding: var(--sn-web-notification-padding, 14px 16px);
  background: var(--sn-web-color-background-elevated, #ffffff);
  color: var(--sn-web-color-text-primary, #1f2224);
  border: 1px solid var(--sn-web-color-border-subtle, rgba(0, 0, 0, 0.08));
  border-radius: var(--sn-web-card-radius, 8px);
  box-shadow: var(--sn-web-card-shadow, 0 4px 16px rgba(0, 0, 0, 0.08));
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
  pointer-events: auto;
}

/* ── leading avatar / type icon ─────────────────────────────────────────── */

.sn-notification__avatar,
.sn-notification__icon {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  font-size: var(--sn-web-icon-size-medium, 16px);
}

/* Per-type icon colour — mirrors the reference icon colour table: the
 * success glyph is tinted with the info colour; error uses danger. Each has
 * a component-token override hook. */
.sn-notification--info .sn-notification__icon {
  color: var(--sn-web-notification-icon-color-info, var(--sn-web-color-feedback-info, #4098fc));
}

.sn-notification--success .sn-notification__icon {
  color: var(--sn-web-notification-icon-color-success, var(--sn-web-color-feedback-info, #4098fc));
}

.sn-notification--warning .sn-notification__icon {
  color: var(
    --sn-web-notification-icon-color-warning,
    var(--sn-web-color-feedback-warning, #f0a020)
  );
}

.sn-notification--error .sn-notification__icon {
  color: var(--sn-web-notification-icon-color-error, var(--sn-web-color-feedback-danger, #d03050));
}

/* ── text column ────────────────────────────────────────────────────────── */

.sn-notification__main {
  flex: 1 1 auto;
  min-width: 0;
}

.sn-notification__header {
  font-size: 15px;
  font-weight: 600;
  color: var(--sn-web-color-text-primary, #1f2224);
}

.sn-notification__content {
  color: var(--sn-web-color-text-primary, #1f2224);
}

.sn-notification__description {
  color: var(--sn-web-color-text-secondary, #555a5f);
}

.sn-notification__meta {
  color: var(--sn-web-color-text-tertiary, #909699);
  font-size: 12px;
}

.sn-notification__footer {
  margin-top: 6px;
}

/* ── close button ───────────────────────────────────────────────────────── */

.sn-notification__close {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin: -4px -6px 0 8px;
  padding: 0;
  border: none;
  border-radius: var(--sn-web-button-radius, 4px);
  background: transparent;
  color: var(--sn-web-color-text-tertiary, #909699);
  font-size: var(--sn-web-icon-size-small, 14px);
  cursor: pointer;
  transition:
    color 0.2s ease,
    background-color 0.2s ease;
}

.sn-notification__close:hover {
  color: var(--sn-web-color-text-primary, #1f2224);
  background: var(--sn-web-color-background-subtle, rgba(0, 0, 0, 0.04));
}

.sn-notification__close:focus-visible {
  outline: 2px solid var(--sn-web-focus-ring, #4098fc);
  outline-offset: 2px;
}
</style>
