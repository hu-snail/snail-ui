<script setup lang="ts">
/**
 * SnTag — web-end compact label (AUI-WEB-DS-002).
 *
 * Reference library: naive-ui `n-tag`
 *   (https://www.naiveui.com/zh-CN/light/components/tag)
 * Per AGENTS.md §112, props + semantics mirror n-tag 1:1:
 *   type / size / round / closable / disabled / bordered / checkable /
 *   checked (v-model) / onClose.
 *
 * Documented divergences (not §112 violations):
 *   - `color` is a plain background color string per the component task
 *     spec; naive-ui takes a { color, borderColor, textColor } object.
 *   - A close click hides the tag internally before emitting `close`
 *     (naive-ui leaves removal to the consumer via onClose).
 *   - `size` has no `tiny` step; slots `avatar` / `close-icon` and the
 *     internal close-focus props are not implemented.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnTag>默认</SnTag>
 *   <SnTag type="success" closable @close="remove">可关闭</SnTag>
 *   <SnTag checkable v-model:checked="on">可选中</SnTag>
 */

import { ref } from 'vue';
import { useLocale } from '../locales/use-locale';

defineOptions({ name: 'SnTag' });

/** Active locale (injected once at setup — inject() is setup-only). */
const locale = useLocale();

const props = withDefaults(
  defineProps<{
    /** Semantic type — drives colors. Mirrors n-tag `type`. */
    type?: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error';
    /** Tag scale. Mirrors n-tag `size`. */
    size?: 'small' | 'medium' | 'large';
    /** Pill-shaped corners. Mirrors n-tag `round`. */
    round?: boolean;
    /** Render the close button. Mirrors n-tag `closable`. */
    closable?: boolean;
    /** Disabled interactions (no toggle, no close). Mirrors n-tag `disabled`. */
    disabled?: boolean;
    /** Draw the surrounding border. Mirrors n-tag `bordered`. */
    bordered?: boolean;
    /** Custom background color (any CSS color value); overrides the type background. */
    color?: string | undefined;
    /** Click toggles the checked state. Mirrors n-tag `checkable`. */
    checkable?: boolean;
    /** Checked state (v-model:checked). Mirrors n-tag `checked`. */
    checked?: boolean;
  }>(),
  {
    type: 'default',
    size: 'medium',
    round: false,
    closable: false,
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
}>();

const visible = ref(true);

function handleCloseClick(event: MouseEvent): void {
  if (props.disabled) return;
  // The close button must not trigger the checkable toggle bubbling on the root.
  event.stopPropagation();
  emit('close');
  visible.value = false;
}

function toggleChecked(): void {
  if (!props.checkable || props.disabled) return;
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
      bordered ? 'sn-tag--bordered' : '',
      round ? 'sn-tag--round' : '',
      checkable ? 'sn-tag--checkable' : '',
      checked ? 'sn-tag--checked' : '',
      disabled ? 'sn-tag--disabled' : '',
    ]"
    :style="color ? { background: color } : undefined"
    :role="checkable ? 'button' : undefined"
    :aria-pressed="checkable ? checked : undefined"
    :aria-disabled="checkable && disabled ? 'true' : undefined"
    :tabindex="checkable && !disabled ? 0 : undefined"
    @click="toggleChecked"
    @keydown.enter.prevent="toggleChecked"
    @keydown.space.prevent="toggleChecked"
  >
    <slot />
    <button
      v-if="closable"
      type="button"
      class="sn-tag__close"
      :aria-label="locale.Common.close"
      :disabled="disabled"
      @click="handleCloseClick"
    >
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
    </button>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-tag {
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

/* ---------- Checkable ---------- */

.sn-tag--checkable {
  cursor: pointer;
  background: transparent;
}

.sn-tag--checkable:hover:not(.sn-tag--disabled):not(.sn-tag--checked) {
  background: var(--sn-web-color-background-subtle);
}

.sn-tag--checked {
  background: var(--sn-web-color-action-primary);
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

.sn-tag--disabled .sn-tag__close {
  cursor: not-allowed;
}
</style>
