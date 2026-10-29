<script setup lang="ts">
/**
 * SnButton (uni-end) — primary button for uni-app.
 *
 * API design reference: wot-ui (mobile-first, easycom-registered).
 * File path follows the uni-app easycom convention:
 *   components/sn-button/sn-button.vue
 * → auto-registered as `<sn-button>` in any .vue that uses it.
 *
 * Per AGENTS.md §32, this component handles rendering + interaction + DOM
 * bridge only. No schema validation; no business logic.
 */

import { computed, markRaw } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import type { IconData } from '../sn-icon/sn-icon.vue';

defineOptions({ name: 'SnButton' });

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-button` 1:1 surface ─────────────────────────────────── */

    /** Visual variant. Drives background / border / text color. */
    type?: 'primary' | 'default' | 'success' | 'warning' | 'danger' | 'info';
    /** Size preset. */
    size?: 'small' | 'medium' | 'large';
    /** Block (full-width) layout — common on mobile. */
    block?: boolean;
    /** Pill shape. */
    round?: boolean;
    /** Disabled. Skips click. */
    disabled?: boolean;
    /** Loading. Shows spinner. Skips click. */
    loading?: boolean;
    /** Show hairline border (default type only). */
    hairline?: boolean;
    /** Tap feedback (active state opacity). */
    feedback?: boolean;
    /**
     * Plain / low-key style. Drives the variant — for wot-ui parity this
     * maps to `variant: 'plain'` automatically when `type === 'primary'`.
     */
    plain?: boolean;
    /** wot-ui style variant. Mirrors `wd-button variant`. */
    variant?: 'base' | 'plain' | 'dashed' | 'soft' | 'subtle' | 'text';
    /** Cell-style preset. Mirrors wd-button cell. */
    cell?: 'hover' | 'fill' | 'menu' | undefined;
    /** Custom loading spinner color. */
    loadingColor?: string;
    /** Custom loading spinner size (rpx). */
    loadingSize?: number | string;
    /** Open-type routing hint — uni-app MP only. */
    openType?:
      | 'share'
      | 'feedback'
      | 'launchApp'
      | 'contact'
      | 'getUserInfo'
      | 'openSetting'
      | 'lifestyle'
      | 'livePlayer'
      | 'favorite'
      | 'chooseAvatar'
      | 'weRunGroup';
    /** Override the press-feedback class applied while touched (`hover-class`). */
    hoverClass?: string;
    /** Hover start time (ms, uni-app MP). */
    hoverStartTime?: number;
    /** Hover stay time (ms, uni-app MP). */
    hoverStayTime?: number;
    /** Form submission type. */
    formType?: 'submit' | 'reset' | undefined;
    /** Class on the root element. */
    customClass?: string;
    /** Inline style on the root element. */
    customStyle?: string | Record<string, string>;
    /** Custom background color override. */
    bgColor?: string;
    /** Custom text/border color override. */
    color?: string;
    /** Accessible label override. */
    ariaLabel?: string;

    /* ── icon handling (mirror of web) ─────────────────────────────────── */

    /**
     * Icon data (frozen `{ viewBox, paths }` object) to render before the
     * default slot.
     */
    iconData?: IconData;
    /**
     * Icon name resolved via the sn-icon registry (populated by
     * `registerSnIcons()` at app bootstrap).
     */
    iconName?: string;
    /** rpx / pixel size forwarded to the embedded sn-icon. Default 32. */
    iconSize?: number | string;
    /**
     * Iconfont glyph name — wot-ui's `icon` prop (`wd-button icon="check"`).
     *
     * Distinct from `iconName` (SVG registry lookup): this resolves through the
     * iconfont class convention, which is what wot-ui's docs teach.
     */
    icon?: string;
    /** Class-name prefix for the iconfont glyph. Mirrors wot-ui `class-prefix`. */
    classPrefix?: string;
    /** CSS icon class (or `true` to also apply the raw name). Mirrors `css-icon`. */
    cssIcon?: boolean | string;
    /**
     * Loading indicator config — mirrors wot-ui `loading-props`.
     *
     * Accepts the shape `wd-loading` takes (`{ color, size, text, ... }`); the
     * fields this component understands are applied to the spinner, the rest
     * are ignored so a config written for wot-ui still type-checks.
     */
    loadingProps?:
      | {
          color?: string;
          size?: number | string;
          text?: string;
          [key: string]: unknown;
        }
      | undefined;
    /** Prevent the press state from bubbling to ancestors (uni-app MP). */
    hoverStopPropagation?: boolean;
    /** `open-type=contact` session language: `zh_CN` / `zh_TW` / `en`. */
    lang?: 'zh_CN' | 'zh_TW' | 'en' | '';
    /** `open-type=contact` session source. */
    sessionFrom?: string;
    /** `open-type=contact` message card title. */
    sendMessageTitle?: string;
    /** `open-type=contact` message card path. */
    sendMessagePath?: string;
    /** `open-type=contact` message card image. */
    sendMessageImg?: string;
    /** `open-type=launchApp` launch parameters. */
    appParameter?: string;
    /** `open-type=contact` — show the session message card. */
    showMessageCard?: boolean;
    /** Unique button identifier. */
    buttonId?: string;
    /** Alipay authorization scope (`open-type=getAuthorize`). */
    scope?: 'phoneNumber' | 'userInfo' | '';
  }>(),
  {
    type: 'default',
    size: 'medium',
    block: false,
    round: false,
    disabled: false,
    loading: false,
    hairline: true,
    feedback: true,
    plain: false,
    variant: 'base',
    cell: undefined,
    loadingColor: '',
    loadingSize: 32,
    hoverClass: 'sn-button--feedback',
    hoverStartTime: 0,
    hoverStayTime: 70,
    formType: undefined,
    customClass: '',
    customStyle: '',
    bgColor: '',
    color: '',
    iconSize: 32,
    icon: '',
    classPrefix: 'sn-icon',
    cssIcon: false,
    loadingProps: undefined,
    hoverStopPropagation: false,
    lang: '',
    sessionFrom: '',
    sendMessageTitle: '',
    sendMessagePath: '',
    sendMessageImg: '',
    appParameter: '',
    showMessageCard: false,
    buttonId: '',
    scope: '',
  },
);

/**
 * Resolved icon data: explicit `iconData` object only. String names are NOT
 * resolved here — they are forwarded to the embedded SnIcon, whose sync
 * resolution chain (registry → built-in catalog → provider prefix) covers
 * the whole sn-icon library without bundling the catalog into sn-button.
 */
const resolvedIconData = computed<IconData | null>(() =>
  props.iconData ? markRaw(props.iconData) : null,
);

/**
 * Inline loader glyph — lucide `loader-circle` (ISC).
 * Inline loader glyph — lucide `loader-circle` (ISC). Rendered through the
 * embedded SnIcon so the spinner reuses the same cross-end SVG pipeline as
 * every other icon, and its stroke scales with `loading-size` instead of
 * keeping a fixed border width (the old hand-rolled dot washed out at 48rpx+).
 */
const LOADER_CIRCLE: IconData = {
  paths: ['M21 12a9 9 0 1 1-6.219-8.56'],
};

/**
 * Loading spinner appearance.
 *
 * wot-ui exposes both the flat props (`loading-color` / `loading-size`) and a
 * `loading-props` object. The flat props win when set, so existing call sites
 * keep working; `loading-props` is the fallback for configs written against
 * wd-button.
 */
const spinnerColor = computed<string>(() => {
  if (props.loadingColor !== '') return props.loadingColor;
  const fromProps = props.loadingProps?.color;
  return typeof fromProps === 'string' ? fromProps : '';
});

const spinnerSize = computed<number | string>(() => {
  if (props.loadingSize !== 32) return props.loadingSize;
  const fromProps = props.loadingProps?.size;
  if (typeof fromProps === 'number' || typeof fromProps === 'string') return fromProps;
  return props.loadingSize;
});
const emit = defineEmits<{
  (e: 'click', event: Event): void;
}>();

defineSlots<{
  default(): unknown;
  icon(): unknown;
  loading(): unknown;
}>();

const classList = computed(() => [
  'sn-button',
  `sn-button--${props.type}`,
  `sn-button--${props.size}`,
  `sn-button--variant-${props.variant}`,
  {
    'sn-button--block': props.block,
    'sn-button--round': props.round,
    'sn-button--disabled': props.disabled,
    'sn-button--loading': props.loading,
    'sn-button--hairline': props.hairline && props.type === 'default',
    'sn-button--plain': props.plain,
    'sn-button--cell-hover': props.cell === 'hover',
    'sn-button--cell-fill': props.cell === 'fill',
    'sn-button--cell-menu': props.cell === 'menu',
  },
  props.customClass,
]);

/**
 * Press feedback rides uni `hover-class` (§116.2 — App has no :active pseudo),
 * so the touch state is a dedicated class instead of a CSS pseudo. Inert
 * buttons (feedback off / disabled / loading) get `none`; the cell variant
 * presses with a background change instead of the opacity dip.
 */
const effectiveHoverClass = computed<string>(() => {
  if (!props.feedback || props.disabled || props.loading) return 'none';
  if (props.cell === 'hover') return 'sn-button--cell-pressed';
  return props.hoverClass;
});

const wrapperStyle = computed(() => {
  let style = '';
  if (props.bgColor) style += `background-color: ${props.bgColor};`;
  if (props.color) style += `color: ${props.color};border-color: ${props.color};`;
  if (typeof props.customStyle === 'string') style += props.customStyle;
  else if (props.customStyle)
    style += Object.entries(props.customStyle)
      .map(([k, v]) => `${k}:${v}`)
      .join(';');
  return style || undefined;
});

function onTap(event: Event): void {
  if (props.disabled || props.loading) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  }
  emit('click', event);
}
</script>

<template>
  <view
    data-snui-component="button"
    :class="classList"
    :style="wrapperStyle"
    :aria-disabled="disabled || loading"
    :aria-busy="loading"
    :aria-label="ariaLabel"
    :hover-class="effectiveHoverClass"
    :hover-start-time="hoverStartTime"
    :hover-stay-time="hoverStayTime"
    :hover-stop-propagation="hoverStopPropagation || undefined"
    :form-type="formType || undefined"
    :open-type="openType"
    :lang="lang || undefined"
    :session-from="sessionFrom || undefined"
    :send-message-title="sendMessageTitle || undefined"
    :send-message-path="sendMessagePath || undefined"
    :send-message-img="sendMessageImg || undefined"
    :app-parameter="appParameter || undefined"
    :show-message-card="showMessageCard || undefined"
    :button-id="buttonId || undefined"
    :scope="scope || undefined"
    @tap="onTap"
  >
    <slot name="icon">
      <!--
        Icon precedence: SVG data (`iconData`) first, then string `iconName`
        resolved by SnIcon (registry → built-in catalog → provider), then the
        wot-ui iconfont API (`icon` + `class-prefix` + `css-icon`).
      -->
      <SnIcon v-if="resolvedIconData" :icon="resolvedIconData" :size="iconSize ?? 32" />
      <SnIcon v-else-if="iconName" :icon="iconName" :size="iconSize ?? 32" />
      <SnIcon
        v-else-if="icon"
        :name="icon"
        :class-prefix="classPrefix"
        :css-icon="cssIcon"
        :size="iconSize ?? 32"
      />
      <view v-else-if="loading" class="sn-button__spinner" aria-hidden="true">
        <slot name="loading">
          <SnIcon
            :icon="LOADER_CIRCLE"
            :size="`${spinnerSize}rpx`"
            :color="spinnerColor || undefined"
          />
        </slot>
      </view>
    </slot>
    <slot />
  </view>
</template>

<style scoped>
.sn-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 0 28rpx;
  border: 2rpx solid transparent;
  border-radius: 8rpx;
  font-size: 28rpx;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  transition:
    opacity 0.15s,
    background-color 0.15s,
    border-color 0.15s,
    color 0.15s;
  /* uni-app uses rpx for cross-device sizing; rpx is a typography/geometry unit,
     not a color, so hardcoded rpx values are allowed per Spec-01 §3.1. */
  box-sizing: border-box;
}

.sn-button--block {
  display: flex;
  width: 100%;
}

.sn-button--round {
  border-radius: 999rpx;
}

.sn-button--disabled,
.sn-button--loading {
  cursor: not-allowed;
  opacity: 0.5;
}

/* Press feedback rides hover-class (§116.2 — App has no :active pseudo);
   .sn-button--feedback is applied only while touched (see effectiveHoverClass). */
.sn-button--feedback {
  opacity: 0.7;
}

/* Sizes */
.sn-button--small {
  height: 56rpx;
  padding: 0 20rpx;
  font-size: 24rpx;
}
.sn-button--medium {
  height: 72rpx;
}
.sn-button--large {
  height: 88rpx;
  padding: 0 36rpx;
  font-size: 32rpx;
}

/* Variants — color tokens only; geometry stays as rpx values above. */
.sn-button--primary {
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
  border-color: var(--sn-mp-color-action-primary);
}
.sn-button--success {
  background-color: var(--sn-mp-color-feedback-success);
  color: var(--sn-mp-color-text-on-primary);
  border-color: var(--sn-mp-color-feedback-success);
}
.sn-button--warning {
  background-color: var(--sn-mp-color-feedback-warning);
  color: var(--sn-mp-color-text-on-primary);
  border-color: var(--sn-mp-color-feedback-warning);
}
.sn-button--danger {
  background-color: var(--sn-mp-color-feedback-danger);
  color: var(--sn-mp-color-text-on-primary);
  border-color: var(--sn-mp-color-feedback-danger);
}
.sn-button--info {
  background-color: var(--sn-mp-color-feedback-info);
  color: var(--sn-mp-color-text-on-primary);
  border-color: var(--sn-mp-color-feedback-info);
}

.sn-button--default {
  background-color: var(--sn-mp-color-background-surface);
  color: var(--sn-mp-color-text-primary);
}
.sn-button--default.sn-button--hairline {
  border-color: var(--sn-mp-color-border-default);
}

/* Variant: plain — transparent background, colored border. */
.sn-button--variant-plain.sn-button--primary {
  background-color: transparent;
  color: var(--sn-mp-color-action-primary);
  border-color: var(--sn-mp-color-action-primary);
}
.sn-button--variant-plain.sn-button--danger {
  background-color: transparent;
  color: var(--sn-mp-color-feedback-danger);
  border-color: var(--sn-mp-color-feedback-danger);
}

/* Variant: soft — tinted background. */
.sn-button--variant-soft.sn-button--primary {
  background-color: var(--sn-mp-color-action-primary-soft);
  color: var(--sn-mp-color-action-primary);
  border-color: transparent;
}
.sn-button--variant-soft.sn-button--danger {
  background-color: var(--sn-mp-color-feedback-danger-soft);
  color: var(--sn-mp-color-feedback-danger);
  border-color: transparent;
}

/* Variant: dashed — dashed border. */
.sn-button--variant-dashed {
  border-style: dashed;
}

/* Variant: text — transparent, no border. */
.sn-button--variant-text {
  background-color: transparent;
  border-color: transparent;
}

/* Variant: subtle — light gray background, primary text. */
.sn-button--variant-subtle {
  background-color: var(--sn-mp-color-background-soft);
  color: var(--sn-mp-color-text-primary);
  border-color: transparent;
}

/* Cell hover — used inside Cell menu lists; press feedback via hover-class. */
.sn-button--cell-pressed {
  background-color: var(--sn-mp-color-background-soft);
}
.sn-button--cell-fill {
  background-color: var(--sn-mp-color-background-soft);
}
.sn-button--cell-menu {
  background-color: transparent;
  border-radius: 0;
}
/* Spinner — the glyph itself comes from the embedded SnIcon (loader-circle);
 * the wrapper only owns the rotation so custom `loading` slots inherit it. */
.sn-button__spinner {
  display: inline-flex;
  align-items: center;
  animation: sn-button-spin 0.8s linear infinite;
}
@keyframes sn-button-spin {
  to {
    transform: rotate(360deg);
  }
}

/* Doodle skin — see packages/vue-web/src/button/SnButton.vue for full
 * rationale. uni side mirrors the same .snui-skin-doodle CSS but uses
 * rpx units (uni-app cross-end) for border thickness so it scales
 * correctly on small devices.
 *
 * Note: rpx units in this CSS get converted to px by the docs site's
 * vite rpx-transform plugin (see apps/docs/.vitepress/utils/rpx-transform.ts).
 * In a real uni-app runtime these stay as rpx. */
.snui-skin-doodle .sn-button {
  border-width: 5rpx;
  border-style: solid;
  border-color: #1a1a1a;
  font-weight: 700;
  letter-spacing: 0.4rpx;
}
/* :hover dropped — App 无伪类且触屏无 hover（§116.2）。
   Press state rides hover-class (.sn-button--feedback, gated in script). */
.snui-skin-doodle .sn-button--feedback {
  transform: translate(4rpx, 4rpx);
  box-shadow: 2rpx 2rpx 0 #1a1a1a;
}
.snui-skin-doodle .sn-button--primary,
.snui-skin-doodle .sn-button--success,
.snui-skin-doodle .sn-button--warning,
.snui-skin-doodle .sn-button--danger,
.snui-skin-doodle .sn-button--info {
  border-color: #1a1a1a;
}
.snui-skin-doodle .sn-button--ghost {
  background-color: transparent;
}
.snui-skin-doodle .sn-button--variant-dashed {
  border-style: dashed;
}
.snui-skin-doodle .sn-button--variant-text,
.snui-skin-doodle .sn-button--variant-plain,
.snui-skin-doodle .sn-button--variant-subtle {
  background-color: transparent;
  border-color: transparent;
}
.snui-skin-doodle .sn-button--variant-soft {
  border-color: transparent;
}
.snui-skin-doodle .sn-button--cell-fill {
  background-color: var(--sn-mp-color-background-subtle);
  border-color: #1a1a1a;
}
.snui-skin-doodle .sn-button--round {
  border-radius: 999rpx;
}
</style>
