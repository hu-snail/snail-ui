<script setup lang="ts">
/**
 * SnTag — web-end compact label (AUI-WEB-DS-002).
 *
 * Reference library: naive-ui `n-tag`
 *   (https://www.naiveui.com/zh-CN/light/components/tag)
 * Per AGENTS.md §112, props + semantics mirror n-tag 1:1:
 *   type / size / round / closable / disabled / bordered / checkable /
 *   checked (v-model) / color (string | { color, borderColor, textColor }) /
 *   slots default / icon / avatar / close-icon / onClose.
 *
 * Registered AUI-additive capabilities (AGENTS.md §112.3a, absent upstream):
 *   - `loading` — inline spinner; blocks close + toggle while active
 *     (parity with arco-design `a-tag`, which n-tag lacks).
 *   - `shape` — special-shape variants `skew` / `ribbon` / `fold` / `ticket`;
 *     `round` stays as the legacy sugar for `shape: 'round'`. When both are
 *     given, `shape` wins.
 *
 * Documented divergences (not §112 violations):
 *   - A close click hides the tag internally before emitting `close`
 *     (naive-ui leaves removal to the consumer via onClose).
 *   - `size` has no `tiny` step.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnTag>默认</SnTag>
 *   <SnTag type="success" closable @close="remove">可关闭</SnTag>
 *   <SnTag checkable v-model:checked="on">可选中</SnTag>
 *   <SnTag shape="ticket" type="info">票券</SnTag>
 *   <SnTag loading>加载中</SnTag>
 */

import { computed, ref } from 'vue';
import { useLocale } from '../locales/use-locale';
import SnLoadingSpinner from '../loading/SnLoadingSpinner.vue';

defineOptions({ name: 'SnTag' });

/** Active locale (injected once at setup — inject() is setup-only). */
const locale = useLocale();

/** n-tag `color` object form — any field may be omitted. */
interface TagCustomColor {
  /** Background color (any CSS color value). */
  color?: string;
  /** Border color; overrides the type border. */
  borderColor?: string;
  /** Text color; overrides the auto contrast pick. */
  textColor?: string;
}

const props = withDefaults(
  defineProps<{
    /** Semantic type — drives colors. Mirrors n-tag `type`. */
    type?: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error';
    /** Tag scale. Mirrors n-tag `size`. */
    size?: 'small' | 'medium' | 'large';
    /**
     * Special-shape variant (AUI additive, §112.3a). `square` is the plain
     * rectangle; `round` is the capsule.
     */
    shape?: 'square' | 'round' | 'skew' | 'ribbon' | 'fold' | 'ticket';
    /** Pill-shaped corners. Mirrors n-tag `round`; sugar for `shape: 'round'`. */
    round?: boolean;
    /** Render the close button. Mirrors n-tag `closable`. */
    closable?: boolean;
    /** Inline spinner; blocks close + toggle while active (AUI additive). */
    loading?: boolean;
    /** Disabled interactions (no toggle, no close). Mirrors n-tag `disabled`. */
    disabled?: boolean;
    /** Draw the surrounding border. Mirrors n-tag `bordered`. */
    bordered?: boolean;
    /**
     * Custom colors. Mirrors n-tag `color`: a plain background string or a
     * `{ color, borderColor, textColor }` object. Text color is picked
     * automatically for contrast when `textColor` is not given.
     */
    color?: string | TagCustomColor | undefined;
    /** Click toggles the checked state. Mirrors n-tag `checkable`. */
    checkable?: boolean;
    /** Checked state (v-model:checked). Mirrors n-tag `checked`. */
    checked?: boolean;
  }>(),
  {
    type: 'default',
    size: 'medium',
    shape: 'square',
    round: false,
    closable: false,
    loading: false,
    disabled: false,
    bordered: true,
    color: undefined,
    checkable: false,
    checked: false,
  },
);

const emit = defineEmits<{
  /** Close button clicked; the tag hides itself afterwards. Mirrors n-tag `onClose`. */
  (e: 'close'): void;
  /** Checkable toggle — supports v-model:checked. Mirrors n-tag `on-update:checked`. */
  (e: 'update:checked', checked: boolean): void;
}>();

defineSlots<{
  /** Tag label. */
  default?(): unknown;
  /** Leading icon (replaced by the spinner while `loading`). Mirrors n-tag `icon`. */
  icon?(): unknown;
  /** Leading avatar, before the icon. Mirrors n-tag `avatar`. */
  avatar?(): unknown;
  /** Custom close glyph. Mirrors n-tag `close-icon`. */
  'close-icon'?(): unknown;
}>();

const visible = ref(true);

/** Effective shape: explicit `shape` wins over the `round` sugar. */
const effectiveShape = computed(() =>
  props.shape !== 'square' ? props.shape : props.round ? 'round' : 'square',
);

/**
 * WCAG relative luminance of a hex color, 0 (black) → 1 (white).
 * Returns `undefined` for non-hex values (then the on-primary token is used).
 */
function hexLuminance(hex: string): number | undefined {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (match === null || match[1] === undefined) return undefined;
  let digits = match[1];
  if (digits.length === 3) {
    digits = [...digits].map((c) => c + c).join('');
  }
  const channels = [0, 2, 4].map((offset) => {
    const raw = Number.parseInt(digits.slice(offset, offset + 2) ?? '0', 16) / 255;
    return raw <= 0.04045 ? raw / 12.92 : ((raw + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * (channels[0] ?? 0) + 0.7152 * (channels[1] ?? 0) + 0.0722 * (channels[2] ?? 0);
}

/**
 * Backgrounds lighter than this read better with dark text (naive-ui uses the
 * same heuristic in its theme internal `composite` helpers).
 */
const LIGHTNESS_THRESHOLD = 0.55;

/** Contrast text color for a custom background (no explicit `textColor`). */
function autoContrastText(background: string): string {
  const luminance = hexLuminance(background);
  if (luminance !== undefined && luminance > LIGHTNESS_THRESHOLD) {
    // Defined on `.sn-tag` as color-mix(black 88%) — stays readable on any
    // light custom background regardless of theme.
    return 'var(--sn-tag-contrast-text-dark)';
  }
  // #ffffff in both themes (tokens resolver) — safe on saturated/dark colors.
  return 'var(--sn-web-color-text-on-primary)';
}

/** n-tag `color` → inline style. */
const customColorStyle = computed<Record<string, string> | undefined>(() => {
  if (props.color === undefined) return undefined;
  // Checkable tags stay ghost while unchecked (n-tag semantics); the custom
  // color applies once checked.
  if (props.checkable && !props.checked) return undefined;
  const parts = typeof props.color === 'string' ? { color: props.color } : props.color;
  const style: Record<string, string> = {};
  if (parts.color !== undefined) {
    style.background = parts.color;
    style.color = parts.textColor ?? autoContrastText(parts.color);
  }
  if (parts.borderColor !== undefined) style.borderColor = parts.borderColor;
  return Object.keys(style).length > 0 ? style : undefined;
});

function handleCloseClick(event: MouseEvent): void {
  if (props.disabled || props.loading) return;
  // The close button must not trigger the checkable toggle bubbling on the root.
  event.stopPropagation();
  emit('close');
  visible.value = false;
}

function toggleChecked(): void {
  if (!props.checkable || props.disabled || props.loading) return;
  emit('update:checked', !props.checked);
}
</script>

<template>
  <div
    v-if="visible"
    data-snui-component="tag"
    class="sn-tag"
    :class="[
      `sn-tag--${type}`,
      `sn-tag--${size}`,
      effectiveShape !== 'square' ? `sn-tag--${effectiveShape}` : '',
      bordered ? 'sn-tag--bordered' : '',
      checkable ? 'sn-tag--checkable' : '',
      checked ? 'sn-tag--checked' : '',
      disabled ? 'sn-tag--disabled' : '',
      loading ? 'sn-tag--loading' : '',
    ]"
    :style="customColorStyle"
    :role="checkable ? 'button' : undefined"
    :aria-pressed="checkable ? checked : undefined"
    :aria-disabled="checkable && disabled ? 'true' : undefined"
    :aria-busy="loading ? 'true' : undefined"
    :tabindex="checkable && !disabled && !loading ? 0 : undefined"
    @click="toggleChecked"
    @keydown.enter.prevent="toggleChecked"
    @keydown.space.prevent="toggleChecked"
  >
    <span v-if="$slots.avatar" class="sn-tag__avatar">
      <slot name="avatar" />
    </span>
    <span v-if="loading || $slots.icon" class="sn-tag__icon">
      <SnLoadingSpinner v-if="loading" class="sn-tag__spinner" />
      <slot v-else name="icon" />
    </span>
    <span class="sn-tag__label"><slot /></span>
    <button
      v-if="closable"
      type="button"
      class="sn-tag__close"
      :aria-label="locale.Common.close"
      :disabled="disabled || loading"
      @click="handleCloseClick"
    >
      <slot name="close-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M18 6 6 18" />
          <path d="M6 6 18 18" />
        </svg>
      </slot>
    </button>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`).
 * `black` below is a mask/contrast constant, not a theme color (see
 * --sn-tag-contrast-text-dark). */

.sn-tag {
  /* Contrast text for light custom backgrounds (auto-picked in script). */
  --sn-tag-contrast-text-dark: color-mix(in srgb, black 88%, transparent);
  /* Ticket notch radius, scaled per size below. */
  --sn-tag-notch: 4px;

  position: relative;
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0 7px;
  border-radius: 3px;
  font-size: 14px;
  line-height: 1;
  color: var(--sn-web-color-text-secondary);
  background: var(--sn-web-color-background-subtle);
  white-space: nowrap;
  vertical-align: middle;
}

/* Named scale (reference heights: 22 / 28 / 34 px). */
.sn-tag--small {
  height: 22px;
  font-size: 12px;
}

.sn-tag--medium {
  height: 28px;
}

.sn-tag--large {
  height: 34px;
}

/* ---------- Type colors (tint = 12% type color on surface) ---------- */

.sn-tag--primary {
  background: color-mix(
    in srgb,
    var(--sn-web-color-action-primary) 12%,
    var(--sn-web-color-background-surface)
  );
  color: var(--sn-web-color-action-primary);
}

.sn-tag--info {
  background: color-mix(
    in srgb,
    var(--sn-web-color-feedback-info) 12%,
    var(--sn-web-color-background-surface)
  );
  color: var(--sn-web-color-feedback-info);
}

.sn-tag--success {
  background: color-mix(
    in srgb,
    var(--sn-web-color-feedback-success) 12%,
    var(--sn-web-color-background-surface)
  );
  color: var(--sn-web-color-feedback-success);
}

.sn-tag--warning {
  background: color-mix(
    in srgb,
    var(--sn-web-color-feedback-warning) 12%,
    var(--sn-web-color-background-surface)
  );
  color: var(--sn-web-color-feedback-warning);
}

.sn-tag--error {
  background: color-mix(
    in srgb,
    var(--sn-web-color-feedback-danger) 12%,
    var(--sn-web-color-background-surface)
  );
  color: var(--sn-web-color-feedback-danger);
}

/* ---------- Bordered (tinted with the type text color) ---------- */

.sn-tag--bordered {
  border: 1px solid var(--sn-web-color-border-default);
}

.sn-tag--bordered.sn-tag--primary,
.sn-tag--bordered.sn-tag--info,
.sn-tag--bordered.sn-tag--success,
.sn-tag--bordered.sn-tag--warning,
.sn-tag--bordered.sn-tag--error {
  border-color: color-mix(in srgb, currentColor 30%, transparent);
}

.sn-tag--round {
  border-radius: 9999px;
}

/* ---------- Special shapes (AUI additive, §112.3a) ---------- */

/* Parallelogram: skew the box, counter-skew every child so glyphs stay
 * upright. `> *` covers avatar / icon / label / close button. */
.sn-tag--skew {
  transform: skewX(-10deg);
}

.sn-tag--skew > * {
  transform: skewX(10deg);
}

/* Ribbon: the right end tapers into a point; extra right padding keeps the
 * label clear of the taper. */
.sn-tag--ribbon {
  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%);
  padding-right: calc(7px + 10px);
}

/* Fold: the top-right corner is clipped and a darker flap triangle suggests
 * the fold (page-curl tag). */
.sn-tag--fold {
  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
  padding-right: calc(7px + 6px);
}

.sn-tag--fold::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 8px;
  background: color-mix(in srgb, currentColor 30%, transparent);
  clip-path: polygon(0 0, 100% 100%, 0 100%);
}

/* Ticket: circular notches punched into both ends (coupon). Two radial
 * gradient mask layers — one per half — union into the full surface minus
 * the notches; the border is masked along, so the notch cuts through it. */
.sn-tag--ticket {
  padding-left: calc(7px + 4px);
  padding-right: calc(7px + 4px);
  -webkit-mask:
    radial-gradient(
        circle var(--sn-tag-notch) at 0 50%,
        transparent calc(var(--sn-tag-notch) - 0.5px),
        black var(--sn-tag-notch)
      )
      left / calc(50% + 8px) 100% no-repeat,
    radial-gradient(
        circle var(--sn-tag-notch) at 100% 50%,
        transparent calc(var(--sn-tag-notch) - 0.5px),
        black var(--sn-tag-notch)
      )
      right / calc(50% + 8px) 100% no-repeat;
  mask:
    radial-gradient(
        circle var(--sn-tag-notch) at 0 50%,
        transparent calc(var(--sn-tag-notch) - 0.5px),
        black var(--sn-tag-notch)
      )
      left / calc(50% + 8px) 100% no-repeat,
    radial-gradient(
        circle var(--sn-tag-notch) at 100% 50%,
        transparent calc(var(--sn-tag-notch) - 0.5px),
        black var(--sn-tag-notch)
      )
      right / calc(50% + 8px) 100% no-repeat;
}

.sn-tag--small.sn-tag--ticket {
  --sn-tag-notch: 3px;
}

.sn-tag--large.sn-tag--ticket {
  --sn-tag-notch: 5px;
}

/* ---------- Checkable ---------- */

.sn-tag--checkable {
  cursor: pointer;
  background: transparent;
}

.sn-tag--checkable:hover:not(.sn-tag--disabled):not(.sn-tag--checked) {
  background: var(--sn-web-color-background-subtle);
}

/* Checked state takes the type color (n-tag semantics) instead of a fixed
 * primary; `default` and `primary` both map to the action primary. */
.sn-tag--checked.sn-tag--default,
.sn-tag--checked.sn-tag--primary {
  background: var(--sn-web-color-action-primary);
  color: var(--sn-web-color-text-on-primary);
}

.sn-tag--checked.sn-tag--info {
  background: var(--sn-web-color-feedback-info);
  color: var(--sn-web-color-text-on-primary);
}

.sn-tag--checked.sn-tag--success {
  background: var(--sn-web-color-feedback-success);
  color: var(--sn-web-color-text-on-primary);
}

.sn-tag--checked.sn-tag--warning {
  background: var(--sn-web-color-feedback-warning);
  color: var(--sn-web-color-text-on-primary);
}

.sn-tag--checked.sn-tag--error {
  background: var(--sn-web-color-feedback-danger);
  color: var(--sn-web-color-text-on-primary);
}

.sn-tag--bordered.sn-tag--checked {
  border-color: transparent;
}

/* ---------- Disabled ---------- */

.sn-tag--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ---------- Loading ---------- */

.sn-tag--loading {
  cursor: progress;
}

.sn-tag__icon {
  display: inline-flex;
  align-items: center;
  margin-right: 4px;
}

.sn-tag__icon :deep(svg),
.sn-tag__spinner {
  width: 14px;
  height: 14px;
}

.sn-tag--small .sn-tag__icon :deep(svg),
.sn-tag--small .sn-tag__spinner {
  width: 12px;
  height: 12px;
}

.sn-tag__avatar {
  display: inline-flex;
  align-items: center;
  margin-right: 6px;
}

/* ---------- Label ---------- */

.sn-tag__label {
  display: inline-flex;
  align-items: center;
}

/* ---------- Close button ---------- */

.sn-tag__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-left: 4px;
  padding: 0;
  border: none;
  border-radius: 3px;
  font: inherit;
  color: inherit;
  background: transparent;
  cursor: pointer;
  opacity: 0.6;
}

.sn-tag__close:hover {
  opacity: 1;
}

.sn-tag__close svg {
  width: 14px;
  height: 14px;
}

.sn-tag--small .sn-tag__close {
  width: 16px;
  height: 16px;
}

.sn-tag--small .sn-tag__close svg {
  width: 12px;
  height: 12px;
}

.sn-tag--disabled .sn-tag__close,
.sn-tag--loading .sn-tag__close {
  cursor: not-allowed;
}
</style>
