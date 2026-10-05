<script setup lang="ts">
/**
 * SnCollapse — collapsible content groups (AUI-WEB-LAYOUT-005).
 *
 * Reference library: naive-ui `n-collapse`
 *   (https://www.naiveui.com/zh-CN/light/components/collapse)
 * Per AGENTS.md §112, prop names + default values mirror n-collapse 1:1.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units).
 *
 * Usage:
 *   <SnCollapse :default-expanded-names="['1']">
 *     <SnCollapseItem title="Section 1" name="1">Content 1</SnCollapseItem>
 *     <SnCollapseItem title="Section 2" name="2">Content 2</SnCollapseItem>
 *   </SnCollapse>
 *
 * Not responsible for:
 *   - Animation timing curves (n-collapse uses appear/disappear timing — v0.1
 *     uses simple transition; expand later)
 *   - lazy rendering (n-collapse `displayDirective: 'show' | 'if'`)
 */

import { computed, provide } from 'vue'

defineOptions({ name: 'SnCollapse' })

// Reference: naive-ui collapseProps
const props = withDefaults(
  defineProps<{
    /** Names of currently expanded items (controlled). */
    expandedNames?: Array<string | number>
    /** Initial expanded names (uncontrolled). */
    defaultExpandedNames?: Array<string | number>
    /** Allow expanding only one item at a time. Mirrors n-collapse `accordion`. */
    accordion?: boolean
    /** Where to place the expand arrow. Mirrors n-collapse `arrowPlacement`. */
    arrowPlacement?: 'left' | 'right'
    /** Trigger mode. Mirrors n-collapse `trigger`. */
    trigger?: 'click' | 'hover'
  }>(),
  {
    expandedNames: () => [],
    defaultExpandedNames: () => [],
    accordion: false,
    arrowPlacement: 'left',
    trigger: 'click',
  },
)

const emit = defineEmits<{
  (e: 'update:expandedNames', names: Array<string | number>): void
  (e: 'itemHeaderClick', name: string | number): void
}>()

defineSlots<{
  /** Sequence of `<SnCollapseItem>` children. */
  default?(): unknown
}>()

/** Set of currently expanded item names (mirrors n-collapse expanded names). */
const expandedSet = computed<Set<string | number>>(() => {
  if (props.expandedNames.length) return new Set(props.expandedNames)
  return new Set(props.defaultExpandedNames)
})

/** Toggle handler — exposed via provide to descendant SnCollapseItem. */
function toggleItem(name: string | number): void {
  const next = new Set(expandedSet.value)
  if (next.has(name)) {
    next.delete(name)
  }
  else {
    if (props.accordion) next.clear()
    next.add(name)
  }
  emit('update:expandedNames', Array.from(next))
  emit('itemHeaderClick', name)
}

function isExpanded(name: string | number): boolean {
  return expandedSet.value.has(name)
}

provide('sn-collapse-toggle', toggleItem)
provide('sn-collapse-is-expanded', isExpanded)
provide('sn-collapse-arrow-placement', () => props.arrowPlacement)
</script>

<template>
  <div
    :class="[
      'sn-collapse',
      `sn-collapse--arrow-${arrowPlacement}`,
      accordion ? 'sn-collapse--accordion' : '',
    ]"
    role="region"
  >
    <slot />
  </div>
</template>

<style scoped>
.sn-collapse {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>