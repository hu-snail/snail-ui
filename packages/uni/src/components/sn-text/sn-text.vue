<script setup lang="ts">
/**
 * sn-text (uni-end) — semantic text with mode-based formatting.
 *
 * Reference library: wot-ui `wd-text`
 *   (https://wot-ui.cn/component/text.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-text 1:1:
 *   type / text / size / mode / decoration / call / bold / format / color /
 *   prefix / suffix / lines / line-height / custom-class / custom-style.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * ## Why the mode transformations live in the component
 *
 * `mode` is a *display* transform, not business logic (§32): it turns a raw
 * value into the string a user should read — a masked phone number, a grouped
 * price, a normalised date. Keeping it here means a schema author writes
 * `mode="price"` instead of shipping a formatter into the binding layer.
 *
 * Masking is deliberately lossy-by-design and never leaks the raw value into
 * the DOM: `format` replaces the hidden run with `*` before rendering, so an
 * inspection tool or a copy/paste cannot recover it (§66).
 *
 * ## Why `call` needs a runtime guard
 *
 * `call` only makes sense on a real device, and the uni-app runtime global is
 * not part of this package's type surface (no `@dcloudio/types` dependency).
 * The handler therefore feature-detects `makePhoneCall` instead of assuming
 * it — on H5 / SSR / a test the prop degrades to a plain `click` emit rather
 * than throwing (§84 / §85).
 *
 * Per Spec-02 v1.1 §3 (end: mp), uni-side component CSS uses only
 * `--sn-mp-*` aliases (rpx units). The `end: mp` marker in ai-description.md
 * is consumed by `@snui/cli` and MCP tools for per-end filtering.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-text/sn-text.vue
 * → auto-registered as `<sn-text>` in any .vue that uses it.
 *
 * Usage:
 *   <sn-text text="普通文本" />
 *   <sn-text text="主要" type="primary" bold />
 *   <sn-text text="13800138000" mode="phone" format />
 *   <sn-text text="1288.5" mode="price" prefix="¥" />
 *   <sn-text text="很长的一段话…" :lines="2" />
 *
 * Not responsible for:
 *   - 标题层级 / 富文本渲染 — 用 sn-title / 业务富文本组件
 *   - 链接跳转 — 由外层元素承载
 */

import { computed } from 'vue';

defineOptions({ name: 'SnText' });

/** Text processing modes. Mirrors `wd-text` `mode`. */
type TextMode = 'text' | 'date' | 'phone' | 'name' | 'price';

/** Text decoration. Mirrors `wd-text` `decoration`. */
type TextDecoration = 'none' | 'underline' | 'line-through' | 'overline';

/** Minimal shape of the uni-app runtime global used by the `call` prop. */
interface UniRuntime {
  makePhoneCall?: (options: { phoneNumber: string }) => void;
}

/**
 * Read the uni-app runtime global without assuming it exists.
 *
 * Typed as an optional-shaped record rather than `any`: the only member this
 * component touches is `makePhoneCall`, so that is the whole contract.
 */
function readUniRuntime(): UniRuntime | undefined {
  return (globalThis as { uni?: UniRuntime }).uni;
}

// Reference: wot-ui wd-text Attributes
//   (https://wot-ui.cn/component/text.html)
// All prop names match wd-text 1:1.
const props = withDefaults(
  defineProps<{
    /** 主题类型：default / primary / success / warning / error。 */
    type?: 'default' | 'primary' | 'success' | 'warning' | 'error';
    /** 文本内容（`default` slot 优先）。 */
    text?: string | number;
    /** 字体大小（原样转发，可写 `28rpx` / `14px`）。 */
    size?: string;
    /** 文本处理模式：text / date / phone / name / price。 */
    mode?: TextMode;
    /** 文本装饰：none / underline / line-through / overline。 */
    decoration?: TextDecoration;
    /** `mode="phone"` 时点击文本是否拨号。 */
    call?: boolean;
    /** 是否粗体。 */
    bold?: boolean;
    /** 是否脱敏，仅在 `mode` 为 phone / name 时生效。 */
    format?: boolean;
    /** 文本颜色（内联覆盖 `type`）。 */
    color?: string;
    /** 前缀内容（`prefix` slot 优先）。 */
    prefix?: string;
    /** 后缀内容（`suffix` slot 优先）。 */
    suffix?: string;
    /** 展示行数，超出后显示省略号。 */
    lines?: number;
    /** 文本行高（原样转发）。 */
    lineHeight?: string;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义 inline style。 */
    customStyle?: string;
  }>(),
  {
    type: 'default',
    text: '',
    size: '',
    mode: 'text',
    decoration: 'none',
    call: false,
    bold: false,
    format: false,
    color: '',
    prefix: '',
    suffix: '',
    lines: 0,
    lineHeight: '',
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  /** 点击文本时触发。 */
  (e: 'click', event: Event): void;
}>();

defineSlots<{
  /** 文本内容（优先于 `text` prop）。 */
  default?(): unknown;
  /** 前缀内容（优先于 `prefix` prop）。 */
  prefix?(): unknown;
  /** 后缀内容（优先于 `suffix` prop）。 */
  suffix?(): unknown;
}>();

/** Keep the first 3 and last 4 digits; the middle run becomes `*`. */
function maskPhone(raw: string): string {
  const digits = raw.replace(/\s/g, '');
  if (digits.length < 8) return digits;
  const head = digits.slice(0, 3);
  const tail = digits.slice(-4);
  return `${head}${'*'.repeat(digits.length - 7)}${tail}`;
}

/** Keep the first character; the rest becomes `*`. */
function maskName(raw: string): string {
  const chars = Array.from(raw.trim());
  if (chars.length <= 1) return chars.join('');
  return `${chars[0]}${'*'.repeat(chars.length - 1)}`;
}

/** Group the integer part with thousands separators, keep 2 decimals. */
function formatPrice(raw: string): string {
  const value = Number(raw.replace(/[^\d.-]/g, ''));
  if (!Number.isFinite(value)) return raw;
  const [intPart = '0', decPart = '00'] = Math.abs(value).toFixed(2).split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${value < 0 ? '-' : ''}${grouped}.${decPart}`;
}

/** Normalise to `YYYY-MM-DD`; unparsable input passes through untouched. */
function formatDate(raw: string): string {
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** The display string after `mode` + `format` are applied. */
const displayText = computed<string>(() => {
  const raw = String(props.text ?? '');
  if (!raw) return '';
  switch (props.mode) {
    case 'phone':
      return props.format ? maskPhone(raw) : raw;
    case 'name':
      return props.format ? maskName(raw) : raw;
    case 'price':
      return formatPrice(raw);
    case 'date':
      return formatDate(raw);
    default:
      return raw;
  }
});

/** True when a tap should dial — phone mode, `call` on, digits available. */
const canCall = computed<boolean>(
  () => props.mode === 'phone' && props.call && displayText.value.length > 0,
);

const rootClass = computed(() => [
  'sn-text',
  `sn-text--${props.type}`,
  `sn-text--decoration-${props.decoration}`,
  {
    'sn-text--bold': props.bold,
    'sn-text--clamped': props.lines > 0,
    'sn-text--call': canCall.value,
  },
  props.customClass,
]);

const rootStyle = computed(() => {
  const parts: string[] = [];
  if (props.size) parts.push(`font-size: ${props.size}`);
  if (props.lineHeight) parts.push(`line-height: ${props.lineHeight}`);
  if (props.color) parts.push(`color: ${props.color}`);
  if (props.lines > 0) parts.push(`-webkit-line-clamp: ${props.lines}`);
  if (props.customStyle) parts.push(props.customStyle);
  return parts.length > 0 ? parts.join('; ') : undefined;
});

function onTap(event: Event): void {
  const runtime = readUniRuntime();
  if (canCall.value && runtime?.makePhoneCall) {
    runtime.makePhoneCall({ phoneNumber: String(props.text ?? '').replace(/\s/g, '') });
  }
  emit('click', event);
}
</script>

<template>
  <view
    data-snui-component="text"
    :class="rootClass"
    :style="rootStyle"
    :role="canCall ? 'link' : undefined"
    @tap="onTap"
  >
    <slot name="prefix">
      <text v-if="prefix" class="sn-text__affix">{{ prefix }}</text>
    </slot>
    <slot>
      <text class="sn-text__body">{{ displayText }}</text>
    </slot>
    <slot name="suffix">
      <text v-if="suffix" class="sn-text__affix">{{ suffix }}</text>
    </slot>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-text {
  display: inline;
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-normal);
  color: var(--sn-mp-color-text-primary);
  word-break: break-word;
}

/* ── Types ─────────────────────────────────────────────────────────────── */

.sn-text--default {
  color: var(--sn-mp-color-text-primary);
}

.sn-text--primary {
  color: var(--sn-mp-color-action-primary);
}

.sn-text--success {
  color: var(--sn-mp-color-feedback-success);
}

.sn-text--warning {
  color: var(--sn-mp-color-feedback-warning);
}

.sn-text--error {
  color: var(--sn-mp-color-feedback-danger);
}

/* ── Decorations ───────────────────────────────────────────────────────── */

.sn-text--decoration-underline {
  text-decoration: underline;
}

.sn-text--decoration-line-through {
  text-decoration: line-through;
}

.sn-text--decoration-overline {
  text-decoration: overline;
}

/* ── Emphasis ──────────────────────────────────────────────────────────── */

.sn-text--bold {
  font-weight: var(--sn-mp-font-weight-bold);
}

/* ── Truncation ────────────────────────────────────────────────────────── */

/*
 * `lines > 0` clamps the text. The inline `-webkit-line-clamp` carries the
 * count (it is per-instance), while the box model needed for the clamp lives
 * here — without `display: -webkit-box` the clamp property is inert.
 */
.sn-text--clamped {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  word-break: break-all;
}

/* ── Parts ─────────────────────────────────────────────────────────────── */

.sn-text__body {
  color: inherit;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  text-decoration: inherit;
}

.sn-text__affix {
  color: inherit;
  font-size: inherit;
  line-height: inherit;
}

/* A dialable phone number reads as a link: the platform underline + colour
   are already covered by `type`, this only adds the affordance. */
.sn-text--call {
  cursor: pointer;
}

/* ── Doodle skin ───────────────────────────────────────────────────────── */

.snui-skin-doodle .sn-text--primary,
.snui-skin-doodle .sn-text--success,
.snui-skin-doodle .sn-text--warning,
.snui-skin-doodle .sn-text--error {
  font-weight: var(--sn-mp-font-weight-bold);
  text-decoration: underline;
}
</style>
