<script setup lang="ts">
/**
 * SnAlert — inline feedback banner (AUI-WEB-FB-008).
 *
 * Reference library: naive-ui `n-alert`
 *   (https://www.naiveui.com/zh-CN/light/components/alert)
 * Per AGENTS.md §112, props + semantics mirror n-alert 1:1.
 *
 * 1:1 parity (this version): title / showIcon / type / bordered /
 *   closable / onClose / onAfterLeave / onAfterHide (deprecated).
 *   Slots: default / icon / header.
 *
 * Close semantics mirror n-alert exactly: `onClose` may return a Promise;
 * the alert unmounts only when the resolved value is not `false`, which
 * lets callers veto the dismissal (e.g. keep the alert while a save is
 * in flight).
 *
 * Divergence from n-alert (documented, not a §112 violation):
 *   - n-alert wraps its body in `NFadeInExpandTransition` (a height
 *     collapse animation) and mounts the real node only when visible.
 *     This version keeps the same `visible` gate + `onAfterLeave` timing
 *     but uses a CSS transition instead of the internal transition
 *     component, so no internal naive-ui module is imported.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnAlert type="warning" title="注意">
 *     磁盘剩余空间不足 10%。
 *   </SnAlert>
 */

import { computed, ref } from 'vue';
import { useLocale } from '../locales/use-locale';
import { AlertTriangle, Check, CircleAlert, Info, X } from 'lucide-vue-next';
import SnIcon from '../icon/SnIcon.vue';

defineOptions({ name: 'SnAlert' });

/** Active locale (injected once at setup — inject() is setup-only). */
const locale = useLocale();

const props = withDefaults(
  defineProps<{
    /** Alert heading. Mirrors n-alert `title`. */
    title?: string;
    /** Show the leading type icon. Mirrors n-alert `showIcon` (default true). */
    showIcon?: boolean;
    /** Semantic type — drives color + default icon. Mirrors n-alert `type`. */
    type?: 'info' | 'warning' | 'error' | 'success' | 'default';
    /** Draw the surrounding border. Mirrors n-alert `bordered` (default true). */
    bordered?: boolean;
    /** Render the close button. Mirrors n-alert `closable`. */
    closable?: boolean;
    /** Called on close click. Return `false` (or a Promise of `false`) to
     * veto the dismissal. Mirrors n-alert `onClose`. */
    onClose?: () => unknown;
    /** Called after the leave transition finishes. Mirrors n-alert
     * `onAfterLeave`. */
    onAfterLeave?: () => void;
    /** @deprecated Use `onAfterLeave` instead. Mirrors n-alert `onAfterHide`. */
    onAfterHide?: () => void;
  }>(),
  {
    title: '',
    showIcon: true,
    type: 'default',
    bordered: true,
    closable: false,
    // Callback props have no default: leaving them undefined is the
    // intended behaviour. `exactOptionalPropertyTypes` rejects an explicit
    // `undefined` here, so cast the sentinel (same pattern as SnSteps).
    onClose: undefined as any,
    onAfterLeave: undefined as any,
    onAfterHide: undefined as any,
  },
);

const emit = defineEmits<{
  /**
   * Close button clicked (fires before the veto check resolves).
   *
   * Named `closeClick` rather than `close` on purpose: Vue maps an
   * emitted `close` event onto an `onClose` prop listener, which would
   * invoke the §112-mandated `onClose` callback a second time (once via
   * that mapping, once via our explicit `props.onClose()` call). Keeping
   * the event name distinct makes the callback fire exactly once.
   */
  (e: 'closeClick'): void;
  /** Leave transition finished — the alert has been removed.
   * Named `leave` (not `afterLeave`) so Vue does not additionally map it
   * onto the `onAfterLeave` prop listener. */
  (e: 'leave'): void;
}>();

defineSlots<{
  /** Alert body content. */
  default?(): unknown;
  /** Custom icon — replaces the built-in per-type icon. */
  icon?(): unknown;
  /** Custom header — replaces the `title` prop. */
  header?(): unknown;
}>();

/** Visibility gate. Flipped to false once a close is not vetoed. */
const visible = ref(true);

/** Per-type lucide icon. `default` has no icon (mirrors n-alert). */
const iconComponent = computed(() => {
  switch (props.type) {
    case 'success':
      return Check;
    case 'info':
      return Info;
    case 'warning':
      return AlertTriangle;
    case 'error':
      return CircleAlert;
    default:
      return null;
  }
});

async function handleCloseClick() {
  emit('closeClick');
  // Mirror n-alert: a `false` result from onClose vetoes the dismissal.
  const result = await Promise.resolve(props.onClose?.());
  if (result === false) return;
  visible.value = false;
}

function handleAfterLeave() {
  props.onAfterLeave?.();
  props.onAfterHide?.(); // deprecated alias
  emit('leave');
}
</script>

<template>
  <Transition name="sn-alert-fade" @after-leave="handleAfterLeave">
    <div
      v-if="visible"
      role="alert"
      data-snui-component="alert"
      class="sn-alert"
      :class="[
        `sn-alert--${type}`,
        bordered ? 'sn-alert--bordered' : '',
        closable ? 'sn-alert--closable' : '',
        showIcon ? 'sn-alert--show-icon' : '',
      ]"
    >
      <div v-if="bordered" class="sn-alert__border" />

      <!--
        The column only renders when it actually holds a glyph. An empty
        `showIcon` column (type="default" with no `icon` slot) still carried
        its 8px right margin, indenting the body for nothing.
      -->
      <div
        v-if="showIcon && (iconComponent || $slots.icon)"
        class="sn-alert__icon"
        aria-hidden="true"
      >
        <slot name="icon">
          <SnIcon v-if="iconComponent" :icon="iconComponent" />
        </slot>
      </div>

      <div class="sn-alert-body" :class="bordered ? 'sn-alert-body--bordered' : ''">
        <div v-if="$slots.header || title" class="sn-alert-body__title">
          <slot name="header">{{ title }}</slot>
        </div>
        <div v-if="$slots.default" class="sn-alert-body__content">
          <slot />
        </div>
      </div>

      <button
        v-if="closable"
        type="button"
        class="sn-alert__close"
        :aria-label="locale.Common.close"
        @click="handleCloseClick"
      >
        <SnIcon :icon="X" />
      </button>
    </div>
  </Transition>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-alert {
  position: relative;
  display: flex;
  /* The icon and the close button align to the *first text line*, not to the
    * middle of a multi-line banner — `stretch` used to grow both columns to the
    * full height and leave their glyphs pinned at the top. */
  align-items: flex-start;
  box-sizing: border-box;
  width: 100%;
  padding: 8px 12px;
  border-radius: 3px;
  /* Neutral text by default: the semantic type colour is reserved for the icon
    * and the border, so the copy inside a tinted banner stays crisp. */
  color: var(--sn-web-color-text-primary);
  font-size: 14px;
  line-height: 1.6;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

/* ---------- Fade transition (mirrors n-alert's leave behaviour) ---------- */

.sn-alert-fade-enter-active,
.sn-alert-fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.sn-alert-fade-enter-from,
.sn-alert-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ---------- Type colors ---------- */

/* Each type exposes its hue as `--sn-alert-accent`; only the icon and the
  * border consume it. Painting the whole banner (title + body) in the type
  * colour made the copy low-contrast against its own tint. */
.sn-alert--default {
  background: var(--sn-web-color-background-subtle);
  color: var(--sn-web-color-text-primary);
}

.sn-alert--info {
  --sn-alert-accent: var(--sn-web-color-feedback-info);
  background: color-mix(
    in srgb,
    var(--sn-web-color-feedback-info) 12%,
    var(--sn-web-color-background-surface)
  );
}

.sn-alert--success {
  --sn-alert-accent: var(--sn-web-color-feedback-success);
  background: color-mix(
    in srgb,
    var(--sn-web-color-feedback-success) 12%,
    var(--sn-web-color-background-surface)
  );
}

.sn-alert--warning {
  --sn-alert-accent: var(--sn-web-color-feedback-warning);
  background: color-mix(
    in srgb,
    var(--sn-web-color-feedback-warning) 12%,
    var(--sn-web-color-background-surface)
  );
}

.sn-alert--error {
  --sn-alert-accent: var(--sn-web-color-feedback-danger);
  background: color-mix(
    in srgb,
    var(--sn-web-color-feedback-danger) 12%,
    var(--sn-web-color-background-surface)
  );
}

/* ---------- Border overlay ---------- */

/* ---------- Border overlay ---------- */

/* The hairline lives on an overlay layer with its own `color`, so it takes the
  * type hue without tinting the copy inside. */
.sn-alert__border {
  position: absolute;
  inset: 0;
  border: 1px solid var(--sn-alert-accent, currentColor);
  border-radius: inherit;
  opacity: 0.2;
  pointer-events: none;
}

.sn-alert--default .sn-alert__border {
  color: var(--sn-web-color-border-default);
  opacity: 1;
}

/* ---------- Icon ---------- */

/* `height: 1.6em` is exactly the first text line box (`font-size` 14px ×
 * `line-height` 1.6 above), so centering the glyph in it puts the icon on the
 * title's optical center. Both values are em-relative to `.sn-alert`, so a
 * consumer overriding `font-size` keeps them in step. */
/* `height: 1.6em` is exactly the first text line box (`font-size` 14px ×
  * `line-height` 1.6 above), so centering the glyph in it puts the icon on the
  * title's optical center. Both values are em-relative to `.sn-alert`, so a
  * consumer overriding `font-size` keeps them in step.
  *
  * The glyph is the one element allowed to carry the semantic type colour. */
.sn-alert__icon {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 1.6em;
  margin-right: 8px;
  color: var(--sn-alert-accent, currentColor);
}

/* SnIcon sizes its wrapper at `1em` of the ambient font (14px here) while the
 * glyph it forwards is 16px, so the wrapper used to squash the svg to 14×16.
 * Let the glyph define the box, and keep flex from shrinking it. */
.sn-alert__icon :deep(.sn-icon),
.sn-alert__close :deep(.sn-icon) {
  width: auto;
  height: auto;
}

.sn-alert__icon :deep(svg),
.sn-alert__close :deep(svg) {
  display: block;
  flex: none;
}

.sn-alert__close {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 1.6em;
  margin-left: 8px;
  padding: 0;
  border: none;
  /* `<button>` does not inherit font metrics by default; without this the
   * `1.6em` above resolves against the UA's 13.33px instead of our 14px. */
  font: inherit;
  background: transparent;
  color: inherit;
  opacity: 0.6;
  cursor: pointer;
}

.sn-alert__close:hover {
  opacity: 1;
}

.sn-alert__close:focus-visible {
  outline: 2px solid var(--sn-web-focus-ring);
  outline-offset: 2px;
  border-radius: 2px;
}

/* ---------- Body ---------- */

.sn-alert-body {
  flex: 1;
  min-width: 0;
}

.sn-alert-body__title {
  font-weight: 600;
}

/* The gap belongs to the title/content *pair*. As a `margin-bottom` on the
  * title it also padded a title-only banner, so the title sat 2px above the
  * vertical center of its own box.
  *
  * The pair also drops the body to the secondary text colour: the semantic type
  * colour paints only the icon and the border, so the copy stays crisp. */
.sn-alert-body__title + .sn-alert-body__content {
  margin-top: 2px;
  color: var(--sn-web-color-text-secondary);
}

/* A title-less banner *is* the message, so it keeps the primary text colour. */
.sn-alert-body__content {
  color: var(--sn-web-color-text-primary);
}
</style>
