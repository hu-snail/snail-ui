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

const toggle = inject<ToggleFn>('sn-collapse-toggle', () => {})
const isExpanded = inject<IsExpandedFn>('sn-collapse-is-expanded', () => false)
const getArrowPlacement = inject<ArrowFn>('sn-collapse-arrow-placement', () => 'left')

function handleHeaderClick(): void {
  if (props.disabled) return
  if (typeof props.name === 'number' || typeof props.name === 'string') {
    toggle(props.name)
  }
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
      @keydown.enter.prevent="handleHeaderClick"
      @keydown.space.prevent="handleHeaderClick"
    >
      <span
        v-if="showArrow() && arrowPlacement() === 'left'"
        class="sn-collapse-item__caret"
        aria-hidden="true"
      >{{ expanded() ? '▾' : '▸' }}</span>
      <span class="sn-collapse-item__title">{{ title }}</span>
      <span
        v-if="showArrow() && arrowPlacement() === 'right'"
        class="sn-collapse-item__caret"
        aria-hidden="true"
      >{{ expanded() ? '▾' : '▸' }}</span>
    </header>
    <div
      v-show="expanded()"
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

/* Doodle skin */
.snui-skin-doodle .sn-collapse-item {
  border: 2.5px solid #1a1a1a;
}
.snui-skin-doodle .sn-collapse-item__header {
  font-weight: 700;
}
</style>