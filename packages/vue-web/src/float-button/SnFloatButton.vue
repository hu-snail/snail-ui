<script setup lang="ts">
/**
 * SnFloatButton — floating action button pinned to a viewport corner.
 *
 * Reference library: Ant Design Vue `FloatButton`
 *   (https://antdv.com/components/float-button).
 * **Explicit divergence from the naive-ui 1:1 rule**: naive-ui has NO
 * FloatButton component (its `src/components.ts` exports no floating action
 * button), so per the parity rule this component mirrors Ant Design Vue
 * `FloatButton` instead — the same registration style SnComment uses for the
 * data-display batch. Props + slots mirror `FloatButton`:
 *   type ('default' | 'primary') / shape ('circle' | 'square') / icon /
 *   iconSize / description / tooltip / badge / href / target / disabled /
 *   visible; slots: icon / description + default.
 *
 * Divergences from the Ant Design Vue source (documented, not accidental):
 *   - `tooltip` does NOT pull in a tooltip component. It sets the native
 *     `title` attribute and the accessible name (`aria-label`) on the real
 *     `<button>` / `<a>` root. Rationale: this library's tooltip stack is
 *     portal + timer based; a corner-pinned action button does not need it,
 *     and staying portal-free keeps the component disposable-free (§41).
 *   - `badge` is rendered inline by this component instead of delegating to a
 *     Badge component; `@snui/vue-web` ships no `SnBadge` yet.
 *   - `placement` (corner) plus explicit `right` / `bottom` / `top` / `left`
 *     offsets. Ant Design Vue only exposes `style`; the corner model matches
 *     naive-ui's `n-back-top` (`right` / `bottom`) that this library already
 *     uses for fixed corner widgets.
 *   - `visible` (`v-if` the whole button) replaces the reference's
 *     conditional rendering in userland.
 *
 * Inside `<SnFloatButtonGroup>` the group owns the fixed position: the child
 * injects `sn-float-button-group`, inherits the group `shape` and renders
 * `position: static` / full width. Standalone, the button positions itself.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnFloatButton :icon="Plus" tooltip="新建" :right="24" :bottom="24" />
 *   <SnFloatButton type="primary" badge="5" shape="square" description="消息" />
 */

import { computed, inject, markRaw, onBeforeUnmount, onMounted, ref, useSlots } from 'vue'
import type { ComputedRef, CSSProperties } from 'vue'
import SnIcon from '../icon/SnIcon.vue'
import type { IconComponent } from '../icon/sn-icon-registry'

defineOptions({ name: 'SnFloatButton' })

type SnFloatButtonType = 'default' | 'primary'
type SnFloatButtonShape = 'circle' | 'square'
type SnFloatButtonPlacement = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

/**
 * Contract handed down by `<SnFloatButtonGroup>` through provide/inject.
 * Kept as a structural type so the two files never need a shared module.
 */
interface SnFloatButtonGroupContext {
  /** Group-level shape; overrides the child's own `shape` prop. */
  shape: ComputedRef<SnFloatButtonShape>
}

/** Injection key shared with `SnFloatButtonGroup` (string key, like SnCollapse). */
const FLOAT_BUTTON_GROUP_KEY = 'sn-float-button-group'

/** Distance from the viewport edge that `placement` falls back to. */
const DEFAULT_OFFSET = '24px'

const props = withDefaults(
  defineProps<{
    /** Filled color: surface background (`'default'`) or brand fill (`'primary'`). */
    type?: SnFloatButtonType
    /** `'circle'` (default) or `'square'` — square stacks the icon above a `description` line. */
    shape?: SnFloatButtonShape
    /** Lucide-style icon component; the `icon` slot overrides it. */
    icon?: IconComponent | undefined
    /** Pixel / CSS size forwarded to the embedded SnIcon. */
    iconSize?: number | string
    /** Text under the icon. Rendered for `shape="square"` only; the `description` slot overrides it. */
    description?: string
    /**
     * Sets the native `title` and the accessible name on the root. No tooltip
     * component is used. The explicit `| undefined` is required by
     * `exactOptionalPropertyTypes` for props forwarded into the template.
     */
    tooltip?: string | undefined
    /** Count bubble; hidden when `undefined`, `0` or `''`. */
    badge?: number | string
    /** Render a dot instead of the count (used when there is no number to show). */
    badgeDot?: boolean
    /** When set, the root renders `<a href>` instead of `<button type="button">`. */
    href?: string
    /** Native link target. Only meaningful together with `href`. */
    target?: '_blank' | '_self' | '_parent' | '_top'
    /** Disabled state — no `click` event, `aria-disabled` on the root. */
    disabled?: boolean
    /** `v-if` the whole button. */
    visible?: boolean
    /** Fixed corner. Ignored inside `<SnFloatButtonGroup>` — the group positions its children. */
    placement?: SnFloatButtonPlacement
    /** Explicit distance from the viewport right edge; overrides `placement`. */
    right?: number | string
    /** Explicit distance from the viewport bottom edge; overrides `placement`. */
    bottom?: number | string
    /** Explicit distance from the viewport top edge; overrides `placement`. */
    top?: number | string
    /** Explicit distance from the viewport left edge; overrides `placement`. */
    left?: number | string
    /** Stacking order of the fixed root. Ignored inside a group. */
    zIndex?: number
    /**
     * `false` pins the button to its nearest positioned ancestor instead of
     * the viewport — drop it into a `position: relative` hero/section (or set
     * `container`) when the button belongs to that block, not to the page.
     */
    fixed?: boolean
    /**
     * Explicit positioning context (selector or element) for `fixed: false`.
     * When omitted the root only switches to `position: absolute`, so the
     * offset resolves against the nearest positioned ancestor.
     */
    container?: string | HTMLElement | undefined
  }>(),
  {
    type: 'default',
    shape: 'circle',
    iconSize: 18,
    badgeDot: false,
    disabled: false,
    visible: true,
    placement: 'bottom-right',
    zIndex: 1000,
    fixed: true,
    container: undefined,
  },
)

const emit = defineEmits<{
  /** Native click. Not emitted when `disabled`. */
  (e: 'click', event: MouseEvent): void
}>()

defineSlots<{
  /** Replaces the icon. */
  icon?(): unknown
  /** Replaces the whole inner content (icon + description). */
  default?(): unknown
  /** Replaces the `description` text. */
  description?(): unknown
}>()

const slots = useSlots()

// ---------- Group context ----------

/** Non-null while rendered inside a `<SnFloatButtonGroup>`. */
const floatButtonGroup = inject<SnFloatButtonGroupContext | null>(
  FLOAT_BUTTON_GROUP_KEY,
  null,
)

/** Root element — the handle `container` mounting moves and restores. */
const rootRef = ref<HTMLElement | null>(null)

/** Whether the parent group owns the fixed position. */
const inGroup = computed(() => floatButtonGroup !== null)

/** Effective shape: the group wins over the child's own prop. */
const resolvedShape = computed<SnFloatButtonShape>(
  () => floatButtonGroup?.shape.value ?? props.shape,
)

// ---------- Rendering state ----------

const isLink = computed(() => Boolean(props.href))

/**
 * Resolved icon component, or `undefined` when none was passed.
 *
 * `markRaw` keeps the component out of Vue's reactivity proxy — passing a
 * component through `props` would otherwise warn on every render.
 */
const resolvedIcon = computed<IconComponent | undefined>(() =>
  props.icon ? markRaw(props.icon) : undefined,
)

/** The description line is a square-shape feature. An empty string counts as absent. */
const hasDescription = computed(
  () => resolvedShape.value === 'square' && Boolean(props.description || slots.description),
)

/** `0` and `''` are "no count" — mirrors Ant Design Vue `Badge` truthiness. */
const hasBadgeValue = computed(
  () => props.badge !== undefined && props.badge !== 0 && props.badge !== '',
)

const showBadge = computed(() => hasBadgeValue.value || props.badgeDot)
const isDotBadge = computed(() => props.badgeDot && !hasBadgeValue.value)

/**
 * Accessible name for the icon-only button. Falls back to `description` for
 * square buttons without a tooltip; a plain button with neither stays unnamed
 * (the consumer should pass `tooltip`).
 */
const accessibleLabel = computed(() => props.tooltip ?? props.description)

// ---------- Positioning ----------

function formatLength(value: string | number): string {
  return typeof value === 'number' ? `${value}px` : value
}

/**
 * Corner style for the standalone case.
 *
 * `placement` only fills an axis the caller did not offset explicitly, so
 * `top` / `bottom` (`left` / `right`) win over the corner preset. `fixed` off
 * pins the button to its positioning context instead of the viewport. Inside
 * a group the style is empty: `.sn-float-button--in-group` makes the child
 * static and full width.
 */
const rootStyle = computed<CSSProperties>(() => {
  if (inGroup.value) return {}

  const isTop = props.placement === 'top-left' || props.placement === 'top-right'
  const isLeft = props.placement === 'top-left' || props.placement === 'bottom-left'

  const style: CSSProperties = {
    position: props.fixed ? 'fixed' : 'absolute',
    zIndex: props.zIndex,
  }

  if (props.top !== undefined) style.top = formatLength(props.top)
  if (props.bottom !== undefined) style.bottom = formatLength(props.bottom)
  if (props.left !== undefined) style.left = formatLength(props.left)
  if (props.right !== undefined) style.right = formatLength(props.right)

  if (props.top === undefined && props.bottom === undefined) {
    if (isTop) style.top = DEFAULT_OFFSET
    else style.bottom = DEFAULT_OFFSET
  }
  if (props.left === undefined && props.right === undefined) {
    if (isLeft) style.left = DEFAULT_OFFSET
    else style.right = DEFAULT_OFFSET
  }

  return style
})

/* ---------- Container mounting (§41) ---------- */

/**
 * The context `container="…"` resolved to. `fixed: false` + an explicit
 * `container` renders the button inside that element, so the instance owns
 * the move: it inserts a comment placeholder at the original spot, appends
 * the root to the container, and on unmount puts the root back. No listener
 * or observer is created, so there is nothing else to dispose.
 */
let containerHost: { parent: Node; placeholder: Comment } | null = null

function resolveContainer(target: string | HTMLElement | undefined): HTMLElement | null {
  if (target === undefined) return null
  if (typeof target !== 'string') return target
  if (typeof document === 'undefined') return null
  return document.querySelector<HTMLElement>(target)
}

onMounted(() => {
  if (props.fixed || inGroup.value) return
  const container = resolveContainer(props.container)
  const root = rootRef.value
  const parent = root?.parentNode
  if (!container || !root || !parent) return
  const placeholder = document.createComment('sn-float-button')
  parent.insertBefore(placeholder, root)
  container.appendChild(root)
  containerHost = { parent, placeholder }
})

onBeforeUnmount(() => {
  const host = containerHost
  if (!host) return
  const root = rootRef.value
  if (root) host.parent.insertBefore(root, host.placeholder)
  host.placeholder.remove()
  containerHost = null
})

const rootClass = computed(() => [
  'sn-float-button',
  `sn-float-button--${props.type}`,
  `sn-float-button--${resolvedShape.value}`,
  {
    'sn-float-button--in-group': inGroup.value,
    'sn-float-button--link': isLink.value,
    'sn-float-button--disabled': props.disabled,
  },
])

// ---------- Interaction ----------

function handleClick(event: MouseEvent): void {
  if (props.disabled) {
    // `<a aria-disabled>` still navigates on its own; suppress it explicitly.
    event.preventDefault()
    event.stopPropagation()
    return
  }
  emit('click', event)
}
</script>

<template>
  <component
    :is="isLink ? 'a' : 'button'"
    ref="rootRef"
    v-if="visible"
    data-snui-component="float-button"
    :class="rootClass"
    :style="rootStyle"
    :type="isLink ? undefined : 'button'"
    :href="isLink ? href : undefined"
    :target="isLink ? target : undefined"
    :title="tooltip"
    :aria-label="accessibleLabel"
    :aria-disabled="disabled ? 'true' : undefined"
    @click="handleClick"
  >
    <slot>
      <span class="sn-float-button__icon">
        <!-- `SnIcon` is the only icon path (AGENTS.md §113). -->
        <slot name="icon">
          <SnIcon v-if="resolvedIcon" :icon="resolvedIcon" :size="iconSize" />
        </slot>
        <span
          v-if="showBadge"
          class="sn-float-button__badge"
          :class="{ 'sn-float-button__badge--dot': isDotBadge }"
        >
          <template v-if="!isDotBadge">{{ badge }}</template>
        </span>
      </span>

      <span v-if="hasDescription" class="sn-float-button__description">
        <slot name="description">{{ description }}</slot>
      </span>
    </slot>
  </component>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-float-button {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 40px;
  min-height: 40px;
  margin: 0;
  padding: 0;
  border: 1px solid var(--sn-web-color-border-subtle, #e5e6eb);
  background: var(--sn-web-color-background-elevated, #ffffff);
  color: var(--sn-web-color-text-primary, #1f2329);
  font-family: inherit;
  font-size: var(--sn-web-font-size-sm, 12px);
  line-height: var(--sn-web-font-line-height-tight, 1.2);
  cursor: pointer;
  box-shadow: var(--sn-web-shadow-md, 0 4px 12px color-mix(in srgb, var(--sn-web-color-text-primary, #1f2329) 12%, transparent));
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

/* ---------- Shape ---------- */

.sn-float-button--circle {
  border-radius: var(--sn-web-radius-full, 999px);
}

.sn-float-button--square {
  min-height: 44px;
  padding: 6px 4px;
  border-radius: var(--sn-web-radius-md, 6px);
}

/* ---------- Type ---------- */

.sn-float-button--primary {
  border-color: var(--sn-web-color-action-primary, #1677ff);
  background: var(--sn-web-color-action-primary, #1677ff);
  color: var(--sn-web-color-text-on-primary, #ffffff);
}

.sn-float-button--primary:hover:not(.sn-float-button--disabled) {
  border-color: var(--sn-web-color-action-primary-hover, #4096ff);
  background: var(--sn-web-color-action-primary-hover, #4096ff);
}

.sn-float-button--default:hover:not(.sn-float-button--disabled) {
  border-color: var(--sn-web-color-action-primary, #1677ff);
  color: var(--sn-web-color-action-primary, #1677ff);
}

/* ---------- States ---------- */

.sn-float-button:focus-visible {
  outline: 2px solid var(--sn-web-focus-ring);
  outline-offset: 2px;
}

.sn-float-button--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.sn-float-button--link {
  text-decoration: none;
}

/* Inside a group the group owns positioning: the child fills the group
 * column and stays in normal flow (`position: static`). */
.sn-float-button--in-group {
  position: static;
  width: 100%;
  box-shadow: var(--sn-web-shadow-sm, 0 2px 8px color-mix(in srgb, var(--sn-web-color-text-primary, #1f2329) 12%, transparent));
}

/* ---------- Icon + description ---------- */

.sn-float-button__icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.sn-float-button__description {
  max-width: 56px;
  margin-top: 2px;
  overflow: hidden;
  font-size: var(--sn-web-font-size-xs, 10px);
  line-height: var(--sn-web-font-line-height-tight, 1.2);
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ---------- Badge bubble ---------- */

.sn-float-button__badge {
  position: absolute;
  top: -4px;
  right: -4px;
  box-sizing: border-box;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: var(--sn-web-radius-full, 999px);
  background: var(--sn-web-color-feedback-danger, #f53f3f);
  color: var(--sn-web-color-text-on-primary, #ffffff);
  font-size: var(--sn-web-font-size-xs, 10px);
  line-height: 16px;
  text-align: center;
  white-space: nowrap;
}

.sn-float-button__badge--dot {
  min-width: 8px;
  width: 8px;
  height: 8px;
  padding: 0;
}
</style>