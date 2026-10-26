<script setup lang="ts">
/**
 * SnCollapseItem — collapsible group child (AUI-WEB-LAYOUT-005).
 *
 * Reference library: naive-ui `n-collapse-item`. Per AGENTS.md §112, prop
 * names + slot shape mirror the reference child component.
 *
 * Parent `<SnCollapse>` supplies `toggle`, `isExpanded`, `arrowPlacement`
 * via provide/inject.
 */

import { inject } from 'vue'
import { ChevronRight, ChevronDown } from 'lucide-vue-next'
import SnIcon from '../icon/SnIcon.vue'

defineOptions({ name: 'SnCollapseItem' })

const props = withDefaults(
  defineProps<{
    /** Unique identifier within the parent SnCollapse. Required. */
    name?: string | number
    /** Header label. Mirrors n-collapse-item `title`. */
    title?: string
    /** Disable interaction. Mirrors n-collapse-item `disabled`. */
    disabled?: boolean
    /** Override parent arrowPlacement. Mirrors n-collapse-item `arrow`. */
    arrow?: string | boolean
  }>(),
  {
    name: '',
    title: '',
    disabled: false,
    arrow: '',
  },
)

type ToggleFn = (name: string | number) => void
type IsExpandedFn = (name: string | number) => boolean
type ArrowFn = () => 'left' | 'right'
type DisplayFn = () => 'show' | 'if'
type TriggerFn = () => 'click' | 'hover'

const toggle = inject<ToggleFn>('sn-collapse-toggle', () => {})
const isExpanded = inject<IsExpandedFn>('sn-collapse-is-expanded', () => false)
const getArrowPlacement = inject<ArrowFn>('sn-collapse-arrow-placement', () => 'left')
const getDisplayDirective = inject<DisplayFn>('sn-collapse-display-directive', () => 'if' as const)
const getTrigger = inject<TriggerFn>('sn-collapse-trigger', () => 'click' as const)

function handleHeaderClick(): void {
  if (props.disabled) return
  if (typeof props.name === 'number' || typeof props.name === 'string') {
    toggle(props.name)
  }
}

function handleHeaderMouseenter(): void {
  if (getTrigger() !== 'hover') return
  handleHeaderClick()
}

const expanded = (): boolean => {
  if (typeof props.name !== 'string' && typeof props.name !== 'number') return false
  return isExpanded(props.name)
}

const showArrow = (): boolean => {
  if (props.arrow === false) return false
  if (props.arrow === true || props.arrow === '') return true
  return true
}

const arrowPlacement = (): 'left' | 'right' => {
  if (props.arrow === 'left' || props.arrow === 'right') return props.arrow
  return getArrowPlacement()
}

/** `v-show` vs `v-if` for collapsed content — selected via parent's
 * `displayDirective`. 'show' = always rendered, toggle via display:none.
 * 'if' = unmounted when not expanded (default, cheaper for heavy content). */
const displayMode = (): 'show' | 'if' => getDisplayDirective()

/** Whether parent is in 'show' mode (always mount). */
const isShowMode = (): boolean => displayMode() === 'show'

/** Whether parent is in 'if' mode AND this item is expanded (mount now). */
const isIfModeMounted = (): boolean => displayMode() === 'if' && expanded()
</script>

<template>
  <section
    :class="[
      'sn-collapse-item',
      expanded() ? 'sn-collapse-item--expanded' : '',
      disabled ? 'sn-collapse-item--disabled' : '',
    ]"
  >
    <header
      :class="['sn-collapse-item__header', `sn-collapse-item__header--arrow-${arrowPlacement()}`]"
      role="button"
      :aria-expanded="expanded()"
      :aria-disabled="disabled || undefined"
      :tabindex="disabled ? -1 : 0"
      @click="handleHeaderClick"
      @mouseenter="handleHeaderMouseenter"
      @keydown.enter.prevent="handleHeaderClick"
      @keydown.space.prevent="handleHeaderClick"
    >
      <span
        v-if="showArrow() && arrowPlacement() === 'left'"
        class="sn-collapse-item__caret"
        aria-hidden="true"
      >
        <SnIcon :icon="expanded() ? ChevronDown : ChevronRight" :size="14" />
      </span>
      <span class="sn-collapse-item__title">{{ title }}</span>
      <span
        v-if="showArrow() && arrowPlacement() === 'right'"
        class="sn-collapse-item__caret"
        aria-hidden="true"
      >
        <SnIcon :icon="expanded() ? ChevronDown : ChevronRight" :size="14" />
      </span>
    </header>
    <!--
      Body rendering strategy (per parent's `displayDirective`):
        - 'if'  → mounted only while expanded (cheaper for heavy content)
        - 'show' → always mounted; v-show toggles visibility
      We split into two mutually exclusive divs to avoid the
      v-if + v-show ambiguity that warns "Invalid vnode type".
    -->
    <div
      v-if="isShowMode()"
      v-show="expanded()"
      class="sn-collapse-item__body"
      role="region"
    >
      <slot />
    </div>
    <div
      v-else-if="isIfModeMounted()"
      class="sn-collapse-item__body"
      role="region"
    >
      <slot />
    </div>
  </section>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. */

.sn-collapse-item {
  border-radius: 6px;
  background: var(--sn-web-color-background-surface);
}

.sn-collapse-item__header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  color: var(--sn-web-color-text-primary);
  border-radius: 6px;
  transition: background-color 0.15s ease;
}
.sn-collapse-item__header:hover:not(.sn-collapse-item__header--disabled) {
  background: rgba(0, 0, 0, 0.03);
}
.sn-collapse-item__header--arrow-right {
  flex-direction: row;
}
.sn-collapse-item__header--arrow-right .sn-collapse-item__caret {
  margin-left: auto;
}
.sn-collapse-item__caret {
  font-size: 11px;
  opacity: 0.6;
}
.sn-collapse-item__title {
  flex: 1;
}

.sn-collapse-item__body {
  padding: 0 12px 12px;
  color: var(--sn-web-color-text-primary);
}

.sn-collapse-item--disabled .sn-collapse-item__header {
  cursor: not-allowed;
  opacity: 0.5;
}

/* Bordered mode (parent .sn-collapse--bordered) — drop our own rounded
 * surface so each item's bottom border lines up with the next item's top
 * border (clean shared-line visual, like n-collapse). */
.sn-collapse--bordered .sn-collapse-item {
  border-radius: 0;
  background: transparent;
}
.sn-collapse--bordered .sn-collapse-item:not(:first-child) {
  border-top: 1px solid var(--sn-web-color-border-default);
}
.sn-collapse--bordered .sn-collapse-item__header {
  border-radius: 0;
}
.sn-collapse--bordered .sn-collapse-item__header:hover:not(.sn-collapse-item__header--disabled) {
  background: var(--sn-web-color-background-subtle);
}

/* Doodle skin */
.snui-skin-doodle .sn-collapse-item {
  border: 2.5px solid #1a1a1a;
}
.snui-skin-doodle .sn-collapse-item__header {
  font-weight: 700;
}
</style>