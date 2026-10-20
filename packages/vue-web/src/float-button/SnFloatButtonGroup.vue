<script setup lang="ts">
/**
 * SnFloatButtonGroup — collapsible stack of `<SnFloatButton>` children
 * sharing one fixed corner.
 *
 * Reference library: Ant Design Vue `FloatButton.Group`
 *   (https://antdv.com/components/float-button).
 * **Explicit divergence from the naive-ui 1:1 rule**: naive-ui has NO float
 * button (and therefore no float button group), so per the parity rule this
 * component mirrors Ant Design Vue `FloatButton.Group` instead — the same
 * registration style SnComment uses for the data-display batch:
 *   shape / open (v-model:open) / trigger ('click' | 'hover') / placement /
 *   right / bottom / top / left / zIndex / gap; slots: default (the stacked
 *   `SnFloatButton` children) + trigger (replaces the built-in trigger).
 *
 * Divergences from the Ant Design Vue source (documented, not accidental):
 *   - The reference renders the children inside a `FloatButton` wrapper whose
 *     icon is either `CloseOutlined` / `MenuOutlined` or a custom `icon`. Here
 *     the trigger is a plain `<SnFloatButton>` whose glyph (`triggerIcon`,
 *     default `Plus`) rotates 45° while open, matching the reference's
 *     `CloseOutlined` behaviour without pinning a close glyph.
 *   - `triggerTooltip` sets the native `title` + the accessible name on the
 *     trigger; no tooltip component is pulled in (same policy as
 *     `SnFloatButton.tooltip`).
 *   - `gap` replaces the reference's fixed 12px vertical rhythm (the
 *     reference hard-codes it in the less source).
 *   - The trigger always toggles on click, whatever `trigger` is; `hover`
 *     additionally opens on `mouseenter` and closes on `mouseleave`.
 *   - `hover` installs a document-level `mousemove` guard so the stack also
 *     collapses when the pointer leaves it without a `mouseleave` (e.g. the
 *     pointer moved over an overlay). The listener is removed as soon as the
 *     stack closes and on unmount (AGENTS.md §41).
 *
 * The group owns the fixed position for itself AND its children: it provides
 * `sn-float-button-group` (shape) and each child renders `position: static` /
 * full width. Children keep working standalone — the inject has a `null`
 * fallback and each child positions itself when no group is present.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnFloatButtonGroup v-model:open="open" trigger="hover">
 *     <SnFloatButton :icon="FileText" tooltip="文档" />
 *     <SnFloatButton :icon="Share2" tooltip="分享" />
 *   </SnFloatButtonGroup>
 */

import { computed, markRaw, onBeforeUnmount, provide, ref, watch } from 'vue'
import type { ComputedRef, CSSProperties } from 'vue'
import { Plus } from 'lucide-vue-next'
import SnIcon from '../icon/SnIcon.vue'
import SnFloatButton from './SnFloatButton.vue'
import type { IconComponent } from '../icon/sn-icon-registry'

defineOptions({ name: 'SnFloatButtonGroup' })

type SnFloatButtonGroupShape = 'circle' | 'square'
type SnFloatButtonGroupPlacement = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

/**
 * Shape contract handed down to every child `SnFloatButton` through
 * provide/inject. Structural twin of the interface declared in
 * `SnFloatButton.vue` — kept local so the two files share no module.
 */
interface SnFloatButtonGroupContext {
  /** Group-level shape; overrides each child's own `shape` prop. */
  shape: ComputedRef<SnFloatButtonGroupShape>
}

/** Injection key shared with `SnFloatButton` (string key, like SnCollapse). */
const FLOAT_BUTTON_GROUP_KEY = 'sn-float-button-group'

/** Distance from the viewport edge that `placement` falls back to. */
const DEFAULT_OFFSET = '24px'

/** Size passed to the trigger glyph. */
const TRIGGER_ICON_SIZE = 18

const props = withDefaults(
  defineProps<{
    /** Shape handed to every child; overrides each child's own `shape` prop. */
    shape?: SnFloatButtonGroupShape
    /** Controlled open state (`v-model:open`). Uncontrolled when omitted. */
    open?: boolean
    /** Gesture that opens the stack. */
    trigger?: 'click' | 'hover'
    /** Fixed corner of the group (and therefore of its children). */
    placement?: SnFloatButtonGroupPlacement
    /** Explicit distance from the viewport right edge; overrides `placement`. */
    right?: number | string
    /** Explicit distance from the viewport bottom edge; overrides `placement`. */
    bottom?: number | string
    /** Explicit distance from the viewport top edge; overrides `placement`. */
    top?: number | string
    /** Explicit distance from the viewport left edge; overrides `placement`. */
    left?: number | string
    /** Stacking order of the fixed root. */
    zIndex?: number
    /** Vertical gap between the stacked children (and to the trigger). */
    gap?: number
    /**
     * Trigger glyph component. Rotated 45° while open.
     *
     * Deliberately absent from the `withDefaults` object below: `IconComponent`
     * is a function type behind an imported alias, so the SFC compiler cannot
     * infer `type: Function` and Vue would treat a function-valued default as
     * a *factory* and call the icon component itself. `resolvedTriggerIcon`
     * applies the `Plus` fallback instead.
     */
    triggerIcon?: IconComponent | undefined
    /**
     * Sets the trigger's native `title` and accessible name. The explicit
     * `| undefined` is required by `exactOptionalPropertyTypes` because the
     * value is forwarded to the child `SnFloatButton` in the template.
     */
    triggerTooltip?: string | undefined
  }>(),
  {
    shape: 'circle',
    trigger: 'click',
    placement: 'bottom-right',
    zIndex: 1000,
    gap: 12,
    /*
     * `open: undefined` is load-bearing, not noise. Vue's boolean-prop
     * casting turns an *absent* `Boolean` prop into `false`, which would
     * make "uncontrolled" indistinguishable from "controlled closed" and
     * freeze `mergedOpen` at `false`. Declaring an explicit `undefined`
     * default marks the prop as having a default, which disables the cast —
     * the same trick SnBackTop uses for its `show` prop.
     */
    open: undefined as any,
  },
)

const emit = defineEmits<{
  /** The open state changed (`v-model:open`). */
  (e: 'update:open', value: boolean): void
  /** The open state changed (event-style alias). */
  (e: 'openChange', value: boolean): void
}>()

defineSlots<{
  /** The `SnFloatButton` children — stacked above the trigger. */
  default?(): unknown
  /** Replaces the built-in trigger button entirely. */
  trigger?(): unknown
}>()

// ---------- Open state ----------

/** Uncontrolled open state, used while the `open` prop is omitted. */
const uncontrolledOpen = ref(false)

/** Effective open state: the `open` prop wins when provided. */
const mergedOpen = computed(() =>
  props.open === undefined ? uncontrolledOpen.value : props.open,
)

function setOpen(value: boolean): void {
  const changed = value !== mergedOpen.value
  if (props.open === undefined) uncontrolledOpen.value = value
  if (!changed) return
  emit('update:open', value)
  emit('openChange', value)
}

function toggle(): void {
  setOpen(!mergedOpen.value)
}

// ---------- Provide (shape + "the group owns positioning") ----------

const groupShape = computed<SnFloatButtonGroupShape>(() => props.shape)

provide<SnFloatButtonGroupContext>(FLOAT_BUTTON_GROUP_KEY, { shape: groupShape })

// ---------- Positioning (same model as SnFloatButton) ----------

function formatLength(value: string | number): string {
  return typeof value === 'number' ? `${value}px` : value
}

/**
 * Fixed-corner style. `placement` only fills an axis the caller did not
 * offset explicitly, so `top` / `bottom` (`left` / `right`) win over the
 * corner preset.
 */
function resolveFixedStyle(): CSSProperties {
  const isTop = props.placement === 'top-left' || props.placement === 'top-right'
  const isLeft = props.placement === 'top-left' || props.placement === 'bottom-left'

  const style: CSSProperties = {
    position: 'fixed',
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
}

/** Root: fixed corner + the gap between the stack and the trigger. */
const rootStyle = computed<CSSProperties>(() => ({
  ...resolveFixedStyle(),
  rowGap: `${props.gap}px`,
}))

/** Stack of children: the same gap applies between the children themselves. */
const itemsStyle = computed<CSSProperties>(() => ({ gap: `${props.gap}px` }))

const rootClass = computed(() => [
  'sn-float-button-group',
  `sn-float-button-group--${props.shape}`,
  { 'sn-float-button-group--open': mergedOpen.value },
])

// ---------- Trigger ----------

/** Resolved trigger glyph. `markRaw` keeps the component out of the proxy. */
const resolvedTriggerIcon = computed<IconComponent>(() =>
  markRaw(props.triggerIcon ?? Plus),
)

function handleTriggerClick(): void {
  toggle()
}

function handleGroupMouseEnter(): void {
  if (props.trigger !== 'hover') return
  setOpen(true)
}

function handleGroupMouseLeave(): void {
  if (props.trigger !== 'hover') return
  setOpen(false)
}

// ---------- Hover dismiss guard ----------

const rootRef = ref<HTMLElement | null>(null)

function isPointerInsideGroup(event: MouseEvent): boolean {
  const root = rootRef.value
  if (!root) return false
  const rect = root.getBoundingClientRect()
  return (
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom
  )
}

function handleDocumentMouseMove(event: MouseEvent): void {
  if (isPointerInsideGroup(event)) return
  setOpen(false)
}

function bindHoverGuard(): void {
  document.addEventListener('mousemove', handleDocumentMouseMove)
}

function unbindHoverGuard(): void {
  document.removeEventListener('mousemove', handleDocumentMouseMove)
}

// Only while an open hover-triggered stack exists does the document listener
// need to exist; closing the stack (or unmounting) removes it. AGENTS.md §41.
watch(
  () => mergedOpen.value && props.trigger === 'hover',
  (active) => {
    if (active) bindHoverGuard()
    else unbindHoverGuard()
  },
  { immediate: true },
)

onBeforeUnmount(unbindHoverGuard)
</script>

<template>
  <div
    ref="rootRef"
    data-snui-component="float-button-group"
    role="group"
    :class="rootClass"
    :style="rootStyle"
    @mouseenter="handleGroupMouseEnter"
    @mouseleave="handleGroupMouseLeave"
  >
    <!-- `v-show` keeps the children mounted (their own state survives a
         collapse); the transition animates opacity + translate. -->
    <Transition name="sn-float-button-group-items">
      <div
        v-show="mergedOpen"
        class="sn-float-button-group__items"
        :class="{ 'sn-float-button-group__items--open': mergedOpen }"
        :style="itemsStyle"
        :aria-hidden="mergedOpen ? undefined : 'true'"
      >
        <slot />
      </div>
    </Transition>

    <slot name="trigger">
      <SnFloatButton
        class="sn-float-button-group__trigger"
        :tooltip="triggerTooltip"
        aria-haspopup="true"
        :aria-expanded="mergedOpen"
        @click="handleTriggerClick"
      >
        <template #icon>
          <span
            class="sn-float-button-group__trigger-icon"
            :class="{ 'sn-float-button-group__trigger-icon--open': mergedOpen }"
          >
            <!-- `SnIcon` is the only icon path (AGENTS.md §113). -->
            <SnIcon :icon="resolvedTriggerIcon" :size="TRIGGER_ICON_SIZE" />
          </span>
        </template>
      </SnFloatButton>
    </slot>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-float-button-group {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

.sn-float-button-group__items {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
}

/* ---------- Trigger ---------- */

.sn-float-button-group__trigger-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.sn-float-button-group__trigger-icon--open {
  transform: rotate(45deg);
}

/* ---------- Stack transition ---------- */

.sn-float-button-group-items-enter-active,
.sn-float-button-group-items-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.sn-float-button-group-items-enter-from,
.sn-float-button-group-items-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>