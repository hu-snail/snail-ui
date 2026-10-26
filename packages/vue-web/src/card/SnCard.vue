<script setup lang="ts">
/**
 * SnCard — web-end card container (AUI-WEB-LAYOUT-001).
 *
 * Reference library: naive-ui `n-card`
 *   (https://www.naiveui.com/zh-CN/light/components/card)
 * Per AGENTS.md §112, this component's API surface is 1:1 with n-card
 * (same prop names, defaults, control semantics). Anything new added here
 * MUST also be added to the n-card reference list in AGENTS.md §112.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units). Direct `--aui-*` / `--sn-mp-*`
 * access is forbidden (enforced by `pnpm snui token-check --end web`).
 *
 * Slot structure mirrors n-card: cover → header → content → footer → action.
 * `closable` renders a close button in the header; click emits `onClose`.
 * `tag` swaps the root element (`div` default; `<a>` / `<section>` / etc.).
 *
 * Not responsible for:
 *   - Animation / collapse (use SnCollapse, future AUI-WEB-LAYOUT-005)
 *   - Selection state / checkbox (use SnForm + SnCheckbox)
 *   - Lazy image loading inside cover (use SnImg, future)
 *   - Drag / sortable behavior
 */

import { computed, useSlots } from 'vue'
import { XIcon } from '../icon/sn-input-icons'

defineOptions({ name: 'SnCard' })

// Reference: naive-ui cardBaseProps
//   (https://github.com/tusen-ai/naive-ui/blob/main/src/card/src/Card.tsx)
// All prop names match n-card 1:1. Optional consumer-friendly aliases are
// appended below (no breaking additions).
const props = withDefaults(
  defineProps<{
    /** Title text or render function. Rendered inside header when header
     * slot is not provided. */
    title?: string | (() => unknown)
    /** Class applied to the content (body) region. */
    contentClass?: string
    /** Inline style applied to the content (body) region. */
    contentStyle?: string | Record<string, string>
    /** Make content region scrollable when overflowing. Naive UI wires this
     * to NScrollbar; we render a max-height + overflow:auto shell that
     * approximates that behavior without pulling in the full virtualized
     * scrollbar. */
    contentScrollable?: boolean
    /** Class applied to the header region. */
    headerClass?: string
    /** Inline style applied to the header region. */
    headerStyle?: string | Record<string, string>
    /** Class applied to the header-extra region. */
    headerExtraClass?: string
    /** Inline style applied to the header-extra region. */
    headerExtraStyle?: string | Record<string, string>
    /** Class applied to the footer region. */
    footerClass?: string
    /** Inline style applied to the footer region. */
    footerStyle?: string | Record<string, string>
    /** Embedded variant — strips outer border + shadow for nested cards. */
    embedded?: boolean
    /** Segmented divider lines between regions. Can be `true` (all on) or
     * `{ content?, footer?, action? }` shape (each `true | 'soft'`). */
    segmented?: boolean | { content?: boolean | 'soft'; footer?: boolean | 'soft'; action?: boolean | 'soft' }
    /** Card size preset. Drives padding + font-size. */
    size?: 'small' | 'medium' | 'large' | 'huge'
    /** Show 1px outer border. Default true. */
    bordered?: boolean
    /** Show close button in header. Requires `onClose` to do anything. */
    closable?: boolean
    /** Apply hover-lift visual cue. */
    hoverable?: boolean
    /** Accessible role attribute. Default 'region'. */
    role?: string
    /** Root tag. Default 'div'. */
    tag?: keyof HTMLElementTagNameMap
    /** Render function for cover (above header). */
    cover?: () => unknown
    /** Content text or render function. Rendered inside body when default
     * slot is not provided. */
    content?: string | (() => unknown)
    /** Render function for footer region. */
    footer?: () => unknown
    /** Render function for action region (below footer). */
    action?: () => unknown
    /** Render function for header-extra region. */
    headerExtra?: () => unknown
    /** Close button focusable (keyboard tab). Default true. */
    closeFocusable?: boolean
    /** Web-only convenience alias: visual variant. Maps to (bordered, |)
     * combinations. 'default' → bordered true + shadow false. 'outlined' →
     * bordered true + shadow false (alias of default; kept for nav parity
     * with prior docs). 'elevated' → bordered false + shadow true.
     * @deprecated Prefer `bordered` + token-driven `--sn-web-card-shadow`. */
    variant?: 'default' | 'outlined' | 'elevated'
    /** Web-only convenience alias: padding sub-axis. Maps to `size`. */
    padding?: 'none' | 'sm' | 'md' | 'lg'
    /** Web-only convenience alias: show shadow. */
    shadow?: boolean
    /** Native ARIA label. Forwarded to the root element when provided. */
    ariaLabel?: string
  }>(),
  {
    bordered: true,
    closeFocusable: true,
    role: 'region',
    tag: 'div',
  },
)

const emit = defineEmits<{
  /** Fired when the close button is clicked (only when `closable` is true). */
  (e: 'close'): void
}>()

defineSlots<{
  /** Card body content (rendered between header and footer). */
  default?(): unknown
  /** Cover region (above header). */
  cover?(): unknown
  /** Header region. Overrides the `title` prop. */
  header?(): unknown
  /** Header-extra region (right side of header). */
  'header-extra'?(): unknown
  /** Footer region. */
  footer?(): unknown
  /** Action region (below footer). */
  action?(): unknown
}>()

const slots = useSlots()

/** Resolve `variant` alias into `(bordered, shadow)` flags. The legacy
 * `variant` is a §112-allowed convenience that mirrors the pre-render docs
 * surface; the canonical n-card-aligned API is `bordered` + token shadow. */
const effectiveBordered = computed(() => {
  if (props.variant === 'elevated') return false
  return props.bordered
})
const effectiveShadow = computed(() => {
  if (props.variant === 'elevated') return true
  if (props.variant === 'outlined') return false
  return props.shadow
})
/** Resolve `padding` alias into `size` value. */
const effectiveSize = computed(() => {
  if (props.padding) {
    if (props.padding === 'none') return undefined
    if (props.padding === 'sm') return 'small'
    if (props.padding === 'md') return 'medium'
    if (props.padding === 'lg') return 'large'
  }
  return props.size
})

/** Whether header should render. Triggered by `title`, `header` slot,
 * `closable`, or `headerExtra` (anything header-region-worthy). */
const showHeader = computed(() => {
  return Boolean(
    slots.header
    || props.title !== undefined
    || props.headerExtra !== undefined
    || props.closable,
  )
})

/** Whether content region should render. Triggered by default slot or
 * `content` prop. */
const showContent = computed(() => {
  return Boolean(slots.default || props.content !== undefined)
})

/** Whether footer region should render. Triggered by `footer` slot or
 * `footer` prop. */
const showFooter = computed(() => {
  return Boolean(slots.footer || props.footer !== undefined)
})

/** Whether action region should render. Triggered by `action` slot or
 * `action` prop. */
const showAction = computed(() => {
  return Boolean(slots.action || props.action !== undefined)
})

/** Whether cover region should render. Triggered by `cover` slot or
 * `cover` prop. */
const showCover = computed(() => {
  return Boolean(slots.cover || props.cover !== undefined)
})

/** Resolve segmented into a normalized object. */
const segmentedObj = computed(() => {
  if (props.segmented === true) {
    return { content: true, footer: true, action: true }
  }
  if (props.segmented === false || props.segmented === undefined) {
    return { content: false, footer: false, action: false }
  }
  return {
    content: props.segmented.content === true,
    footer: props.segmented.footer === true,
    action: props.segmented.action === true,
  }
})

const CloseIconComponent = XIcon

function handleClose(): void {
  emit('close')
}

// useSlots() reference keeps vue-tsc treating this file as a Vue SFC and
// emits the compiled JS to dist/card/SnCard.vue.js. Without an explicit
// `import { ... } from 'vue'`, vue-tsc may skip JS emission and leave raw
// SFC markup in dist — which trips up downstream consumers that resolve
// `import { SnCard } from '@snui/vue-web'` via the package main entry.
void useSlots
</script>

<template>
  <component
    :is="tag"
    :class="[
      'sn-card',
      `sn-card--size-${effectiveSize ?? 'medium'}`,
      effectiveBordered ? 'sn-card--bordered' : '',
      embedded ? 'sn-card--embedded' : '',
      hoverable ? 'sn-card--hoverable' : '',
      effectiveShadow ? 'sn-card--shadow' : '',
      closable ? 'sn-card--closable' : '',
      contentScrollable ? 'sn-card--content-scrollable' : '',
      showCover ? 'sn-card--has-cover' : '',
      showHeader ? 'sn-card--has-header' : '',
      showContent ? 'sn-card--has-content' : '',
      showFooter ? 'sn-card--has-footer' : '',
      showAction ? 'sn-card--has-action' : '',
    ]"
    :style="effectiveShadow ? { boxShadow: 'var(--sn-web-card-shadow)' } : undefined"
    :role="role"
    :aria-label="ariaLabel"
  >
    <!-- Cover (above header when shown) -->
    <div v-if="showCover" class="sn-card__cover">
      <slot name="cover">
        <component :is="cover" v-if="typeof cover === 'function'" />
        <template v-else-if="cover">{{ cover }}</template>
      </slot>
    </div>

    <!-- Header -->
    <div
      v-if="showHeader"
      :class="['sn-card__header', headerClass]"
      :style="headerStyle"
      role="heading"
    >
      <div class="sn-card__header-main">
        <slot name="header">
          <component :is="title" v-if="typeof title === 'function'" />
          <template v-else-if="title !== undefined">{{ title }}</template>
        </slot>
      </div>
      <div
        v-if="$slots['header-extra'] || headerExtra !== undefined"
        :class="['sn-card__header-extra', headerExtraClass]"
        :style="headerExtraStyle"
      >
        <slot name="header-extra">
          <component :is="headerExtra" v-if="typeof headerExtra === 'function'" />
          <template v-else-if="headerExtra">{{ headerExtra }}</template>
        </slot>
      </div>
      <button
        v-if="closable"
        type="button"
        class="sn-card__close"
        :aria-label="ariaLabel ? `${ariaLabel} close` : 'Close'"
        :tabindex="closeFocusable ? 0 : -1"
        @click="handleClose"
      >
        <CloseIconComponent :size="14" />
      </button>
    </div>

    <!-- Content -->
    <div
      v-if="showContent"
      :class="[
        'sn-card__content',
        segmentedObj.content ? 'sn-card__content--segmented' : '',
        contentScrollable ? 'sn-card__content--scrollable' : '',
        contentClass,
      ]"
      :style="contentStyle"
      role="none"
    >
      <slot>
        <component :is="content" v-if="typeof content === 'function'" />
        <template v-else-if="content !== undefined">{{ content }}</template>
      </slot>
    </div>

    <!-- Footer -->
    <div
      v-if="showFooter"
      :class="[
        'sn-card__footer',
        segmentedObj.footer ? 'sn-card__footer--segmented' : '',
        footerClass,
      ]"
      :style="footerStyle"
      role="none"
    >
      <slot name="footer">
        <component :is="footer" v-if="typeof footer === 'function'" />
        <template v-else-if="footer">{{ footer }}</template>
      </slot>
    </div>

    <!-- Action -->
    <div
      v-if="showAction"
      :class="[
        'sn-card__action',
        segmentedObj.action ? 'sn-card__action--segmented' : '',
      ]"
      role="none"
    >
      <slot name="action">
        <component :is="action" v-if="typeof action === 'function'" />
        <template v-else-if="action">{{ action }}</template>
      </slot>
    </div>
  </component>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-card {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: var(--sn-web-color-background-surface);
  color: var(--sn-web-color-text-primary);
  border-radius: var(--sn-web-card-radius);
  font-family: inherit;
  line-height: 1.5;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}

.sn-card--bordered {
  border: 1px solid var(--sn-web-color-border-default);
}

.sn-card--embedded {
  border: none;
  background: transparent;
}

.sn-card--hoverable {
  cursor: pointer;
}
.sn-card--hoverable:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Size presets — padding + font-size */
.sn-card--size-small {
  padding: 12px;
  font-size: 13px;
}
.sn-card--size-medium {
  padding: var(--sn-web-card-padding, 16px);
  font-size: 14px;
}
.sn-card--size-large {
  padding: 24px;
  font-size: 15px;
}
.sn-card--size-huge {
  padding: 32px;
  font-size: 16px;
}

/* When cover is shown, remove top padding (cover fills the rounded top). */
.sn-card--has-cover.sn-card--size-small,
.sn-card--has-cover.sn-card--size-medium,
.sn-card--has-cover.sn-card--size-large,
.sn-card--has-cover.sn-card--size-huge {
  padding-top: 0;
}

.sn-card__cover {
  margin: calc(var(--sn-web-card-padding, 16px) * -1) calc(var(--sn-web-card-padding, 16px) * -1) 0;
  border-radius: var(--sn-web-card-radius) var(--sn-web-card-radius) 0 0;
  overflow: hidden;
}
.sn-card--size-small .sn-card__cover {
  margin: -12px -12px 0;
}
.sn-card--size-large .sn-card__cover {
  margin: -24px -24px 0;
}
.sn-card--size-huge .sn-card__cover {
  margin: -32px -32px 0;
}

.sn-card__header {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--sn-web-color-text-primary);
}
.sn-card--size-small .sn-card__header {
  font-size: 14px;
}
.sn-card--size-large .sn-card__header {
  font-size: 18px;
}
.sn-card--size-huge .sn-card__header {
  font-size: 20px;
}

.sn-card__header-main {
  flex: 1;
  min-width: 0;
}

.sn-card__header-extra {
  flex: 0 0 auto;
  color: var(--sn-web-color-text-secondary);
  font-weight: normal;
  font-size: 13px;
}

.sn-card__close {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: var(--sn-web-color-text-secondary);
  transition: background-color 0.15s ease, color 0.15s ease;
}
.sn-card__close:hover {
  background: rgba(0, 0, 0, 0.06);
  color: var(--sn-web-color-text-primary);
}
.sn-card__close:focus-visible {
  outline: 2px solid var(--sn-web-color-action-primary);
  outline-offset: 2px;
}

.sn-card__content {
  flex: 1 1 auto;
  min-height: 0;
}

.sn-card__content--scrollable {
  max-height: 240px;
  overflow-y: auto;
}

.sn-card__content--segmented {
  border-top: 1px solid var(--sn-web-color-border-default);
  margin-top: 12px;
  padding-top: 12px;
}

.sn-card__footer {
  flex: 0 0 auto;
  margin-top: 12px;
}
.sn-card__footer--segmented {
  border-top: 1px solid var(--sn-web-color-border-default);
  padding-top: 12px;
}

.sn-card__action {
  flex: 0 0 auto;
  border-top: 1px solid var(--sn-web-color-border-default);
  margin-top: 12px;
  padding-top: 12px;
}
.sn-card__action--segmented {
  /* same as outer --action; class kept for §112.c 3-state hook */
}

/* Doodle skin */
.snui-skin-doodle .sn-card {
  border-width: 2.5px;
  border-color: #1a1a1a;
  box-shadow: 4px 4px 0 #1a1a1a;
}
.snui-skin-doodle .sn-card--embedded {
  border: none;
  box-shadow: none;
}
.snui-skin-doodle .sn-card__close:hover {
  background: #1a1a1a;
  color: #fff;
}
</style>