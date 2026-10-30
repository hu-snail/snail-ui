<script setup lang="ts">
/**
 * sn-tag (uni-end) — compact label / chip for mobile / miniprogram.
 *
 * Reference library: wot-ui `wd-tag`
 *   (https://wot-ui.cn/component/tag.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-tag 1:1:
 *   size / type / icon / icon-prefix / css-icon / closable / dynamic / color /
 *   bg-color / round / mark / variant / custom-class / custom-style.
 *
 * Registered AUI-additive capabilities (AGENTS.md §112.3a, absent upstream):
 *   - `shape` — special-shape variants `skew` / `ribbon` / `fold` / `ticket`;
 *     `round` stays as the legacy sugar for `shape: 'round'`. When both are
 *     given, `shape` wins (same semantics as the web-end SnTag).
 *   - `iconUrl` — bitmap icon rendered as `<image>`, sized by the
 *     `--sn-mp-icon-size-*` tiers; wins over `icon`, loses to the icon slot.
 *   - `icon` also accepts an inline `IconData` object (the same dual track as
 *     sn-button: string = registry / built-in catalog name, object = direct
 *     SVG data).
 *
 * ## Why `icon` resolves through the sn-icon chain
 *
 * The web end accepts an icon component; the uni end has no first-class
 * tree-shakable icon component library (see sn-icon.vue header). A tag icon is
 * therefore given as a *name* and resolved sync (registry → built-in catalog)
 * — the same contract sn-button already uses. `iconPrefix` + `cssIcon` cover
 * the other upstream idiom: an iconfont class pair, rendered as
 * `<text class="prefix-name">` (font icons work in miniprogram WXSS). When
 * `cssIcon` is on, the string name goes to the glyph path only — the SVG
 * chain is skipped so iconfont users never collide with catalog names.
 *
 * ## Why the label is wrapped in `<text>`
 *
 * App-side (uni-app x) text does not inherit container styles (§116.2), and
 * the skew shape needs a stable element to counter-skew so glyphs stay
 * upright. The wrapper carries `color/font-size: inherit` and the
 * `sn-tag__upright` modifier; the close / icon / image parts get the same
 * modifier when the tag is skewed.
 *
 * Per Spec-02 v1.1 §3 (end: mp), uni-side component CSS uses only
 * `--sn-mp-*` aliases (rpx units). The `end: mp` marker in ai-description.md
 * is consumed by `@snui/cli` and MCP tools for per-end filtering.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-tag/sn-tag.vue
 * → auto-registered as `<sn-tag>` in any .vue that uses it.
 *
 * Usage:
 *   <sn-tag>默认</sn-tag>
 *   <sn-tag type="primary" variant="light" closable @close="remove">标签</sn-tag>
 *   <sn-tag type="success" round mark>圆角标记</sn-tag>
 *   <sn-tag shape="ticket" type="warning">优惠券</sn-tag>
 *   <sn-tag icon-url="https://cdn.example.com/logo.png">品牌</sn-tag>
 *   <sn-tag dynamic @confirm="add" />
 *
 * Not responsible for:
 *   - 选择 / 复选语义 — 用 sn-checkbox / sn-radio
 *   - 徽标计数 — 用 sn-badge
 *   - 长文本排版 — 用 sn-text
 */

import { computed, markRaw, ref } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import type { IconData } from '../sn-icon/sn-icon.vue';
import { resolveSnIconStringSync } from '../sn-icon/sn-icon-providers';
import { X } from '../sn-icon/sn-icon-set';

defineOptions({ name: 'SnTag' });

// Reference: wot-ui wd-tag Attributes
//   (https://wot-ui.cn/component/tag.html)
// All prop names match wd-tag 1:1; `shape` / `iconUrl` are AUI additive.
const props = withDefaults(
  defineProps<{
    /** 标签尺寸，可选值为 small、medium、large、extra-large、default。 */
    size?: 'small' | 'medium' | 'large' | 'extra-large' | 'default';
    /**
     * 标签类型（语义色）。
     * default / primary / success / warning / danger / volcano / lightblue /
     * cyan / pink / purple。
     */
    type?:
      | 'default'
      | 'primary'
      | 'success'
      | 'warning'
      | 'danger'
      | 'volcano'
      | 'lightblue'
      | 'cyan'
      | 'pink'
      | 'purple';
    /**
     * 左侧图标：字符串 = 经内置解析链（`registerSnIcons()` 注册表 → 内置
     * 目录）解析的图标名；`IconData` 对象 = 直接渲染的 SVG 数据。`cssIcon`
     * 开启时字符串走字体图标路径，不再进入 SVG 解析链。
     */
    icon?: string | IconData;
    /**
     * 图片图标 URL（AUI additive）：渲染为 `<image>`，尺寸与图标档位
     * token 对齐。优先级低于 `icon` 插槽、高于 `icon`。
     */
    iconUrl?: string;
    /** 图标类名前缀，`cssIcon` 打开时用于拼出字体图标 class。 */
    iconPrefix?: string;
    /** CSS（字体）图标：`true` 用 `iconPrefix`，字符串则直接作为 class 前缀。 */
    cssIcon?: boolean | string;
    /**
     * 异形形态（AUI additive，§112.3a）：square 直角矩形、skew 平行四边形、
     * ribbon 右端旗标、fold 右上折角、ticket 两侧票券缺口、round 胶囊。
     * 非 square 时优先于 `round` sugar。
     */
    shape?: 'square' | 'round' | 'skew' | 'ribbon' | 'fold' | 'ticket';
    /** 是否可关闭（渲染关闭按钮，点击 emit `close`）。 */
    closable?: boolean;
    /** 是否为新增标签（渲染输入框，确认后 emit `confirm`）。 */
    dynamic?: boolean;
    /** 文字颜色（内联覆盖）。 */
    color?: string;
    /** 背景色和边框色（内联覆盖）。 */
    bgColor?: string;
    /** 是否圆角（胶囊形）。等价于 `shape: 'round'` 的 sugar，`shape` 优先。 */
    round?: boolean;
    /** 是否标记样式（左上 / 右下不对称圆角）。 */
    mark?: boolean;
    /** 标签变体：light / dark / plain / dashed / text。 */
    variant?: 'light' | 'dark' | 'plain' | 'dashed' | 'text';
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义 inline style。 */
    customStyle?: string;
  }>(),
  {
    size: 'default',
    type: 'default',
    icon: '',
    iconUrl: '',
    iconPrefix: '',
    cssIcon: false,
    shape: 'square',
    closable: false,
    dynamic: false,
    color: '',
    bgColor: '',
    round: false,
    mark: false,
    variant: 'dark',
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  /** 点击标签时触发。 */
  (e: 'click', event: Event): void;
  /** 点击关闭按钮时触发。 */
  (e: 'close', event: Event): void;
  /** 新增标签输入确认后触发。 */
  (e: 'confirm', payload: { value: string }): void;
}>();

defineSlots<{
  /** 标签内容。 */
  default?(): unknown;
  /** 自定义图标（覆盖 `icon` / `iconUrl` prop）。 */
  icon?(): unknown;
  /** 自定义新增标签内容，`dynamic` 为 true 时生效。 */
  add?(): unknown;
}>();

/**
 * Effective shape: explicit `shape` wins over the `round` sugar — same
 * resolution as the web-end SnTag, so cross-end class names match
 * (`sn-tag--skew` etc.; `square` emits no modifier, the base style is square).
 */
const effectiveShape = computed(() =>
  props.shape !== 'square' ? props.shape : props.round ? 'round' : 'square',
);

/** Skew shape counter-skews every internally rendered part (`.sn-tag__upright`). */
const isSkew = computed(() => effectiveShape.value === 'skew');

/**
 * SVG data for a string `icon`, resolved through the same sync chain as
 * sn-button's string icons: registry (`registerSnIcons`) → built-in catalog.
 * `cssIcon` opts out of the chain entirely — the name is then a font glyph,
 * never SVG data, so an iconfont user is insulated from catalog / name
 * collisions.
 */
const namedIconData = computed<IconData | null>(() => {
  if (typeof props.icon !== 'string' || props.icon === '' || props.cssIcon) return null;
  const resolved = resolveSnIconStringSync(props.icon);
  return resolved ? markRaw(resolved) : null;
});

/** Inline `IconData` object form of `icon` (rendered without the registry). */
const objectIconData = computed<IconData | null>(() => {
  if (typeof props.icon === 'string') return null;
  return markRaw(props.icon);
});

/** Vector icon to render: inline object first, then the registry lookup. */
const displayIconData = computed<IconData | null>(
  () => objectIconData.value ?? namedIconData.value,
);

/**
 * Font-icon class list. `cssIcon === true` uses `iconPrefix` as the prefix
 * (`wd-icon` upstream); a string value is the prefix itself, which is the
 * escape hatch for consumers carrying their own iconfont. Object icons never
 * take this path.
 */
const cssIconClass = computed<string>(() => {
  if (typeof props.icon !== 'string' || props.icon === '' || !props.cssIcon) return '';
  const prefix = typeof props.cssIcon === 'string' ? props.cssIcon : props.iconPrefix;
  return prefix ? `${prefix}-${props.icon}` : props.icon;
});

/**
 * Icon boxes ride the `--sn-mp-icon-size-*` tiers (rpx, device-scaled):
 * small tags take the large tier, every other size the xlarge tier — the
 * same 20px / 24px the component used before, now token-driven (§34).
 */
const iconBoxSize = computed(() =>
  props.size === 'small' ? 'var(--sn-mp-icon-size-large)' : 'var(--sn-mp-icon-size-xlarge)',
);

const closeIconSize = computed(() =>
  props.size === 'small' ? 'var(--sn-mp-icon-size-medium)' : 'var(--sn-mp-icon-size-large)',
);

/** Draft text of the inline "new tag" input. */
const draftValue = ref('');

/** Close button click — must not bubble into the root `click`. */
function onCloseTap(event: Event): void {
  event.stopPropagation();
  emit('close', event);
}

function onRootTap(event: Event): void {
  emit('click', event);
}

function onConfirm(): void {
  emit('confirm', { value: draftValue.value });
}

const rootClass = computed(() => [
  'sn-tag',
  `sn-tag--${props.type}`,
  `sn-tag--size-${props.size}`,
  `sn-tag--variant-${props.variant}`,
  effectiveShape.value !== 'square' ? `sn-tag--${effectiveShape.value}` : '',
  {
    'sn-tag--mark': props.mark,
    'sn-tag--closable': props.closable,
    'sn-tag--dynamic': props.dynamic,
  },
  props.customClass,
]);

const rootStyle = computed(() => {
  const parts: string[] = [];
  if (props.color) parts.push(`color: ${props.color}`);
  if (props.bgColor)
    parts.push(`background-color: ${props.bgColor}`, `border-color: ${props.bgColor}`);
  if (props.customStyle) parts.push(props.customStyle);
  return parts.length > 0 ? parts.join('; ') : undefined;
});
</script>

<template>
  <view
    data-snui-component="tag"
    :class="rootClass"
    :style="rootStyle"
    role="button"
    :hover-class="closable ? 'sn-tag--close-pressed' : 'none'"
    @tap="onRootTap"
  >
    <slot name="icon">
      <!--
        Icon chain: bitmap (iconUrl) → vector data (object / registry) →
        iconfont glyph (cssIcon). The image box scales with the same
        icon-size tiers as the vector icon (CSS classes below).
      -->
      <image
        v-if="iconUrl"
        :class="[
          'sn-tag__image',
          { 'sn-tag__image--small': size === 'small', 'sn-tag__upright': isSkew },
        ]"
        :src="iconUrl"
        mode="aspectFit"
        aria-hidden="true"
      />
      <SnIcon
        v-else-if="displayIconData"
        class="sn-tag__icon"
        :class="{ 'sn-tag__upright': isSkew }"
        :icon="displayIconData"
        :size="iconBoxSize"
      />
      <text
        v-else-if="cssIconClass"
        :class="['sn-tag__icon', cssIconClass, { 'sn-tag__upright': isSkew }]"
        aria-hidden="true"
      />
    </slot>

    <input
      v-if="dynamic"
      v-model="draftValue"
      class="sn-tag__input"
      :class="{ 'sn-tag__upright': isSkew }"
      type="text"
      confirm-type="done"
      :placeholder="''"
      @confirm="onConfirm"
    />
    <text v-else class="sn-tag__label" :class="{ 'sn-tag__upright': isSkew }">
      <slot />
    </text>
    <slot v-if="dynamic" name="add" />

    <view
      v-if="closable"
      class="sn-tag__close"
      :class="{ 'sn-tag__upright': isSkew }"
      role="button"
      aria-label="Close"
      @tap="onCloseTap"
    >
      <SnIcon :icon="X" :size="closeIconSize" />
    </view>

    <!-- Fold flap: a real element paints the darker triangle (§116.2 forbids
         ::after on the MP/App pipeline); the root clip-path cuts the corner. -->
    <view v-if="effectiveShape === 'fold'" class="sn-tag__fold-flap" aria-hidden="true" />
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`).
 *
 * Type colours are funneled through three component-local custom properties
 * (`--snui-tag-*`) so the five variants stay a single set of rules instead of
 * a 10 types × 5 variants matrix. The locals are *not* theme slots — they are
 * assigned from real `--sn-mp-*` tokens per type class. */

.sn-tag {
  --snui-tag-bg: var(--sn-mp-color-feedback-info);
  --snui-tag-soft: var(--sn-mp-color-background-subtle);
  --snui-tag-accent: var(--sn-mp-color-text-secondary);
  box-sizing: border-box;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--sn-mp-spacing-1);
  max-width: 100%;
  padding: 6rpx 16rpx;
  border: 2rpx solid transparent;
  border-radius: var(--sn-mp-radius-sm);
  font-size: var(--sn-mp-font-size-sm);
  line-height: 1;
  vertical-align: middle;
  white-space: nowrap;
}

/* ── Sizes ─────────────────────────────────────────────────────────────── */

.sn-tag--size-small {
  padding: 2rpx 8rpx;
  font-size: var(--sn-mp-font-size-xs);
}

.sn-tag--size-medium {
  padding: 4rpx 12rpx;
  font-size: var(--sn-mp-font-size-sm);
}

.sn-tag--size-large {
  padding: 6rpx 20rpx;
  font-size: var(--sn-mp-font-size-md);
}

.sn-tag--size-extra-large {
  padding: 8rpx 24rpx;
  font-size: var(--sn-mp-font-size-lg);
}

/* ── Shapes ────────────────────────────────────────────────────────────── */

/* Pill: the legacy `round` sugar and `shape="round"` share this rule. */
.sn-tag--round {
  padding-left: 20rpx;
  padding-right: 20rpx;
  border-radius: var(--sn-mp-radius-full);
}

/* Mark: asymmetric corners (large top-left, small bottom-right). */
.sn-tag--mark {
  border-radius: var(--sn-mp-radius-lg) var(--sn-mp-radius-md) var(--sn-mp-radius-lg)
    var(--sn-mp-radius-md);
}

.sn-tag--round.sn-tag--mark {
  border-radius: var(--sn-mp-radius-full);
}

/* ── Special shapes (AUI additive, §112.3a) ──────────────────────────────
 * Pure visuals layered on the box: transform / clip-path / mask only. A
 * renderer without them (uni-app x App) degrades to the plain square tag and
 * never loses padding or label — layout never depends on these properties. */

/* Skew: parallelogram box; every inner part counter-skews so glyphs stay
 * upright (web-end parity). */
.sn-tag--skew {
  transform: skewX(-10deg);
}

.sn-tag__upright {
  transform: skewX(10deg);
}

/* Ribbon: right end tapers into a flag point; extra right padding keeps the
 * label clear of the taper. */
.sn-tag--ribbon {
  clip-path: polygon(0 0, calc(100% - 16rpx) 0, 100% 50%, calc(100% - 16rpx) 100%, 0 100%);
  padding-right: calc(16rpx + 16rpx);
}

/* Fold: top-right corner clipped; the flap element paints the darker fold. */
.sn-tag--fold {
  clip-path: polygon(0 0, calc(100% - 16rpx) 0, 100% 16rpx, 100% 100%, 0 100%);
  padding-right: calc(16rpx + 12rpx);
}

.sn-tag__fold-flap {
  position: absolute;
  top: 0;
  right: 0;
  width: 16rpx;
  height: 16rpx;
  background-color: currentColor;
  opacity: 0.35;
  clip-path: polygon(0 0, 100% 100%, 0 100%);
}

/* Ticket: circular notches punched into both ends (coupon). Two mask layers —
 * one per half — union into the surface minus the notches, so the border is
 * masked along (same technique as sn-circle). Mask paint uses currentColor:
 * only alpha matters, no colour literal (§112.5). */
.sn-tag--ticket {
  --snui-tag-notch: 8rpx;
  padding-left: calc(16rpx + 8rpx);
  padding-right: calc(16rpx + 8rpx);
  -webkit-mask:
    radial-gradient(
        circle var(--snui-tag-notch) at 0 50%,
        transparent calc(var(--snui-tag-notch) - 1rpx),
        currentColor var(--snui-tag-notch)
      )
      left / calc(50% + 16rpx) 100% no-repeat,
    radial-gradient(
        circle var(--snui-tag-notch) at 100% 50%,
        transparent calc(var(--snui-tag-notch) - 1rpx),
        currentColor var(--snui-tag-notch)
      )
      right / calc(50% + 16rpx) 100% no-repeat;
  mask:
    radial-gradient(
        circle var(--snui-tag-notch) at 0 50%,
        transparent calc(var(--snui-tag-notch) - 1rpx),
        currentColor var(--snui-tag-notch)
      )
      left / calc(50% + 16rpx) 100% no-repeat,
    radial-gradient(
        circle var(--snui-tag-notch) at 100% 50%,
        transparent calc(var(--snui-tag-notch) - 1rpx),
        currentColor var(--snui-tag-notch)
      )
      right / calc(50% + 16rpx) 100% no-repeat;
}

/* Notch scales with the tag: small 6 / medium+default 8 / large 10 /
 * extra-large 12 rpx. */
.sn-tag--size-small.sn-tag--ticket {
  --snui-tag-notch: 6rpx;
}

.sn-tag--size-large.sn-tag--ticket {
  --snui-tag-notch: 10rpx;
}

.sn-tag--size-extra-large.sn-tag--ticket {
  --snui-tag-notch: 12rpx;
}

/* ── Type palettes (fills the --snui-tag-* locals) ─────────────────────── */

.sn-tag--primary {
  --snui-tag-bg: var(--sn-mp-color-action-primary);
  --snui-tag-soft: var(--sn-mp-color-action-primary-soft);
  --snui-tag-accent: var(--sn-mp-color-action-primary);
}

.sn-tag--success {
  --snui-tag-bg: var(--sn-mp-color-feedback-success);
  --snui-tag-soft: var(--sn-mp-color-feedback-success-soft);
  --snui-tag-accent: var(--sn-mp-color-feedback-success);
}

.sn-tag--warning {
  --snui-tag-bg: var(--sn-mp-color-feedback-warning);
  --snui-tag-soft: var(--sn-mp-color-feedback-warning-soft);
  --snui-tag-accent: var(--sn-mp-color-feedback-warning);
}

.sn-tag--danger {
  --snui-tag-bg: var(--sn-mp-color-feedback-danger);
  --snui-tag-soft: var(--sn-mp-color-feedback-danger-soft);
  --snui-tag-accent: var(--sn-mp-color-feedback-danger);
}

.sn-tag--volcano {
  --snui-tag-bg: var(--sn-mp-color-volcano);
  --snui-tag-soft: var(--sn-mp-color-volcano-soft);
  --snui-tag-accent: var(--sn-mp-color-volcano);
}

.sn-tag--lightblue {
  --snui-tag-bg: var(--sn-mp-color-lightblue);
  --snui-tag-soft: var(--sn-mp-color-lightblue-soft);
  --snui-tag-accent: var(--sn-mp-color-lightblue);
}

.sn-tag--cyan {
  --snui-tag-bg: var(--sn-mp-color-cyan);
  --snui-tag-soft: var(--sn-mp-color-cyan-soft);
  --snui-tag-accent: var(--sn-mp-color-cyan);
}

.sn-tag--pink {
  --snui-tag-bg: var(--sn-mp-color-pink);
  --snui-tag-soft: var(--sn-mp-color-pink-soft);
  --snui-tag-accent: var(--sn-mp-color-pink);
}

.sn-tag--purple {
  --snui-tag-bg: var(--sn-mp-color-purple);
  --snui-tag-soft: var(--sn-mp-color-purple-soft);
  --snui-tag-accent: var(--sn-mp-color-purple);
}

/* ── Variants ──────────────────────────────────────────────────────────── */

/* dark (default): solid fill, white label. */
.sn-tag--variant-dark {
  background-color: var(--snui-tag-bg);
  color: var(--sn-mp-color-text-on-primary);
  border-color: var(--snui-tag-bg);
}

/* light: tinted fill, accent label. */
.sn-tag--variant-light {
  background-color: var(--snui-tag-soft);
  color: var(--snui-tag-accent);
  border-color: transparent;
}

/* plain: no fill, accent border. */
.sn-tag--variant-plain {
  background-color: transparent;
  color: var(--snui-tag-accent);
  border-color: var(--snui-tag-accent);
}

/* dashed: plain with a dashed border. */
.sn-tag--variant-dashed {
  background-color: transparent;
  color: var(--snui-tag-accent);
  border-style: dashed;
  border-color: var(--snui-tag-accent);
}

/* text: label only. */
.sn-tag--variant-text {
  padding-left: 0;
  padding-right: 0;
  background-color: transparent;
  color: var(--snui-tag-accent);
  border-color: transparent;
}

/* ── Parts ─────────────────────────────────────────────────────────────── */

/* App-side text does not inherit container styles (§116.2): re-declare the
 * root typography on the label so the pill reads correctly on every end. */
.sn-tag__label {
  color: inherit;
  font-size: inherit;
  line-height: inherit;
}

.sn-tag__icon {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  color: inherit;
  font-size: inherit;
}

/* Bitmap icon box: same icon-size tiers as the vector icon (small tags take
 * the large tier, all other sizes the xlarge tier). */
.sn-tag__image {
  flex: 0 0 auto;
  width: var(--sn-mp-icon-size-xlarge);
  height: var(--sn-mp-icon-size-xlarge);
}

.sn-tag__image--small {
  width: var(--sn-mp-icon-size-large);
  height: var(--sn-mp-icon-size-large);
}

.sn-tag__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  margin-left: 4rpx;
  color: inherit;
  opacity: 0.7;
}

/* Press feedback rides hover-class (§116.2 — App has no :active pseudo): the
   pressed class lands on the closable root and lights the inner close. */
.sn-tag--close-pressed .sn-tag__close {
  opacity: 1;
}

.sn-tag__input {
  flex: 1 1 auto;
  min-width: 120rpx;
  padding: 0;
  border: 0;
  background-color: transparent;
  color: inherit;
  font-size: inherit;
  line-height: inherit;
}

/* ── Doodle skin ───────────────────────────────────────────────────────── */

.snui-skin-doodle .sn-tag {
  border: 4rpx solid var(--sn-mp-color-text-primary);
  border-radius: var(--sn-mp-radius-md) var(--sn-mp-radius-sm);
  font-weight: var(--sn-mp-font-weight-bold);
}
</style>
